import ToolsLayout from '../components/tools/ToolsLayout';
import Link from 'next/link';

export default function ToolsIndex() {
  const tools = [
    {
      title: 'FASTQ to FASTA',
      description: 'Convert FASTQ sequence files to FASTA format.',
      href: '/tools/fastq-to-fasta',
      icon: '🧬',
      status: 'available',
      features: [
        'File upload support',
        'Drag & drop interface',
        'Copy/download output',
      ],
    },
  ];

  return (
    <ToolsLayout title="Bioinformatics Tools - ProteinIQ">
      <div className="py-12">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
              Bioinformatics tools
            </h1>
            <p className="text-lg text-gray-600 mx-auto">
              Powerful, easy-to-use tools for sequence analysis, structure
              prediction, and bioinformatics research. All tools run directly in
              your browser - no installation required.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
            {tools.map((tool, index) => (
              <Link href={tool.href} className="">
                <div
                  key={index}
                  className="flex flex-row gap-4 items-start py-2 px-2 rounded-lg bg-neutral-100 hover:bg-indigo-200/75 hover:rounded-2xl transition transition-all duration-300"
                >
                  <div className="bg-gradient-to-bl from-white/50 to-gray-50 text-2xl mt-1 p-1 aspect-square border rounded-lg border-gray-200 leading-0 flex items-center">
                    {tool.icon}
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      {tool.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm leading-tight">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
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
    </ToolsLayout>
  );
}
