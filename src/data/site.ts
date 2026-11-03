import provision from "./work/provision.json";
import redq from "./work/redq.json";
import notebot from "./work/notebot.json";
import brac from "./work/brac.json";
import edison from "./work/edison.json";

export const SITE_URL = "https://triptex.me";

export const person = {
  name: "Afshin Nahian Tripto",
  short: "Tripto",
  roles: ["Founder", "Product Engineer", "AI Engineer", "Full-Stack"],
  location: "Dhaka, Bangladesh",
  email: "afsintripto@gmail.com",
  photo: "https://images.ctfassets.net/6t2jvd86tzzx/3L2dcQkfHXJmCWtHhgeAnP/7d84d6caa2fe165cd6a4b1c950850f5e/dev_new.jpg",
  resume: "/cv/Afshin%20Nahian%20Tripto-Software%20Engineer.pdf",
  social: {
    github: "https://github.com/TriptoAfsin",
    linkedin: "https://www.linkedin.com/in/triptoafsin/",
    x: "https://x.com/Tripto_Afsin",
  },
  mailto: "mailto:afsintripto@gmail.com?subject=Hello%20Afshin",
};

/** Rotating hero headline. The part inside `accent` is highlighted. */
export const headlines: { lead: string; accent: string }[] = [
  { lead: "Built for people.", accent: "Ready for their agents." },
  { lead: "I build products that do real work,", accent: "and I own what they do." },
  { lead: "Founder and engineer.", accent: "I ship software people rely on." },
  { lead: "From the first conversation", accent: "to production, and everything after." },
  { lead: "I turn messy operations", accent: "into software teams use every day." },
  { lead: "Products with AI inside,", accent: "built to be fast, cheap and right." },
];

export const bio = [
  "I start with the people who'll use the thing and the problem they're stuck on. Then I cut it down to what actually moves that problem, build it end to end, and stay with it after launch. Sometimes that's an AI agent. More often it's the platform around it: payments, permissions, queues, the dashboard someone checks every morning.",
  "More than half a decade in, I've founded a product that's still serving students eight years later, been the only engineer on platforms a whole company runs on, and written the AI behind two SaaS products.",
];

export const facts = [
  { icon: "i-brief", text: "Senior Full Stack Engineer, Provision Capital" },
  { icon: "i-globe", text: "Working remotely with cross-cultural teams" },
  { icon: "i-pin", text: "Dhaka, Bangladesh" },
];

export type WorkDetail = {
  summary?: string;
  projects?: { title: string; ownership?: string; client?: string; period?: string; what?: string; built?: string[]; stack?: string[] }[];
  ai?: string[];
  operations?: string[];
};

export type WorkCard = {
  key: string;
  company: string;
  role: string;
  place: string;
  when: string;
  logo?: string;
  partTime?: boolean;
  blurb: string;
  tags: string[];
  detail?: WorkDetail;
};

export const work: WorkCard[] = [
  { key: "provision", logo: "/logos/provision-capital.png", company: "Provision Capital", role: "Senior Full Stack Engineer", place: "Texas, remote", when: "Apr 2024 – now",
    blurb: "I build the software a real estate investment firm and the organizations it works with run on: investor platforms, learning and operations systems, marketing sites with lead capture, and AI tools. I scope it with the team, build it, host it, and keep it healthy.",
    tags: ["Next.js 16", "PostgreSQL", "BullMQ", "Cloudflare", "Stripe", "AI agents"], detail: provision as WorkDetail },
  { key: "redq", logo: "/logos/redq.png", company: "REDQ Technologies", role: "Software Engineer", place: "Dhaka", when: "Apr 2024 – now",
    blurb: "Main author of the AI engines behind TrueBeep, a marketing platform, and PROA, a multi-tenant ERP: copilots with memory, retrieval over documents, inbox agents, and model routing and caching to keep cost and latency down.",
    tags: ["Python", "FastAPI", "RAG", "Redis", "ChromaDB"], detail: redq as WorkDetail },
  { key: "notebot", logo: "/logos/notebot.jpg", company: "BUTEX NoteBot", role: "Founder", place: "Side project", when: "Sep 2018 – now",
    blurb: "Started as a Messenger bot that sent lecture notes to classmates. It's now a study platform with a web app, an Android app, analytics, an AI-assisted note pipeline and an MCP server. I still run all of it.",
    tags: ["Node.js", "Bun", "PostgreSQL", "Go", "n8n", "MCP"], detail: notebot as WorkDetail },
  { key: "brac", logo: "/logos/brac.svg", company: "BRAC", role: "Frontend Engineer", place: "SDP program", when: "Mar 2023 – May 2025", partTime: true,
    blurb: "A part-time project alongside my full-time roles. I built most of the frontend for a program management platform: roles and designations, project cohorts and branches, donor and area data, and approvals.",
    tags: ["React", "TypeScript", "Docker"], detail: brac as WorkDetail },
  { key: "edison", logo: "/logos/edison.png", company: "Edison Communication", role: "Frontend Developer", place: "Dhaka", when: "Jun 2023 – Apr 2024",
    blurb: "Built WebManza, a drag-and-drop store builder. Moving storefronts to server rendering fixed their SEO, and RTK Query caching cut about 40% of redundant network calls.",
    tags: ["Next.js", "Redux", "RTK Query"], detail: edison as WorkDetail },
  { key: "dh", logo: "/logos/delivery-hobe.ico", company: "Delivery Hobe", role: "JavaScript Developer", place: "Dhaka", when: "Oct 2021 – May 2023",
    blurb: "My first engineering job. I architected the AdsHobe ads platform frontend from scratch, worked on the DeliveryHobe storefront, and shipped a React Native rider app.",
    tags: ["Next.js", "React Native", "TypeScript"] },
];

