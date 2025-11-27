import { Container } from '@/app/components/container'
import ProjectLayout from '@/app/components/project-layout'
import { ProjectDescription } from '@/app/components/projects/project-description'
import { MachineLearningContent } from './content'

const coreProjects = [
  {
    title: "Medical Discharge Prediction",
    description: "Fine-tuned ICU discharge models through advanced feature engineering and interpretability analysis, achieving 5% performance improvement on hospital patient data.",
    impact: "Improves patient outcome predictions and enables better resource allocation in healthcare settings, supporting 6,000+ beds monitored.",
    technologies: ["PyTorch", "SHAP", "Feature Engineering", "Medical Data"],
    icon: "🏥"
  },
  {
    title: "3D Geological Modelling with CNNs",
    description: "Researched and implemented 3D CNN architectures for subsurface analysis, processing multi-dimensional geophysical data to identify geological formations.",
    impact: "Enables advanced subsurface modeling for mineral exploration and resource estimation with state-of-the-art accuracy.",
    technologies: ["TensorFlow", "3D CNN", "NumPy", "Scikit-Image"],
    icon: "🗻"
  },
  {
    title: "Real-time Anomaly Detection",
    description: "Designed production-grade anomaly detection systems for sensor data monitoring with containerized REST APIs and automated alerting.",
    impact: "Proactively identifies data quality issues and sensor failures, enabling rapid response and preventing downstream cascading failures.",
    technologies: ["Python", "FastAPI", "Docker", "Azure"],
    icon: "⚠️"
  }
];

const modelingTechniques = [
  {
    name: "Deep Learning Architectures",
    items: ["CNNs (2D & 3D)", "RNNs & LSTMs", "Transformer Architectures", "Ensemble Methods"]
  },
  {
    name: "Core Frameworks",
    items: ["TensorFlow", "PyTorch", "Scikit-Learn", "XGBoost"]
  },
  {
    name: "Data & Features",
    items: ["Pandas", "NumPy", "Feature Engineering", "Data Version Control (DVC)"]
  },
  {
    name: "Interpretability & Evaluation",
    items: ["SHAP Values", "Attention Visualization", "Cross-validation", "Hyperparameter Tuning (Optuna)"]
  },
  {
    name: "Optimization & Deployment",
    items: ["TensorFlow Lite", "Model Compression", "Quantization", "Edge Deployment"]
  },
  {
    name: "Cloud & MLOps",
    items: ["Azure ML", "Vertex AI", "MLflow", "Experiment Tracking"]
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
    <Container>
      <ProjectLayout
        demo={
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Advanced Predictive Models
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                Building state-of-the-art machine learning systems with rigorous evaluation and production-grade reliability.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {competencies.map((comp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[var(--color-primary)]">✓</span>
                    <span className="text-[var(--color-text-secondary)]">{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <MachineLearningContent coreProjects={coreProjects} modelingTechniques={modelingTechniques} />
      </ProjectLayout>
    </Container>
  );
}