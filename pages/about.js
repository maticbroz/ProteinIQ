import Layout from './components/Layout';
import Image from 'next/image';

export default function About() {
  return (
    <Layout title="About - ProteinIQ">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              About ProteinIQ
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Making bioinformatics tools accessible to researchers everywhere
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Origin Story */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                The Story Behind ProteinIQ
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  ProteinIQ was born out of necessity during my PhD studies in
                  computational biochemistry. As a researcher, I frequently
                  encountered situations where I needed simple, reliable
                  bioinformatics tools that were either unavailable, overly
                  complex, or scattered across different platforms.
                </p>
                <p>
                  Rather than accepting these limitations, I decided to build
                  the tools I wished I had during my research. ProteinIQ
                  represents a collection of practical, browser-based
                  bioinformatics utilities designed to streamline common
                  research workflows.
                </p>
              </div>
            </section>

            {/* About Me */}
            <section className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                About the Creator
              </h2>
              <div className="md:flex md:items-start md:space-x-8">
                <div className="md:flex-shrink-0 mb-6 md:mb-0">
                  {/* Placeholder for profile image - replace with actual photo */}
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto md:mx-0">
                    <span className="text-2xl font-bold text-blue-600">MB</span>
                  </div>
                </div>
                <div className="prose prose-lg text-gray-700">
                  <p>
                    Hi, I'm <strong>Matic Broz</strong>, and I recently
                    completed my PhD in computational biochemistry. My research
                    focused on understanding complex biological systems through
                    computational approaches, which gave me deep insights into
                    both the power and limitations of current bioinformatics
                    tools.
                  </p>
                  <p>
                    Through ProteinIQ, I'm sharing the tools and knowledge I've
                    developed to help other researchers overcome similar
                    challenges in their work.
                  </p>
                </div>
              </div>
            </section>

            {/* Mission & Vision */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Mission & Vision
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-3"
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
                    Our Mission
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To democratize access to bioinformatics tools by creating
                    simple, reliable, and browser-based utilities that
                    researchers can use without complex installations or
                    technical barriers.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg
                      className="w-6 h-6 text-green-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Our Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    A future where every researcher has instant access to the
                    bioinformatics tools they need, combined with clear
                    explanations and practical examples that bridge the gap
                    between theory and application.
                  </p>
                </div>
              </div>
            </section>

            {/* What We Offer */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                What ProteinIQ Offers
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Research Tools
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Browser-based bioinformatics utilities that work instantly
                    without downloads or installations.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Research Insights
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Summaries of cutting-edge research papers with practical
                    implications for computational biology.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Documentation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Clear explanations, examples, and best practices for
                    bioinformatics workflows.
                  </p>
                </div>
              </div>
            </section>

            {/* Philosophy */}
            <section className="bg-blue-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Our Philosophy
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Accessibility First
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Every tool should be usable by researchers regardless of
                    their technical background. Complex bioinformatics shouldn't
                    require complex interfaces.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Privacy & Security
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Your data stays on your device. Our browser-based tools
                    ensure complete privacy and security for your research data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Evidence-Based
                  </h3>
                  <p className="text-sm leading-relaxed">
                    All tools and insights are grounded in peer-reviewed
                    research and real-world applications from computational
                    biochemistry.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Continuous Improvement
                  </h3>
                  <p className="text-sm leading-relaxed">
                    ProteinIQ evolves based on the needs of the research
                    community and advances in computational methods.
                  </p>
                </div>
              </div>
            </section>

            {/* Future Plans */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Looking Ahead
              </h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  ProteinIQ is continuously evolving. I'm working on expanding
                  the tool collection based on feedback from the research
                  community and emerging needs in computational biochemistry.
                  Future developments may include more advanced analysis tools,
                  collaborative features, and specialized utilities for specific
                  research domains.
                </p>
                <p>
                  If you have suggestions for tools that would benefit your
                  research, or if you'd like to collaborate, I'd love to hear
                  from you.
                </p>
              </div>
            </section>

            {/* Contact/Connect */}
            <section className="text-center bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Let's Connect
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Have questions, suggestions, or want to collaborate? I'm always
                interested in connecting with fellow researchers and hearing
                about your bioinformatics challenges.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="mailto:hello@proteiniq.com"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Get in Touch
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
