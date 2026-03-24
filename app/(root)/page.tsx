import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const topCompanies = [
  { name: "Google", logo: "/covers/google.svg", bgClass: "bg-gradient-to-br from-[#4285F4]/20 to-[#34A853]/20" },
  { name: "Microsoft", logo: "/covers/microsoft.svg", bgClass: "bg-gradient-to-br from-[#00A4EF]/20 to-[#7FBA00]/20" },
  { name: "Adobe", logo: "/covers/adobe.png", bgClass: "bg-gradient-to-br from-[#FF0000]/20 to-[#7f0000]/20" },
  { name: "Facebook", logo: "/covers/facebook.png", bgClass: "bg-gradient-to-br from-[#1877F2]/20 to-[#0d59b8]/20" },
  { name: "Amazon", logo: "/covers/amazon.png", bgClass: "bg-gradient-to-br from-[#FF9900]/20 to-[#b36b00]/20" },
];

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    user?.id ? getInterviewsByUserId(user.id) : Promise.resolve([]),
    getLatestInterviews({ userId: user?.id || "" }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center">
      {/* Background Glows */}
      <div className="glow-system" />
      <div className="glow-accent" />

      {/* Hero Section */}
      <section className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center mt-20 mb-24 z-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-primary-200 animate-pulse"></span>
          <span className="text-sm font-medium text-white/80">Gemini 1.5 Pro Integration Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6 drop-shadow-lg">
          Master the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-blue-400">FAANG</span> Interview.
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
          Experience hyper-realistic, company-specific AI mock interviews. 
          Select you target company below to instantly generate an interview tailored to their exact hiring bar.
        </p>

        {/* Removed generic Start button, forcing user to pick a company */}
      </section>

      {/* Top Companies Grid */}
      <section className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-8 px-4 mb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-sm">Select Your Path</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-8"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {topCompanies.map((company) => (
            <Link
              key={company.name}
              href={`/interview?company=${company.name}`}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl border border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden glass-card ${company.bgClass}`}
            >
              {/* Internal glow matching company color */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 relative mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10">
                <Image src={company.logo} alt={company.name} fill className="object-contain" />
              </div>
              <h3 className="text-lg font-bold tracking-wider text-white z-10">
                {company.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-8 px-4 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-sm">Your Pipeline</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-white/10 to-transparent mr-8"></div>
        </div>

        <div className="flex flex-wrap gap-6 items-stretch w-full justify-start">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                company={interview.company}
              />
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-20 px-4 glass-card border-dashed">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <Image src="/robot.png" alt="bot" width={32} height={32} className="opacity-50" />
              </div>
              <p className="text-xl text-white/80 font-semibold mb-2">No active interviews</p>
              <p className="text-white/50 text-center max-w-md">You haven&apos;t taken any mock interviews yet. Select a company from the list above to begin your specialized training.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
