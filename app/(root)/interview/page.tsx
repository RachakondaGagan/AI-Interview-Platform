import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async ({ searchParams }: { searchParams: { company?: string } }) => {
  const user = await getCurrentUser();
  const company = searchParams.company || "Default";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto min-h-[75vh]">
      <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">Interview Setup: <span className="text-primary-200">{company}</span></h3>
      <p className="text-white/60 mb-8 max-w-xl text-center">Our AI will quickly ask for your targeted role and skills to properly generate your customized {company} interview.</p>
      
      <div className="w-full bg-dark-200/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <Agent
          userName={user?.name!}
          userId={user?.id}
          type="generate"
          company={company}
        />
      </div>
    </div>
  );
};

export default Page;
