import Link from 'next/link';
import { useRouter } from 'next/router';

const tools = [
  {
    name: 'FASTQ to FASTA',
    href: '/tools/fastq-to-fasta',
    icon: '🧬',
    status: 'available',
    description: 'Convert FASTQ to FASTA format',
  },
  {
    name: 'FASTA to PDB',
    href: '/tools/fasta-to-pdb',
    icon: '🧪',
    status: 'coming-soon',
    description: 'Predict protein structures',
  },
  {
    name: 'PDB to FASTA',
    href: '/tools/pdb-to-fasta',
    icon: '🔬',
    status: 'coming-soon',
    description: 'Extract sequences from PDB',
  },
  {
    name: 'Protein Analyzer',
    href: '/tools/protein-analyzer',
    icon: '⚗️',
    status: 'coming-soon',
    description: 'Analyze protein sequences',
  },
  {
    name: 'Multiple Sequence Alignment',
    href: '/tools/msa',
    icon: '📊',
    status: 'coming-soon',
    description: 'Align multiple sequences',
  },
  {
    name: 'Phylogenetic Tree',
    href: '/tools/phylogenetic-tree',
    icon: '🌳',
    status: 'coming-soon',
    description: 'Build evolutionary trees',
  },
  {
    name: 'Primer Design',
    href: '/tools/primer-design',
    icon: '🎯',
    status: 'coming-soon',
    description: 'Design PCR primers',
  },
  {
    name: 'ORF Finder',
    href: '/tools/orf-finder',
    icon: '🔍',
    status: 'coming-soon',
    description: 'Find open reading frames',
  },
];

export default function ToolsSidebar({ isOpen, onClose }) {
  const router = useRouter();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-auto lg:z-auto
        w-72 lg:w-64 xl:w-72
      `}
      >
        <div className="p-6 border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Tools</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="hidden lg:block mb-6">
            <Link
              href="/tools"
              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
            >
              🛠️ Tools
            </Link>
          </div>

          <nav className="space-y-1">
            {tools.map((tool) => {
              const isActive = router.pathname === tool.href;
              const isAvailable = tool.status === 'available';

              return (
                <div key={tool.href}>
                  {isAvailable ? (
                    <Link
                      href={tool.href}
                      className={`
                        flex items-start p-3 rounded-lg text-sm transition-colors
                        ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="text-lg mr-3 flex-shrink-0">
                        {tool.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{tool.name}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {tool.description}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-start p-3 rounded-lg text-sm opacity-60 cursor-not-allowed">
                      <span className="text-lg mr-3 flex-shrink-0">
                        {tool.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{tool.name}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {tool.description}
                        </div>
                        <div className="text-xs text-amber-600 font-medium mt-1">
                          Coming Soon
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
              Quick Links
            </div>
            <div className="space-y-2">
              <Link
                href="/blog"
                className="block text-sm text-gray-600 hover:text-blue-600 py-1"
              >
                📖 Research Blog
              </Link>
              <Link
                href="/about"
                className="block text-sm text-gray-600 hover:text-blue-600 py-1"
              >
                ℹ️ About ProteinIQ
              </Link>
              <a
                href="mailto:hello@proteiniq.com"
                className="block text-sm text-gray-600 hover:text-blue-600 py-1"
              >
                ✉️ Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
