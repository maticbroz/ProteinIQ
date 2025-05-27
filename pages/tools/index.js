import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout title="ProteinIQ Tools">
        <div className="relative pt-12 sm:pt-20 xl:py-40 max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold tracking-tight">
            Bioinformatics tools for researchers
          </h1>
          {/* ... rest of your content ... */}
        </div>
    </Layout>
  )
}