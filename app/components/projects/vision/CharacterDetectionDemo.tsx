'use client'

import { useEffect, useRef, useState } from 'react'
import { FallingCharacters } from './FallingCharacters'
import { DetectionCanvas } from './DetectionCanvas'
import { ControlPanel } from './ControlPanel'
import { FallingCharacter } from './types'
import { SPEED_PRESETS } from './utils'

/**
 * Main character detection demo component
 * Simplified: Single unified metric tracking correct/incorrect/missed detections
 */
export function CharacterDetectionDemo() {
    const [isRunning, setIsRunning] = useState(false)
    const [targetCharacter, setTargetCharacter] = useState<string | null>(null)
    const [animationSpeed, setAnimationSpeed] = useState(SPEED_PRESETS.animation[1])
    const [confidenceThreshold, setConfidenceThreshold] = useState(50)
    const [sessionDuration, setSessionDuration] = useState(0)
    const [fallingCharacters, setFallingCharacters] = useState<Map<string, FallingCharacter>>(new Map())

    // Simple metrics tracking
    const [metrics, setMetrics] = useState({
        detection: { correct: 0, incorrect: 0, total: 0 },
        classification: { correct: 0, incorrect: 0, total: 0 }
    })
    const [sessionHistory, setSessionHistory] = useState<any[]>([])
    const detectionTrackedRef = useRef<Set<string>>(new Set())
    const classificationTrackedRef = useRef<Set<string>>(new Set())
    const sessionStartTimeRef = useRef<number>(0)

    // Timer for session duration
    useEffect(() => {
        if (!isRunning) {
            setSessionDuration(0)
            return
        }

        sessionStartTimeRef.current = Date.now()
        const timer = setInterval(() => {
            setSessionDuration((Date.now() - sessionStartTimeRef.current) / 1000)
        }, 100)

        return () => clearInterval(timer)
    }, [isRunning])

    // Handle session start/stop
    const handleToggleRun = (running: boolean) => {
        if (running && !targetCharacter) return

        if (!running && isRunning) {
            // Save session when stopping
            setSessionHistory(prev => [...prev, {
                id: Date.now(),
                targetCharacter,
                duration: sessionDuration,
                metrics: { ...metrics },
                timestamp: new Date(),
            }])
            setMetrics({
                detection: { correct: 0, incorrect: 0, total: 0 },
                classification: { correct: 0, incorrect: 0, total: 0 }
            })
            detectionTrackedRef.current.clear()
            classificationTrackedRef.current.clear()
        }

        setIsRunning(running)
    }

    // Handle detection stage
    // Only count target digits as misses. Non-target digits are ignored.
    const handleDetectionStage = (char: string, isDetected: boolean) => {
        // Only score if this is the target digit we're looking for
        if (char !== targetCharacter) return

        setMetrics(prev => ({
            ...prev,
            detection: {
                correct: prev.detection.correct + (isDetected ? 1 : 0),
                incorrect: prev.detection.incorrect + (isDetected ? 0 : 1),
                total: prev.detection.total + 1,
            }
        }))
    }

    // Handle classification stage
    const handleClassificationStage = (isCorrectTarget: boolean) => {
        setMetrics(prev => ({
            ...prev,
            classification: {
                correct: prev.classification.correct + (isCorrectTarget ? 1 : 0),
                incorrect: prev.classification.incorrect + (isCorrectTarget ? 0 : 1),
                total: prev.classification.total + 1,
            }
        }))
    }

    // Calculate accuracies
    const detectionAccuracy = metrics.detection.total > 0
        ? ((metrics.detection.correct / metrics.detection.total) * 100).toFixed(1)
        : '0.0'
    const classificationAccuracy = metrics.classification.total > 0
        ? ((metrics.classification.correct / metrics.classification.total) * 100).toFixed(1)
        : '0.0'

    // Clear history
    const handleClearHistory = () => {
        setSessionHistory([])
    }

    return (
        <div className="space-y-6">
            {/* Controls at top - user selects digit first */}
            <div className="p-6 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl">
                <ControlPanel
                    isRunning={isRunning}
                    onToggleRun={handleToggleRun}
                    targetCharacter={targetCharacter}
                    onTargetSelect={setTargetCharacter}
                    animationSpeed={animationSpeed}
                    onAnimationSpeedChange={setAnimationSpeed}
                    confidenceThreshold={confidenceThreshold}
                    onConfidenceThresholdChange={setConfidenceThreshold}
                    sessionDuration={sessionDuration}
                />
            </div>

            {/* Viewport */}
            <div className="relative h-96 bg-[var(--color-background-dark)] rounded-lg border border-[var(--color-border-primary)] overflow-hidden">
                <FallingCharacters
                    isRunning={isRunning}
                    animationSpeed={animationSpeed}
                    onCharacterPositions={setFallingCharacters}
                    characterCount={15}
                />

                {/* Detection overlay canvas */}
                <DetectionCanvas
                    isRunning={isRunning}
                    targetCharacter={targetCharacter}
                    fallingCharacters={fallingCharacters}
                    confidenceThreshold={confidenceThreshold}
                    onDetectionStage={handleDetectionStage}
                    onClassificationStage={handleClassificationStage}
                />
            </div>

            {/* Metrics display */}
            <div className="p-6 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Detection & Classification Metrics</h3>

                {/* Detection Stage */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase">Stage 1: Detection</h4>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-3">Was any digit detected?</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Accuracy</p>
                            <p className="text-4xl font-bold text-[var(--color-primary)]">{detectionAccuracy}%</p>
                        </div>
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Detected</p>
                            <p className="text-3xl font-bold text-green-400">{metrics.detection.correct}</p>
                        </div>
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Missed</p>
                            <p className="text-3xl font-bold text-red-400">{metrics.detection.incorrect}</p>
                        </div>
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Total</p>
                            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{metrics.detection.total}</p>
                        </div>
                    </div>
                </div>

                {/* Classification Stage */}
                <div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase">Stage 2: Classification</h4>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-3">Of detected digits, how many were correct?</p>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Accuracy</p>
                            <p className="text-4xl font-bold text-[var(--color-primary)]">{classificationAccuracy}%</p>
                        </div>
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Correct</p>
                            <p className="text-3xl font-bold text-green-400">{metrics.classification.correct}</p>
                        </div>
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Incorrect</p>
                            <p className="text-3xl font-bold text-red-400">{metrics.classification.incorrect}</p>
                        </div>
                        <div className="p-4 bg-[var(--color-background-dark)] rounded-lg text-center">
                            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Total</p>
                            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{metrics.classification.total}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Session History */}
            {sessionHistory.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Session History</h3>
                        <button
                            onClick={handleClearHistory}
                            className="text-xs px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-all"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {sessionHistory.map(session => (
                            <div key={session.id} className="p-3 bg-[var(--color-background-dark)] rounded border border-[var(--color-border-primary)]">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="font-semibold text-[var(--color-primary)]">Target: {session.targetCharacter}</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">{session.duration.toFixed(1)}s</span>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-text-secondary)]">Detection:</span>
                                        <span>
                                            {session.metrics.detection.total > 0
                                                ? ((session.metrics.detection.correct / session.metrics.detection.total) * 100).toFixed(0)
                                                : 0}%
                                            <span className="text-green-400 ml-2">✓ {session.metrics.detection.correct}</span>
                                            <span className="text-red-400 ml-2">✗ {session.metrics.detection.incorrect}</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-text-secondary)]">Classification:</span>
                                        <span>
                                            {session.metrics.classification.total > 0
                                                ? ((session.metrics.classification.correct / session.metrics.classification.total) * 100).toFixed(0)
                                                : 0}%
                                            <span className="text-green-400 ml-2">✓ {session.metrics.classification.correct}</span>
                                            <span className="text-red-400 ml-2">✗ {session.metrics.classification.incorrect}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
