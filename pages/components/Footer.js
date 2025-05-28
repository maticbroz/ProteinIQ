export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ProteinIQ</h3>
            <p className="text-gray-600">
              Making bioinformatics accessible to everyone.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a
                  href="/tools/fasta-to-pdb"
                  className="hover:text-blue-600 hover:underline"
                >
                  FASTA to PDB
                </a>
              </li>
              <li>
                <a
                  href="/tools/protein-analyzer"
                  className="hover:text-blue-600 hover:underline"
                >
                  Protein Analyzer
                </a>
              </li>
              <li>
                <a
                  href="/tools/visualizer"
                  className="hover:text-blue-600 hover:underline"
                >
                  Data Visualizer
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/blog" className="hover:text-blue-600 hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-blue-600 hover:underline">
                  Help
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-blue-600 hover:underline"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Questions? Reach out to us.</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ProteinIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
