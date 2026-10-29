import React from 'react';
import { 
  Atom, 
  Layers, 
  FileCode, 
  Server, 
  Terminal, 
  Database, 
  Cloud, 
  Bot, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Workflow,
  Box,
  Code2,
  HardDrive
} from 'lucide-react';

const iconMap = {
  // Frontend
  react: <Atom size={24} />,
  nextjs: <Layers size={24} />,
  typescript: <FileCode size={24} />,
  javascript: <Code2 size={24} />,
  htmlcss: <Globe size={24} />,
  
  // Backend
  nodejs: <Server size={24} />,
  python: <Terminal size={24} />,
  mongodb: <Database size={24} />,
  postgresql: <HardDrive size={24} />,
  php: <FileCode size={24} />,
  
  // Cloud & DevOps
  aws: <Cloud size={24} />,
  docker: <Box size={24} />,
  kubernetes: <Workflow size={24} />,
  security: <ShieldCheck size={24} />,

  // AI & Data
  ai: <Bot size={24} />,
  tensorflow: <Cpu size={24} />,

  // Default fallback
  default: <Cpu size={24} />
};

export const getTechIcon = (iconKey) => {
  return iconMap[iconKey?.toLowerCase()] || iconMap.default;
};

// List of available icons for the Admin dropdown selector
export const availableIcons = [
  { key: 'react', label: 'React / Atom' },
  { key: 'nextjs', label: 'Next.js / Layers' },
  { key: 'typescript', label: 'TypeScript / FileCode' },
  { key: 'javascript', label: 'JavaScript / Code2' },
  { key: 'htmlcss', label: 'HTML & CSS / Globe' },
  { key: 'nodejs', label: 'Node.js / Server' },
  { key: 'python', label: 'Python / Terminal' },
  { key: 'mongodb', label: 'MongoDB / Database' },
  { key: 'postgresql', label: 'PostgreSQL / HardDrive' },
  { key: 'php', label: 'PHP / FileCode' },
  { key: 'aws', label: 'AWS / Cloud' },
  { key: 'docker', label: 'Docker / Box' },
  { key: 'kubernetes', label: 'Kubernetes / Workflow' },
  { key: 'security', label: 'DevSecOps / Shield' },
  { key: 'ai', label: 'AI & LLMs / Bot' },
  { key: 'tensorflow', label: 'TensorFlow / Cpu' },
];