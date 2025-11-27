'use client'

import { useState, useEffect, useRef } from 'react'

interface DataParticle {
    id: string
    sourceProducer: number
    stage: 'producer' | 'buffer' | 'reader' | 'database'
    progress: number // 0-1 within current stage
    createdAt: number
}

interface ProducerStats {
    produced: number
}

interface ReaderStats {
    consumed: number
}

export function DataPipelineDemo() {
    const [producerCount, setProducerCount] = useState(1) // 1-5 producers
    const [readerCount, setReaderCount] = useState(1) // 1-3 readers
    const [isRunning, setIsRunning] = useState(true)

    // Counters
    const [buffered, setBuffered] = useState(0)
    const [stored, setStored] = useState(0)
    const [producerStats, setProducerStats] = useState<ProducerStats[]>(
        Array(1).fill(null).map(() => ({ produced: 0 }))
    )
    const [readerStats, setReaderStats] = useState<ReaderStats[]>(
        Array(1).fill(null).map(() => ({ consumed: 0 }))
    )

    // Particles for animation
    const [particles, setParticles] = useState<DataParticle[]>([])
    const timeRef = useRef(0)
    const lastProducerTimeRef = useRef<number[]>([])

    // Update producer/reader stats arrays when counts change
    useEffect(() => {
        setProducerStats((prev) => {
            const newStats = [...prev]
            if (newStats.length < producerCount) {
                while (newStats.length < producerCount) {
                    newStats.push({ produced: 0 })
                }
            } else {
                newStats.splice(producerCount)
            }
            return newStats
        })
        lastProducerTimeRef.current = Array(producerCount).fill(0)
    }, [producerCount])

    useEffect(() => {
        setReaderStats((prev) => {
            const newStats = [...prev]
            if (newStats.length < readerCount) {
                while (newStats.length < readerCount) {
                    newStats.push({ consumed: 0 })
                }
            } else {
                newStats.splice(readerCount)
            }
            return newStats
        })
    }, [readerCount])

    // Animation loop
    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            timeRef.current += 16 // ~60fps

            setParticles((prevParticles) => {
                let updated = [...prevParticles]

                // Generate particles from each producer (0 or 1 item/sec = random)
                for (let i = 0; i < producerCount; i++) {
                    // Random chance of producing an item (0-1 per second average)
                    if (Math.random() < 0.016) { // ~1/60 chance per frame = 1 per second
                        const newParticle: DataParticle = {
                            id: `${timeRef.current}-${i}-${Math.random()}`,
                            sourceProducer: i,
                            stage: 'producer',
                            progress: 0,
                            createdAt: timeRef.current,
                        }
                        updated.push(newParticle)
                        setProducerStats((prev) => {
                            const newStats = [...prev]
                            newStats[i].produced += 1
                            return newStats
                        })
                    }
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
                        // Time in buffer depends on reader count (readers process 2 items/sec each)
                        const readerThroughput = Math.max(2, readerCount * 2)
                        const bufferTime = Math.max(200, 1000 / readerThroughput)
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
                            // Distribute consumed evenly across readers
                            const readerIndex = Math.floor(Math.random() * readerCount)
                            setReaderStats((prev) => {
                                const newStats = [...prev]
                                newStats[readerIndex].consumed += 1
                                return newStats
                            })
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
    }, [isRunning, producerCount, readerCount])

    // Calculate positions for each stage
    const getProducerPosition = (producerIndex: number) => {
        const startY = 60
        const spacing = 80
        return { x: 40, y: startY + producerIndex * spacing }
    }

    const getReaderPosition = (readerIndex: number) => {
        const startY = 60
        const spacing = 80
        return { x: 380, y: startY + readerIndex * spacing }
    }

    const getParticlePosition = (particle: DataParticle) => {
        const colors = {
            producer: '#3b82f6',
            buffer: '#eab308',
            reader: '#8b5cf6',
            database: '#10b981',
        }

        if (particle.stage === 'producer') {
            const prodPos = getProducerPosition(particle.sourceProducer)
            return { x: prodPos.x + particle.progress * 40, y: prodPos.y + 25 }
        } else if (particle.stage === 'buffer') {
            return {
                x: 150 + particle.progress * 50,
                y: 150 + Math.sin(particle.id.charCodeAt(0) / 10) * 40,
            }
        } else if (particle.stage === 'reader') {
            const readerIndex = Math.floor(Math.random() * readerCount)
            const readerPos = getReaderPosition(readerIndex)
            return { x: readerPos.x + particle.progress * 40, y: readerPos.y + 25 }
        } else {
            return { x: 520, y: 150 + Math.sin(particle.id.charCodeAt(0) / 10) * 40 }
        }
    }

    // Calculate system health
    const bufferHealth = buffered > 100 ? 'high' : buffered > 50 ? 'medium' : 'low'
    const bufferColor =
        bufferHealth === 'high' ? '#ef4444' : bufferHealth === 'medium' ? '#eab308' : '#22c55e'

    const totalProduced = producerStats.reduce((sum, stat) => sum + stat.produced, 0)
    const totalConsumed = readerStats.reduce((sum, stat) => sum + stat.consumed, 0)

    return (
        <div className="w-full h-full flex flex-col bg-[var(--color-background-dark)] rounded-lg p-6">
            {/* Title */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Data Pipeline Simulator</h3>
                <p className="text-sm text-[var(--color-text-primary)]">
                    Scale producers and readers to manage data flow. Producers: 0-1 items/sec, Readers: 2 items/sec each
                </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-[var(--color-background-card)] p-4 rounded-lg border border-[var(--color-border-primary)]">
                {/* Producer Count Control */}
                <div>
                    <label className="text-sm font-medium text-white block mb-2">
                        Active Producers: {producerCount}
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((count) => (
                            <button
                                key={count}
                                onClick={() => setProducerCount(count)}
                                className={`px-2 py-1 text-xs rounded font-medium transition ${producerCount === count
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-background-card)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-primary)]'
                                    }`}
                            >
                                {count}
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
                                className={`flex-1 px-3 py-1 text-sm rounded font-medium transition ${readerCount === count
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
            <div className="flex-1 bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-primary)] mb-6 p-4 relative overflow-hidden min-h-[400px]">
                <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 600 500" className="w-full h-full">
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

                    {/* Producers */}
                    {Array.from({ length: producerCount }).map((_, i) => {
                        const pos = getProducerPosition(i)
                        return (
                            <g key={`producer-${i}`}>
                                {/* Producer box */}
                                <rect
                                    x={pos.x}
                                    y={pos.y}
                                    width="70"
                                    height="50"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    rx="4"
                                />
                                {/* Icon */}
                                <text
                                    x={pos.x + 10}
                                    y={pos.y + 18}
                                    fontSize="20"
                                    fill="#3b82f6"
                                >
                                    📊
                                </text>
                                {/* Label */}
                                <text
                                    x={pos.x + 35}
                                    y={pos.y + 22}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#3b82f6"
                                    fontWeight="bold"
                                >
                                    P{i + 1}
                                </text>
                                {/* Count */}
                                <text
                                    x={pos.x + 35}
                                    y={pos.y + 38}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="#3b82f6"
                                >
                                    {producerStats[i]?.produced || 0}
                                </text>
                            </g>
                        )
                    })}

                    {/* Buffer */}
                    <g>
                        <rect
                            x="150"
                            y="125"
                            width="70"
                            height="50"
                            fill="none"
                            stroke={bufferColor}
                            strokeWidth="2"
                            rx="4"
                        />
                        <text x="165" y="143" fontSize="20" fill={bufferColor}>
                            ⚡
                        </text>
                        <text x="185" y="148" textAnchor="middle" fontSize="10" fill={bufferColor} fontWeight="bold">
                            Buffer
                        </text>
                        <text x="185" y="163" textAnchor="middle" fontSize="10" fill="white">
                            {buffered}
                        </text>
                    </g>

                    {/* Readers */}
                    {Array.from({ length: readerCount }).map((_, i) => {
                        const pos = getReaderPosition(i)
                        return (
                            <g key={`reader-${i}`}>
                                {/* Reader box */}
                                <rect
                                    x={pos.x}
                                    y={pos.y}
                                    width="70"
                                    height="50"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="2"
                                    rx="4"
                                />
                                {/* Icon */}
                                <text
                                    x={pos.x + 10}
                                    y={pos.y + 18}
                                    fontSize="20"
                                    fill="#8b5cf6"
                                >
                                    🔍
                                </text>
                                {/* Label */}
                                <text
                                    x={pos.x + 35}
                                    y={pos.y + 22}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#8b5cf6"
                                    fontWeight="bold"
                                >
                                    R{i + 1}
                                </text>
                                {/* Count */}
                                <text
                                    x={pos.x + 35}
                                    y={pos.y + 38}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="#8b5cf6"
                                >
                                    {readerStats[i]?.consumed || 0}
                                </text>
                            </g>
                        )
                    })}

                    {/* Database */}
                    <g>
                        <rect x="520" y="125" width="70" height="50" fill="none" stroke="#10b981" strokeWidth="2" rx="4" />
                        <text x="535" y="143" fontSize="20" fill="#10b981">
                            💾
                        </text>
                        <text x="555" y="148" textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="bold">
                            Database
                        </text>
                        <text x="555" y="163" textAnchor="middle" fontSize="10" fill="white">
                            {stored}
                        </text>
                    </g>

                    {/* Arrows from producers to buffer */}
                    {Array.from({ length: producerCount }).map((_, i) => {
                        const prodPos = getProducerPosition(i)
                        return (
                            <line
                                key={`arrow-prod-${i}`}
                                x1={prodPos.x + 70}
                                y1={prodPos.y + 25}
                                x2="150"
                                y2="150"
                                stroke="#666"
                                strokeWidth="1"
                                markerEnd="url(#arrowhead)"
                            />
                        )
                    })}

                    {/* Arrow from buffer to readers */}
                    {Array.from({ length: readerCount }).map((_, i) => {
                        const readerPos = getReaderPosition(i)
                        return (
                            <line
                                key={`arrow-reader-${i}`}
                                x1="220"
                                y1="150"
                                x2={readerPos.x}
                                y2={readerPos.y + 25}
                                stroke="#666"
                                strokeWidth="1"
                                markerEnd="url(#arrowhead)"
                            />
                        )
                    })}

                    {/* Arrow from readers to database */}
                    <line
                        x1="450"
                        y1="150"
                        x2="520"
                        y2="150"
                        stroke="#666"
                        strokeWidth="1"
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Animated particles */}
                    {particles.map((particle) => {
                        const pos = getParticlePosition(particle)
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
                                r="3"
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
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Total Produced</p>
                    <p className="text-2xl font-bold text-[#3b82f6]">{totalProduced}</p>
                </div>
                <div className="bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded p-3">
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Buffered</p>
                    <p className="text-2xl font-bold text-[#eab308]">{buffered}</p>
                </div>
                <div className="bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded p-3">
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Total Consumed</p>
                    <p className="text-2xl font-bold text-[#8b5cf6]">{totalConsumed}</p>
                </div>
                <div className="bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded p-3">
                    <p className="text-xs text-[var(--color-text-primary)] mb-1">Stored</p>
                    <p className="text-2xl font-bold text-[#10b981]">{stored}</p>
                </div>
            </div>
        </div>
    )
}
