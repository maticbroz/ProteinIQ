// components/tools/ToolsSidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toolSections } from '../../../config/tools';

export default function ToolsSidebar() {
  const router = useRouter();
  const currentPath = router.asPath;

  // Helper function to clean section titles
  const cleanSectionTitle = (title) => {
    return title
      .replace(/\b(converters?|analysis|tools?)\b/gi, '') // Remove these words
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
  };

  return (
    <div className="w-64 h-full pr-3">
      <div className="py-6 sticky top-0">
        <nav className="flex flex-col space-y-6">
          {toolSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className=" font-semibold text-gray-800 mb-2">
                {cleanSectionTitle(section.title)}
              </div>

              <div className="flex flex-col space-y-1">
                {section.tools.map((tool) => {
                  const isActive = currentPath === tool.url;

                  const content = (
                    <div
                      className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-200
                      ${
                        isActive
                          ? 'bg-gray-200 font-semibold hover:bg-gray-100 hover:text-gray-900 font-medium'
                          : ''
                      }
                    `}
                    >
                      <span className="flex-1">{tool.name}</span>
                    </div>
                  );

                  return (
                    <Link key={tool.url} href={tool.url}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
