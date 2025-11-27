'use client'

interface DemoControlsProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

export function DemoControls({
  systemPrompt,
  onSystemPromptChange
}: DemoControlsProps) {
  return (
    <div className="w-full space-y-4 bg-[var(--color-background-card)] p-4 rounded-lg mb-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xs bg-green-700 text-white px-2 py-1 rounded">✓ Resume Loaded</p>
          <p className="text-xs text-gray-400">The model has access to your resume context for personalized responses</p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm block">System Prompt:</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          className="w-full h-24 bg-gray-700 text-white rounded-lg p-2 resize-none"
        />
      </div>
    </div>
  );
}