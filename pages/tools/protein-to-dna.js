import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../../components/tools/ToolsLayout';
import InputSection from '../../components/tools/InputSection';
import OutputSection from '../../components/tools/OutputSection';
import ToolDocumentation from '../../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';
import { InfoText } from '../../components/ui/Info';

export default function ProteinToDna({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [conversionOptions, setConversionOptions] = useState({
    codonUsage: 'human',
    optimizationStrategy: 'balanced',
    includeStopCodon: true,
    removeAmbiguous: true,
    addStartCodon: false,
  });

  // Standard genetic code - amino acid to codons mapping
  const geneticCode = {
    A: ['GCT', 'GCC', 'GCA', 'GCG'], // Alanine
    R: ['CGT', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'], // Arginine
    N: ['AAT', 'AAC'], // Asparagine
    D: ['GAT', 'GAC'], // Aspartic acid
    C: ['TGT', 'TGC'], // Cysteine
    Q: ['CAA', 'CAG'], // Glutamine
    E: ['GAA', 'GAG'], // Glutamic acid
    G: ['GGT', 'GGC', 'GGA', 'GGG'], // Glycine
    H: ['CAT', 'CAC'], // Histidine
    I: ['ATT', 'ATC', 'ATA'], // Isoleucine
    L: ['TTA', 'TTG', 'CTT', 'CTC', 'CTA', 'CTG'], // Leucine
    K: ['AAA', 'AAG'], // Lysine
    M: ['ATG'], // Methionine (start codon)
    F: ['TTT', 'TTC'], // Phenylalanine
    P: ['CCT', 'CCC', 'CCA', 'CCG'], // Proline
    S: ['TCT', 'TCC', 'TCA', 'TCG', 'AGT', 'AGC'], // Serine
    T: ['ACT', 'ACC', 'ACA', 'ACG'], // Threonine
    W: ['TGG'], // Tryptophan
    Y: ['TAT', 'TAC'], // Tyrosine
    V: ['GTT', 'GTC', 'GTA', 'GTG'], // Valine
    '*': ['TAA', 'TAG', 'TGA'], // Stop codons
  };

  // Codon usage preferences for different organisms
  const codonUsageTables = {
    human: {
      A: 'GCC',
      R: 'CGG',
      N: 'AAC',
      D: 'GAC',
      C: 'TGC',
      Q: 'CAG',
      E: 'GAG',
      G: 'GGC',
      H: 'CAC',
      I: 'ATC',
      L: 'CTG',
      K: 'AAG',
      M: 'ATG',
      F: 'TTC',
      P: 'CCC',
      S: 'AGC',
      T: 'ACC',
      W: 'TGG',
      Y: 'TAC',
      V: 'GTG',
      '*': 'TAA',
    },
    ecoli: {
      A: 'GCG',
      R: 'CGT',
      N: 'AAC',
      D: 'GAT',
      C: 'TGC',
      Q: 'CAG',
      E: 'GAA',
      G: 'GGT',
      H: 'CAT',
      I: 'ATT',
      L: 'CTG',
      K: 'AAA',
      M: 'ATG',
      F: 'TTT',
      P: 'CCG',
      S: 'TCG',
      T: 'ACC',
      W: 'TGG',
      Y: 'TAT',
      V: 'GTG',
      '*': 'TAA',
    },
    yeast: {
      A: 'GCT',
      R: 'AGA',
      N: 'AAT',
      D: 'GAT',
      C: 'TGT',
      Q: 'CAA',
      E: 'GAA',
      G: 'GGT',
      H: 'CAT',
      I: 'ATT',
      L: 'TTG',
      K: 'AAA',
      M: 'ATG',
      F: 'TTT',
      P: 'CCT',
      S: 'TCT',
      T: 'ACT',
      W: 'TGG',
      Y: 'TAT',
      V: 'GTT',
      '*': 'TAA',
    },
    plant: {
      A: 'GCT',
      R: 'AGA',
      N: 'AAT',
      D: 'GAT',
      C: 'TGT',
      Q: 'CAA',
      E: 'GAA',
      G: 'GGA',
      H: 'CAT',
      I: 'ATT',
      L: 'CTT',
      K: 'AAA',
      M: 'ATG',
      F: 'TTT',
      P: 'CCT',
      S: 'TCT',
      T: 'ACT',
      W: 'TGG',
      Y: 'TAT',
      V: 'GTT',
      '*': 'TAA',
    },
    random: {}, // Will use random codon selection
  };

  // Convert protein sequence to DNA
  const convertProteinToDna = (fastaText, options) => {
    try {
      const sequences = parseFastaInput(fastaText);
      if (sequences.length === 0) {
        throw new Error('No valid protein sequences found in input');
      }

      const dnaSequences = [];

      for (const seq of sequences) {
        const dnaSequence = translateProteinToDna(seq.sequence, options);
        dnaSequences.push({
          header: seq.header.replace(/^>/, '>DNA_'),
          sequence: dnaSequence,
        });
      }

      return formatFastaOutput(dnaSequences);
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Parse FASTA input
  const parseFastaInput = (fastaText) => {
    const lines = fastaText.trim().split('\n');
    const sequences = [];
    let currentHeader = '';
    let currentSequence = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.startsWith('>')) {
        // Save previous sequence if exists
        if (currentHeader && currentSequence) {
          sequences.push({
            header: currentHeader,
            sequence: currentSequence.toUpperCase(),
          });
        }
        // Start new sequence
        currentHeader = trimmedLine;
        currentSequence = '';
      } else {
        // Add to current sequence
        currentSequence += trimmedLine.replace(/\s/g, '');
      }
    }

    // Add last sequence
    if (currentHeader && currentSequence) {
      sequences.push({
        header: currentHeader,
        sequence: currentSequence.toUpperCase(),
      });
    }

    return sequences;
  };

  // Translate single protein sequence to DNA
  const translateProteinToDna = (proteinSeq, options) => {
    const codonTable = codonUsageTables[options.codonUsage];
    let dnaSequence = '';

    // Add start codon if requested
    if (options.addStartCodon && !proteinSeq.startsWith('M')) {
      dnaSequence += 'ATG';
    }

    for (const aminoAcid of proteinSeq) {
      // Handle ambiguous amino acids
      if (
        aminoAcid === 'X' ||
        aminoAcid === 'B' ||
        aminoAcid === 'Z' ||
        aminoAcid === 'J'
      ) {
        if (options.removeAmbiguous) {
          continue; // Skip ambiguous amino acids
        } else {
          // Use a random amino acid for ambiguous ones
          const randomAA = 'ACDEFGHIKLMNPQRSTVWY'[
            Math.floor(Math.random() * 20)
          ];
          dnaSequence += selectCodon(
            randomAA,
            codonTable,
            options.optimizationStrategy
          );
        }
        continue;
      }

      // Handle stop codons
      if (aminoAcid === '*') {
        if (options.includeStopCodon) {
          dnaSequence += selectCodon(
            '*',
            codonTable,
            options.optimizationStrategy
          );
        }
        continue;
      }

      // Validate amino acid
      if (!geneticCode[aminoAcid]) {
        if (options.removeAmbiguous) {
          continue;
        } else {
          throw new Error(`Invalid amino acid: ${aminoAcid}`);
        }
      }

      // Convert to codon
      const codon = selectCodon(
        aminoAcid,
        codonTable,
        options.optimizationStrategy
      );
      dnaSequence += codon;
    }

    // Add stop codon if not present and requested
    if (options.includeStopCodon && !proteinSeq.endsWith('*')) {
      dnaSequence += selectCodon('*', codonTable, options.optimizationStrategy);
    }

    return dnaSequence;
  };

  // Select appropriate codon based on strategy
  const selectCodon = (aminoAcid, codonTable, strategy) => {
    const availableCodons = geneticCode[aminoAcid];
    if (!availableCodons || availableCodons.length === 0) {
      throw new Error(`No codons found for amino acid: ${aminoAcid}`);
    }

    switch (strategy) {
      case 'optimized':
        // Use organism-specific preferred codon
        return codonTable[aminoAcid] || availableCodons[0];

      case 'random':
        // Select random codon
        return availableCodons[
          Math.floor(Math.random() * availableCodons.length)
        ];

      case 'balanced':
        // Mix of optimized and random (70% optimized, 30% random)
        if (Math.random() < 0.7 && codonTable[aminoAcid]) {
          return codonTable[aminoAcid];
        } else {
          return availableCodons[
            Math.floor(Math.random() * availableCodons.length)
          ];
        }

      case 'first':
        // Always use first codon (simplest)
        return availableCodons[0];

      default:
        return codonTable[aminoAcid] || availableCodons[0];
    }
  };

  // Format output as FASTA
  const formatFastaOutput = (sequences) => {
    let output = '';
    for (const seq of sequences) {
      output += seq.header + '\n';
      // Break sequence into 80-character lines
      for (let i = 0; i < seq.sequence.length; i += 80) {
        output += seq.sequence.substring(i, i + 80) + '\n';
      }
    }
    return output.trim();
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(
        /\.(fasta|fas|fa|txt)$/i,
        ''
      );
      return `${nameWithoutExt}_DNA.fasta`;
    }
    return 'protein_to_dna.fasta';
  };

  // Automatic conversion when input or options change
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsProcessing(true);
      setError('');

      setTimeout(() => {
        try {
          const result = convertProteinToDna(input, conversionOptions);
          setOutput(result);
        } catch (err) {
          setError(err.message);
          setOutput('');
        } finally {
          setIsProcessing(false);
        }
      }, 100);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [input, conversionOptions]);

  const handleFileUpload = (file) => {
    if (!file) return;

    setIsUploading(true);
    setError('');
    setUploadedFilename(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      setInput(e.target.result);
      setIsUploading(false);
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getDownloadFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsUploading(false);
    setUploadedFilename('');
  };

  return (
    <ToolsLayout
      title="Protein to DNA converter"
      description="Convert protein FASTA sequences to DNA sequences through reverse translation. Choose codon optimization strategies for different organisms and expression systems."
      h1="Protein to DNA converter"
      subtitle="Convert your protein sequences to DNA sequences using reverse translation. Upload a FASTA file or paste your protein sequences below."
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <InputSection
            input={input}
            onInputChange={setInput}
            inputFormat="FASTA (Protein)"
            placeholder=">protein1&#10;MKVLWAALLVTFLAGCQAKVEQAVETEPEPELRQQTEWQSGQRWELALGRFWDYLRWVQTLSEQVQEELLSSQVTQELRALMDETAQIPPAWTARESRCSRQLFANDFMKGDHMKQHDFFKHQPQ&#10;>protein2&#10;MGSSKSKPKDPSQRRSSSDHEDELRPLLNERALQKEALPKSLSSRGRKQRQLFADYKFQEVKQAESLRHLRRCAEIGRWRALQNPLGPTTLSVAHESWLRKRPSFLPGVSPERLNDCL&#10;&#10;Note: If you have PDB files, use our PDB to FASTA converter first: /tools/pdb-to-fasta"
            acceptedFileTypes=".fasta,.fas,.fa,.txt"
            fileTypeDescription="FASTA file (.fasta, .fas, .fa, .txt)"
            onClear={clearAll}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            error={error}
          />

          {/* Conversion Options */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">
              Reverse translation options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Codon Usage */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Codon usage table
                </label>
                <select
                  value={conversionOptions.codonUsage}
                  onChange={(e) =>
                    setConversionOptions((prev) => ({
                      ...prev,
                      codonUsage: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="human">Human (Homo sapiens)</option>
                  <option value="ecoli">E. coli (Escherichia coli)</option>
                  <option value="yeast">
                    Yeast (Saccharomyces cerevisiae)
                  </option>
                  <option value="plant">Plant (Arabidopsis thaliana)</option>
                  <option value="random">Random codon selection</option>
                </select>
              </div>

              {/* Optimization Strategy */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Optimization strategy
                </label>
                <select
                  value={conversionOptions.optimizationStrategy}
                  onChange={(e) =>
                    setConversionOptions((prev) => ({
                      ...prev,
                      optimizationStrategy: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="optimized">
                    Fully optimized (preferred codons)
                  </option>
                  <option value="balanced">
                    Balanced (70% optimized, 30% random)
                  </option>
                  <option value="random">Random codon selection</option>
                  <option value="first">Use first codon (simplest)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Additional Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Sequence handling
                </h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.addStartCodon}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        addStartCodon: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Add start codon (ATG) if missing
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.includeStopCodon}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        includeStopCodon: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Include stop codon</span>
                </label>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Error handling
                </h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.removeAmbiguous}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        removeAmbiguous: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Remove ambiguous amino acids (X, B, Z, J)
                  </span>
                </label>
              </div>
            </div>

            <InfoText>
              Reverse translation is not deterministic - multiple DNA sequences
              can code for the same protein. Codon optimization improves
              expression in specific organisms.
            </InfoText>

            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <p className="text-sm text-green-800">
                <strong>Have PDB files?</strong> Convert them to FASTA first
                using our{' '}
                <a
                  href="/tools/pdb-to-fasta"
                  className="font-medium underline hover:text-green-900"
                >
                  PDB to FASTA converter
                </a>
                , then use this tool.
              </p>
            </div>
          </div>
        </div>

        <OutputSection
          output={output}
          outputFormat="FASTA (DNA)"
          placeholder={
            isProcessing
              ? 'Converting protein to DNA sequences...'
              : 'DNA sequences will appear here automatically...'
          }
          onCopy={copyToClipboard}
          onDownload={downloadFile}
          downloadFilename={getDownloadFilename()}
        />
      </div>

      {/* Documentation */}
      <ToolDocumentation mdxSource={mdxSource} frontMatter={frontMatter} />
    </ToolsLayout>
  );
}

export const getStaticProps = createToolStaticProps('protein-to-dna');
