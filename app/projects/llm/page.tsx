import ProjectLayout from '@/app/components/project-layout';
import { Container } from '@/app/components/container';
import { ProjectDescription } from '@/app/components/projects/project-description';
import { ApplicationCard } from '@/app/components/projects/llm/application-card';
import dynamic from 'next/dynamic';

// Dynamically import the LLM components with ssr disabled
const LLMDemo = dynamic(
  () => import('@/app/components/projects/llm/llm-demo').then(mod => mod.LLMDemo),
  { ssr: false }
);

const LLMErrorBoundary = dynamic(
  () => import('@/app/components/projects/llm/error-boundary').then(mod => mod.LLMErrorBoundary),
  { ssr: false }
);

const applications = [
  {
    title: "Custom Knowledge Assistant",
    description: "AI-powered chatbot that learns from your organization's documents and knowledge base to provide accurate, contextual responses to employee queries.",
    skills: ["RAG", "Vector databases", "LLM fine-tuning", "Enterprise search"],
    value: "Reduces time spent searching for information by 70% and ensures consistent knowledge sharing across teams."
  },
  {
    title: "Automated Document Analysis",
    description: "Intelligent system for processing and analyzing large volumes of documents, extracting key insights and generating summaries.",
    skills: ["Document processing", "NLP", "Information extraction", "Text summarization"],
    value: "Cuts document processing time by 80% while improving accuracy and consistency of information extraction."
  },
  {
    title: "Conversational AI Platform",
    description: "Enterprise-grade platform for building and deploying custom chatbots and virtual assistants tailored to specific business needs.",
    skills: ["Dialogue management", "Intent recognition", "Multi-language support", "Integration APIs"],
    value: "Enables 24/7 customer support while reducing support costs by 50% and improving response times."
  },
  {
    title: "Content Generation System",
    description: "AI-powered system for generating and optimizing various types of content, from technical documentation to marketing materials.",
    skills: ["Content generation", "SEO optimization", "Multilingual support", "Template management"],
    value: "Accelerates content creation by 5x while maintaining brand voice and quality standards."
  }
];

export const metadata = {
  title: 'LLM Projects',
  description: 'Interactive LLM demonstrations and applications',
}

export default function LLMPage() {
  return (
    <Container>
      <ProjectLayout
        demo={
          <LLMErrorBoundary>
            <LLMDemo />
          </LLMErrorBoundary>
        }
      >
        <div className="space-y-8">
          <div>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
              Language Model Projects
            </h1>
            <ProjectDescription
              paragraphs={[
                "Interactive demonstration of a browser-based language model. Chat with the AI to learn about my skills and experience in building LLM-powered applications.",
                "This demo showcases my expertise in deploying efficient, production-ready language models, particularly for enterprise applications requiring real-time responses and seamless integration."
              ]}
            />
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-4 tracking-tighter">
              What I Can Build For You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {applications.map((app, index) => (
                <ApplicationCard key={index} {...app} />
              ))}
            </div>
          </div>
        </div>
      </ProjectLayout>
    </Container>
  );
} 