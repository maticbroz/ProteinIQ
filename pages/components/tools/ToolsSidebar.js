import Link from 'next/link';
import { useRouter } from 'next/router';

const tools = [
  {
    name: 'FASTQ to FASTA',
    url: '/tools/fastq-to-fasta',
    status: 'available',
  },
  {
    name: 'TXT to FASTA',
    url: '/tools/txt-to-fasta',
    status: 'available',
  },
    {
    name: 'SDF to PDB',
    url: '/tools/sdf-to-pdb',
    status: 'available',
  },
  {
    name: 'PDB to FASTA',
    url: '/tools/pdb-to-fasta',
    status: 'available',
  },
  {
    name: 'Sequence to FASTA',
    url: '/tools/sequence-to-fasta',
    status: 'coming-soon',
  },
  {
    name: 'CIF to PDB',
    url: '/tools/cif-to-pdb',
    status: 'coming-soon',
  },
  {
    name: 'PDB to CIF',
    url: '/tools/pdb-to-cif',
    status: 'coming-soon',
  },
];

export default function ToolsSidebar() {
  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <div className=" w-64 h-full pr-3">
      <div className="py-6 sticky top-0">
        <h2 className="text-sm uppercase tracking-wider font-bold text-gray-800 mb-6">
          Converters
        </h2>

        <nav className="flex flex-col space-y-1">
          {tools.map((tool) => {
            const isActive = currentPath === tool.url;
            const isAvailable = tool.status === 'available';

            const content = (
              <div
                className={`
                flex items-center px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-200
                ${
                  isActive
                    ? 'bg-gray-200 font-semibold'
                    : isAvailable
                      ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium'
                      : 'text-gray-400 cursor-not-allowed'
                }
              `}
              >
                <span className="flex-1">{tool.name}</span>
                {tool.status === 'coming-soon' && (
                  <span className="text-xs bg-indigo-100 text-indigo-600 font-medium px-2 py-1 rounded-full ml-2">
                    Soon
                  </span>
                )}
              </div>
            );

            if (isAvailable) {
              return (
                <Link key={tool.url} href={tool.url}>
                  {content}
                </Link>
              );
            } else {
              return <div key={tool.url}>{content}</div>;
            }
          })}
        </nav>
      </div>
    </div>
  );
}
