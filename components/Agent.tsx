"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, PhoneOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer, setupAssistant, companyPersonas } from "@/constants";
import { createFeedback, generateInterviewAction } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  company = "Default",
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [activeTranscript, setActiveTranscript] = useState<{ role: string; text: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript") {
        if (message.transcriptType === "final") {
          const newMessage = { role: message.role, content: message.transcript };
          setMessages((prev) => [...prev, newMessage]);
          setActiveTranscript(null);
        } else if (message.transcriptType === "partial") {
          setActiveTranscript({ role: message.role, text: message.transcript });
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Vapi Error:", error);
      // Suppress known upstream Vapi/Daily error when meeting ends
      if (
        error &&
        error.message &&
        (error.message.includes("Meeting ended in error") ||
          error.message.includes("Meeting ended due to ejection") ||
          error.message.includes("Meeting has ended"))
      ) {
        console.log("Ignored upstream Meeting ended error");
        setCallStatus(CallStatus.FINISHED);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        generateInterviewAction({
          transcript: messages,
          company: company || "Default",
          userId: userId || "",
          userName: userName || "",
        }).then((res) => {
          if (res.success && res.interviewId) {
            router.push(`/interview/${res.interviewId}`);
          } else {
            router.push("/");
          }
        });
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId, company, userName]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      const dynamicSetup = JSON.parse(JSON.stringify(setupAssistant));
      if (dynamicSetup.model && Array.isArray(dynamicSetup.model.messages)) {
        dynamicSetup.model.messages = dynamicSetup.model.messages.map((msg: any) => ({
          ...msg,
          content: msg.content.replace("your interview", `your highly customized ${company} interview`),
        }));
      }
      await vapi.start(dynamicSetup);
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      const selectedPersona = companyPersonas[company] || companyPersonas["Default"];
      const dynamicInterviewer = JSON.parse(JSON.stringify(interviewer));
      
      // Inject Voice Details
      if (dynamicInterviewer.voice) {
        dynamicInterviewer.voice = {
          ...dynamicInterviewer.voice,
          voiceId: selectedPersona.voiceId,
          speed: selectedPersona.speed,
          style: selectedPersona.style,
        };
      }

      // Inject Guidelines & Variables into System Prompt
      if (dynamicInterviewer.model && Array.isArray(dynamicInterviewer.model.messages)) {
        dynamicInterviewer.model.messages = dynamicInterviewer.model.messages.map((msg: any) => {
          if (msg.role === "system" && typeof msg.content === "string") {
            const fallback = "Ask general behavioral interview questions.";
            return {
              ...msg,
              content: msg.content
                .split("{{questions}}").join(formattedQuestions || fallback)
                .split("[Identity]").join(`[Identity]\n${selectedPersona.guidelines}\n\n`),
            };
          }
          return msg;
        });
      }

      await vapi.start(dynamicInterviewer);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    vapi.setMuted(nextMute);
    setIsMuted(nextMute);

    // If user unmutes, forcefully interrupt the AI so they can speak
    if (!nextMute && callStatus === CallStatus.ACTIVE) {
      vapi.send({
        type: "add-message",
        message: {
          role: "system",
          content: "The user has just unmuted their microphone to intervene. Please stop speaking immediately and listen to them.",
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[75vh] w-full relative overflow-hidden py-8">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-primary-200/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* HEADER / CANDIDATE INFO */}
      <div className="w-full flex justify-between items-center px-4 md:px-12 z-10 mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">AI Interview</h2>
        <div className="flex items-center gap-4 bg-dark-200/40 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-xl shadow-lg">
          <Image
            src="/user-avatar.png"
            alt="User"
            width={38}
            height={38}
            className="rounded-full object-cover border border-white/20"
          />
          <span className="text-white/90 font-semibold tracking-wide">{userName}</span>
        </div>
      </div>

      {/* CENTRAL AI ORB */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full my-8">
        <div className="relative flex items-center justify-center group mb-12 mt-4">
          {/* Outer Ripple 1 */}
          <div className={cn(
            "absolute rounded-full transition-all duration-1000 ease-in-out",
            callStatus === "ACTIVE" ? "bg-primary-200/20 blur-3xl w-72 h-72 lg:w-96 lg:h-96" : "bg-primary-200/5 blur-2xl w-48 h-48",
            isSpeaking ? "scale-[1.6] opacity-80" : "scale-100 opacity-40"
          )} />
          
          {/* Inner Ripple 2 */}
          <div className={cn(
            "absolute rounded-full transition-all duration-700 ease-out",
            callStatus === "ACTIVE" ? "bg-primary-200/30 blur-2xl w-56 h-56 lg:w-72 lg:h-72" : "bg-primary-200/10 blur-xl w-32 h-32",
            isSpeaking ? "scale-125 animate-pulse" : "scale-100 opacity-60"
          )} />
          
          {/* Core Orb Container */}
          <div className={cn(
            "relative z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-200/80 to-blue-600/80 shadow-[0_0_50px_rgba(202,197,254,0.5)] transition-all duration-500 overflow-hidden border border-white/20",
            callStatus === "ACTIVE" ? "w-48 h-48 lg:w-56 lg:h-56" : "w-36 h-36 opacity-70"
          )}>
            <Image
              src="/ai-avatar.png"
              alt="AI"
              width={200}
              height={200}
              className="object-cover opacity-90 mix-blend-screen scale-110"
            />
          </div>
        </div>
      </div>

      {/* TRANSCRIPT AREA */}
      <div className="min-h-28 w-full flex items-center justify-center z-10 px-6 mb-6">
        {/* Render Live Active Transcript if currently speaking */}
        {activeTranscript ? (
          <p className={cn(
            "text-2xl text-center font-bold max-w-3xl tracking-wide drop-shadow-xl leading-relaxed animate-pulse",
            activeTranscript.role === "assistant" ? "text-primary-200" : "text-white"
          )}>
            "{activeTranscript.text}"
          </p>
        ) : (
          /* Fallback to Last Final Message */
          messages.length > 0 && lastMessage && (
            <p className="text-2xl text-center text-white/90 font-medium max-w-3xl animate-fadeIn tracking-wide drop-shadow-md leading-relaxed">
              "{lastMessage}"
            </p>
          )
        )}
      </div>

      {/* CONTROL DOCK */}
      <div className="w-full flex justify-center z-10 pb-4">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call group overflow-hidden" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75 inset-0 bg-success-100",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative text-lg tracking-wider drop-shadow-md">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Start Interview"
                : "Connecting..."}
            </span>
          </button>
        ) : (
          <div className="control-bar transition-all duration-500 animate-fadeIn translate-y-0 scale-100 flex items-center gap-8 px-12 py-6 rounded-full bg-dark-200/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button 
              className={cn("btn-action", isMuted ? "muted" : "unmuted")} 
              onClick={toggleMute}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isMuted ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            <button 
              className="btn-action end" 
              onClick={() => handleDisconnect()}
              title="End Interview"
            >
              <PhoneOff size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agent;
