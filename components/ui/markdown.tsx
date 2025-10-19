import React from 'react'
import ReactMarkdown from 'react-markdown'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mt-3 mb-2 first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold mt-3 mb-1 first:mt-0" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 last:mb-0" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary/30 pl-3 italic my-2" {...props} />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
            ) : (
              <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto my-2" {...props} />
            ),
          pre: ({ node, ...props }) => (
            <pre className="bg-muted p-2 rounded overflow-x-auto my-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-t border-border my-3" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-border" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-muted" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-border" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-2 py-1 text-left text-xs font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-2 py-1 text-xs" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
