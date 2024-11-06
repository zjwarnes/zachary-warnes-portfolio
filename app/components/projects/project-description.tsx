interface ProjectDescriptionProps {
  paragraphs: string[];
}

export function ProjectDescription({ paragraphs }: ProjectDescriptionProps) {
  return (
    <div className="bg-black bg-opacity-70 p-6 rounded-lg space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-white !text-white">
          {paragraph}
        </p>
      ))}
    </div>
  );
} 