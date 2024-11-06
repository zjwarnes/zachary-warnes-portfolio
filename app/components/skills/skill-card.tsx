'use client'

import { useState } from 'react';
import { SkillModal } from './skill-modal';

interface SkillCardProps {
  title: string;
  description: string;
  details: {
    expertise: string[];
    projects: string[];
    technologies: string[];
  };
}

export function SkillCard({ title, description, details }: SkillCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left p-6 bg-[var(--color-background-card)] 
          hover:bg-opacity-70 border border-[var(--color-border-primary)] 
          hover:border-[var(--color-border-hover)] rounded-lg 
          transition-all duration-200 animate-border-glow"
      >
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-[var(--color-text-secondary)]">{description}</p>
      </button>

      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
        details={details}
      />
    </>
  );
} 