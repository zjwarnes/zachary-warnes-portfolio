import { Container } from '@/app/components/container'
import { ParticleBackground } from '@/app/components/particle-background'
import { DemoReveal } from '@/app/components/projects/demo-reveal'
import ProjectLayout from '@/app/components/project-layout'
import { ProjectDescription } from '@/app/components/projects/project-description'
import { ApplicationCard } from '@/app/components/projects/llm/application-card'
import { DataPipelineDemo } from '@/app/components/projects/data-engineering/data-pipeline-demo'
import Link from 'next/link'

const coreProjects = [
    {
        title: "Kubernetes-Based ML Training System",
        description: "Designed and implemented a horizontally-scalable Kubernetes system in Azure for distributed ML model training, achieving 50% reduction in inversion time through cloud-native architecture.",
        skills: ["Kubernetes", "Azure Container Apps", "Python", "Distributed Computing"],
        value: "Reduced geological analysis inversion time by 50%, enabling faster subsurface modeling and resource exploration. 2+ years in this role."
    },
    {
        title: "Event-Driven Data Pipelines",
        description: "Built production-grade event-driven pipelines processing terabytes of data from 100+ global sensors, enabling real-time analytics and system scalability.",
        skills: ["Azure Event Hub", "Service Bus", "Data Factory", "Airflow"],
        value: "Processes 100+ data streams globally with enhanced scalability, reliability, and real-time insights for critical operations. 2+ years in this role."
    },
    {
        title: "Monitoring & Anomaly Detection System",
        description: "Developed comprehensive monitoring and logging dashboards equipped with anomaly detection algorithms to trigger alerts for sensor issues and ensure high data quality.",
        skills: ["Datadog", "Azure Monitoring", "Machine Learning", "Real-time Alerting"],
        value: "Proactively identifies data quality issues before they affect downstream ML systems, ensuring 99.9% data reliability. 2+ years in this role."
    }
];

const systemArchitecture = [
    {
        name: "Cloud Platforms",
        items: ["Azure", "AWS", "Google Cloud"]
    },
    {
        name: "Data Processing",
        items: ["Apache Spark", "PySpark", "Pandas", "ETL Pipelines"]
    },
    {
        name: "Orchestration",
        items: ["Kubernetes", "Airflow", "Docker", "CI/CD Pipelines"]
    },
    {
        name: "Databases",
        items: ["PostgreSQL", "MongoDB", "SQL Server", "Cosmos DB"]
    },
    {
        name: "APIs & Frameworks",
        items: ["REST APIs", "FastAPI", "Terraform", "Infrastructure as Code"]
    }
];

export const metadata = {
    title: 'Data Engineering',
    description: 'Data engineering, pipelines, and cloud infrastructure',
}

export default function DataEngineeringPage() {
    return (
        <div className="relative min-h-screen bg-[var(--color-background-dark)]">
            <ParticleBackground />
            <div className="relative z-10">
                <Container>
                    <Link href="/" className="inline-flex items-center gap-2 mb-8 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-200 font-medium">
                        <span>←</span> Back to Home
                    </Link>
                    <ProjectLayout
                        demo={
                            <DemoReveal title="Data Pipeline Demo">
                                <DataPipelineDemo />
                            </DemoReveal>
                        }
                    >
                        <div className="space-y-8">
                            <div>
                                <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
                                    Data Engineering Expertise
                                </h1>
                                <ProjectDescription
                                    paragraphs={[
                                        "Expert in designing and implementing large-scale data systems that handle complex data flows, distributed architectures, and real-time processing. With years of experience processing terabytes of data from 100s of global sensors and creating ETL pipelines for complex data workflows, I specialize in building robust, scalable infrastructure.",
                                        "My approach combines cloud-native architectures (Kubernetes, serverless), event-driven design patterns, and comprehensive monitoring to create systems that are both performant and maintainable."
                                    ]}
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold text-xl mb-4 tracking-tighter">
                                    What I Offer
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                    {coreProjects.map((project, index) => (
                                        <ApplicationCard key={index} {...project} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="font-semibold text-xl mb-4 tracking-tighter">
                                    Technical Stack
                                </h2>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {systemArchitecture.map((category, index) => (
                                        <div key={index}>
                                            <p className="font-semibold text-[var(--color-primary)] mb-2">{category.name}</p>
                                            <ul className="space-y-1 text-[var(--color-text-primary)] list-disc list-inside">
                                                {category.items.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
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
                                        <p className="text-white">Specialized in cloud-native architecture, distributed systems, and ETL pipeline design. Expert at designing systems that process massive volumes of data reliably and efficiently while maintaining high availability and fault tolerance.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--color-primary)] mb-1">Key Achievements</p>
                                        <p className="text-white">• Architected systems processing 100+ global data streams handling terabytes of data</p>
                                        <p className="text-white">• Delivered 50% performance improvements through Kubernetes-based infrastructure optimization</p>
                                        <p className="text-white">• Built monitoring systems ensuring 99.9% data reliability and uptime for mission-critical operations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ProjectLayout>
                </Container>
            </div>
        </div>
    );
}
