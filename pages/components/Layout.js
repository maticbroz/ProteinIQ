import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ 
  children, 
  title = 'ProteinIQ - Bioinformatics Tools for Researchers',
  description = 'Free bioinformatics tools for researchers. Convert FASTQ to FASTA, analyze protein sequences, and more. Browser-based tools with no installation required.'
}) {
  return (
    <div className="px-3 md:pl-8 md:pr-4">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://proteiniq.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* Add canonical URL */}
        <link rel="canonical" href="https://proteiniq.com" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="bg-white rounded-lg border border-gray-200">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}