import { colors, commonStyles } from '../styles/theme'

interface ProjectLayoutProps {
  children: React.ReactNode;
  demo: React.ReactNode;
}

export default function ProjectLayout({ children, demo }: ProjectLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-12 min-h-[calc(100vh-200px)]">
      <div className="flex-1 prose prose-invert prose-headings:text-[var(--color-text-primary)] prose-p:text-gray-300 prose-a:text-[var(--color-primary)] prose-strong:text-[var(--color-text-primary)]">
        {children}
      </div>
      <div className="flex-1 border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)] rounded-lg p-8 bg-[var(--color-background-card)] transition-all duration-200">
        {demo}
      </div>
    </div>
  );
} 