'use client'

import { useState } from 'react'
import { SessionRun } from './types'

interface SessionHistoryProps {
    history: SessionRun[]
    onClearHistory: () => void
}

/**
 * Expandable table showing previous session runs
 */
export function SessionHistory({ history, onClearHistory }: SessionHistoryProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    if (history.length === 0) {
        return (
            <div className="p-6 text-center text-[var(--color-text-secondary)]">
                No session history yet. Start a session to see results here!
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Session History</h3>
                <button
                    onClick={onClearHistory}
                    className="text-xs px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-all"
                >
                    Clear
                </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.map(session => (
                    <div
                        key={session.id}
                        className="bg-gradient-to-r from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-lg overflow-hidden transition-all hover:border-[var(--color-primary)]"
                    >
                        {/* Main row */}
                        <button
                            onClick={() =>
                                setExpandedId(expandedId === session.id ? null : session.id)
                            }
                            className="w-full p-4 flex justify-between items-center hover:bg-[var(--color-background-card)] transition-all"
                        >
                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                                        {session.targetCharacter}
                                    </span>
                                    <div>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            {session.startTime.toLocaleTimeString()}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-secondary)]">
                                            {session.duration.toFixed(1)}s • {session.metrics.detection.totalFrames} frames
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-[var(--color-text-secondary)]">Detection Acc</p>
                                    <p
                                        className={`text-lg font-bold ${session.metrics.detection.accuracy >= 80
                                            ? 'text-green-400'
                                            : session.metrics.detection.accuracy >= 60
                                                ? 'text-yellow-400'
                                                : 'text-red-400'
                                            }`}
                                    >
                                        {session.metrics.detection.accuracy.toFixed(1)}%
                                    </p>
                                </div>

                                <span
                                    className={`transition-transform ${expandedId === session.id ? 'rotate-180' : ''
                                        }`}
                                >
                                    ▼
                                </span>
                            </div>
                        </button>

                        {/* Expanded details */}
                        {expandedId === session.id && (
                            <div className="px-4 pb-4 border-t border-[var(--color-border-primary)] space-y-4">
                                {/* Detection Stage Metrics */}
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-[var(--color-primary)]">Detection Stage</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-xs text-[var(--color-text-secondary)]">Accuracy</p>
                                            <p className="text-lg font-bold text-green-400">
                                                {session.metrics.detection.accuracy.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="p-3 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-xs text-[var(--color-text-secondary)]">Precision</p>
                                            <p className="text-lg font-bold text-blue-400">
                                                {session.metrics.detection.precision.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="p-3 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-xs text-[var(--color-text-secondary)]">Recall</p>
                                            <p className="text-lg font-bold text-purple-400">
                                                {session.metrics.detection.recall.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-[var(--color-text-secondary)]">Detected</p>
                                            <p className="font-bold text-green-400">{session.metrics.detection.correctDetections}</p>
                                        </div>
                                        <div className="p-2 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-[var(--color-text-secondary)]">Missed</p>
                                            <p className="font-bold text-orange-400">{session.metrics.detection.falseNegatives}</p>
                                        </div>
                                        <div className="p-2 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-[var(--color-text-secondary)]">False Positives</p>
                                            <p className="font-bold text-red-400">{session.metrics.detection.falsePositives}</p>
                                        </div>
                                        <div className="p-2 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-[var(--color-text-secondary)]">Total Frames</p>
                                            <p className="font-bold">{session.metrics.detection.totalFrames}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Classification Stage Metrics */}
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-[var(--color-accent)]">Classification Stage</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-xs text-[var(--color-text-secondary)]">Accuracy</p>
                                            <p className="text-lg font-bold text-green-400">
                                                {session.metrics.classification.accuracy.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="p-3 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-xs text-[var(--color-text-secondary)]">Precision</p>
                                            <p className="text-lg font-bold text-blue-400">
                                                {session.metrics.classification.precision.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="p-3 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-xs text-[var(--color-text-secondary)]">Recall</p>
                                            <p className="text-lg font-bold text-purple-400">
                                                {session.metrics.classification.recall.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-[var(--color-text-secondary)]">Correct</p>
                                            <p className="font-bold text-green-400">{session.metrics.classification.correctDetections}</p>
                                        </div>
                                        <div className="p-2 bg-[var(--color-background-dark)] rounded">
                                            <p className="text-[var(--color-text-secondary)]">Wrong Target</p>
                                            <p className="font-bold text-red-400">{session.metrics.classification.falsePositives}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Settings used */}
                                <div className="p-3 bg-[var(--color-background-dark)] rounded text-xs space-y-1">
                                    <p>
                                        <span className="text-[var(--color-text-secondary)]">Detection Speed:</span>{' '}
                                        <span className="font-bold">{session.detectionSpeed}ms (~{(1000 / session.detectionSpeed).toFixed(0)}fps)</span>
                                    </p>
                                    <p>
                                        <span className="text-[var(--color-text-secondary)]">Animation Speed:</span>{' '}
                                        <span className="font-bold">{session.animationSpeed}px/f (~{(session.animationSpeed * 60).toFixed(0)}px/s)</span>
                                    </p>
                                    <p>
                                        <span className="text-[var(--color-text-secondary)]">Confidence Threshold:</span>{' '}
                                        <span className="font-bold">{session.confidenceThreshold}%</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
