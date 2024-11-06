import { Button } from '../ui/button';

interface ProjectDemoProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function ProjectDemo({ 
  title, 
  description, 
  buttonText = "Try Demo",
  onButtonClick 
}: ProjectDemoProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-[var(--color-background-card)] rounded-lg">
      <div className="max-w-2xl text-center mb-8">
        <h2 className="text-xl font-medium mb-4">
          {title}
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          {description}
        </p>
        <Button 
          variant="primary" 
          size="lg"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
} 