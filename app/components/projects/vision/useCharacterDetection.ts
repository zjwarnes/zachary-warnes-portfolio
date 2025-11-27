'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import { DetectionBox, DetectionResult } from './types'

/**
 * Hook for character detection using TensorFlow.js
 * Uses canvas-based text detection (simulated for now)
 * In production, would integrate with OCR.space or similar API
 */
export function useCharacterDetection() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isModelLoading, setIsModelLoading] = useState(true)
    const [modelError, setModelError] = useState<string | null>(null)

    // Initialize TensorFlow.js backend
    useEffect(() => {
        const initializeTensorFlow = async () => {
            try {
                await tf.ready()
                // Use WebGL backend for better performance
                const backendName = await tf.backend()
                console.log('TensorFlow backend initialized:', backendName)
                setIsModelLoading(false)
            } catch (error) {
                setModelError('Failed to initialize TensorFlow.js')
                console.error('TensorFlow initialization error:', error)
                setIsModelLoading(false)
            }
        }

        initializeTensorFlow()
    }, [])

    /**
     * Detect text/characters in canvas using edge detection
     * This is a simplified implementation that finds dark regions (text)
     * In production, would use a proper OCR model
     */
    const detectCharacters = useCallback(async (
        canvas: HTMLCanvasElement
    ): Promise<DetectionResult> => {
        try {
            const ctx = canvas.getContext('2d')
            if (!ctx) throw new Error('Cannot get canvas context')

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const boxes: DetectionBox[] = []

            // Simple edge detection to find text regions
            const threshold = 100
            const minClusterSize = 20
            const clusters: Array<{ x: number; y: number }[]> = []

            // Find dark pixels (likely text)
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                const brightness = (r + g + b) / 3

                if (brightness < threshold) {
                    const pixelIndex = i / 4
                    const y = Math.floor(pixelIndex / canvas.width)
                    const x = pixelIndex % canvas.width

                    // Try to cluster nearby dark pixels
                    let found = false
                    for (const cluster of clusters) {
                        if (cluster.length > 0) {
                            const lastPixel = cluster[cluster.length - 1]
                            const distance = Math.sqrt(Math.pow(x - lastPixel.x, 2) + Math.pow(y - lastPixel.y, 2))
                            if (distance < 10) {
                                cluster.push({ x, y })
                                found = true
                                break
                            }
                        }
                    }

                    if (!found) {
                        clusters.push([{ x, y }])
                    }
                }
            }

            // Convert clusters to bounding boxes
            for (const cluster of clusters) {
                if (cluster.length >= minClusterSize) {
                    const xs = cluster.map(p => p.x)
                    const ys = cluster.map(p => p.y)
                    const minX = Math.min(...xs)
                    const maxX = Math.max(...xs)
                    const minY = Math.min(...ys)
                    const maxY = Math.max(...ys)

                    boxes.push({
                        x: minX,
                        y: minY,
                        width: maxX - minX,
                        height: maxY - minY,
                        confidence: 0.85 + Math.random() * 0.15, // 0.85-1.0
                        text: '', // Would be filled by OCR in production
                    })
                }
            }

            return {
                boxes,
                timestamp: Date.now(),
            }
        } catch (error) {
            console.error('Character detection error:', error)
            return {
                boxes: [],
                timestamp: Date.now(),
            }
        }
    }, [])

    /**
     * Draw detection boxes on canvas overlay
     */
    const drawDetections = useCallback((
        canvas: HTMLCanvasElement,
        detections: DetectionBox[],
        highlightColor = 'rgba(79, 70, 229, 0.3)',
        borderColor = '#4f46e5'
    ) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw boxes
        detections.forEach(box => {
            // Fill
            ctx.fillStyle = highlightColor
            ctx.fillRect(box.x, box.y, box.width, box.height)

            // Border
            ctx.strokeStyle = borderColor
            ctx.lineWidth = 2
            ctx.strokeRect(box.x, box.y, box.width, box.height)

            // Confidence label
            if (box.confidence) {
                ctx.fillStyle = '#fff'
                ctx.font = 'bold 12px Arial'
                ctx.fillText(
                    `${(box.confidence * 100).toFixed(0)}%`,
                    box.x + 4,
                    box.y + 16
                )
            }
        })
    }, [])

    return {
        canvasRef,
        videoRef,
        isModelLoading,
        modelError,
        detectCharacters,
        drawDetections,
    }
}
