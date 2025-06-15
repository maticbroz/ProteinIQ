// pages/tools/index.js
import ToolsLayout from '../../components/tools/ToolsLayout';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toolSections } from '../../config/tools';

export default function ToolsIndex() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqItems = [
    {
      question: 'Are these tools free to use?',
      answer:
        'Yes, all our bioinformatics tools are completely free to use. We believe in making scientific tools accessible to researchers, students, and professionals worldwide.',
    },
    {
      question: 'Do I need to install any software?',
      answer:
        'No installation required! All tools run directly in your web browser using modern web technologies. Simply upload your files and get results instantly.',
    },
    {
      question: 'Is my data secure and private?',
      answer:
        "Absolutely. All processing happens locally in your browser - your data never leaves your computer. We don't store, track, or have access to any files you upload or process.",
    },
    {
      question: 'What file formats are supported?',
      answer:
        'We support all major bioinformatics file formats including FASTA, FASTQ, PDB, SDF, MOL2, CIF, and plain text. Check individual tool pages for specific format requirements.',
    },
    {
      question: 'Is there a file size limit?',
      answer:
        "File size limits depend on your browser's memory capacity. Most tools can handle files up to several hundred MB. For very large datasets, consider splitting them into smaller chunks.",
    },
    {
      question: 'Can I use these tools for commercial purposes?',
      answer:
        'Yes, our tools can be used for both academic and commercial research. However, please ensure you comply with any licensing requirements of the underlying algorithms or databases.',
    },
    {
      question: 'How accurate are the conversion results?',
      answer:
        'Our tools use well-established algorithms and standards for each conversion type. However, always validate critical results with additional tools or manual inspection for important research.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <ToolsLayout title="Bioinformatics tools | ProteinIQ">
      <div className="py-12">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6 tracking-tight">
              Bioinformatics tools
            </h1>
            <p className="text-lg text-gray-600 mx-auto">
              Powerful, easy-to-use tools for sequence analysis, structure
              prediction, and bioinformatics research. All tools run directly in
              your browser—no installation required.
            </p>
          </header>

          {/* Tools Sections */}
          <div className="space-y-12 mb-16">
            {toolSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600">{section.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {section.tools.map((tool, index) => {
                    const IconComponent = tool.icon;

                    return (
                      <Link key={index} href={tool.href} className="">
                        <div className="flex flex-row gap-4 items-start py-2 px-2 rounded-lg bg-gray-100 hover:bg-indigo-200/75 -hover:rounded-2xl transition-all duration-300">
                          <div className="font-semibold text-center bg-white text-xs mt-1 p-1 aspect-square border rounded-lg border-gray-200 flex items-center justify-center w-12 h-12 text-indigo-500">
                            <IconComponent size={24} strokeWidth={1.5} />
                          </div>

                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {tool.title}
                            </h3>

                            <p className="text-gray-500 text-sm leading-tight">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="border-t border-gray-200 pt-12">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Frequently asked questions
              </h2>
              <p className="text-gray-600">
                Common questions about our bioinformatics tools and platform.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {openFAQ === index && (
                    <div className="px-6 pb-4">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolsLayout>
  );
}
