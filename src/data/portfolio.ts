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
  bio: "I build intelligent web experiences with AI and modern technologies. Passionate about AI agents, context engineering, and crafting scalable full-stack solutions.",
  avatar: "/avatar.jpg",
  profileImage: "https://images.ctfassets.net/6t2jvd86tzzx/3L2dcQkfHXJmCWtHhgeAnP/7d84d6caa2fe165cd6a4b1c950850f5e/dev_new.jpg",
  resume: "/cv/afshin-nahian-tripto-resume.pdf",
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
    "Python",
    "Go",
    "Rust",
    "Java",
  ],
  ai: [
    "AI Agents",
    "Context Engineering",
    "RAG Systems",
    "Prompt Engineering",
    "LangChain",
    "Vector DBs",
    "Fine-tuning",
    "LoRA",
    "MCP",
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
    title: "Turbo Reader",
    description:
      "A desktop RSS reader in Rust and React on Tauri 2. The installer is under 5 MB and it holds 20,000 articles in a 14 MB core process.",
    tags: ["Rust", "Tauri", "React", "SQLite"],
    github: "https://github.com/t21dev/turbo-reader",
    stars: 26,
    featured: true,
  },
  {
    title: "Porter",
    description:
      "A cross-platform port monitor for developers. See what holds every port and kill the process in one click.",
    tags: ["Tauri", "React 19", "TypeScript"],
    github: "https://github.com/t21dev/porter-app",
    stars: 27,
    featured: true,
  },
  {
    title: "md-viewer-pwa",
    description:
      "A small, installable Markdown viewer that works offline on any device.",
    tags: ["PWA", "Markdown", "React"],
    github: "https://github.com/TriptoAfsin/md-viewer-pwa",
    stars: 23,
    featured: true,
  },
  {
    title: "Shapeshifting Software",
    description:
      "A reference design for apps that reshape their UI and workflows from natural-language intent while the core and its guardrails stay fixed.",
    tags: ["AI Agents", "Architecture"],
    github: "https://github.com/TriptoAfsin/shape-shifter",
    stars: 12,
    featured: true,
  },
  {
    title: "BUTEX NoteBot",
    description:
      "A 24/7 Messenger chatbot and study platform serving students at Bangladesh University of Textiles.",
    tags: ["Node.js", "Chatbot", "Go"],
    github: "https://github.com/TriptoAfsin/notebot-engine-v1",
    stars: 22,
    featured: true,
  },
  {
    title: "ts-stats",
    description:
      "TypeScript utility functions for statistics: mean, median, mode, standard deviation and more.",
    tags: ["TypeScript", "NPM"],
    github: "https://github.com/TriptoAfsin/ts-stats",
    npm: "https://www.npmjs.com/package/ts-stats",
    stars: 6,
    featured: true,
  },
  {
    title: "simple-messenger-blocks",
    description:
      "Builds Messenger chatbot blocks (buttons, cards, quick replies) from plain objects. Extracted from NoteBot.",
    tags: ["Node.js", "NPM", "Chatbot"],
    github: "https://github.com/TriptoAfsin/simple-messenger-blocks",
    npm: "https://www.npmjs.com/package/simple-messenger-blocks",
    stars: 6,
    featured: true,
  },
];

export const experience = [
  {
    company: "Provision Capital",
    role: "Senior Full Stack Engineer",
    period: "Apr 2024 - Present",
    duration: "Current",
    description:
      "I build the software a real estate investment firm and its operating companies run on, from investor-facing platforms to internal operations tools, usually as the engineer who scopes it with the team and takes it to production.",
    tags: ["Next.js", "PostgreSQL", "BullMQ", "Stripe", "AI Agents"],
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
      "Main author of the AI engines behind a marketing platform and a multi-tenant ERP: copilots with short- and long-term memory, retrieval over business documents, and agents that answer inboxes.",
    tags: ["FastAPI", "ChromaDB", "Next.js", "Redis", "BullMQ"],
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
      "Founded a study platform for textile engineering students: Messenger bot, web app, Go analytics and an MCP server for Claude and ChatGPT.",
    tags: ["Bun", "PostgreSQL", "Go", "MCP"],
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
    grade: "CGPA: 3.97",
    current: false,
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

export const socialLinks = [
  {
    label: "GitHub",
    href: personalInfo.social.github,
  },
  {
    label: "LinkedIn",
    href: personalInfo.social.linkedin,
  },
  {
    label: "Email",
    href: personalInfo.social.email,
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
