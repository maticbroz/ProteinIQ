import Image from "next/image";
import Header from './components/Header' 
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

// pages/index.js
export default function Home() {
return (
<div
className={`${geistSans.className} font-[family-name:var(--font-geist-sans)] pl-6 md:pl-8 pr-4` }
>


<Header />


<main className="bg-white rounded-lg border border-gray-200">
<div className="text-center relative pt-12 sm:pt-20 xl:py-40">
<h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
Bioinformatics tools for researchers
</h1>
<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
Professional-grade bioinformatics tools for researchers, students, and professionals. 
Convert, analyze, and visualize biological data with ease.
</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<a 
href="/tools" 
className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
>
Explore Tools
</a>
<a 
href="/about" 
className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
>
Learn More
</a>
</div>
</div>


<div className="mt-20">
<h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Tools</h2>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
<span className="text-2xl">🧬</span>
</div>
<h3 className="text-xl font-semibold mb-2">FASTA to PDB</h3>
<p className="text-gray-600 mb-4">Convert FASTA sequence files to PDB format for structural analysis.</p>
<a href="/tools/fasta-to-pdb" className="text-blue-600 font-medium hover:text-blue-700">
Try Tool →
</a>
</div>

<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
<span className="text-2xl">🔬</span>
</div>
<h3 className="text-xl font-semibold mb-2">Protein Sequence Analyzer</h3>
<p className="text-gray-600 mb-4">Analyze protein sequences for properties, motifs, and characteristics.</p>
<a href="/tools/protein-analyzer" className="text-blue-600 font-medium hover:text-blue-700">
Try Tool →
</a>
</div>

<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
<span className="text-2xl">📊</span>
</div>
<h3 className="text-xl font-semibold mb-2">Data Visualizer</h3>
<p className="text-gray-600 mb-4">Create publication-ready charts and graphs from your biological data.</p>
<a href="/tools/visualizer" className="text-blue-600 font-medium hover:text-blue-700">
Try Tool →
</a>
</div>
</div>
</div>

{/* Coming Soon */}
<div className="mt-20 text-center">
<h2 className="text-3xl font-bold text-gray-900 mb-6">Coming Soon</h2>
<div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
<div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
<span className="text-3xl">🤖</span>
</div>
<h3 className="text-2xl font-semibold mb-4">AlphaFold API Integration</h3>
<p className="text-gray-600 mb-6">
Direct integration with AlphaFold database for protein structure prediction and analysis.
</p>
<div className="bg-gray-50 rounded-lg p-4">
<p className="text-sm text-gray-500">
Subscribe to get notified when this feature launches
</p>
</div>
</div>
</div>
</main>

{/* Footer */}
<footer className="bg-gray-800 text-white mt-20">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
<div className="grid md:grid-cols-4 gap-8">
<div>
<h3 className="text-lg font-semibold mb-4">ProteinIQ</h3>
<p className="text-gray-400">
Making bioinformatics accessible to everyone.
</p>
</div>
<div>
<h4 className="font-semibold mb-4">Tools</h4>
<ul className="space-y-2 text-gray-400">
<li><a href="/tools/fasta-to-pdb" className="hover:text-white">FASTA to PDB</a></li>
<li><a href="/tools/protein-analyzer" className="hover:text-white">Protein Analyzer</a></li>
<li><a href="/tools/visualizer" className="hover:text-white">Data Visualizer</a></li>
</ul>
</div>
<div>
<h4 className="font-semibold mb-4">Resources</h4>
<ul className="space-y-2 text-gray-400">
<li><a href="/blog" className="hover:text-white">Blog</a></li>
<li><a href="/help" className="hover:text-white">Help</a></li>
<li><a href="/about" className="hover:text-white">About</a></li>
</ul>
</div>
<div>
<h4 className="font-semibold mb-4">Contact</h4>
<p className="text-gray-400">
Questions? Reach out to us.
</p>
</div>
</div>
<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
<p>&copy; 2025 ProteinIQ. All rights reserved.</p>
</div>
</div>
</footer>
</div>
)
}