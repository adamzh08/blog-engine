import { notFound } from 'next/navigation'
import { getBlogPosts, markdownToHtml } from '../utils'

export default async function Page({ params }: {
  params: { slug: string }
}) {
  const { slug } = await params

  const posts = getBlogPosts()
  const post = posts.find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  const content = await markdownToHtml(post.content)

  return (
    <article className="prose dark:prose-invert">
      <h1 className='text-3xl font-semibold tracking-tighter'>{post.metadata.title}</h1>
      <div 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </article>
  )
}