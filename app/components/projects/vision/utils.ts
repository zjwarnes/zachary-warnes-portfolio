/**
 * Utility functions for character detection demo
 */

import { DetectionBox } from './types'

/**
 * Check if a falling character overlaps with a detection box
 */
export function isCharacterDetected(
    charX: number,
    charY: number,
    charSize: number,
    detectionBox: DetectionBox
): boolean {
    const charRadius = charSize / 2

    // Check if character center is within detection box with some margin
    return (
        charX >= detectionBox.x &&
        charX <= detectionBox.x + detectionBox.width &&
        charY >= detectionBox.y &&
        charY <= detectionBox.y + detectionBox.height
    )
}

// Note: calculateMetrics moved to simplified system - see CharacterDetectionDemo.tsx for current metrics logic

/**
 * Generate a falling character with random position and size
 */
export function generateFallingCharacter(
    characters: string[],
    canvasWidth: number
): {
    char: string
    x: number
    y: number
    size: number
    speed: number
} {
    return {
        char: characters[Math.floor(Math.random() * characters.length)],
        x: Math.random() * (canvasWidth - 80) + 40,
        y: -80,
        size: Math.random() * 50 + 50, // 50-100px (bigger characters)
        speed: Math.random() * 0.8 + 0.4, // 0.4-1.2 pixels per frame (slower)
    }
}

/**
 * Get preset speed options
 */
export const SPEED_PRESETS = {
    detection: [33, 66, 100, 200, 500], // ms (33ms ≈ 30fps, 100ms ≈ 10fps)
    animation: [0.5, 0.75, 1, 1.25, 1.5], // pixels per frame (30, 45, 60, 75, 90 px/s at 60fps)
}

/**
 * Get next or previous preset value
 */
export function getNextPreset(
    current: number,
    presets: number[],
    direction: 'up' | 'down'
): number {
    const index = presets.indexOf(current)
    if (index === -1) return presets[0]

    const newIndex = direction === 'up' ? index + 1 : index - 1

    if (newIndex < 0) return presets[presets.length - 1]
    if (newIndex >= presets.length) return presets[0]

    return presets[newIndex]
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Available characters for detection (digits only)
 */
export const AVAILABLE_CHARACTERS = '0123456789'.split('')
