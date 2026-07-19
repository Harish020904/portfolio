// ── Portfolio content as plain strings ──

export const ABOUT = `
Hi, I'm Harish Ragavender K — a developer who loves building things that live on the internet.
I'm passionate about clean code, beautiful interfaces, and solving complex problems.

When I'm not coding, you'll find me exploring new technologies, contributing to
open source, or tinkering with Linux systems.
`;

export const SKILLS = {
  languages: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'C++'],
  frontend: ['React', 'Next.js', 'Vue.js', 'Svelte', 'TailwindCSS'],
  backend: ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'Redis'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Nginx', 'CI/CD'],
  tools: ['Git', 'Vim', 'tmux', 'Arch Linux', 'VS Code'],
};

export const PROJECTS = [
  {
    name: 'terminal-portfolio',
    description: 'This very website — an interactive Arch Linux terminal in the browser',
    tech: ['React', 'TypeScript', 'Vite'],
    url: 'https://github.com/harish/terminal-portfolio',
  },
  {
    name: 'cloud-deploy',
    description: 'Automated cloud infrastructure deployment tool',
    tech: ['Go', 'Docker', 'Kubernetes'],
    url: 'https://github.com/harish/cloud-deploy',
  },
  {
    name: 'neural-canvas',
    description: 'AI-powered generative art platform',
    tech: ['Python', 'PyTorch', 'React'],
    url: 'https://github.com/harish/neural-canvas',
  },
];

export const CONTACT = {
  email: 'harish@example.com',
  github: 'https://github.com/harish',
  linkedin: 'https://linkedin.com/in/harish',
  twitter: 'https://twitter.com/harish',
};

export const EDUCATION = [
  {
    degree: 'B.Tech in Computer Science',
    school: 'University of Technology',
    year: '2020 - 2024',
  },
];

export const EXPERIENCE = [
  {
    role: 'Software Engineer',
    company: 'Tech Corp',
    period: '2024 - Present',
    description: 'Building scalable web applications and microservices',
  },
];
