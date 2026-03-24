"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { feedbackSchema } from "@/constants";

let dummyInterviews = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: true,
    createdAt: new Date().toISOString(),
  },
];

export async function generateInterviewAction(params: {
  transcript: { role: string; content: string }[];
  company: string;
  userId: string;
  userName: string;
}) {
  const { transcript, company, userId, userName } = params;

  try {
    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    const { object } = await generateObject({
      model: google("gemini-1.5-pro", {
        structuredOutputs: false,
      }),
      schema: z.object({
        role: z.string().describe("The job role the candidate stated they are applying for. (e.g. Frontend Engineer)"),
        techstack: z.array(z.string()).describe("The list of specific technologies the candidate mentioned they know."),
        questions: z.array(z.string()).describe(`Exactly 3 hyper-specific, realistic interview questions for this role tailored specifically for ${company}'s actual interview loops.`),
      }),
      prompt: `
        You are an expert technical interview creator for top-tier companies. 
        The candidate ${userName} just completed an intake conversation with our setup AI to prepare for an interview at ${company}.
        
        Analyze the transcript below. Extract the exact job role they want and their primary technical skills/stack.
        Then, generate EXACTLY 3 extremely challenging, realistic interview questions tailored specifically for this role at ${company}.
        - If ${company} is Google, focus heavily on advanced algorithms and deep scale.
        - If ${company} is Amazon, ask questions strongly tied to their Leadership Principles (e.g., Deliver Results, Customer Obsession).
        - If ${company} is Meta/Facebook, focus on massive front-end scale or rapid backend iteration.
        - If no company is provided, provide standard difficult FAANG-level questions.
        
        If the transcript is empty or vague, default to "Software Engineer" with ["React", "Node.js"] and generate generic FAANG questions.
        
        Transcript:
        ${formattedTranscript}
      `,
      system: "You are an expert technical interview question generator.",
    });

    const newInterview = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      role: object.role,
      type: "Technical",
      techstack: object.techstack,
      level: "Senior",
      questions: object.questions,
      company: company,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    dummyInterviews.unshift(newInterview);

    return { success: true, interviewId: newInterview.id };
  } catch (error) {
    console.error("Error generating interview:", error);
    return { success: false, interviewId: null };
  }
}

export async function createFeedback(params: any) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-1.5-pro", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    console.log("Mock saved feedback:", feedback);

    return { success: true, feedbackId: feedbackId || "mock_feedback_id" };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<any | null> {
  return dummyInterviews.find(i => i.id === id) || null;
}

export async function getFeedbackByInterviewId(
  params: any
): Promise<any | null> {
  return {
    id: "mock_feedback_id",
    interviewId: params.interviewId,
    userId: params.userId,
    totalScore: 85,
    categoryScores: [
      { name: "Communication Skills", score: 90, comment: "Good" },
      { name: "Technical Knowledge", score: 80, comment: "Fair" },
      { name: "Problem-Solving", score: 85, comment: "Good" },
      { name: "Cultural & Role Fit", score: 90, comment: "Good" },
      { name: "Confidence & Clarity", score: 80, comment: "Good" },
    ],
    strengths: ["Clear communication"],
    areasForImprovement: ["More deeper technical answers"],
    finalAssessment: "Overall good performance.",
    createdAt: new Date().toISOString(),
  };
}

export async function getLatestInterviews(
  params: any
): Promise<any[] | null> {
  return dummyInterviews;
}

export async function getInterviewsByUserId(
  userId: string
): Promise<any[] | null> {
  return dummyInterviews;
}
