import { Container } from '@/app/components/container'
import { ParticleBackground } from '@/app/components/particle-background'
import { DemoReveal } from '@/app/components/projects/demo-reveal'
import ProjectLayout from '@/app/components/project-layout'
import { ProjectDescription } from '@/app/components/projects/project-description'
import { DataEngineeringContent } from './content'
import Link from 'next/link'

const coreProjects = [
    {
        title: "Kubernetes-Based ML Training System",
        description: "Designed and implemented a horizontally-scalable Kubernetes system in Azure for distributed ML model training, achieving 50% reduction in inversion time through cloud-native architecture.",
        impact: "Reduced geological analysis inversion time by 50%, enabling faster subsurface modeling and resource exploration.",
        technologies: ["Kubernetes", "Azure Container Apps", "Python", "Distributed Computing"],
        icon: "☁️"
    },
    {
        title: "Event-Driven Data Pipelines",
        description: "Built production-grade event-driven pipelines processing terabytes of data from 100+ global sensors, enabling real-time analytics and system scalability.",
        impact: "Processes 100+ data streams globally with enhanced scalability, reliability, and real-time insights for critical operations.",
        technologies: ["Azure Event Hub", "Service Bus", "Data Factory", "Airflow"],
        icon: "📡"
    },
    {
        title: "Monitoring & Anomaly Detection System",
        description: "Developed comprehensive monitoring and logging dashboards equipped with anomaly detection algorithms to trigger alerts for sensor issues and ensure high data quality.",
        impact: "Proactively identifies data quality issues before they affect downstream ML systems, ensuring 99.9% data reliability.",
        technologies: ["Datadog", "Azure Monitoring", "Machine Learning", "Real-time Alerting"],
        icon: "🔍"
    }
];

const systemArchitecture = [
    {
        name: "Cloud Platforms",
        items: ["Azure (AKS, Functions, Cosmos DB, Data Factory)", "AWS (Lambda, S3, EC2)", "Google Cloud (GKE, Vertex AI, BigQuery)"]
    },
    {
        name: "Data Processing",
        items: ["Apache Spark", "PySpark", "Pandas", "ETL Pipelines", "Data versioning with DVC"]
    },
    {
        name: "Orchestration",
        items: ["Kubernetes & KEDA", "Airflow", "Docker", "CI/CD Pipelines"]
    },
    {
        name: "Databases",
        items: ["PostgreSQL", "MongoDB", "SQL Server", "TimescaleDB", "Cosmos DB"]
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
                            <DemoReveal title="Data Engineering Demo">
                                <div className="h-full flex flex-col items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">⚙️</div>
                                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                                            Data Pipelines & Infrastructure
                                        </h3>
                                        <p className="text-[var(--color-text-primary)] text-sm">
                                            Designing and deploying scalable systems to process and monitor billions of data points across global infrastructure.
                                        </p>
                                        <div className="mt-8 space-y-3 text-sm text-[var(--color-text-primary)]">
                                            <div className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)] flex-shrink-0">→</span>
                                                <span>100+ sensors monitored in real-time</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)] flex-shrink-0">→</span>
                                                <span>Terabytes of data processed daily</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)] flex-shrink-0">→</span>
                                                <span>50% reduction in processing time</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-[var(--color-primary)] flex-shrink-0">→</span>
                                                <span>99.9% data reliability</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DemoReveal>
                        }
                    >
                        <DataEngineeringContent coreProjects={coreProjects} systemArchitecture={systemArchitecture} />
                    </ProjectLayout>
                </Container>
            </div>
        </div>
    );
}
