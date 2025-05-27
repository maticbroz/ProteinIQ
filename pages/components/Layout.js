// components/Layout.js
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'


export default function Layout({ children, title = 'ProteinIQ' }) {
  return (
    // Apply inter.className to your root layout element.
    // This will set the font-family for all children to var(--font-inter)
    // and handle all font loading and fallback logic.
    <div className={`px-3 md:pl-8 md:pr-4` }>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Bioinformatics tools" />

        
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="bg-white rounded-lg border border-gray-200 pl-6 md:pl-8 pr-4">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}