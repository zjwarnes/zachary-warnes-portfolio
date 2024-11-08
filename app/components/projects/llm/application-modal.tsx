interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  skills: string[];
  value: string;
}

export function ApplicationModal({
  isOpen,
  onClose,
  title,
  description,
  skills,
  value
}: ApplicationModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--color-background-card)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-medium !text-[var(--color-text-primary)]">{title}</h2>
            <button 
              onClick={onClose}
              className="!text-[var(--color-text-primary)] hover:opacity-80"
            >
              ✕
            </button>
          </div>
          
          <p className="!text-[var(--color-text-primary)]">{description}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium !text-[var(--color-text-primary)] mb-2">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-[var(--color-background)] rounded-full text-sm !text-[var(--color-text-primary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium !text-[var(--color-text-primary)] mb-2">Business Value</h3>
              <p className="!text-[var(--color-text-primary)]">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 