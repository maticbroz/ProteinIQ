export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Protein<span className="text-indigo-600">IQ</span>
            </h3>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <a
              href="/tools"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Tools
            </a>
            <a
              href="/blog"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Blog
            </a>
            <a
              href="/about"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              About
            </a>
            <a
              href="mailto:matic.broz@gmail.com"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 ProteinIQ. Making bioinformatics accessible to
            researchers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
