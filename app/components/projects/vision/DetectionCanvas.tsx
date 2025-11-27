'use client'

import { useEffect, useRef, useState } from 'react'
import { DetectionBox, FallingCharacter } from './types'

interface DetectionCanvasProps {
    isRunning: boolean
    targetCharacter: string | null
    fallingCharacters: Map<string, FallingCharacter>
    onDetectionStage: (char: string, isDetected: boolean) => void
    onClassificationStage: (isCorrectTarget: boolean) => void
    confidenceThreshold: number
}

/**
 * Overlay canvas for rendering detection boxes
 * Two-stage detection and classification:
 * - Detection: Was ANY digit detected?
 * - Classification: If detected, is it the correct target?
 */
export function DetectionCanvas({
    isRunning,
    targetCharacter,
    fallingCharacters,
    onDetectionStage,
    onClassificationStage,
    confidenceThreshold,
}: DetectionCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [detectionBoxes, setDetectionBoxes] = useState<DetectionBox[]>([])
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

    // Track which characters we've already scored using position + char value as key
    // This works even when IDs are recycled as characters fall off and respawn
    const trackedPositionsRef = useRef<Set<string>>(new Set())
    const previousCharCountRef = useRef<number>(0)

    // Sync canvas size with parent container
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resizeCanvas = () => {
            const rect = canvas.parentElement?.getBoundingClientRect()
            if (rect) {
                canvas.width = rect.width
                canvas.height = rect.height
                setCanvasSize({ width: rect.width, height: rect.height })
            }
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    // Simulate object detection and track metrics
    useEffect(() => {
        if (!isRunning || !targetCharacter) return

        const boxes: DetectionBox[] = []
        const currentCharCount = fallingCharacters.size

        // When character count changes (characters fall off or respawn), clean up old tracked positions
        // Only reset when count decreases (indicating characters left the screen)
        if (currentCharCount < previousCharCountRef.current) {
            trackedPositionsRef.current.clear()
        }
        previousCharCountRef.current = currentCharCount

        // Process each character on screen
        fallingCharacters.forEach((char, id) => {
            // Determine confidence based on character type (consistent per character)
            const charIdHash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
            const randomFactor = (charIdHash % 100) / 100

            let confidence: number
            if (char.char === targetCharacter) {
                // High confidence for target characters (85-95%)
                confidence = 0.85 + randomFactor * 0.1
            } else {
                // Low confidence for non-targets (10-30%)
                confidence = 0.1 + randomFactor * 0.2
            }

            const isDetected = confidence * 100 >= confidenceThreshold

            // Create box if detected
            if (isDetected) {
                const box: DetectionBox = {
                    x: char.x - char.size / 2 - 5,
                    y: char.y - char.size / 2 - 5,
                    width: char.size + 10,
                    height: char.size + 10,
                    confidence,
                    text: char.char,
                }
                boxes.push(box)
            }

            // Record metrics only ONCE per unique character ID
            if (!trackedPositionsRef.current.has(id)) {
                trackedPositionsRef.current.add(id)

                // Stage 1: Detection - Pass the character so caller can decide if it matters
                onDetectionStage(char.char, isDetected)

                // Stage 2: Classification - If detected, is it the correct target?
                if (isDetected) {
                    const isCorrectTarget = char.char === targetCharacter
                    onClassificationStage(isCorrectTarget)
                }
            }
        })

        setDetectionBoxes(boxes)
    }, [isRunning, targetCharacter, fallingCharacters, onDetectionStage, onClassificationStage, confidenceThreshold])

    // Draw detection boxes
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (!isRunning) return

        // Draw boxes
        detectionBoxes.forEach(box => {
            const isTargetDetection = box.text === targetCharacter

            // Box fill with transparency
            ctx.fillStyle = isTargetDetection
                ? 'rgba(34, 197, 94, 0.2)' // Green for target
                : 'rgba(239, 68, 68, 0.2)' // Red for non-target

            ctx.fillRect(box.x, box.y, box.width, box.height)

            // Box border
            ctx.strokeStyle = isTargetDetection ? '#22c55e' : '#ef4444'
            ctx.lineWidth = 2
            ctx.strokeRect(box.x, box.y, box.width, box.height)

            // Draw the character inside the box
            ctx.fillStyle = '#ffffff'
            ctx.font = `bold ${box.width * 0.6}px monospace`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            const centerX = box.x + box.width / 2
            const centerY = box.y + box.height / 2
            ctx.fillText(box.text, centerX, centerY)

            // Confidence label at top
            ctx.fillStyle = isTargetDetection ? '#22c55e' : '#ef4444'
            ctx.font = 'bold 10px monospace'
            const confidenceText = `${(box.confidence * 100).toFixed(0)}%`
            ctx.fillText(confidenceText, box.x + 4, box.y + 12)
        })
    }, [detectionBoxes, isRunning, targetCharacter])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
            style={{
                cursor: isRunning ? 'crosshair' : 'default',
            }}
        />
    )
}
