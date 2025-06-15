import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import ToolsSidebar from './ToolsSidebar';
import ToolFeedback from './ToolFeedback';

export default function ToolsLayout({
  children,
  title = 'Tools - ProteinIQ',
  description = 'Bioinformatics tools for researchers',
  showSidebar = true,
  showFeedback = true,
  h1,
  subtitle,
}) {
  // Extract tool name from title for feedback component
  const toolName = title.replace(' | ProteinIQ', '').replace('Tools - ', '');

  return (
    <div className="px-3 md:pl-8 md:pr-4">
      <Head>
        <title>{`${title} | ProteinIQ`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-grow lg:flex">
          {showSidebar && (
            <div className="hidden lg:block">
              <ToolsSidebar />
            </div>
          )}

          <main className="flex-1 bg-white rounded-lg border border-gray-200">
            <header className="mt-16 mb-12 max-w-5xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {h1}
              </h1>
              <p className="text-md text-gray-600 max-w-2xl">{subtitle}</p>
            </header>
            <div className="pb-12 px-6">
              <div className="max-w-5xl mx-auto">
                {children}

                {/* Add feedback component at the end */}
                {showFeedback && <ToolFeedback toolName={toolName} />}
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
