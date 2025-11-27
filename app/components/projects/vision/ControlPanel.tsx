'use client'

import { AVAILABLE_CHARACTERS, SPEED_PRESETS, getNextPreset } from './utils'

interface ControlPanelProps {
    isRunning: boolean
    onToggleRun: (running: boolean) => void
    targetCharacter: string | null
    onTargetSelect: (char: string) => void
    animationSpeed: number
    onAnimationSpeedChange: (speed: number) => void
    confidenceThreshold: number
    onConfidenceThresholdChange: (threshold: number) => void
    sessionDuration: number
}

/**
 * Control panel for demo settings
 */
export function ControlPanel({
    isRunning,
    onToggleRun,
    targetCharacter,
    onTargetSelect,
    animationSpeed,
    onAnimationSpeedChange,
    confidenceThreshold,
    onConfidenceThresholdChange,
    sessionDuration,
}: ControlPanelProps) {
    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl">
            {/* Session Control */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
                    Session Control
                </h3>

                <button
                    onClick={() => onToggleRun(!isRunning)}
                    disabled={!targetCharacter}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${isRunning
                        ? 'bg-red-500/80 hover:bg-red-600 text-white'
                        : targetCharacter
                            ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isRunning ? '⏹ Stop Session' : '▶ Start Session'}
                </button>

                {isRunning && (
                    <div className="text-center text-sm text-[var(--color-primary)]">
                        ⏱ {Math.floor(sessionDuration)}s
                    </div>
                )}
            </div>

            {/* Target Selection */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
                    Select Target Character
                </h3>
                {!isRunning ? (
                    <div className="grid grid-cols-6 gap-1 max-h-24 overflow-y-auto">
                        {AVAILABLE_CHARACTERS.map(char => (
                            <button
                                key={char}
                                onClick={() => onTargetSelect(char)}
                                className={`p-2 rounded text-sm font-bold transition-all ${targetCharacter === char
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-background-dark)] border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                                    }`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="p-3 bg-[var(--color-background-dark)] rounded border border-[var(--color-border-primary)] text-center">
                        <p className="text-2xl font-bold text-[var(--color-primary)]">{targetCharacter}</p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">Looking for this character</p>
                    </div>
                )}
            </div>

            {/* Animation Speed */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
                        Animation Speed
                    </h3>
                    <span className="text-xs text-[var(--color-text-secondary)]">{animationSpeed}px/f</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onAnimationSpeedChange(getNextPreset(animationSpeed, SPEED_PRESETS.animation, 'down'))}
                        disabled={isRunning}
                        className="px-3 py-2 bg-[var(--color-background-dark)] border border-[var(--color-border-primary)] rounded hover:border-[var(--color-primary)] transition-all disabled:opacity-50"
                    >
                        ◀
                    </button>
                    <div className="flex-1 px-3 py-2 bg-[var(--color-background-dark)] border border-[var(--color-border-primary)] rounded text-center text-sm text-[var(--color-text-secondary)]">
                        {(animationSpeed * 60).toFixed(0)}px/s
                    </div>
                    <button
                        onClick={() => onAnimationSpeedChange(getNextPreset(animationSpeed, SPEED_PRESETS.animation, 'up'))}
                        disabled={isRunning}
                        className="px-3 py-2 bg-[var(--color-background-dark)] border border-[var(--color-border-primary)] rounded hover:border-[var(--color-primary)] transition-all disabled:opacity-50"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* Confidence Threshold */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
                        Confidence Threshold
                    </h3>
                    <span className="text-xs text-[var(--color-text-secondary)]">{confidenceThreshold}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={confidenceThreshold}
                    onChange={e => onConfidenceThresholdChange(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full h-2 bg-[var(--color-background-dark)] border border-[var(--color-border-primary)] rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                    style={{
                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${confidenceThreshold}%, var(--color-border-primary) ${confidenceThreshold}%, var(--color-border-primary) 100%)`,
                    }}
                />
            </div>
        </div>
    )
}
