import Link from 'next/link'

interface ProjectLinkProps {
  title: string;
  description: string;
  href: string;
}

export function ProjectLink({ title, description, href }: ProjectLinkProps) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-[var(--color-background-card)] hover:bg-opacity-70 
        border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)] 
        rounded-lg transition-all duration-200 animate-border-glow"
    >
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-[var(--color-text-secondary)]">{description}</p>
    </Link>
  );
} 