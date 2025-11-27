'use client'

import { useState } from 'react'

interface DemoRevealProps {
    children: React.ReactNode
    title?: string
}

export function DemoReveal({ children, title = "Demo" }: DemoRevealProps) {
    const [isRevealed, setIsRevealed] = useState(false)

    if (!isRevealed) {
        return (
            <div className="min-h-[300px] flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <div className="text-5xl mb-4">✨</div>
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        {title}
                    </h3>
                    <p className="text-[var(--color-text-primary)] max-w-xs">
                        Click the button below to load and interact with the demo
                    </p>
                    <button
                        onClick={() => setIsRevealed(true)}
                        className="mt-6 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30"
                    >
                        Start Demo
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {children}
        </div>
    )
}
