import Layout from './components/Layout';

export default function Home() {
  return (
    <Layout title="Home - ProteinIQ">
      <div className="text-center relative pt-12 sm:pt-20 xl:py-40">
        <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
          Bioinformatics tools for researchers
        </h1>
        {/* ... rest of your content ... */}
      </div>
    </Layout>
  );
}
