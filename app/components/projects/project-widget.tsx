'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface ProjectWidgetProps {
    title: string
    description: string
    href: string
    icon?: ReactNode
    color?: string
}

export function ProjectWidget({
    title,
    description,
    href,
    icon,
    color = 'from-indigo-500 to-purple-500',
}: ProjectWidgetProps) {
    return (
        <Link href={href}>
            <div
                className={`group relative p-8 rounded-xl border border-[var(--color-border-primary)] hover:border-[var(--color-primary)]
          bg-gradient-to-br from-[var(--color-background-card)] to-transparent
          backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
          hover:shadow-indigo-500/20 overflow-hidden`}
            >
                {/* Gradient background effect on hover */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Icon area */}
                {icon && (
                    <div className="mb-4 text-4xl opacity-80 group-hover:opacity-100 transition-opacity">
                        {icon}
                    </div>
                )}

                {/* Content */}
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">
                    {description}
                </p>

                {/* Arrow indicator */}
                <div className="absolute top-4 right-4 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                    →
                </div>
            </div>
        </Link>
    )
}
