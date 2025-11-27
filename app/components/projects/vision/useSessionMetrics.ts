'use client'

import { useState, useCallback } from 'react'
import { SessionMetrics, SessionRun, StageMetrics } from './types'
import { generateId } from './utils'

const emptyStageMetrics: StageMetrics = {
    totalFrames: 0,
    correctDetections: 0,
    falsePositives: 0,
    falseNegatives: 0,
    accuracy: 0,
    precision: 0,
    recall: 0,
}

/**
 * Hook for managing session metrics and history
 */
export function useSessionMetrics() {
    const [currentMetrics, setCurrentMetrics] = useState<SessionMetrics>({
        detection: { ...emptyStageMetrics },
        classification: { ...emptyStageMetrics },
    })

    const [sessionHistory, setSessionHistory] = useState<SessionRun[]>([])

    /**
     * Record a detection stage result (was ANY digit detected?)
     */
    const recordDetectionStage = useCallback((
        detected: boolean,
        falsePositive: boolean = false
    ) => {
        setCurrentMetrics(prev => {
            const stage = prev.detection
            const updated = {
                ...stage,
                totalFrames: stage.totalFrames + 1,
                correctDetections: detected ? stage.correctDetections + 1 : stage.correctDetections,
                falsePositives: falsePositive ? stage.falsePositives + 1 : stage.falsePositives,
                falseNegatives: !detected ? stage.falseNegatives + 1 : stage.falseNegatives,
            }

            const additionalMetrics = {
                accuracy: 0,
                precision: 0,
                recall: 0,
            }

            return {
                ...prev,
                detection: {
                    ...updated,
                    ...additionalMetrics,
                }
            }
        })
    }, [])

    /**
     * Record a classification stage result (was it the correct target?)
     */
    const recordClassificationStage = useCallback((
        isCorrectTarget: boolean,
        detected: boolean = true
    ) => {
        setCurrentMetrics(prev => {
            const stage = prev.classification
            const updated = {
                ...stage,
                totalFrames: detected ? stage.totalFrames + 1 : stage.totalFrames,
                correctDetections: (detected && isCorrectTarget) ? stage.correctDetections + 1 : stage.correctDetections,
                falsePositives: (detected && !isCorrectTarget) ? stage.falsePositives + 1 : stage.falsePositives,
                falseNegatives: (detected && !isCorrectTarget) ? stage.falseNegatives + 1 : stage.falseNegatives,
            }

            if (updated.totalFrames === 0) {
                return prev
            }

            const additionalMetrics = {
                accuracy: 0,
                precision: 0,
                recall: 0,
            }

            return {
                ...prev,
                classification: {
                    ...updated,
                    ...additionalMetrics,
                }
            }
        })
    }, [])

    /**
     * Reset current session metrics
     */
    const resetMetrics = useCallback(() => {
        setCurrentMetrics({
            detection: { ...emptyStageMetrics },
            classification: { ...emptyStageMetrics },
        })
    }, [])

    /**
     * Save current session to history
     */
    const saveSession = useCallback((
        targetCharacter: string,
        detectionSpeed: number,
        animationSpeed: number,
        confidenceThreshold: number,
        duration: number
    ) => {
        const newRun: SessionRun = {
            id: generateId(),
            startTime: new Date(Date.now() - duration * 1000),
            endTime: new Date(),
            targetCharacter,
            duration,
            detectionSpeed,
            animationSpeed,
            confidenceThreshold,
            metrics: { ...currentMetrics },
        }

        setSessionHistory(prev => [newRun, ...prev])
        return newRun
    }, [currentMetrics])

    /**
     * Clear session history
     */
    const clearHistory = useCallback(() => {
        setSessionHistory([])
    }, [])

    return {
        currentMetrics,
        sessionHistory,
        recordDetectionStage,
        recordClassificationStage,
        resetMetrics,
        saveSession,
        clearHistory,
    }
}
