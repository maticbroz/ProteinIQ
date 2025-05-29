import Layout from './components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: '🧬',
      title: 'Sequence Conversion',
      description:
        'Convert between FASTQ, FASTA, and other sequence formats instantly',
      link: '/tools/fastq-to-fasta',
    },
    {
      icon: '🧪',
      title: 'Structure Prediction',
      description:
        'Predict protein structures from sequences using advanced algorithms',
      link: '/tools',
      comingSoon: true,
    },
    {
      icon: '📊',
      title: 'Sequence Analysis',
      description:
        'Analyze protein sequences for domains, properties, and functions',
      link: '/tools',
      comingSoon: true,
    },
    {
      icon: '🔬',
      title: 'Research Insights',
      description:
        'Stay updated with the latest computational biology breakthroughs',
      link: '/blog',
    },
  ];

  const testimonials = [
    {
      text: "ProteinIQ's tools have streamlined our research workflow significantly. The browser-based approach means no installation headaches.",
      author: 'Dr. Sarah Chen',
      role: 'Computational Biologist, Stanford University',
    },
    {
      text: 'Finally, bioinformatics tools that just work. The FASTQ to FASTA converter has saved me hours of processing time.',
      author: 'Prof. Michael Rodriguez',
      role: 'Structural Biology Lab, MIT',
    },
    {
      text: 'The research summaries are incredibly valuable for staying current with protein folding advances. Highly recommended.',
      author: 'Dr. Emily Watson',
      role: 'Biochemistry Researcher, Cambridge',
    },
  ];

  return (
    <Layout
      title="ProteinIQ - Bioinformatics Tools for Researchers"
      description="Free bioinformatics tools for researchers. Convert FASTQ to FASTA, analyze protein sequences, and stay updated with cutting-edge research. Browser-based tools with no installation required."
    >
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-sm font-medium text-indigo-700 mb-8">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
              New: Hybrid AI system beats AlphaFold
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 mb-8 tracking-tighter">
              Bioinformatics tools
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                for researchers
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl leading-relaxed">
              Free, browser-based tools for sequence analysis, format
              conversion, and protein research. No installation required,
              complete privacy guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center px-6 py-3.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Explore tools
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border-2 text-indigo-600 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Research blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className=" mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything you need for bioinformatics research
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              Powerful tools designed by researchers, for researchers. All
              processing happens in your browser for maximum privacy and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-indigo-200 relative overflow-hidden"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  href={feature.link}
                  className={`inline-flex items-center font-medium transition-colors ${
                    feature.comingSoon
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  {feature.comingSoon ? 'Coming Soon' : 'Try it now'}
                  {!feature.comingSoon && (
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  )}
                </Link>

                {feature.comingSoon && (
                  <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                    Soon
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for modern research workflows
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our tools are designed with the modern researcher in mind. No
                more complex installations, command-line interfaces, or data
                privacy concerns. Just powerful, reliable tools that work
                instantly.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Privacy First
                    </h3>
                    <p className="text-gray-600">
                      All processing happens locally in your browser. Your data
                      never leaves your device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-indigo-600"
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Lightning Fast
                    </h3>
                    <p className="text-gray-600">
                      No server delays or upload times. Results appear instantly
                      as you work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-purple-600"
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Easy to Use
                    </h3>
                    <p className="text-gray-600">
                      Intuitive interfaces designed for both beginners and
                      expert researchers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      FASTQ to FASTA Converter
                    </h4>
                    <span className="text-green-600 text-sm font-medium">
                      Live Tool
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-600">
                      @SEQ_ID_1
                      <br />
                      GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT
                      <br />
                      +<br />
                      !''*((((***+))%%%++)(%%%%).1***-+*''))**55CCFCCCCCCC65
                    </div>
                    <div className="">
                      <div className="inline-flex items-center text-indigo-600">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                        Converting...
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 font-mono text-sm text-gray-700">
                      SEQ_ID_1
                      <br />
                      GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="px-6 py-20 bg-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className=" mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Stay ahead of the research curve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              Get insights from the latest computational biology papers,
              explained clearly with practical implications for your research.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <div className="text-sm text-indigo-600 font-medium mb-2">
                  Latest research
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Hybrid AI system beats AlphaFold at predicting complex protein
                  structures
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  D-I-TASSER combines deep learning with physics-based
                  simulations to achieve superior accuracy on difficult proteins
                  and multi-domain structures.
                </p>
                <Link
                  href="/blog/hybrid-ai-system-beats-alphafold-protein-structure-prediction"
                  className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Read the summary
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 lg:p-12 text-white">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-50 rounded-full"></div>
                    <span className="text-sm font-medium">
                      29.2% higher accuracy than AlphaFold2
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-50 rounded-full"></div>
                    <span className="text-sm font-medium">
                      Excels at multi-domain proteins
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-50 rounded-full"></div>
                    <span className="text-sm font-medium">
                      Physics + AI hybrid approach
                    </span>
                  </div>
                  <div className="mt-8 p-4 bg-white/10 rounded-lg">
                    <div className="text-sm opacity-90 mb-2">Published in</div>
                    <div className="font-semibold">Nature Biotechnology</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 hidden">
        <div className="max-w-6xl mx-auto">
          <div className=" mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by researchers worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of researchers who rely on ProteinIQ for their
              bioinformatics workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gray-900 text-white hidden">
        <div className="max-w-4xl mx-auto ">
          <h2 className="text-4xl font-bold mb-6">
            Ready to accelerate your research?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of researchers using ProteinIQ's tools to streamline
            their bioinformatics workflows. Start using our tools today – no
            registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/tools"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Start Using Tools
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-gray-500 hover:text-white transition-all duration-200"
            >
              Learn More About ProteinIQ
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
