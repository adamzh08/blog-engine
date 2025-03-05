import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeAddClasses from 'rehype-add-classes'

import 'highlight.js/styles/atom-one-dark.css'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export async function markdownToHtml(markdown) {
  const result = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight) // <-- Add this plugin for syntax highlighting
    .use(rehypeAddClasses, {
      h1: 'text-2xl font-semibold tracking-tighter',
      h2: 'my-3 text-xl font-semibold tracking-tighter',
      h3: 'text-lg font-semibold tracking-tighter',
      h4: 'text-base font-semibold tracking-tighter',
      h5: 'text-sm font-semibold tracking-tighter',
      h6: 'text-xs font-semibold tracking-tighter',
      img: 'my-8',
      ol: 'mb-4 font-semibold list-decimal list-inside',
      ul: 'mb-4 list-disc list-inside',
      p: 'mb-4',
      code: 'bg-gray-100 text-red-600',
      hr: 'my-4',
      blockquote: 'border-l-4 border-gray-300 pl-4 italic my-4',
      pre: 'bg-gray-900 p-4 rounded my-4 overflow-x-auto',
    })
    
    .use(rehypeStringify)
    .process(markdown)
  return result.toString()
}
