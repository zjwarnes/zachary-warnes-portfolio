export const baseUrl = 'https://portfolio-blog-starter.vercel.app'

export default async function sitemap() {
  const routes = ['', '/projects/llm', '/projects/vision', '/projects/prediction'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes]
}
