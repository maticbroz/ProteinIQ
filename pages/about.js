import { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Zap,
  Shield,
  Target,
  Lightbulb,
  Users,
  ChevronRight,
  Heart,
  Star,
  Award,
} from 'lucide-react';

// Molecular Animation Component (simplified version)
function MolecularBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 20;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 4 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 57, 246, 0.1)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}

export default function About() {
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    {
      icon: Zap,
      title: 'Accessibility First',
      description:
        "Every tool should be usable by researchers regardless of their technical background. Complex bioinformatics shouldn't require complex interfaces.",
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description:
        'Your data stays on your device. Our browser-based tools ensure complete privacy and security for your research data.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Target,
      title: 'Evidence-Based',
      description:
        'All tools and insights are grounded in peer-reviewed research and real-world applications from computational biochemistry.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Lightbulb,
      title: 'Continuous Innovation',
      description:
        'ProteinIQ evolves based on the needs of the research community and advances in computational methods.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const offerings = [
    {
      icon: '🧬',
      title: 'Research Tools',
      description:
        'Browser-based bioinformatics utilities that work instantly without downloads or installations.',
      features: [
        'FASTQ/FASTA conversion',
        'Sequence analysis',
        'Structure prediction',
        'Data visualization',
      ],
    },
    {
      icon: '📊',
      title: 'Research Insights',
      description:
        'Summaries of cutting-edge research papers with practical implications for computational biology.',
      features: [
        'Paper summaries',
        'Trend analysis',
        'Method comparisons',
        'Practical applications',
      ],
    },
    {
      icon: '📚',
      title: 'Documentation',
      description:
        'Clear explanations, examples, and best practices for bioinformatics workflows.',
      features: [
        'Step-by-step guides',
        'Best practices',
        'Code examples',
        'Troubleshooting',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        <MolecularBackground />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
              <Heart size={16} className="mr-2" />
              Built by researchers, for researchers
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 mb-8 tracking-tight">
              About&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                ProteinIQ
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Making bioinformatics tools accessible to researchers everywhere
              through thoughtful design and cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#story"
                className="inline-flex items-center px-8 py-4 text-white rounded-full font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Our Story
                <ChevronRight size={20} className="ml-2" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 text-indigo-600 bg-white border-2 border-indigo-200 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-300"
              >
                Get in Touch
                <Mail size={20} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section id="story" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">
                The story behind ProteinIQ
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
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
                <p>
                  Today, ProteinIQ serves researchers worldwide, helping them
                  focus on discovery rather than wrestling with tools.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-gray-200">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      MB
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Matic Broz
                      </h3>
                      <p className="text-gray-600">
                        PhD in Computational Biochemistry
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Award size={16} className="text-indigo-500 mr-3" />
                      <span className="text-sm">Researcher & Tool Builder</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Star size={16} className="text-indigo-500 mr-3" />
                      <span className="text-sm">
                        Passionate about accessible science
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users size={16} className="text-indigo-500 mr-3" />
                      <span className="text-sm">
                        Serving researchers worldwide
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driving the future of accessible bioinformatics through innovation
              and community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                To democratize access to bioinformatics tools by creating
                simple, reliable, and browser-based utilities that researchers
                can use without complex installations or technical barriers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                A future where every researcher has instant access to the
                bioinformatics tools they need, combined with clear explanations
                and practical examples that bridge the gap between theory and
                application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What ProteinIQ offers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and resources designed to accelerate your
              research workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {offering.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {offering.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {offering.description}
                </p>
                <div className="space-y-2">
                  {offering.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our core values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we build and every decision
              we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onMouseEnter={() => setActiveValue(index)}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Looking ahead
          </h2>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                ProteinIQ is continuously evolving. I'm working on expanding the
                tool collection based on feedback from the research community
                and emerging needs in computational biochemistry.
              </p>
              <p>
                Future developments may include more advanced analysis tools,
                collaborative features, and specialized utilities for specific
                research domains.
              </p>
              <p className="text-indigo-100">
                If you have suggestions for tools that would benefit your
                research, or if you'd like to collaborate, I'd love to hear from
                you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Let's connect
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Have questions, suggestions, or want to collaborate? I'm always
            interested in connecting with fellow researchers and hearing about
            your bioinformatics challenges.
          </p>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Get in touch
                </h3>
                <p className="text-gray-600 mb-6">
                  Whether you have a question about our tools, want to suggest a
                  new feature, or just want to say hello, I'd love to hear from
                  you.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Mail size={20} className="text-indigo-500 mr-3" />
                    <span>matic.broz@gmail.com</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users size={20} className="text-indigo-500 mr-3" />
                    <span>Open to collaborations</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="mailto:matic.broz@gmail.com"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Mail size={20} className="mr-3" />
                  Send Message
                </a>
                <p className="text-sm text-gray-500 mt-4">
                  Usually responds within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
