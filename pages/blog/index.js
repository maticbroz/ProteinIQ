import Layout from '../../pages/components/Layout';
import Link from 'next/link';
import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function BlogIndex({ posts }) {
  return (
    <Layout title="Blog - ProteinIQ">
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Research & Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Paper summaries, bioinformatics tutorials, and latest research
              insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {post.featuredImage && (
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {post.subtitle && (
                      <p className="text-gray-600 text-sm mb-3">
                        {post.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <span className="font-medium">{post.author}</span>
                    {post.publishedDate && (
                      <>
                        <span className="mx-2">•</span>
                        <time dateTime={post.publishedDate}>
                          {format(new Date(post.publishedDate), 'MMM d, yyyy')}
                        </time>
                      </>
                    )}
                  </div>

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600">
                Check back soon for research summaries and insights!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');

  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return { props: { posts: [] } };
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...data,
      };
    })
    .sort((a, b) => {
      if (a.publishedDate && b.publishedDate) {
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      }
      return 0;
    });

  return {
    props: {
      posts,
    },
  };
}
