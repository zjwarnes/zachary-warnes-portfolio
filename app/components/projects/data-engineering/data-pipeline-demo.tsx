'use client'

import { useState, useEffect, useRef } from 'react'

interface DataParticle {
    id: string
    sourceProducer: number
    readerIndex?: number
    stage: 'producer' | 'buffer' | 'reader' | 'database'
    progress: number // 0-1 within current stage
    createdAt: number
}

interface ProducerStats {
    produced: number
}

interface ReaderStats {
    consumed: number
    isReading: boolean
    readTimeout: NodeJS.Timeout | null
}

export function DataPipelineDemo() {
    const [producerCount, setProducerCount] = useState(1) // 1-5 producers
    const [readerCount, setReaderCount] = useState(1) // 1-3 readers
    const [isRunning, setIsRunning] = useState(true)
    const [autoScale, setAutoScale] = useState(false) // Auto-scaling toggle
    const [effectiveReaderCount, setEffectiveReaderCount] = useState(1) // Reader count after auto-scaling

    // Counters
    const [buffered, setBuffered] = useState(0)
    const [stored, setStored] = useState(0)
    const [producerStats, setProducerStats] = useState<ProducerStats[]>(
        Array(1).fill(null).map(() => ({ produced: 0 }))
    )
    const [readerStats, setReaderStats] = useState<ReaderStats[]>(
        Array(1).fill(null).map(() => ({ consumed: 0, isReading: false, readTimeout: null }))
    )

    // Particles for animation
    const [particles, setParticles] = useState<DataParticle[]>([])
    const timeRef = useRef(0)
    const lastProducerTimeRef = useRef<number[]>([])
    const lastConsumerTimeRef = useRef<number[]>([])

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
        lastConsumerTimeRef.current = Array(Math.max(1, effectiveReaderCount)).fill(0)
    }, [effectiveReaderCount])

    useEffect(() => {
        setReaderStats((prev) => {
            const newStats = [...prev]
            if (newStats.length < readerCount) {
                while (newStats.length < readerCount) {
                    newStats.push({ consumed: 0, isReading: false, readTimeout: null })
                }
            } else {
                newStats.splice(readerCount)
                // When reducing readers, filter out particles that reference removed readers
                setParticles((current) =>
                    current.filter(p => p.stage !== 'reader' || (p.readerIndex !== undefined && p.readerIndex < readerCount))
                )
            }
            return newStats
        })
    }, [readerCount])

    // Auto-scaling logic
    useEffect(() => {
        if (!autoScale) {
            setEffectiveReaderCount(readerCount)
            return
        }

        const scalingInterval = setInterval(() => {
            setEffectiveReaderCount((prev) => {
                if (buffered > 10 && prev < 3) {
                    return prev + 1
                } else if (buffered <= 5 && prev > 1) {
                    return prev - 1
                }
                return prev
            })
        }, 1000) // Check every second

        return () => clearInterval(scalingInterval)
    }, [autoScale, buffered])

    // Animation loop
    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            timeRef.current += 1000 // 1 second per tick

            setParticles((prevParticles) => {
                let updated = [...prevParticles]

                // Generate particles from each producer (0, 1, or 2 items/sec)
                for (let i = 0; i < producerCount; i++) {
                    // Random chance of producing 0, 1, or 2 items per second
                    const rand = Math.random()
                    let itemsToGenerate = 0

                    if (rand < 0.33) {
                        itemsToGenerate = 2 // 33% chance of 2 items
                    } else if (rand < 0.67) {
                        itemsToGenerate = 1 // 34% chance of 1 item
                    }
                    // else itemsToGenerate = 0 (33% chance of 0 items)

                    for (let j = 0; j < itemsToGenerate; j++) {
                        const newParticle: DataParticle = {
                            id: `${timeRef.current}-${i}-${j}-${Math.random()}`,
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

                // Process items from readers (1 item per second per reader)
                for (let i = 0; i < Math.max(1, effectiveReaderCount); i++) {
                    const itemsInBuffer = updated.filter(p => p.stage === 'buffer')
                    if (itemsInBuffer.length > 0) {
                        // Pick random buffer item for this consumer
                        const itemIndex = Math.floor(Math.random() * itemsInBuffer.length)
                        const itemToProcess = itemsInBuffer[itemIndex]
                        const idx = updated.findIndex(p => p.id === itemToProcess.id)
                        if (idx !== -1) {
                            updated[idx].stage = 'reader'
                            updated[idx].readerIndex = i
                            updated[idx].createdAt = timeRef.current
                            setBuffered((b) => Math.max(0, b - 1))
                        }
                    }
                }

                // Update particle positions and stages
                updated = updated.map((particle) => {
                    let newParticle = { ...particle }
                    const timeInStage = timeRef.current - particle.createdAt

                    if (newParticle.stage === 'producer') {
                        // Producer stage: 300ms animation
                        newParticle.progress = Math.min(timeInStage / 300, 1)
                        if (newParticle.progress >= 1) {
                            newParticle.stage = 'buffer'
                            newParticle.createdAt = timeRef.current
                            setBuffered((b) => b + 1)
                        }
                    } else if (newParticle.stage === 'buffer') {
                        // Buffer stage: stays until processed by reader (no automatic transition)
                        newParticle.progress = 0
                    } else if (newParticle.stage === 'reader') {
                        // Reader stage: 400ms processing time
                        newParticle.progress = Math.min(timeInStage / 400, 1)
                        if (newParticle.progress >= 1) {
                            newParticle.stage = 'database'
                            newParticle.createdAt = timeRef.current
                            // Track which reader processed this
                            const readerIndex = newParticle.readerIndex ?? 0
                            setReaderStats((prev) => {
                                const newStats = [...prev]
                                if (readerIndex < newStats.length) {
                                    newStats[readerIndex].consumed += 1
                                    newStats[readerIndex].isReading = true

                                    // Clear existing timeout if any
                                    if (newStats[readerIndex].readTimeout) {
                                        clearTimeout(newStats[readerIndex].readTimeout as NodeJS.Timeout)
                                    }

                                    // Reset reading indicator after 500ms
                                    newStats[readerIndex].readTimeout = setTimeout(() => {
                                        setReaderStats((prev2) => {
                                            const newStats2 = [...prev2]
                                            if (readerIndex < newStats2.length) {
                                                newStats2[readerIndex].isReading = false
                                            }
                                            return newStats2
                                        })
                                    }, 500) as any
                                }

                                return newStats
                            })
                        }
                    } else if (newParticle.stage === 'database') {
                        // Database stage: 300ms animation then complete
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
        }, 1000) // Run every 1 second

        return () => clearInterval(interval)
    }, [isRunning, producerCount, effectiveReaderCount]) // Runs every 1 second

    // Calculate positions for each stage
    const getProducerPosition = (producerIndex: number) => {
        const startY = 50
        const spacing = 100
        return { x: 10, y: startY + producerIndex * spacing }
    }

    const getReaderPosition = (readerIndex: number) => {
        const startY = 50
        const spacing = 100
        return { x: 420, y: startY + readerIndex * spacing }
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
            return { x: prodPos.x + particle.progress * 60, y: prodPos.y + 35 }
        } else if (particle.stage === 'buffer') {
            return {
                x: 230 + particle.progress * 50,
                y: 175 + Math.sin(particle.id.charCodeAt(0) / 10) * 40,
            }
        } else if (particle.stage === 'reader') {
            const readerIndex = Math.floor(Math.random() * readerCount)
            const readerPos = getReaderPosition(readerIndex)
            return { x: readerPos.x + particle.progress * 60, y: readerPos.y + 35 }
        } else {
            return { x: 580, y: 175 + Math.sin(particle.id.charCodeAt(0) / 10) * 40 }
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
                <h3 className="text-lg font-semibold text-white mb-2">Scalable Data Pipeline</h3>
                <p className="text-sm text-[var(--color-text-primary)]">
                    Interactive simulation of a distributed data streaming architecture. Scale producers to simulate variable data ingestion and consumers to optimize throughput. Producers emit 0-2 events/sec, consumers process 1 event/sec each.
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
                        Active Consumers: {autoScale ? `${effectiveReaderCount} (auto)` : readerCount}
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((count) => (
                            <button
                                key={count}
                                onClick={() => setReaderCount(count)}
                                disabled={autoScale}
                                className={`flex-1 px-3 py-1 text-sm rounded font-medium transition ${autoScale
                                    ? 'opacity-50 cursor-not-allowed bg-[var(--color-background-card)] text-[var(--color-text-secondary)] border border-[var(--color-border-secondary)]'
                                    : readerCount === count
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

            {/* Auto-Scaling Toggle */}
            <div className="mb-6 flex items-center gap-3 bg-[var(--color-background-card)] p-4 rounded-lg border border-[var(--color-border-primary)]">
                <button
                    onClick={() => setAutoScale(!autoScale)}
                    className={`px-4 py-2 rounded font-medium transition ${autoScale
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-background-card)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-primary)]'
                        }`}
                >
                    {autoScale ? '✓ Auto-Scaling Enabled' : '○ Auto-Scaling Disabled'}
                </button>
                <span className="text-sm text-[var(--color-text-secondary)]">
                    {autoScale
                        ? 'Consumers auto-scale: +1 when buffer &gt; 10, -1 when buffer ≤ 5'
                        : 'Click to enable intelligent auto-scaling'}
                </span>
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
                <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 680 550" className="w-full h-full">
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
                                <title>{`Data Producer ${i + 1}: Emits 0-2 events per second`}</title>
                                {/* Producer box */}
                                <rect
                                    x={pos.x}
                                    y={pos.y}
                                    width="100"
                                    height="70"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    rx="4"
                                />
                                {/* Icon */}
                                <text
                                    x={pos.x + 15}
                                    y={pos.y + 28}
                                    fontSize="28"
                                    fill="#3b82f6"
                                >
                                    📊
                                </text>
                                {/* Label */}
                                <text
                                    x={pos.x + 70}
                                    y={pos.y + 22}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="#3b82f6"
                                    fontWeight="bold"
                                >
                                    P{i + 1}
                                </text>
                                {/* Count */}
                                <text
                                    x={pos.x + 70}
                                    y={pos.y + 48}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="#3b82f6"
                                >
                                    {producerStats[i]?.produced || 0}
                                </text>
                            </g>
                        )
                    })}

                    {/* Buffer */}
                    <g>
                        <title>Message Buffer: Temporary queue storing events between producers and consumers</title>
                        <rect
                            x="180"
                            y="140"
                            width="100"
                            height="70"
                            fill="none"
                            stroke={bufferColor}
                            strokeWidth="2"
                            rx="4"
                        />
                        <text x="205" y="168" fontSize="28" fill={bufferColor}>
                            ⚡
                        </text>
                        <text x="260" y="162" textAnchor="middle" fontSize="12" fill={bufferColor} fontWeight="bold">
                            Buffer
                        </text>
                        <text x="260" y="188" textAnchor="middle" fontSize="11" fill="white">
                            {buffered}
                        </text>
                    </g>

                    {/* Readers */}
                    {Array.from({ length: readerCount }).map((_, i) => {
                        const pos = getReaderPosition(i)
                        const displayValue = readerStats[i]?.isReading ? 1 : 0
                        return (
                            <g key={`reader-${i}`}>
                                <title>{`Consumer ${i + 1}: Processes 1 event per second`}</title>
                                {/* Consumer box */}
                                <rect
                                    x={pos.x}
                                    y={pos.y}
                                    width="100"
                                    height="70"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="2"
                                    rx="4"
                                />
                                {/* Icon */}
                                <text
                                    x={pos.x + 15}
                                    y={pos.y + 28}
                                    fontSize="28"
                                    fill="#8b5cf6"
                                >
                                    🔍
                                </text>
                                {/* Label */}
                                <text
                                    x={pos.x + 70}
                                    y={pos.y + 22}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="#8b5cf6"
                                    fontWeight="bold"
                                >
                                    C{i + 1}
                                </text>
                                {/* Count */}
                                <text
                                    x={pos.x + 70}
                                    y={pos.y + 48}
                                    textAnchor="middle"
                                    fontSize="14"
                                    fill="#8b5cf6"
                                    fontWeight="bold"
                                >
                                    {displayValue}
                                </text>
                            </g>
                        )
                    })}

                    {/* Database */}
                    <g>
                        <title>Data Store: Persists processed events for long-term storage and analytics</title>
                        <rect x="560" y="140" width="100" height="70" fill="none" stroke="#10b981" strokeWidth="2" rx="4" />
                        <text x="580" y="168" fontSize="28" fill="#10b981">
                            💾
                        </text>
                        <text x="635" y="162" textAnchor="middle" fontSize="12" fill="#10b981" fontWeight="bold">
                            Database
                        </text>
                        <text x="635" y="188" textAnchor="middle" fontSize="11" fill="white">
                            {stored}
                        </text>
                    </g>

                    {/* Arrows from producers to buffer */}
                    {Array.from({ length: producerCount }).map((_, i) => {
                        const prodPos = getProducerPosition(i)
                        return (
                            <line
                                key={`arrow-prod-${i}`}
                                x1={prodPos.x + 100}
                                y1={prodPos.y + 35}
                                x2="180"
                                y2="175"
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
                                x1="250"
                                y1="175"
                                x2={readerPos.x}
                                y2={readerPos.y + 35}
                                stroke="#666"
                                strokeWidth="1"
                                markerEnd="url(#arrowhead)"
                            />
                        )
                    })}

                    {/* Arrow from readers to database */}
                    <line
                        x1="520"
                        y1="175"
                        x2="560"
                        y2="175"
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
