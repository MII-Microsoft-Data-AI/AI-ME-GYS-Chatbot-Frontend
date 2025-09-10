'use client'

import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock, { InlineCode } from './CodeBlock'

interface MarkdownContentProps {
  content: string
  className?: string
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const components: Components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      // Check if this is a code block (has language class and contains newlines)
      const isCodeBlock = match && String(children).includes('\n')

      return isCodeBlock ? (
        <CodeBlock
          language={match[1]}
          className={className}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </CodeBlock>
      ) : (
        <InlineCode className={className} {...props}>
          {children}
        </InlineCode>
      )
    },
    pre: ({ children }) => <>{children}</>,
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded-t-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 rounded-t-lg">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-whitedivide-y divide-gray-700 rounded-b-lg">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-gray-50 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-gray-900">
        {children}
      </td>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-900mb-4 mt-2 ">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-gray-900mb-3 mt-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium text-gray-900mb-2 mt-2">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-medium text-gray-900mb-2 mt-2">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-base font-medium text-gray-900mb-2 mt-2">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-medium text-gray-600mb-2 mt-2">
        {children}
      </h6>
    ),
    ul: ({ children }) => <ul className="list-disc ml-4">{children}</ul>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    hr: () => <hr className="my-4 border-gray-300 w-min" />,
  }

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}