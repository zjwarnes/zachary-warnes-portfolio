interface ProjectCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ProjectCard({ title, children, className = '' }: ProjectCardProps) {
  return (
    <div className={`bg-[var(--color-background-card)] p-6 rounded-lg ${className}`}>
      <h3 className="font-medium mb-3">{title}</h3>
      {children}
    </div>
  );
} 