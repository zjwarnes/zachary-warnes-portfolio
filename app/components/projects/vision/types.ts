/**
 * Types for the Character Detection Vision Demo
 */

export interface DetectionBox {
    x: number
    y: number
    width: number
    height: number
    confidence: number
    text: string
}

export interface DetectionResult {
    boxes: DetectionBox[]
    timestamp: number
}

export interface StageMetrics {
    totalFrames: number
    correctDetections: number
    falsePositives: number
    falseNegatives: number
    precision: number
    recall: number
    accuracy: number
}

export interface SessionMetrics {
    // Detection stage: Was ANY digit detected?
    detection: StageMetrics
    // Classification stage: Of detected digits, was it the correct target?
    classification: StageMetrics
}

export interface SessionRun {
    id: string
    startTime: Date
    endTime: Date
    targetCharacter: string
    duration: number // in seconds
    detectionSpeed: number // milliseconds between detections
    animationSpeed: number // pixels per frame
    confidenceThreshold: number
    metrics: SessionMetrics
}

export interface FallingCharacter {
    id: string
    char: string
    x: number
    y: number
    size: number
    speed: number
}

export interface ControlSettings {
    isRunning: boolean
    targetCharacter: string | null
    detectionSpeed: number // ms between model runs
    animationSpeed: number // pixels per frame
    confidenceThreshold: number // 0-100
}
