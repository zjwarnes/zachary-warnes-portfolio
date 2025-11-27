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

interface ModelingTechnique {
    name: string
    items: string[]
}

interface MachineLearningContentProps {
    coreProjects: CoreProject[]
    modelingTechniques: ModelingTechnique[]
}

export function MachineLearningContent({ coreProjects, modelingTechniques }: MachineLearningContentProps) {
    const [expandedProject, setExpandedProject] = useState<number | null>(null)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
                    Machine Learning Expertise
                </h1>
                <ProjectDescription
                    paragraphs={[
                        "With an MSc in Data Science and 6+ years of industry experience, I specialize in building advanced machine learning systems that solve real-world problems. From fine-tuning advanced prediction models to implementing cutting-edge 3D CNNs for geological modeling, I combine theoretical rigor with practical deployment expertise.",
                        "My focus is on creating models that are not only accurate but also interpretable, maintainable, and production-ready. I approach each project with attention to rigorous evaluation, hyperparameter optimization, and understanding the business impact."
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
                    {modelingTechniques.map((category, index) => (
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
                        <p className="font-semibold text-[var(--color-primary)] mb-1">Expertise & Specialization</p>
                        <p className="text-white">Specialized in building advanced machine learning systems across scientific and healthcare domains with 6+ years of industry experience. Expert in designing and deploying production-grade models that combine theoretical rigor with practical scalability, delivering measurable business impact through data-driven solutions.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-primary)] mb-1">Key Achievements</p>
                        <p className="text-white">• Achieved significant performance improvements through advanced feature engineering and fine-tuning techniques in predictive modeling</p>
                        <p className="text-white">• Designed and deployed custom 3D CNN architectures for complex geological analysis and modeling at scale</p>
                        <p className="text-white">• Built anomaly detection systems with real-time monitoring and automated alerting that ensure data quality and system reliability for mission-critical operations</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
