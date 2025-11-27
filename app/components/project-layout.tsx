import { colors, commonStyles } from '../styles/theme'

interface ProjectLayoutProps {
  children: React.ReactNode;
  demo: React.ReactNode;
}

export default function ProjectLayout({ children, demo }: ProjectLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-12 min-h-[calc(100vh-200px)]">
      <div className="flex-1 text-white prose prose-invert prose-headings:text-white prose-p:text-white prose-p:!text-white prose-a:text-[var(--color-primary)] prose-strong:text-white [&>*]:text-white [&>*>*]:text-white">
        {children}
      </div>
      <div className="flex-1 border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)] rounded-lg p-8 bg-[var(--color-background-card)] transition-all duration-200">
        {demo}
      </div>
    </div>
  );
}