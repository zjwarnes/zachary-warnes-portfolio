'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CharacterDetectionDemo } from '@/app/components/projects/vision/CharacterDetectionDemo'

const experienceHighlights = [
  {
    title: "Geological Modelling & 3D CNN",
    description: "Researched and implemented 3D CNN models for state-of-the-art geological modelling, enabling advanced subsurface analysis and resource exploration.",
    icon: "🪨"
  },
  {
    title: "Medical Data Processing",
    description: "Established and monitored ETL pipelines processing terabytes of medical imaging data, ensuring high data quality for clinical analysis.",
    icon: "🏥"
  },
  {
    title: "Anomaly Detection Systems",
    description: "Built anomaly detection systems with real-time alerting to identify sensor issues and data quality problems in production environments.",
    icon: "⚠️"
  }
];

const projects = [
  {
    title: "3D Geological Modelling",
    description: "Implemented 3D CNN architectures for subsurface analysis, processing multi-dimensional geophysical data to identify geological formations and mineral deposits.",
    technologies: ["TensorFlow", "PyTorch", "NumPy", "Scikit-Image"],
    icon: "🗻"
  },
  {
    title: "ICU Discharge Prediction",
    description: "Fine-tuned medical discharge models achieving 5% performance improvement through advanced feature engineering and interpretability analysis on hospital patient data.",
    technologies: ["PyTorch", "Pandas", "Scikit-Learn", "SHAP"],
    icon: "🏥"
  },
  {
    title: "Real-time Anomaly Detection",
    description: "Designed and deployed production-grade anomaly detection systems for sensor data monitoring with containerized REST APIs enabling automated alerting.",
    technologies: ["Python", "FastAPI", "Docker", "Azure"],
    icon: "🔍"
  },
  {
    title: "Hospital Occupancy Planning",
    description: "Built predictive models to estimate patient capacity needs, enabling data-driven hospital resource planning and occupancy forecasting.",
    technologies: ["PyTorch", "SQL", "Tableau", "Azure ML"],
    icon: "📊"
  }
];

const techStack = [
  { name: "TensorFlow", category: "Deep Learning" },
  { name: "PyTorch", category: "Deep Learning" },
  { name: "OpenCV", category: "Computer Vision" },
  { name: "Scikit-Image", category: "Computer Vision" },
  { name: "NumPy & Pandas", category: "Data Processing" },
  { name: "YOLO", category: "Object Detection" },
  { name: "Vertex AI", category: "Cloud ML" },
  { name: "Azure ML", category: "Cloud ML" },
  { name: "FastAPI", category: "APIs" },
  { name: "Docker & Kubernetes", category: "Deployment" },
  { name: "SHAP", category: "Interpretability" },
  { name: "DVC", category: "Model Management" }
];

const skillsHighlights = [
  {
    title: "🎯 Object Detection & Segmentation",
    description: "Advanced computer vision models for detecting, classifying, and segmenting objects in images and video streams with production-grade accuracy."
  },
  {
    title: "🧠 Deep Learning Architectures",
    description: "Expertise in CNNs, RNNs, and specialized architectures (3D CNNs, Transformers) for diverse visual analysis tasks from 2D to volumetric data."
  },
  {
    title: "📊 Model Interpretability",
    description: "Advanced techniques for understanding model decisions including SHAP values, attention visualization, and feature importance analysis."
  },
  {
    title: "⚡ Production Deployment",
    description: "Experience containerizing models with Docker, deploying on cloud platforms (Azure, AWS, GCP), and optimizing for real-time inference."
  },
  {
    title: "🔄 End-to-End Pipelines",
    description: "Building complete ML pipelines from data collection and preprocessing through model training, evaluation, and deployment at scale."
  },
  {
    title: "📈 Performance Optimization",
    description: "Model compression, quantization, and edge deployment techniques for efficient inference on resource-constrained environments."
  }
];

export default function VisionPage() {
  const [activeApp, setActiveApp] = useState(0)
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-background-dark)] text-[var(--color-text-primary)]">
      {/* Header with back button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[var(--color-background-dark)] to-transparent pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mb-6">
            <span className="text-xl">←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Computer Vision
              <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Expertise & Projects
              </span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Deep learning for image analysis, object detection, and production-scale visual processing systems
            </p>
          </div>

          {/* Experience Highlights */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Experience Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experienceHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl hover:border-[var(--color-primary)] transition-all hover:scale-105"
                >
                  <div className="text-4xl mb-3">{highlight.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Key Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl hover:border-[var(--color-primary)] transition-all"
                >
                  <div className="text-3xl mb-3">{project.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-primary)] rounded text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Highlights */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Core Competencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillsHighlights.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl"
                >
                  <h3 className="text-lg font-bold mb-2">{skill.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group by category */}
              {['Deep Learning', 'Computer Vision', 'Data Processing', 'Cloud ML', 'APIs', 'Deployment', 'Interpretability', 'Model Management'].map((category) => {
                const categoryTechs = techStack.filter(t => t.category === category);
                return (
                  <div key={category} className="p-4 bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-lg">
                    <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-3 uppercase">{category}</h3>
                    <div className="space-y-2">
                      {categoryTechs.map((tech, i) => (
                        <div key={i} className="text-sm text-[var(--color-text-secondary)]">
                          • {tech.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Demo Section - Optional */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Interactive Demo</h2>
              <button
                onClick={() => setShowDemo(!showDemo)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${showDemo
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-background-card)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)]'
                  }`}
              >
                {showDemo ? 'Hide Demo' : 'Show Demo'}
              </button>
            </div>

            {showDemo && (
              <div className="bg-gradient-to-br from-[var(--color-background-card)] to-transparent border border-[var(--color-border-primary)] rounded-xl p-8 backdrop-blur-sm">
                <p className="text-[var(--color-text-secondary)] mb-6 text-sm">
                  Select a target character, start the demo, and watch the model detect characters in real-time.
                  Adjust detection and animation speeds to test performance under different conditions.
                </p>
                <CharacterDetectionDemo />
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 border border-purple-500/30 rounded-xl p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Build Vision Solutions?</h2>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-2xl mx-auto">
              Whether you need object detection, image analysis, or custom ML pipelines, I can design and deploy production-grade computer vision systems tailored to your challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-hover)] transition-all">
                Get In Touch
              </Link>
              <Link href="/" className="px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}