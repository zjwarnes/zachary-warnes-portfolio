interface FeatureListProps {
  items: string[];
  className?: string;
}

export function FeatureList({ items, className = '' }: FeatureListProps) {
  return (
    <ul className={`space-y-2 text-white list-none ${className}`}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
} 