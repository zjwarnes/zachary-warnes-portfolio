'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    opacity: number
}

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Particle creation
        const particles: Particle[] = []
        const particleCount = 50

        const createParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.3,
                })
            }
        }
        createParticles()

        // Animation loop
        const animate = () => {
            // Clear canvas with semi-transparent bg for trail effect
            ctx.fillStyle = 'rgba(10, 14, 39, 0.1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw and update particles
            particles.forEach((particle) => {
                // Update position
                particle.x += particle.vx
                particle.y += particle.vy

                // Bounce off edges
                if (particle.x - particle.radius < 0 || particle.x + particle.radius > canvas.width) {
                    particle.vx *= -1
                }
                if (particle.y - particle.radius < 0 || particle.y + particle.radius > canvas.height) {
                    particle.vy *= -1
                }

                // Keep in bounds
                particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x))
                particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y))

                // Draw particle
                ctx.fillStyle = `rgba(79, 70, 229, ${particle.opacity})`
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
                ctx.fill()

                // Draw connection lines
                particles.forEach((otherParticle) => {
                    const dx = particle.x - otherParticle.x
                    const dy = particle.y - otherParticle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.2
                        ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.stroke()
                    }
                })
            })

            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        />
    )
}
