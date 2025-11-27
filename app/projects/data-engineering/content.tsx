'use client'

import { useState } from 'react'
import { ProjectDescription } from '@/app/components/projects/project-description'

interface CoreProject {
    title: string
    description: string
    impact: string
    technologies: string[]
    icon: string
}

interface SystemArchitectureItem {
    name: string
    items: string[]
}

interface DataEngineeringContentProps {
    coreProjects: CoreProject[]
    systemArchitecture: SystemArchitectureItem[]
}

export function DataEngineeringContent({ coreProjects, systemArchitecture }: DataEngineeringContentProps) {
    const [expandedProject, setExpandedProject] = useState<number | null>(null)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
                    Data Engineering Expertise
                </h1>
                <ProjectDescription
                    paragraphs={[
                        "Expert in designing and implementing large-scale data systems that handle complex data flows, distributed architectures, and real-time processing. With experience at Ideon processing data from 100+ global sensors and establishing ETL pipelines handling terabytes of medical data at Pacmed, I specialize in building robust, scalable infrastructure.",
                        "My approach combines cloud-native architectures (Kubernetes, serverless), event-driven design patterns, and comprehensive monitoring to create systems that are both performant and maintainable."
                    ]}
                />
            </div>

            <div>
                <h2 className="font-semibold text-xl mb-4 tracking-tighter">
                    What I Offer
                </h2>
                <div className="space-y-3">
                    {coreProjects.map((project, index) => (
                        <div
                            key={index}
                            className="p-4 bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded-lg hover:border-[var(--color-primary)] transition-all cursor-pointer"
                            onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                        >
                            <div className="flex items-start gap-3 mb-2">
                                <span className="text-2xl flex-shrink-0">{project.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                            <p className="text-base text-white font-semibold mb-2">
                                {project.description}
                            </p>
                            {expandedProject === index && (
                                <div className="mt-3 pt-3 border-t border-[var(--color-border-primary)] space-y-2">
                                    <p className="text-sm text-[var(--color-primary)] font-medium">
                                        Impact: {project.impact}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-primary)] rounded text-xs font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="font-semibold text-xl mb-4 tracking-tighter">
                    Technical Stack
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {systemArchitecture.map((category, index) => (
                        <div
                            key={index}
                            className="p-4 bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded-lg"
                        >
                            <h3 className="font-semibold text-[var(--color-primary)] mb-2 text-sm uppercase">
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.items.map((item, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-[var(--color-border-primary)] text-[var(--color-text-primary)] rounded text-xs"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="font-semibold text-xl mb-4 tracking-tighter">
                    Professional Background
                </h2>
                <div className="space-y-3 text-sm text-white">
                    <div>
                        <p className="font-semibold text-[var(--color-primary)] mb-1">Expertise & Certifications</p>
                        <p className="text-white">Specialized in cloud-native architecture, distributed systems, and ETL pipeline design with 6+ years of industry experience across biotech and scientific tech sectors.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-primary)] mb-1">Key Achievements</p>
                        <p className="text-white">• Architected systems processing 100+ global data streams handling terabytes of medical data daily</p>
                        <p className="text-white">• Delivered 50% performance improvements through Kubernetes-based infrastructure optimization</p>
                        <p className="text-white">• Built monitoring systems ensuring 99.9% data reliability and uptime for mission-critical operations</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
