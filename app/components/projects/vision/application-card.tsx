'use client'

import { useState } from 'react';
import { ApplicationModal } from './application-modal';

interface ApplicationCardProps {
  title: string;
  description: string;
  skills: string[];
  value: string;
}

export function ApplicationCard({ title, description, skills, value }: ApplicationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left p-6 bg-[var(--color-background-card)] 
          hover:bg-opacity-70 border border-[var(--color-border-primary)] 
          hover:border-[var(--color-border-hover)] rounded-lg 
          transition-all duration-200"
      >
        <h3 className="text-lg font-medium !text-[var(--color-text-primary)] mb-2">{title}</h3>
        <p className="!text-[var(--color-text-primary)] line-clamp-2">{description}</p>
      </button>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
        skills={skills}
        value={value}
      />
    </>
  );
} 