import { Container } from '@/app/components/container'
import { ParticleBackground } from '@/app/components/particle-background'
import { DemoReveal } from '@/app/components/projects/demo-reveal'
import ProjectLayout from '@/app/components/project-layout'
import { MachineLearningContent } from './content'
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
    impact: "Delivers interpretable, production-ready models that solve complex business problems with measurable impact.",
    technologies: ["PyTorch", "Feature Engineering", "SHAP", "Model Interpretation"],
    icon: "🧠"
  },
  {
    title: "Computer Vision & Deep Learning",
    description: "Designed and implemented deep learning architectures including CNNs and advanced neural networks for image analysis and pattern recognition tasks at scale.",
    impact: "Applies cutting-edge deep learning techniques to solve visual recognition and analysis challenges.",
    technologies: ["TensorFlow", "CNNs", "Computer Vision", "3D Learning"],
    icon: "👁️"
  },
  {
    title: "Anomaly Detection & Monitoring",
    description: "Developed production-grade anomaly detection systems with real-time monitoring, automated alerting, and containerized REST APIs for continuous data quality assurance.",
    impact: "Ensures data quality and system reliability through proactive anomaly detection and rapid response mechanisms.",
    technologies: ["Python", "FastAPI", "Docker", "Real-time Monitoring"],
    icon: "⚠️"
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
            <MachineLearningContent coreProjects={coreProjects} modelingTechniques={modelingTechniques} />
          </ProjectLayout>
        </Container>
      </div>
    </div>
  );
}