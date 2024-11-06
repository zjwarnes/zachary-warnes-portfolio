'use client'

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  details: {
    expertise: string[];
    projects: string[];
    technologies: string[];
  };
}

export function SkillModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  details 
}: SkillModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--color-background-card)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-medium">{title}</h2>
            <button 
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <p className="text-[var(--color-text-secondary)]">{description}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Areas of Expertise</h3>
              <ul className="list-disc list-inside text-[var(--color-text-secondary)]">
                {details.expertise.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Related Projects</h3>
              <ul className="list-disc list-inside text-[var(--color-text-secondary)]">
                {details.projects.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Technologies</h3>
              <ul className="list-disc list-inside text-[var(--color-text-secondary)]">
                {details.technologies.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 