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
  { name: "JPMC", logo: "/covers/jpmc.svg", bgClass: "bg-gradient-to-br from-[#117ACA]/20 to-[#0A4778]/20" },
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
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Top Companies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCompanies.map((company) => (
            <Link
              key={company.name}
              href={`/interview?company=${company.name}`}
              className={`group flex flex-col items-center justify-center p-6 rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-white/40 backdrop-blur-md ${company.bgClass}`}
            >
              <div className="w-16 h-16 relative mb-4 transition-transform duration-300 group-hover:scale-110">
                <Image src={company.logo} alt={company.name} fill className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              </div>
              <h3 className="text-xl font-bold tracking-wider text-white drop-shadow-md">
                {company.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
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
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
