'use client'

import { useState, useEffect, useRef } from 'react'

interface DataParticle {
    id: string
    stage: 'producer' | 'buffer' | 'reader' | 'database'
    progress: number // 0-1 within current stage
    createdAt: number
}

export function DataPipelineDemo() {
    const [producerRate, setProducerRate] = useState(30) // items per second
    const [readerCount, setReaderCount] = useState(1) // 1-3 readers
    const [isRunning, setIsRunning] = useState(true)

    // Counters
    const [produced, setProduced] = useState(0)
    const [buffered, setBuffered] = useState(0)
    const [consumed, setConsumed] = useState(0)
    const [stored, setStored] = useState(0)

    // Particles for animation
    const [particles, setParticles] = useState<DataParticle[]>([])
    const particleQueueRef = useRef<DataParticle[]>([])
    const timeRef = useRef(0)
    const lastProducerTimeRef = useRef(0)

    // Animation loop
    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            timeRef.current += 16 // ~60fps

            setParticles((prevParticles) => {
                let updated = [...prevParticles]
                const currentQueue = particleQueueRef.current

                // Generate new particles from producer
                const particlesToAdd = Math.floor(
                    (producerRate / 1000) * 16 // convert rate to items per 16ms
                )

                for (let i = 0; i < particlesToAdd; i++) {
                    const newParticle: DataParticle = {
                        id: `${timeRef.current}-${i}`,
                        stage: 'producer',
                        progress: 0,
                        createdAt: timeRef.current,
                    }
                    updated.push(newParticle)
                    currentQueue.push(newParticle)
                    setProduced((p) => p + 1)
                }

                // Update particle positions and stages
                updated = updated.map((particle) => {
                    let newParticle = { ...particle }
                    const timeInStage = timeRef.current - particle.createdAt

                    if (newParticle.stage === 'producer') {
                        newParticle.progress = Math.min(timeInStage / 300, 1)
                        if (newParticle.progress >= 1) {
                            newParticle.stage = 'buffer'
                            newParticle.createdAt = timeRef.current
                            setBuffered((b) => b + 1)
                        }
                    } else if (newParticle.stage === 'buffer') {
                        // Time in buffer depends on reader count
                        const bufferTime = Math.max(200, 1500 / (readerCount || 1))
                        newParticle.progress = Math.min(timeInStage / bufferTime, 1)
                        if (newParticle.progress >= 1) {
                            newParticle.stage = 'reader'
                            newParticle.createdAt = timeRef.current
                            setBuffered((b) => Math.max(0, b - 1))
                        }
                    } else if (newParticle.stage === 'reader') {
                        newParticle.progress = Math.min(timeInStage / 400, 1)
                        if (newParticle.progress >= 1) {
                            newParticle.stage = 'database'
                            newParticle.createdAt = timeRef.current
                            setConsumed((c) => c + 1)
                        }
                    } else if (newParticle.stage === 'database') {
                        newParticle.progress = Math.min(timeInStage / 300, 1)
                        if (newParticle.progress >= 1) {
                            setStored((s) => s + 1)
                            return null as any
                        }
                    }

                    return newParticle
                })

                // Remove completed particles
                updated = updated.filter((p) => p !== null)

                return updated.slice(-500) // Keep max 500 particles for performance
            })
        }, 16)

        return () => clearInterval(interval)
    }, [isRunning, producerRate, readerCount])

    // Calculate positions for each stage
    const getPosition = (particle: DataParticle) => {
        const stageWidth = 120
        const stagePositions = {
            producer: 60,
            buffer: 200,
            reader: 340,
            database: 480,
        }
        const x = stagePositions[particle.stage] + particle.progress * 60
        return { x, y: 150 + Math.sin(particle.id.charCodeAt(0) / 10) * 40 }
    }

    // Calculate system health
    const totalThroughput = consumed + stored
    const bufferHealth = buffered > 100 ? 'high' : buffered > 50 ? 'medium' : 'low'
    const bufferColor =
        bufferHealth === 'high' ? '#ef4444' : bufferHealth === 'medium' ? '#eab308' : '#22c55e'

    return (
        <div className="w-full h-full flex flex-col bg-[var(--color-background-dark)] rounded-lg p-6">
            {/* Title */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Data Pipeline Simulator</h3>
                <p className="text-sm text-[var(--color-text-primary)]">
                    Control producer rate and reader count to manage data flow through the system
                </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-[var(--color-background-card)] p-4 rounded-lg border border-[var(--color-border-primary)]">
                {/* Producer Rate Control */}
                <div>
                    <label className="text-sm font-medium text-white block mb-2">
                        Producer Rate: {producerRate} items/sec
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={producerRate}
                        onChange={(e) => setProducerRate(Number(e.target.value))}
                        className="w-full accent-[var(--color-primary)]"
                    />
                    <div className="flex gap-2 mt-2">
                        {[20, 50, 80].map((rate) => (
                            <button
                                key={rate}
                                onClick={() => setProducerRate(rate)}
                                className="flex-1 px-2 py-1 text-xs rounded bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-primary)] hover:bg-opacity-40 transition"
                            >
                                {rate}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reader Count Control */}
                <div>
                    <label className="text-sm font-medium text-white block mb-2">
                        Active Readers: {readerCount}
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((count) => (
                            <button
                                key={count}
                                onClick={() => setReaderCount(count)}
                                className={`flex-1 px-3 py-2 text-sm rounded font-medium transition ${readerCount === count
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-background-card)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-primary)]'
                                    }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Play/Pause */}
            <div className="mb-6">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-4 py-2 rounded bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition"
                >
                    {isRunning ? '⏸ Pause' : '▶ Resume'}
                </button>
            </div>

            {/* Visualization */}
            <div className="flex-1 bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-primary)] mb-6 p-4 relative overflow-hidden">
                <svg width="100%" height="300" className="absolute inset-0 p-4">
                    {/* Stage labels and boxes */}
                    <g>
                        {/* Producer */}
                        <rect x="20" y="110" width="80" height="80" fill="none" stroke="#3b82f6" strokeWidth="2" rx="4" />
                        <text x="60" y="105" textAnchor="middle" className="text-xs fill-[#3b82f6]" fontSize="12">
                            Producer
                        </text>

                        {/* Buffer */}
                        <rect x="160" y="110" width="80" height="80" fill="none" stroke={bufferColor} strokeWidth="2" rx="4" />
                        <text x="200" y="105" textAnchor="middle" className="text-xs fill-white" fontSize="12">
                            Buffer
                        </text>
                        <text x="200" y="200" textAnchor="middle" className="text-xs fill-white" fontSize="11">
                            ({buffered})
                        </text>

                        {/* Readers */}
                        <rect x="300" y="110" width="80" height="80" fill="none" stroke="#8b5cf6" strokeWidth="2" rx="4" />
                        <text x="340" y="105" textAnchor="middle" className="text-xs fill-[#8b5cf6]" fontSize="12">
                            Readers ({readerCount})
                        </text>

                        {/* Database */}
                        <rect x="440" y="110" width="80" height="80" fill="none" stroke="#10b981" strokeWidth="2" rx="4" />
                        <text x="480" y="105" textAnchor="middle" className="text-xs fill-[#10b981]" fontSize="12">
                            Database
                        </text>

                        {/* Arrows */}
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                            >
                                <polygon points="0 0, 10 3, 0 6" fill="#666" />
                            </marker>
                        </defs>
                        <line x1="100" y1="150" x2="160" y2="150" stroke="#666" strokeWidth="1" markerEnd="url(#arrowhead)" />
                        <line x1="240" y1="150" x2="300" y2="150" stroke="#666" strokeWidth="1" markerEnd="url(#arrowhead)" />
                        <line x1="380" y1="150" x2="440" y2="150" stroke="#666" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    </g>

                    {/* Animated particles */}
                    {particles.map((particle) => {
                        const pos = getPosition(particle)
                        const colors = {
                            producer: '#3b82f6',
                            buffer: '#eab308',
                            reader: '#8b5cf6',
                            database: '#10b981',
                        }
                        return (
                            <circle
                                key={particle.id}
                                cx={pos.x}
                                cy={pos.y}
                                r="4"
                                fill={colors[particle.stage]}
                                opacity="0.8"
                            />
                        )
                    })}
                </svg>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded p-3">
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Produced</p>
                    <p className="text-2xl font-bold text-[#3b82f6]">{produced}</p>
                </div>
                <div className="bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded p-3">
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Buffered</p>
                    <p className="text-2xl font-bold text-[#eab308]">{buffered}</p>
                </div>
                <div className="bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded p-3">
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Consumed</p>
                    <p className="text-2xl font-bold text-[#8b5cf6]">{consumed}</p>
                </div>
                <div className="bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded p-3">
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Stored</p>
                    <p className="text-2xl font-bold text-[#10b981]">{stored}</p>
                </div>
            </div>
        </div>
    )
}
