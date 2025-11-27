import ProjectLayout from '@/app/components/project-layout';
import { Container } from '@/app/components/container';
import { ProjectDescription } from '@/app/components/projects/project-description';
import { ApplicationCard } from '@/app/components/projects/llm/application-card';
import dynamic from 'next/dynamic';

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
    description: "RAG-based system deployed in production at Ideon enabling hundreds of users to query thousands of proprietary documents for scientific analysis.",
    skills: ["RAG", "LangChain", "Pinecone", "REST APIs"],
    value: "Enables instant access to proprietary knowledge base, improving research efficiency and ensuring knowledge consistency across teams."
  },
  {
    title: "Intelligent Document Processing",
    description: "NLP pipeline for processing and analyzing technical documents, extracting key insights and enabling semantic search across document repositories.",
    skills: ["Document parsing", "Embeddings", "Vector search", "Information extraction"],
    value: "Reduces document analysis time by 80% and improves knowledge discovery for research and decision-making."
  },
  {
    title: "Conversational Query Interface",
    description: "End-to-end system combining fine-tuned language models with retrieval mechanisms to provide accurate, context-aware responses to user queries.",
    skills: ["LLM fine-tuning", "Prompt engineering", "Context management", "API integration"],
    value: "Provides natural language interface to complex databases, making specialized knowledge accessible to non-technical users."
  }
];

export const metadata = {
  title: 'LLMs & RAG',
  description: 'Large Language Models and Retrieval-Augmented Generation expertise',
}

export default function LLMPage() {
  return (
    <Container>
      <ProjectLayout
        demo={
          <LLMErrorBoundary>
            <RAGLLMDemo />
          </LLMErrorBoundary>
        }
      >
        <div className="space-y-8">
          <div>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
              LLMs & RAG Expertise
            </h1>
            <ProjectDescription
              paragraphs={[
                "Specialized in building enterprise-scale LLM applications with Retrieval-Augmented Generation (RAG). With experience deploying production systems at Ideon and creating advanced AI tutoring systems, I combine LangChain, vector databases, and fine-tuned models to create intelligent systems that understand domain-specific knowledge.",
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
                <ul className="space-y-1 text-[var(--color-text-secondary)]">
                  <li>• LangChain</li>
                  <li>• Prompt Engineering</li>
                  <li>• Fine-tuning & Adaptation</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-primary)] mb-2">Vector Databases</p>
                <ul className="space-y-1 text-[var(--color-text-secondary)]">
                  <li>• Pinecone</li>
                  <li>• Weaviate</li>
                  <li>• FAISS</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-primary)] mb-2">Cloud & Deployment</p>
                <ul className="space-y-1 text-[var(--color-text-secondary)]">
                  <li>• Azure</li>
                  <li>• AWS Lambda</li>
                  <li>• REST APIs</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-primary)] mb-2">Full Stack</p>
                <ul className="space-y-1 text-[var(--color-text-secondary)]">
                  <li>• FastAPI/Flask</li>
                  <li>• React</li>
                  <li>• Document Processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ProjectLayout>
    </Container>
  );
}