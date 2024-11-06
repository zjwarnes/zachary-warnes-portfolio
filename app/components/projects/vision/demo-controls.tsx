'use client'

import { Button } from '../../../components/ui/button'
import { ToggleButton } from '../../../components/ui/toggle-button'

interface DemoControlsProps {
  onImageCountChange: (count: number) => void;
  onBackgroundToggle: () => void;
  onCatToggle: () => void;
  onDogToggle: () => void;
  onFaceToggle: () => void;
  onDetectionToggle: () => void;
  isBackgroundEnabled: boolean;
  isCatsEnabled: boolean;
  isDogsEnabled: boolean;
  isFacesEnabled: boolean;
  isDetectionEnabled: boolean;
}

export function DemoControls({
  onImageCountChange,
  onBackgroundToggle,
  onCatToggle,
  onDogToggle,
  onFaceToggle,
  onDetectionToggle,
  isBackgroundEnabled,
  isCatsEnabled,
  isDogsEnabled,
  isFacesEnabled,
  isDetectionEnabled
}: DemoControlsProps) {
  return (
    <div className="w-full space-y-4 bg-[var(--color-background-card)] p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <label className="text-sm">Background Image:</label>
        <ToggleButton
          isActive={isBackgroundEnabled}
          onClick={onBackgroundToggle}
          className="min-w-[120px]"
        >
          {isBackgroundEnabled ? 'Disable' : 'Enable'} Background
        </ToggleButton>
      </div>

      <div className="space-y-2">
        <label className="text-sm block">Number of Images:</label>
        <input
          type="range"
          min="1"
          max="5"
          defaultValue="3"
          className="w-full"
          onChange={(e) => onImageCountChange(parseInt(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <ToggleButton
          isActive={isCatsEnabled}
          onClick={onCatToggle}
          className="text-sm py-1 w-full"
        >
          Cats
        </ToggleButton>

        <ToggleButton
          isActive={isDogsEnabled}
          onClick={onDogToggle}
          className="text-sm py-1 w-full"
        >
          Dogs
        </ToggleButton>

        <ToggleButton
          isActive={isFacesEnabled}
          onClick={onFaceToggle}
          className="text-sm py-1 w-full"
        >
          Faces
        </ToggleButton>

        <ToggleButton
          isActive={isDetectionEnabled}
          onClick={onDetectionToggle}
          className="text-sm py-1 w-full"
        >
          Detection
        </ToggleButton>
      </div>
    </div>
  )
} 