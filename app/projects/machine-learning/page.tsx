import { Container } from '@/app/components/container'
import { ParticleBackground } from '@/app/components/particle-background'
import { DemoReveal } from '@/app/components/projects/demo-reveal'
import ProjectLayout from '@/app/components/project-layout'
import { ProjectDescription } from '@/app/components/projects/project-description'
import { ApplicationCard } from '@/app/components/projects/llm/application-card'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import the vision demo with ssr disabled
const CharacterDetectionDemo = dynamic(
  () => import('@/app/components/projects/vision/CharacterDetectionDemo').then(mod => mod.CharacterDetectionDemo),
  { ssr: false }
)

const coreProjects = [
  {
    title: "Predictive Classification Systems",
    description: "Built production-grade classification models with advanced feature engineering and model interpretability. Achieved significant performance improvements through rigorous evaluation and hyperparameter optimization.",
    skills: ["PyTorch", "Feature Engineering", "SHAP", "Model Interpretation"],
    value: "Delivers interpretable, production-ready models that solve complex business problems with measurable impact. 2+ years in this role."
  },
  {
    title: "Computer Vision & Deep Learning",
    description: "Designed and implemented deep learning architectures including CNNs and advanced neural networks for image analysis and pattern recognition tasks at scale.",
    skills: ["TensorFlow", "CNNs", "Computer Vision", "3D Learning"],
    value: "Applies cutting-edge deep learning techniques to solve visual recognition and analysis challenges. 2+ years in this role."
  },
  {
    title: "Anomaly Detection & Monitoring",
    description: "Developed production-grade anomaly detection systems with real-time monitoring, automated alerting, and containerized REST APIs for continuous data quality assurance.",
    skills: ["Python", "FastAPI", "Docker", "Real-time Monitoring"],
    value: "Ensures data quality and system reliability through proactive anomaly detection and rapid response mechanisms. 2+ years in this role."
  }
];

const modelingTechniques = [
  {
    name: "Deep Learning Frameworks",
    items: ["TensorFlow", "PyTorch", "Keras", "JAX"]
  },
  {
    name: "Deep Learning Architectures",
    items: ["CNNs (2D & 3D)", "RNNs & LSTMs", "Transformer Architectures", "Ensemble Methods"]
  },
  {
    name: "ML Libraries & Tools",
    items: ["Scikit-Learn", "XGBoost", "Pandas", "NumPy", "Scikit-Image"]
  },
  {
    name: "Model Evaluation & Interpretability",
    items: ["SHAP Values", "Cross-validation", "Hyperparameter Tuning (Optuna)", "Attention Visualization"]
  }
];

const competencies = [
  "Time Series Forecasting",
  "Classification & Regression",
  "Feature Engineering",
  "Model Interpretability",
  "Hyperparameter Optimization",
  "Production Deployment"
];

export const metadata = {
  title: 'Machine Learning',
  description: 'Advanced machine learning, deep learning, and predictive models',
}

export default function MachineLearningPage() {
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
              <DemoReveal title="Machine Learning Demo">
                <div className="h-full flex flex-col overflow-y-auto">
                  <CharacterDetectionDemo />
                </div>
              </DemoReveal>
            }
          >
            <div className="space-y-8">
              <div>
                <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
                  Machine Learning Expertise
                </h1>
                <ProjectDescription
                  paragraphs={[
                    "Specialized in building advanced machine learning and deep learning systems that solve complex problems. With expertise spanning from classical machine learning to cutting-edge deep learning architectures, I combine theoretical rigor with practical deployment expertise to create models that are accurate, interpretable, and production-ready.",
                    "My focus is on understanding the business impact of each model, rigorous evaluation practices, and creating systems that can be maintained and improved over time."
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
                  {modelingTechniques.map((category, index) => (
                    <div key={index}>
                      <p className="font-semibold text-[var(--color-primary)] mb-2">{category.name}</p>
                      <ul className="space-y-1 text-[var(--color-text-primary)]">
                        {category.items.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ProjectLayout>
        </Container>
      </div>
    </div>
  );
}