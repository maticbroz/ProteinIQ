// config/tools.js
import {
  Dna,
  FileText,
  FlaskConical,
  Microscope,
  Atom,
  Zap,
  Shield,
  Smile,
  ArrowLeftRight,
} from 'lucide-react';

export const toolSections = [
  {
    title: 'Sequence format converters',
    description: 'Convert between different biological sequence file formats',
    tools: [
      {
        title: 'FASTQ to FASTA',
        name: 'FASTQ to FASTA', // for sidebar compatibility
        description: 'Convert FASTQ sequence files to FASTA format.',
        href: '/tools/fastq-to-fasta',
        url: '/tools/fastq-to-fasta', // for sidebar compatibility
        icon: Dna,
      },
      {
        title: 'TXT to FASTA',
        name: 'TXT to FASTA',
        description: 'Convert plain text sequence files to FASTA format.',
        href: '/tools/txt-to-fasta',
        url: '/tools/txt-to-fasta',
        icon: FileText,
      },
      {
        title: 'PDB to FASTA',
        name: 'PDB to FASTA',
        description:
          'Convert Protein Data Bank files to FASTA sequence format.',
        href: '/tools/pdb-to-fasta',
        url: '/tools/pdb-to-fasta',
        icon: Microscope,
      },
    ],
  },
  {
    title: 'Structure format converters',
    description: 'Convert between different molecular structure file formats',
    tools: [
      {
        title: 'SDF to PDB',
        name: 'SDF to PDB',
        description:
          'Convert Structure Data Format files to Protein Data Bank format.',
        href: '/tools/sdf-to-pdb',
        url: '/tools/sdf-to-pdb',
        icon: FlaskConical,
      },
      {
        title: 'PDB to MOL2',
        name: 'PDB to MOL2',
        description:
          'Convert Protein Data Bank files to MOL2 molecular format.',
        href: '/tools/pdb-to-mol2',
        url: '/tools/pdb-to-mol2',
        icon: Atom,
      },
      {
        title: 'PDB to CIF',
        name: 'PDB to CIF',
        description:
          'Convert Protein Data Bank files to Crystallographic Information File format.',
        href: '/tools/pdb-to-cif',
        url: '/tools/pdb-to-cif',
        icon: Shield,
      },
      {
        title: 'SMILES to SDF',
        name: 'SMILES to SDF',
        description: 'Convert SMILES notation to Structure Data Format files.',
        href: '/tools/smiles-to-sdf',
        url: '/tools/smiles-to-sdf',
        icon: Smile,
      },
    ],
  },
  {
    title: 'Biological sequence analysis',
    description:
      'Tools for DNA, RNA, and protein sequence analysis and conversion',
    tools: [
      {
        title: 'DNA to Protein',
        name: 'DNA to Protein',
        description:
          'Translate DNA sequences to protein sequences using genetic code.',
        href: '/tools/dna-to-protein',
        url: '/tools/dna-to-protein',
        icon: ArrowLeftRight,
      },
      {
        title: 'Protein to DNA',
        name: 'Protein to DNA',
        description:
          'Reverse translate protein sequences to possible DNA sequences.',
        href: '/tools/protein-to-dna',
        url: '/tools/protein-to-dna',
        icon: Zap,
      },
    ],
  },
];

// Flatten all tools into a single array for components that need it (like sidebar)
export const allTools = toolSections.flatMap((section) => section.tools);
