// Career start date for calculating years of experience
export const CAREER_START_DATE = new Date("2021-10-01");

export function getYearsOfExperience(): number {
  const now = new Date();
  const years = (now.getTime() - CAREER_START_DATE.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years * 10) / 10; // Round to 1 decimal place
}

export const personalInfo = {
  name: "Tripto Afsin",
  fullName: "Afshin Nahian Tripto",
  title: "Software Engineer",
  tagline: "AI & Full-Stack Engineer",
  location: "Dhaka, Bangladesh",
  email: "AfsinTripto@gmail.com",
  bio: "I build intelligent web experiences with AI and modern technologies. Passionate about RAG applications, AI agents, and crafting scalable full-stack solutions.",
  avatar: "/avatar.jpg",
  profileImage: "https://images.ctfassets.net/6t2jvd86tzzx/3L2dcQkfHXJmCWtHhgeAnP/7d84d6caa2fe165cd6a4b1c950850f5e/dev_new.jpg",
  resume: "/cv/Afshin%20Nahian%20Tripto-Software%20Engineer.pdf",
  social: {
    github: "https://github.com/TriptoAfsin",
    linkedin: "https://www.linkedin.com/in/triptoafsin/",
    email: "mailto:AfsinTripto@gmail.com",
  },
};

export const skills = {
  languages: [
    "TypeScript",
    "JavaScript",
    "Go",
    "Python",
    "Java",
  ],
  ai: [
    "RAG Systems",
    "AI Agents",
    "Prompt Engineering",
    "LangChain",
    "Vector DBs",
    "Fine-tuning",
    "LoRA",
  ],
  frontend: [
    "React",
    "Next.js",
    "Tailwind CSS",
    "React Native",
  ],
  backend: [
    "Node.js",
    "Express",
    "NestJS",
    "FastAPI",
    "Go (Gin/Fiber)",
  ],
  databases: [
    "PostgreSQL",
    "MySQL",
    "Redis",
    "MongoDB",
  ],
  tools: [
    "Git",
    "Docker",
    "Linux",
    "GitHub Actions",
  ],
};

export const projects = [
  {
    title: "BUTEX NoteBot",
    description:
      "A 24/7 Messenger chatbot serving thousands of students at Bangladesh University of Textiles with educational content delivery.",
    tags: ["Node.js", "Chatbot", "MySQL"],
    github: "https://github.com/TriptoAfsin/notebot-engine-v1",
    stars: 22,
    featured: true,
  },
  {
    title: "ts-stats",
    description:
      "TypeScript utility functions for statistical operations - mean, median, mode, standard deviation, and more.",
    tags: ["TypeScript", "NPM", "Statistics"],
    github: "https://github.com/TriptoAfsin/ts-stats",
    npm: "https://www.npmjs.com/package/ts-stats",
    stars: 5,
    featured: true,
  },
  {
    title: "bang-utils",
    description:
      "A lightweight utility library for converting English numerals and dates to Bengali in TypeScript/JavaScript.",
    tags: ["TypeScript", "NPM", "i18n"],
    github: "https://github.com/TriptoAfsin/bang-utils",
    npm: "https://www.npmjs.com/package/bang-utils",
    stars: 5,
    featured: true,
  },
  {
    title: "chonkie-pdf",
    description:
      "Python CLI tool for intelligent PDF chunking, optimized for RAG applications.",
    tags: ["Python", "RAG", "CLI"],
    github: "https://github.com/TriptoAfsin/chonkie-pdf",
    stars: 2,
    featured: true,
  },
  {
    title: "docset-gen",
    description:
      "Documentation-to-dataset transformation tool for training AI models. Built for T21 Dev.",
    tags: ["Python", "AI", "Data"],
    github: "https://github.com/t21dev/docset-gen",
    stars: 1,
    featured: true,
  },
  {
    title: "notebot-analytics-go",
    description:
      "High-performance analytics service for the NoteBot platform, built with Go and MySQL.",
    tags: ["Go", "Analytics", "API", "MySQL"],
    github: "https://github.com/TriptoAfsin/notebot-anlaytics-go",
    featured: true,
  },
];

