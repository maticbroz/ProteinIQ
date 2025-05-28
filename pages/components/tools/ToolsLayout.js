import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import ToolsSidebar from './ToolsSidebar';

export default function ToolsLayout({
  children,
  title = 'Tools - ProteinIQ',
  showSidebar = true,
  h1,
  subtitle,
}) {
  return (
    <div className="px-3 md:pl-8 md:pr-4">
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Bioinformatics tools for researchers"
        />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-grow flex">
          {showSidebar && (
            <div className="">
              <ToolsSidebar />
            </div>
          )}

          <main className="flex-1 bg-white rounded-lg border border-gray-200">
            <header className="text-center mt-16 mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{h1}</h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                {subtitle}
              </p>
            </header>
            <div className="pb-12 px-6">
              <div className="max-w-4xl mx-auto">{children}</div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
