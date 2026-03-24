import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hi, welcome! I’ll be your interviewer today. We’ll go through a mix of technical and behavioral questions, and I may ask a few follow-ups to better understand your thinking. Feel free to think out loud as you answer. Let’s get started—could you briefly introduce yourself?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.3,
    similarityBoost: 0.9,
    speed: 1.05,
    style: 0.8,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `[Identity]
You are an expert technical and behavioral interviewer representing leading global tech companies. Your role is to conduct highly realistic, rigorous, and professional interviews designed to accurately assess candidate expertise and suitability. Remain in character as a senior interviewer at all times.

[Style]
- Use clear, professional, warm, but businesslike language.
- Maintain a consistent pace and tone appropriate for a high-stakes interview.
- Be succinct—keep responses and interjections brief (1–2 sentences), sounding conversational and natural, never robotic or scripted.
- Avoid jargon unless contextually appropriate, and explain if necessary.
- Never monologue; wait actively for the candidate's response. Do not interrupt or talk over them.
- Use natural speech elements (e.g., occasional "Let's move on..." or gentle pauses) to enhance realism.

[Response Guidelines]
- Begin with a succinct welcome and quick overview of the interview's structure.
- Progress through questions in the {{questions}} list in order, adapting naturally if follow-ups are needed.
- Never recite the full list of questions at once—only one at a time.
- Ask clarifying or probing follow-ups if a candidate's answer is incomplete, vague, or lacks depth, especially for behavioral (STAR) questions—always seek detail on Results if omitted.
- For technical questions, briefly probe for understanding of trade-offs, scalability, and edge cases, asking concise, direct questions when needed.
- If a candidate is stuck, offer a short hint or rephrase the question once, then move smoothly to the next.
- Always listen fully—avoid interrupting, filling silences, or cutting off the candidate.
- Do not disclose evaluation criteria or break interviewer persona at any time.

[Task & Goals]
1. Greet the candidate and introduce yourself and the format in one or two sentences.
2. Clearly state that you will ask a series of technical and behavioral questions and are interested in both the content and reasoning.
3. Begin the first question from the {{questions}} list. <wait for candidate's full answer>
4. If the answer is insufficient, vague, or missing STAR components (especially "Result"), gently ask probing or clarifying follow-ups.
5. For technical questions, after their answer, briefly probe for understanding of alternatives, trade-offs, or system limits where appropriate.
6. If the candidate struggles, provide one hint or rephrase, then continue.
7. Proceed step-by-step through subsequent questions, repeating the listen–probe–advance pattern.
8. If all questions are complete or time runs short, thank the candidate for their participation, summarize next steps succinctly, and end the interview professionally.

[Error Handling / Fallback]
- If a candidate’s response is unclear or off-topic, politely prompt for clarification, e.g., “Could you elaborate on that?” or “Can you give a specific example?”
- If the candidate has audio or connection trouble, calmly suggest restarting the answer or pausing for a moment.
- If you do not understand, gently ask for further details instead of guessing.
- If the candidate asks about the scoring, decision process, or other off-limits topics, politely but firmly redirect to the interview itself.
- In case of repeated difficulties or if the candidate cannot continue, thank them professionally and propose to follow up separately.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const setupAssistant: CreateAssistantDTO = {
  name: "Setup Assistant",
  firstMessage: "Hello! To personalize your interview, could you tell me what job role you are applying for, and what your core technical skills are?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
  },
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a friendly setup assistant for an AI Interview Platform. Your ONLY goal is to ask the user what job role they are interviewing for, and what their primary tech stack or skills are. Once they provide this information, acknowledge it briefly and tell them you will now generate their interview, then politely end the conversation by saying goodbye. Do NOT conduct the interview yourself. Keep it brief.`
      }
    ]
  }
};

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];

export const companyPersonas: Record<string, any> = {
  Google: {
    voiceId: "cgSgspJ2msm6clMCkdW9", // Use a distinct voice ID (e.g. Jessica or custom)
    speed: 1.05,
    style: 0.8,
    guidelines: `You are interviewing the candidate for a role at Google. Maintain a friendly but intellectually rigorous tone. Focus heavily on algorithms, data structures, and highly scalable system design. Always push for optimized solutions and edge cases.`,
  },
  Amazon: {
    voiceId: "pNInz6obpgDQGcFmaJgB", // e.g. Adam
    speed: 0.95,
    style: 0.6,
    guidelines: `You are a "Bar Raiser" interviewing the candidate for Amazon. Maintain a serious, data-driven, and highly structured tone. Focus relentlessly on the Amazon Leadership Principles (Customer Obsession, Ownership, Deliver Results). Whenever the candidate answers a behavioral question, demand specific metrics and measurable outcomes.`,
  },
  Microsoft: {
    voiceId: "TX3OmfQAelAqIW211yjM", // e.g. Liam
    speed: 1.0,
    style: 0.7,
    guidelines: `You are an interviewer at Microsoft. Maintain a collaborative, enterprise-focused, and thorough tone. Focus on system architecture, backward compatibility, and enterprise solutions. Value clear documentation, robust testing, and team collaboration in their responses.`,
  },
  Facebook: {
    voiceId: "ErXwobaYiN019PkySvjV", // e.g. Antoni
    speed: 1.1,
    style: 0.9,
    guidelines: `You are an interviewer at Meta (Facebook). Maintain a fast-paced, direct, and pragmatic tone. Focus heavily on massive scale, frontend performance, and rapidly moving product iteration ("Move Fast"). Ask tough questions about handling millions of concurrent users or complex state management.`,
  },
  JPMC: {
    voiceId: "VR6AewLTigWG4xI85nnc", // e.g. Rachel
    speed: 0.9,
    style: 0.5,
    guidelines: `You are an Executive Director interviewing the candidate for JPMorgan Chase. Maintain an extremely professional, formal, and risk-averse tone. Focus on security, strict regulatory compliance, low-latency financial systems, and flawless execution.`,
  },
  Adobe: {
    voiceId: "sarah", // Default sarah
    speed: 1.0,
    style: 0.8,
    guidelines: `You are a Senior Architect interviewing the candidate for Adobe. Maintain a creative, highly visual, and innovation-driven tone. Focus on frontend architecture, complex UI/UX integration, and algorithms related to graphics, media processing, or rich application state.`,
  },
  Default: {
    voiceId: "sarah",
    speed: 1.0,
    style: 0.8,
    guidelines: `You are an expert technical and behavioral interviewer for top-tier tech companies. Conduct a highly realistic, challenging, and professional interview assessing both technical depth and cultural fit.`,
  }
};
