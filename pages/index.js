import Layout from './components/Layout';

export default function Home() {
  return (
    <Layout title="Home - ProteinIQ">
      <div className="max-w-7xl mx-auto relative pt-12 sm:pt-20 xl:py-40">
        <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
          Bioinformatics tools for researchers
        </h1>
        {/* ... rest of your content ... */}
      </div>
    </Layout>
  );
}
