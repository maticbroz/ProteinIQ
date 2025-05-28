import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import ToolsSidebar from './ToolsSidebar';

export default function ToolsLayout({
  children,
  title = 'Tools - ProteinIQ',
  showSidebar = true,
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
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
