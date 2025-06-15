import Layout from '../components/Layout';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, Zap, Users } from 'lucide-react';

// Molecular Animation Component
function MolecularBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 30;
    const connectionDistance = 150;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 6 + 1,
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth)
          particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.offsetHeight)
          particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.offsetWidth, particle.x));
        particle.y = Math.max(0, Math.min(canvas.offsetHeight, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 57, 246, 0.6)';
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79, 57, 246, ${0.3 * (1 - distance / connectionDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-80"
      style={{ pointerEvents: 'none' }}
    />
  );
}

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
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <MolecularBackground />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="">
            <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 mb-8 tracking-tight">
              Bioinformatics tools
              <br />
              for&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 px-1">
                researchers
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed pr-32">
              ProteinIQ is a free, browser-based collection of tools and
              information for protein scientists.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center px-8 py-4 text-white rounded-full font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-lg"
              >
                Explore tools
                <ArrowRight size={20} className="ml-2" />
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
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
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
                    <Check size={20} className="text-green-600" />
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
                    <Zap size={20} className="text-indigo-600" />
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
                    <Users size={20} className="text-purple-600" />
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
                        <ArrowRight size={20} className="mr-2 rotate-90" />
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
                  <ArrowRight size={16} className="ml-2" />
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
    </Layout>
  );
}
