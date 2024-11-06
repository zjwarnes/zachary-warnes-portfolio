import { Container } from 'app/components/container'
import { ProjectLink } from 'app/components/projects/project-link'
import { SkillCard } from 'app/components/skills/skill-card'

const skills = [
  {
    title: "Large Language Models",
    description: "Developing and deploying production-ready LLM applications",
    details: {
      expertise: [
        "RAG System Architecture",
        "Prompt Engineering",
        "Context Window Optimization",
        "Fine-tuning & Training"
      ],
      projects: [
        "Scientific Document Retrieval System",
        "Customer Support AI Assistant",
        "Code Generation Tools"
      ],
      technologies: [
        "OpenAI GPT Models",
        "LangChain",
        "Vector Databases",
        "Azure OpenAI Service"
      ]
    }
  },
  {
    title: "Computer Vision",
    description: "Building advanced computer vision and image processing systems",
    details: {
      expertise: [
        "Object Detection",
        "Image Segmentation",
        "Video Analysis",
        "Real-time Processing"
      ],
      projects: [
        "Manufacturing Defect Detection",
        "Medical Image Analysis",
        "Surveillance Systems"
      ],
      technologies: [
        "PyTorch",
        "OpenCV",
        "YOLO",
        "TensorFlow"
      ]
    }
  },
  {
    title: "Predictive Analytics",
    description: "Creating robust predictive models for business insights",
    details: {
      expertise: [
        "Time Series Analysis",
        "Anomaly Detection",
        "Risk Assessment",
        "Pattern Recognition"
      ],
      projects: [
        "Financial Forecasting",
        "Predictive Maintenance",
        "Customer Behavior Analysis"
      ],
      technologies: [
        "scikit-learn",
        "Prophet",
        "XGBoost",
        "TensorFlow"
      ]
    }
  },
  {
    title: "MLOps",
    description: "Implementing end-to-end ML operations and deployment pipelines",
    details: {
      expertise: [
        "Model Deployment",
        "Performance Monitoring",
        "Pipeline Automation",
        "Version Control"
      ],
      projects: [
        "Automated Training Pipelines",
        "Model Monitoring Systems",
        "A/B Testing Frameworks"
      ],
      technologies: [
        "Docker",
        "Kubernetes",
        "MLflow",
        "GitHub Actions"
      ]
    }
  }
];

export default function Page() {
  return (
    <Container as="section" className="py-8">
      <h1 className="mb-8 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter">
        AI & Machine Learning Engineer
      </h1>
      <p className="mb-4">
        {`I am an AI professional specializing in Large Language Models, Computer Vision, 
        and Predictive Analytics. With six years of experience architecting and deploying 
        AI models, I focus on creating innovative solutions using cutting-edge technologies.`}
      </p>
      
      {/* Skills Section */}
      <div className="my-8">
        <h2 className="text-xl md:text-2xl font-medium mb-4">Core Skills</h2>
        <div className="mx-auto w-[60%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <SkillCard
                key={index}
                title={skill.title}
                description={skill.description}
                details={skill.details}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="my-8">
        <h2 className="text-xl md:text-2xl font-medium mb-4">Featured Projects</h2>
        <div className="mx-auto w-[60%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectLink 
              href="/projects/llm"
              title="LLM & RAG Systems"
              description="Enterprise-scale LLM and RAG implementations for scientific document retrieval"
            />
            <ProjectLink 
              href="/projects/vision"
              title="Computer Vision Projects"
              description="Advanced computer vision and object detection systems"
            />
            <ProjectLink 
              href="/projects/prediction"
              title="Predictive Models"
              description="Machine learning models for predictive analytics and monitoring"
            />
            <ProjectLink 
              href="/projects/other"
              title="Other Projects"
              description="Additional machine learning and data science projects"
            />
          </div>
        </div>
      </div>
    </Container>
  )
}
