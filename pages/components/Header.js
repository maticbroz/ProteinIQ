export default function Header() {
  return (
    <header className="">
      <nav className="">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              <a href="/">ProteinIQ</a>
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#"
                className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="/tools"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Tools
              </a>
              <a
                href="/blog"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Blog
              </a>
              <a
                href="/about"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
