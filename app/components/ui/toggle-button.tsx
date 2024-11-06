interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  children: React.ReactNode;
}

export function ToggleButton({ isActive, children, className, ...props }: ToggleButtonProps) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 
        rounded-md 
        transition-all 
        duration-200 
        font-medium 
        border
        ${isActive 
          ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20' 
          : 'border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
} 