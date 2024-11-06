import ProjectLayout from 'app/components/project-layout';
import { Container } from 'app/components/container';
import { ProjectCard } from 'app/components/projects/project-card';
import { FeatureList } from 'app/components/projects/feature-list';
import { ProjectDemo } from 'app/components/projects/project-demo';
import { ProjectDescription } from 'app/components/projects/project-description';

export const metadata = {
  title: 'LLM & RAG Projects',
  description: 'Enterprise-scale LLM and RAG implementations for scientific document retrieval',
}

const features = [
  'Scalable indexing of scientific documents',
  'Slack integration for seamless access',
  'GPT-based contextual response generation',
  'Enterprise-grade security and compliance',
];

const techStack = [
  'Azure Web Apps for deployment',
  'Pinecone vector stores for document indexing',
  'Langchain for LLM integration',
  'Slack API for user interaction',
];

const impact = [
  'Serving 100+ scientific users across research teams',
  'Processing tens of thousands of scientific documents',
  'Significant reduction in information retrieval time',
  'Enhanced decision-making through contextual insights',
];

const description = [
  `This enterprise-level RAG system demonstrates the successful implementation 
   of LLM technology in a production environment. By combining Azure's cloud 
   infrastructure with advanced language models and vector search capabilities, 
   the system provides researchers with instant access to relevant information 
   from vast document repositories.`,
  `The integration with Slack makes the system easily accessible within existing 
   workflows, while the use of Pinecone vector stores ensures efficient and 
   accurate document retrieval. The Langchain-powered GPT model generates 
   contextually accurate responses, making complex scientific information more 
   accessible and actionable.`,
];

export default function LLMPage() {
  return (
    <Container>
      <ProjectLayout
        demo={
          <ProjectDemo
            title="LLM-powered RAG System Demo"
            description="Interactive demonstration of scientific document retrieval and response generation"
          />
        }
      >
        <div className="space-y-8">
          <div>
            <h1 className="font-semibold text-2xl md:text-3xl mb-4 tracking-tighter">
              LLM-powered Retrieval-Augmented Generation (RAG) System
            </h1>
            <p className="text-white text-lg">
              Enterprise-scale document retrieval and insight generation system deployed on Azure
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProjectCard title="Key Features">
                <FeatureList items={features} />
              </ProjectCard>

              <ProjectCard title="Technical Stack">
                <FeatureList items={techStack} />
              </ProjectCard>
            </div>

            <ProjectCard title="Impact & Scale">
              <FeatureList items={impact} />
            </ProjectCard>

            <ProjectDescription paragraphs={description} />
          </div>
        </div>
      </ProjectLayout>
    </Container>
  );
} 