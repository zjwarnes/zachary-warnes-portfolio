import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`I am a data professional with six years of experience architecting and deploying AI models
         for innovative companies using novel technologies. Currently, I work as a Data Engineer, 
         where I develop advanced AI models and scalable data pipelines. 
         My expertise includes building RAG GPT-based LLM models, implementing MLOps pipelines, 
         and developing event-driven data pipelines and monitoring dashboards. 
         I hold an MSc in Data Science from Maastricht University and a 
         BSc in Computer Science and Mathematics from McGill University.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
