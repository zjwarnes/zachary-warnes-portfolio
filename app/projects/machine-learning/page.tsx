'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/app/components/container'
import ProjectLayout from '@/app/components/project-layout'
import { ProjectDescription } from '@/app/components/projects/project-description'

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
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

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
        <div className="space-y-8">
          <div>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
              Machine Learning Expertise
            </h1>
            <ProjectDescription
              paragraphs={[
                "With an MSc in Data Science and 6+ years of industry experience, I specialize in building advanced machine learning systems that solve real-world problems. From fine-tuning medical prediction models at Pacmed to implementing cutting-edge 3D CNNs for geological modeling at Ideon, I combine theoretical rigor with practical deployment expertise.",
                "My focus is on creating models that are not only accurate but also interpretable, maintainable, and production-ready. I approach each project with attention to rigorous evaluation, hyperparameter optimization, and understanding the business impact."
              ]}
            />
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-4 tracking-tighter">
              What I Offer
            </h2>
            <div className="space-y-3">
              {coreProjects.map((project, index) => (
                <div
                  key={index}
                  className="p-4 bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded-lg hover:border-[var(--color-primary)] transition-all cursor-pointer"
                  onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl flex-shrink-0">{project.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    {project.description}
                  </p>
                  {expandedProject === index && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border-primary)] space-y-2">
                      <p className="text-sm text-[var(--color-primary)] font-medium">
                        Impact: {project.impact}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-primary)] rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-4 tracking-tighter">
              Technical Stack
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {modelingTechniques.map((category, index) => (
                <div
                  key={index}
                  className="p-4 bg-[var(--color-background-card)] border border-[var(--color-border-primary)] rounded-lg"
                >
                  <h3 className="font-semibold text-[var(--color-primary)] mb-2 text-sm uppercase">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[var(--color-border-primary)] text-[var(--color-text-secondary)] rounded text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-4 tracking-tighter">
              Education & Achievements
            </h2>
            <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <div>
                <p className="font-semibold text-[var(--color-text-primary)] mb-1">Education</p>
                <p>MSc in Data Science – Maastricht University, Netherlands</p>
                <p>BSc in Computer Science and Mathematics – McGill University, Canada</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)] mb-1">Recognition</p>
                <p>• 250,000+ views on data science articles</p>
                <p>• Presented at 2020 EDM Conference: "Course Recommender Systems with Statistical Confidence"</p>
                <p>• Completed 25+ online courses in ML, DL, and MLOps</p>
              </div>
            </div>
          </div>
        </div>
      </ProjectLayout>
    </Container>
  );
}