'use client'

import { useEffect, useRef, useState } from 'react'
import { FallingCharacter } from './types'
import { generateFallingCharacter, AVAILABLE_CHARACTERS } from './utils'

interface FallingCharactersProps {
    isRunning: boolean
    animationSpeed: number // pixels per frame
    onCharacterPositions: (positions: Map<string, FallingCharacter>) => void
    characterCount?: number
}

/**
 * Component that renders and animates falling characters
 */
export function FallingCharacters({
    isRunning,
    animationSpeed,
    onCharacterPositions,
    characterCount = 10,
}: FallingCharactersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const charactersRef = useRef<Map<string, FallingCharacter>>(new Map())
    const animationFrameRef = useRef<number>()
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 })

    // Handle canvas resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = canvasRef.current.offsetWidth
                canvasRef.current.height = canvasRef.current.offsetHeight
                setCanvasDimensions({
                    width: canvasRef.current.width,
                    height: canvasRef.current.height,
                })
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Main animation loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Initialize characters on start
        if (isRunning && charactersRef.current.size === 0) {
            for (let i = 0; i < characterCount; i++) {
                const char = generateFallingCharacter(AVAILABLE_CHARACTERS, canvas.width)
                const id = `char-${i}-${Date.now()}`
                charactersRef.current.set(id, {
                    id,
                    char: char.char,
                    x: char.x,
                    y: char.y,
                    size: char.size,
                    speed: char.speed,
                })
            }
        }

        const animate = () => {
            if (!isRunning) {
                animationFrameRef.current = requestAnimationFrame(animate)
                return
            }

            // Clear canvas completely (no trail effect)
            ctx.fillStyle = 'rgba(10, 14, 39, 1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Update and draw characters
            const charsToUpdate = new Map(charactersRef.current)

            charsToUpdate.forEach((char, id) => {
                // Update position
                char.y += animationSpeed * char.speed

                // Spawn new character if this one fell off screen
                if (char.y > canvas.height + 50) {
                    const newChar = generateFallingCharacter(AVAILABLE_CHARACTERS, canvas.width)
                    char.x = newChar.x
                    char.y = newChar.y
                    char.char = newChar.char
                    char.size = newChar.size
                    char.speed = newChar.speed
                    char.id = `char-${Math.random()}-${Date.now()}` // Generate new ID for tracking
                    charsToUpdate.delete(id)
                    charsToUpdate.set(char.id, char)
                }

                // Draw character
                ctx.font = `bold ${char.size}px monospace`
                ctx.fillStyle = 'rgba(79, 70, 229, 1)'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(char.char, char.x, char.y)
            })

            // Update ref and report current positions
            charactersRef.current = charsToUpdate
            onCharacterPositions(new Map(charsToUpdate))

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isRunning, animationSpeed, characterCount, onCharacterPositions])

    // Clear characters when stopping
    useEffect(() => {
        if (!isRunning) {
            charactersRef.current.clear()
            const canvas = canvasRef.current
            if (canvas) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                }
            }
        }
    }, [isRunning])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full bg-[var(--color-background-dark)] rounded-lg border border-[var(--color-border-primary)]"
            style={{
                display: 'block',
            }}
        />
    )
}