export const experience = [
  {
    company: "Provision Capital",
    role: "Senior Full Stack Engineer",
    period: "Oct 2024 - Present",
    duration: "Current",
    description:
      "Building AI-powered internal solutions with focus on AI Agents and Agentic AI Development for financial technology applications.",
    tags: ["AI Agents", "Agentic AI", "Full-Stack"],
    logo: "/logos/provision-capital.png",
    logoFallback: "PC",
    current: true,
  },
  {
    company: "REDQ Technologies Ltd.",
    role: "Software Engineer",
    period: "Apr 2024 - Present",
    duration: "1+ Year",
    description:
      "Building TrueBeep - AI powered marketing platform. Integrated 7+ third-party platforms, built real-time collaboration with WebSocket, delivered production-grade RAG applications.",
    tags: ["Next.js", "TypeScript", "Redis", "BullMQ", "PostgreSQL"],
    logo: "/logos/redq.png",
    logoFallback: "RQ",
    current: true,
  },
  {
    company: "Edison Communication Ltd.",
    role: "Frontend Developer",
    period: "Jun 2023 - Apr 2024",
    duration: "11 Months",
    description:
      "Built WebManza - drag & drop e-commerce builder. Improved SEO with Next.js SSR, reduced network calls by ~40% with Redux RTK Query.",
    tags: ["Next.js", "React", "TypeScript", "Redux"],
    logo: "/logos/edison.png",
    logoFallback: "EC",
    current: false,
  },
  {
    company: "Delivery Hobe",
    role: "JavaScript Developer",
    period: "Oct 2021 - May 2023",
    duration: "1 Year 8 Months",
    description:
      "Built DeliveryHobe e-commerce platform, AdsHobe B2B ads platform, and Rider App using React Native. Architected frontend from scratch with Next.js.",
    tags: ["Next.js", "React", "React Native", "Redux", "TypeScript"],
    logo: "/logos/delivery-hobe.ico",
    logoFallback: "DH",
    current: false,
  },
  {
    company: "BUTEX NoteBot",
    role: "Founder",
    period: "Sep 2018 - Present",
    duration: "7+ Years",
    description:
      "Founded educational chatbot serving thousands of students. Built backend with Node.js/Express, webhook-driven Messenger integration, and Go analytics APIs.",
    tags: ["Node.js", "MySQL", "Go", "Messenger API"],
    logo: "/logos/notebot.jpg",
    logoFallback: "NB",
    current: true,
  },
];

export const certifications = [
  {
    title: "Generative AI Engineering and Fine-Tuning Transformers",
    issuer: "IBM",
    date: "Jan 2026",
    skills: ["Fine Tuning", "LoRA", "Transformers"],
  },
  {
    title: "AI Agents Fundamentals",
    issuer: "Hugging Face",
    date: "Mar 2025",
    skills: ["AI Agents", "LLMs"],
  },
  {
    title: "Software Architecture Foundations",
    issuer: "LinkedIn Learning",
    date: "2024",
    skills: ["Architecture", "Design Patterns"],
  },
  {
    title: "The AI Engineer Path",
    issuer: "Scrimba",
    date: "2024",
    skills: ["AI Engineering", "LLMs"],
  },
  {
    title: "Ethical Hacker",
    issuer: "Cisco",
    date: "2023",
    skills: ["Security", "Ethical Hacking"],
  },
];

export const education = [
  {
    institution: "United International University",
    degree: "Master of Science",
    field: "Computer Science",
    period: "Jan 2024 - Aug 2025",
    current: true,
  },
  {
    institution: "Bangladesh University of Textiles",
    degree: "Bachelor of Science",
    field: "Industrial Engineering",
    period: "Jan 2018 - Dec 2023",
    grade: "CGPA: 3.75",
    current: false,
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];