export const projects = [
  { name: "Porter", stars: 27, stack: "Tauri · React 19", url: "https://github.com/t21dev/porter-app", text: "See which process is holding a port and stop it in one click, on Windows, macOS and Linux." },
  { name: "Turbo Reader", stars: 26, stack: "Rust · Tauri 2", url: "https://github.com/t21dev/turbo-reader", text: "An RSS reader built to stay small and fast: under 5 MB to install and opens in under a second." },
  { name: "md-viewer-pwa", stars: 23, stack: "PWA · React", url: "https://github.com/TriptoAfsin/md-viewer-pwa", text: "An installable Markdown viewer that works offline on any device." },
  { name: "BUTEX NoteBot", stars: 22, stack: "Node.js · Messenger", url: "https://github.com/TriptoAfsin/notebot-engine-v1", text: "The chatbot that started it all in 2018, delivering study material to university students around the clock." },
  { name: "Shapeshifting Software", stars: 12, stack: "AI agents · Essay", url: "https://github.com/TriptoAfsin/shape-shifter", text: "How an app could reshape its own UI and workflows from plain-language requests while its core logic and permissions stay locked." },
  { name: "ts-stats", stars: 6, stack: "TypeScript · npm", url: "https://github.com/TriptoAfsin/ts-stats", text: "Small, typed statistics helpers: mean, median, mode, deviation and more." },
  { name: "simple-messenger-blocks", stars: 6, stack: "Node.js · npm", url: "https://github.com/TriptoAfsin/simple-messenger-blocks", text: "Builds Messenger chatbot blocks (buttons, cards, quick replies) from plain objects. Extracted from NoteBot." },
  { name: "chonkie-pdf", stars: 2, stack: "Python · RAG", url: "https://github.com/TriptoAfsin/chonkie-pdf", text: "Splits large PDFs into clean chunks for retrieval pipelines, from the command line." },
];

export const log = [
  { t: "Oct 2026", c: "oss", n: "Turbo Reader", d: "Rust core, React shell, Tauri 2. Under 5 MB to install.", ship: true },
  { t: "Oct 2026", c: "notebot", n: "NoteBot MCP", d: "MCP servers for students, with free keys and OAuth.", ship: true },
  { t: "Oct 2026", c: "work", n: "Operations platform", d: "Shipped the first phase of an internal platform as the sole engineer.", ship: true },
  { t: "Oct 2026", c: "oss", n: "Porter", d: "Outgoing connections view and a calmer light theme.", ship: true },
  { t: "Oct 2026", c: "oss", n: "Shapeshifting Software", d: "Published the essay and reference design.", ship: true },
  { t: "Jan 2026", c: "work", n: "ERP copilot", d: "AI engine with memory and document search for a multi-tenant ERP.", ship: true },
  { t: "Jan 2026", c: "edu", n: "IBM certificate", d: "Generative AI Engineering and Fine-Tuning Transformers." },
  { t: "Aug 2025", c: "edu", n: "M.S. Computer Science", d: "Finished at UIU with a 3.97 CGPA." },
  { t: "Nov 2024", c: "work", n: "Marketing copilot", d: "Copilot and inbox agents for a marketing platform.", ship: true },
  { t: "Apr 2024", c: "work", n: "Provision Capital and REDQ", d: "Started both roles in the same month." },
  { t: "Jun 2023", c: "work", n: "Edison Communication", d: "Frontend Developer." },
  { t: "Oct 2021", c: "work", n: "Delivery Hobe", d: "First engineering job." },
  { t: "Sep 2018", c: "notebot", n: "BUTEX NoteBot", d: "Sent the first lecture note over Messenger.", ship: true },
];

export const education = [
  { degree: "M.S. Computer Science", school: "United International University", when: "2024 – 2025", note: "Graduated with a 3.97 CGPA while working full time." },
  { degree: "B.S. Industrial Engineering", school: "Bangladesh University of Textiles", when: "2018 – 2023", note: "CGPA 3.75. Where NoteBot started." },
];

export const certifications = [
  { name: "Generative AI Engineering and Fine-Tuning Transformers", issuer: "IBM", year: "2026" },
  { name: "AI Agents Fundamentals", issuer: "Hugging Face", year: "2025" },
  { name: "The AI Engineer Path", issuer: "Scrimba", year: "2024" },
  { name: "Software Architecture Foundations", issuer: "LinkedIn Learning", year: "2024" },
  { name: "Ethical Hacker", issuer: "Cisco", year: "2023" },
  { name: "Introduction to SQL", issuer: "Simplilearn", year: "" },
];
