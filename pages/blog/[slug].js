import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import BlogLayout from '../../pages/components/BlogLayout';

// MDX components - you can add custom components here
const components = {
  // Example: custom callout component
  Callout: ({ children, type = 'info' }) => (
    <div
      className={`p-4 rounded-lg border-l-4 my-6 ${
        type === 'warning'
          ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
          : type === 'error'
            ? 'bg-red-50 border-red-400 text-red-800'
            : 'bg-blue-50 border-blue-400 text-blue-800'
      }`}
    >
      {children}
    </div>
  ),

  // Example: research citation component
  Citation: ({ authors, title, journal, year, doi }) => (
    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400 my-6">
      <p className="text-sm">
        <strong>{authors}</strong> ({year}). {title}. <em>{journal}</em>.
        {doi && (
          <>
            {' '}
            DOI:{' '}
            <a
              href={`https://doi.org/${doi}`}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {doi}
            </a>
          </>
        )}
      </p>
    </div>
  ),
};

export default function BlogPost({ source, frontMatter }) {
  return (
    <BlogLayout
      title={frontMatter.title}
      subtitle={frontMatter.subtitle}
      author={frontMatter.author}
      publishedDate={frontMatter.publishedDate}
      featuredImage={frontMatter.featuredImage}
      excerpt={frontMatter.excerpt}
    >
      <MDXRemote {...source} components={components} />
    </BlogLayout>
  );
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');

  if (!fs.existsSync(postsDirectory)) {
    return { paths: [], fallback: false };
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const paths = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => ({
      params: {
        slug: fileName.replace(/\.mdx$/, ''),
      },
    }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const fullPath = path.join(
    process.cwd(),
    'content/blog',
    `${params.slug}.mdx`
  );
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
}
