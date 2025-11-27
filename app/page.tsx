'use client'

import { ParticleBackground } from './components/particle-background'
import { ProjectWidget } from './components/projects/project-widget'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[var(--color-background-dark)]">
      {/* Particle background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl w-full text-center overflow-hidden">
            {/* Animated gradient text */}
            <div className="mb-6">
              <p className="text-lg md:text-xl text-[var(--color-primary)] font-semibold mb-4 tracking-wide">
                Hi, I'm Zachary Warnes
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight tracking-normal">
                AI & Machine Learning
                <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Engineer
                </span>
              </h1>
            </div>

            {/* Hero statement */}
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
              Building intelligent systems that transform data into actionable insights.
              Specializing in LLMs, Computer Vision, and Predictive Analytics with 6+ years of experience.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="#projects"
                className="px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="px-8 py-3 rounded-lg border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 text-center">
              Experience
            </h2>
            <p className="text-[var(--color-text-secondary)] text-center mb-16 max-w-2xl mx-auto">
              Explore my experience across different domains of LLMs, Data Engineering, and Machine Learning.
            </p>

            {/* Project widgets grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProjectWidget
                title="LLMs & RAG"
                description="Enterprise-scale LLM applications and Retrieval-Augmented Generation systems for semantic search and knowledge retrieval."
                href="/projects/llm"
                icon="🤖"
                color="from-indigo-500 to-blue-500"
              />
              <ProjectWidget
                title="Data Engineering"
                description="Scalable data pipelines, event-driven architectures, and cloud-based ETL systems processing terabytes of data."
                href="/projects/data-engineering"
                icon="⚙️"
                color="from-emerald-500 to-teal-500"
              />
              <ProjectWidget
                title="Machine Learning"
                description="Deep learning architectures, predictive models, and production ML systems with advanced interpretability techniques."
                href="/projects/machine-learning"
                icon="🧠"
                color="from-cyan-500 to-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
              Let's Connect
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-12">
              Interested in collaborating or want to discuss AI solutions for your project?
              Feel free to reach out!
            </p>

            {/* Contact links */}
            <div className="p-8 rounded-xl border border-[var(--color-border-primary)] bg-gradient-to-br from-[var(--color-background-card)] to-transparent backdrop-blur-sm">
              <p className="text-[var(--color-text-secondary)] mb-6">
                Get in touch through any of these channels:
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a
                  href="mailto:zjwarnes@gmail.com"
                  className="px-6 py-2 rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                >
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/zjwarnes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/zjwarnes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-[var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
