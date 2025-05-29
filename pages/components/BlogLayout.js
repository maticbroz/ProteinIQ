// Option 1: Using Next.js Image with explicit width/height (Recommended)
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { format } from 'date-fns';
import Image from 'next/image';

export default function BlogLayout({
  children,
  title,
  subtitle,
  author = 'ProteinIQ Team',
  publishedDate,
  featuredImage,
  excerpt,
}) {
  const formattedDate = publishedDate
    ? format(new Date(publishedDate), 'MMMM d, yyyy')
    : '';

  return (
    <div className="px-3 md:pl-8 md:pr-4">
      <Head>
        <title>{title} - ProteinIQ Blog</title>
        <meta
          name="description"
          content={excerpt || subtitle || 'Research insights from ProteinIQ'}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt || subtitle} />
        {featuredImage && <meta property="og:image" content={featuredImage} />}
        <meta property="og:type" content="article" />
        {publishedDate && (
          <meta property="article:published_time" content={publishedDate} />
        )}
        <meta property="article:author" content={author} />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <div className="bg-white rounded-lg border border-gray-200">
            <article className="max-w-5xl mx-auto">
              {/* Article Header */}
              <div className="px-5 lg:px-0 pt-12 lg:pt-24 border-gray-200">
                <div className="">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight max-w-4xl">
                    {title}
                  </h1>

                  {subtitle && (
                    <h2 className="text-xl md:text-2xl text-gray-600 mb-8 font-normal leading-tight max-w-4xl">
                      {subtitle}
                    </h2>
                  )}

                  <div className="flex justify-between space-x-4 text-sm text-gray-500 mb-8">
                    <span className="font-medium text-gray-700">{author}</span>
                    {publishedDate && (
                      <>
                        <time dateTime={publishedDate}>{formattedDate}</time>
                      </>
                    )}
                  </div>

                  {featuredImage && (
                    <div className="w-full mb-8">
                      <Image
                        src={featuredImage}
                        alt={title}
                        width={1024}
                        height={512}
                        className="w-full h-auto rounded-lg object-cover aspect-2/1"
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="px-6 pt-8">
                <div className="prose prose-lg max-w-[680px]">{children}</div>
              </div>

              {/* Article Footer */}
              <div className="px-6 py-8 border-t border-gray-200 bg-gray-50 mt-12">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>
                      Published by{' '}
                      <span className="font-medium text-gray-900">
                        {author}
                      </span>
                    </p>
                    {publishedDate && <p>{formattedDate}</p>}
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Share on Twitter"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          typeof window !== 'undefined'
                            ? window.location.href
                            : ''
                        )
                      }
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy link"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}