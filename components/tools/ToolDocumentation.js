import { MDXRemote } from 'next-mdx-remote';

// Reusable MDX components for tool documentation
const mdxComponents = {
  // Callout component for tips, warnings, etc.
  Callout: ({ children, type = 'info' }) => (
    <div
      className={`p-4 rounded-lg border-l-4 my-6 ${
        type === 'warning'
          ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
          : type === 'error'
            ? 'bg-red-50 border-red-400 text-red-800'
            : type === 'success'
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-blue-50 border-blue-400 text-blue-800'
      }`}
    >
      {children}
    </div>
  ),

  // Code block with copy functionality
  CodeBlock: ({ children, language, title }) => (
    <div className="my-6">
      {title && (
        <div className="bg-gray-100 px-4 py-2 border-b text-sm font-medium text-gray-700">
          {title}
        </div>
      )}
      <pre
        className={`language-${language} bg-gray-900 text-gray-100 p-4 overflow-x-auto`}
      >
        <code>{children}</code>
      </pre>
    </div>
  ),

  // File format example
  FormatExample: ({ title, children }) => (
    <div className="my-6 border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b text-sm font-medium text-gray-700">
        {title}
      </div>
      <pre className="p-4 bg-white text-sm overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  ),
};

export default function ToolDocumentation({ mdxSource, frontMatter }) {
  if (!mdxSource) {
    return null;
  }

  return (
    <div className="my-16 pt-12">
      <div className="prose prose-lg max-w-3xl">
        {frontMatter?.title && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {frontMatter.title}
            </h2>
            {frontMatter?.description && (
              <p className="text-gray-600">{frontMatter.description}</p>
            )}
          </div>
        )}
        <MDXRemote {...mdxSource} components={mdxComponents} />
      </div>
    </div>
  );
}
