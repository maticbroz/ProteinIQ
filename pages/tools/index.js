import Layout from '../components/Layout';
import Link from 'next/link';

export default function ToolsIndex() {
  const tools = [
    {
      title: 'FASTQ to FASTA Converter',
      description:
        'Convert FASTQ sequence files to FASTA format. Perfect for preparing sequencing data for downstream analysis.',
      href: '/tools/fastq-to-fasta',
      icon: '🧬',
      status: 'available',
      features: [
        'File upload support',
        'Drag & drop interface',
        'Copy/download output',
      ],
    },
    {
      title: 'FASTA to PDB Structure Prediction',
      description:
        'Predict protein structures from FASTA sequences using advanced algorithms.',
      href: '/tools/fasta-to-pdb',
      icon: '🧪',
      status: 'coming-soon',
      features: [
        'AlphaFold integration',
        '3D visualization',
        'Confidence scoring',
      ],
    },
    {
      title: 'Protein Sequence Analyzer',
      description:
        'Analyze protein sequences for properties, domains, and functional predictions.',
      href: '/tools/protein-analyzer',
      icon: '⚗️',
      status: 'coming-soon',
      features: [
        'Domain detection',
        'Property analysis',
        'Functional annotation',
      ],
    },
    {
      title: 'Multiple Sequence Alignment',
      description:
        'Align multiple sequences to identify conserved regions and evolutionary relationships.',
      href: '/tools/msa',
      icon: '📊',
      status: 'coming-soon',
      features: [
        'ClustalW algorithm',
        'Phylogenetic trees',
        'Conservation scoring',
      ],
    },
  ];

  return (
    <Layout title="Bioinformatics Tools - ProteinIQ">
      <div className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Bioinformatics Tools
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Powerful, easy-to-use tools for sequence analysis, structure
              prediction, and bioinformatics research. All tools run directly in
              your browser - no installation required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border-2 p-8 transition-all duration-200 ${
                  tool.status === 'available'
                    ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer'
                    : 'border-gray-100 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{tool.icon}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tool.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {tool.status === 'available' ? 'Available' : 'Coming Soon'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {tool.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Features:
                  </h4>
                  <ul className="space-y-1">
                    {tool.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {tool.status === 'available' ? (
                  <Link
                    href={tool.href}
                    className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Open Tool
                    <svg
                      className="w-4 h-4 ml-2"
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
                ) : (
                  <div className="inline-flex items-center justify-center w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
                    Coming Soon
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose ProteinIQ Tools?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fast & Efficient
                </h3>
                <p className="text-gray-600 text-sm">
                  All processing happens in your browser for instant results
                  with no server delays.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Private & Secure
                </h3>
                <p className="text-gray-600 text-sm">
                  Your data never leaves your device. Complete privacy and
                  security guaranteed.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Easy to Use
                </h3>
                <p className="text-gray-600 text-sm">
                  Intuitive interfaces designed for both beginners and expert
                  researchers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
