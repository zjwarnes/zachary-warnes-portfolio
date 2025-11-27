import ProjectLayout from '@/app/components/project-layout';
import { Container } from '@/app/components/container';
import { ProjectDescription } from '@/app/components/projects/project-description';
import { ApplicationCard } from '@/app/components/projects/llm/application-card';
import { ParticleBackground } from '@/app/components/particle-background';
import { DemoReveal } from '@/app/components/projects/demo-reveal';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the LLM components with ssr disabled
const RAGLLMDemo = dynamic(
  () => import('@/app/components/projects/llm/rag/rag-llm-demo').then(mod => mod.RAGLLMDemo),
  { ssr: false }
);

const LLMErrorBoundary = dynamic(
  () => import('@/app/components/projects/llm/error-boundary').then(mod => mod.LLMErrorBoundary),
  { ssr: false }
);

const coreProjects = [
  {
    title: "AI Knowledge Assistant",
    description: "RAG-based system deployed in production enabling hundreds of users to query thousands of proprietary documents for analysis.",
    skills: ["RAG", "LangChain", "Pinecone", "REST APIs"],
    value: "Enables instant access to knowledge base, improving research efficiency and ensuring knowledge consistency across teams. 1+ years in this role."
  },
  {
    title: "Intelligent Document Processing",
    description: "NLP pipeline for processing and analyzing technical documents, extracting key insights and enabling semantic search across document repositories.",
    skills: ["Document parsing", "Embeddings", "Vector search", "Information extraction"],
    value: "Reduces document analysis time significantly and improves knowledge discovery for research and decision-making. 1+ years in this role."
  },
  {
    title: "Conversational Query Interface",
    description: "End-to-end system combining fine-tuned language models with retrieval mechanisms to provide accurate, context-aware responses to user queries.",
    skills: ["LLM fine-tuning", "Prompt engineering", "Context management", "API integration"],
    value: "Provides natural language interface to complex databases, making specialized knowledge accessible to non-technical users. 1+ years in this role."
  }
];

export const metadata = {
  title: 'LLMs & RAG',
  description: 'Large Language Models and Retrieval-Augmented Generation expertise',
}

export default function LLMPage() {
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
              <DemoReveal title="LLMs & RAG Demo">
                <LLMErrorBoundary>
                  <RAGLLMDemo />
                </LLMErrorBoundary>
              </DemoReveal>
            }
          >
            <div className="space-y-8">
              <div>
                <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
                  LLMs & RAG Expertise
                </h1>
                <ProjectDescription
                  paragraphs={[
                    "Specialized in building enterprise-scale LLM applications with Retrieval-Augmented Generation (RAG). I combine LangChain, vector databases, and fine-tuned models to create intelligent systems that understand domain-specific knowledge and deliver measurable business value.",
                    "This demo showcases a browser-based RAG system where you can upload documents and have intelligent conversations about their content. All processing happens locally for complete privacy and security."
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
                  <div>
                    <p className="font-semibold text-[var(--color-primary)] mb-2">LLM Frameworks</p>
                    <ul className="space-y-1 text-[var(--color-text-primary)] list-disc list-inside">
                      <li>LangChain</li>
                      <li>Prompt Engineering</li>
                      <li>Fine-tuning & Adaptation</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-primary)] mb-2">Vector Databases</p>
                    <ul className="space-y-1 text-[var(--color-text-primary)] list-disc list-inside">
                      <li>Pinecone</li>
                      <li>Weaviate</li>
                      <li>FAISS</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-primary)] mb-2">Cloud & Deployment</p>
                    <ul className="space-y-1 text-[var(--color-text-primary)] list-disc list-inside">
                      <li>Azure</li>
                      <li>AWS Lambda</li>
                      <li>REST APIs</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-primary)] mb-2">Full Stack</p>
                    <ul className="space-y-1 text-[var(--color-text-primary)] list-disc list-inside">
                      <li>FastAPI/Flask</li>
                      <li>React</li>
                      <li>Document Processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-xl mb-4 tracking-tighter">
                  Professional Background
                </h2>
                <div className="space-y-3 text-sm text-white">
                  <div>
                    <p className="font-semibold text-[var(--color-primary)] mb-1">Expertise & Specialization</p>
                    <p className="text-white">Specialized in building enterprise-scale LLM and RAG applications with proven expertise in production deployment. Expert in combining language models with retrieval systems to create intelligent solutions that deliver measurable business value across diverse domains.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-primary)] mb-1">Key Achievements</p>
                    <p className="text-white">• Deployed production RAG systems enabling hundreds of users to efficiently query and analyze proprietary knowledge bases</p>
                    <p className="text-white">• Built end-to-end NLP pipelines for intelligent document processing and semantic search across large repositories</p>
                    <p className="text-white">• Created conversational interfaces combining fine-tuned language models with retrieval mechanisms for accessible knowledge access</p>
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