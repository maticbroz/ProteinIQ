import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../components/tools/ToolsLayout';
import InputSection from '../components/tools/InputSection';
import OutputSection from '../components/tools/OutputSection';
import ToolDocumentation from '../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function PdbToFasta({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [selectedChains, setSelectedChains] = useState('all'); // 'all', 'specific', or specific chain IDs
  const [availableChains, setAvailableChains] = useState([]);
  const [specificChains, setSpecificChains] = useState('');
  const [includeHetAtoms, setIncludeHetAtoms] = useState(false);

  // Three-letter to one-letter amino acid conversion
  const aminoAcidMap = {
    ALA: 'A',
    ARG: 'R',
    ASN: 'N',
    ASP: 'D',
    CYS: 'C',
    GLU: 'E',
    GLN: 'Q',
    GLY: 'G',
    HIS: 'H',
    ILE: 'I',
    LEU: 'L',
    LYS: 'K',
    MET: 'M',
    PHE: 'F',
    PRO: 'P',
    SER: 'S',
    THR: 'T',
    TRP: 'W',
    TYR: 'Y',
    VAL: 'V',
    SEC: 'U',
    PYL: 'O', // Selenocysteine and Pyrrolysine
    // Common modified amino acids
    MSE: 'M',
    SEP: 'S',
    TPO: 'T',
    PTR: 'Y',
    TYS: 'Y',
  };

  // Convert PDB to FASTA
  const convertPdbToFasta = (
    pdbText,
    chainSelection = 'all',
    specificChainIds = '',
    includeHet = false
  ) => {
    try {
      const lines = pdbText.split('\n');
      const chains = new Map(); // chainId -> {residues: Map(resNum -> {resName, atomRecords}), title: string}
      const chainTitles = new Map(); // chainId -> title from COMPND records
      let currentTitle = '';
      let currentChains = [];

      // Parse PDB file
      for (const line of lines) {
        const recordType = line.substring(0, 6).trim();

        // Extract chain titles from COMPND records
        if (recordType === 'COMPND') {
          const compndText = line.substring(10).trim();
          if (compndText.includes('MOLECULE:')) {
            currentTitle = compndText
              .replace('MOLECULE:', '')
              .trim()
              .replace(/;$/, '');
          } else if (compndText.includes('CHAIN:')) {
            const chainMatch = compndText.match(/CHAIN:\s*([A-Z,\s]+)/);
            if (chainMatch) {
              currentChains = chainMatch[1]
                .split(',')
                .map((c) => c.trim())
                .filter((c) => c);
              // Assign title to chains
              currentChains.forEach((chainId) => {
                if (currentTitle) {
                  chainTitles.set(chainId, currentTitle);
                }
              });
            }
          }
        }

        // Parse ATOM and HETATM records
        if (recordType === 'ATOM' || (recordType === 'HETATM' && includeHet)) {
          const chainId = line.charAt(21) || 'A'; // Default to chain A if not specified
          const resNum = parseInt(line.substring(22, 26).trim());
          const resName = line.substring(17, 20).trim();
          const atomName = line.substring(12, 16).trim();

          // Only process CA atoms for protein backbone or standard amino acids
          if (atomName === 'CA' || (includeHet && recordType === 'HETATM')) {
            if (!chains.has(chainId)) {
              chains.set(chainId, {
                residues: new Map(),
                title: chainTitles.get(chainId) || `Chain ${chainId}`,
              });
            }

            const chain = chains.get(chainId);
            if (!chain.residues.has(resNum)) {
              chain.residues.set(resNum, {
                resName: resName,
                atomRecords: [],
              });
            }
            chain.residues.get(resNum).atomRecords.push(line);
          }
        }
      }

      if (chains.size === 0) {
        throw new Error('No valid protein chains found in PDB file');
      }

      // Update available chains for UI
      const availableChainIds = Array.from(chains.keys()).sort();
      setAvailableChains(availableChainIds);

      // Determine which chains to process
      let chainsToProcess = [];
      if (chainSelection === 'all') {
        chainsToProcess = availableChainIds;
      } else if (chainSelection === 'specific' && specificChainIds) {
        const requestedChains = specificChainIds
          .split(',')
          .map((c) => c.trim().toUpperCase())
          .filter((c) => c);
        chainsToProcess = requestedChains.filter((chainId) =>
          chains.has(chainId)
        );

        if (chainsToProcess.length === 0) {
          throw new Error(
            `None of the specified chains (${specificChainIds}) were found in the PDB file. Available chains: ${availableChainIds.join(', ')}`
          );
        }
      } else {
        chainsToProcess = availableChainIds;
      }

      // Convert chains to FASTA
      const fastaLines = [];
      for (const chainId of chainsToProcess) {
        const chain = chains.get(chainId);
        const residues = Array.from(chain.residues.entries())
          .sort(([a], [b]) => a - b) // Sort by residue number
          .map(([resNum, residue]) => residue);

        if (residues.length === 0) continue;

        // Build sequence
        const sequence = [];
        let unknownCount = 0;

        for (const residue of residues) {
          const oneLetterCode = aminoAcidMap[residue.resName];
          if (oneLetterCode) {
            sequence.push(oneLetterCode);
          } else {
            // Handle unknown residues
            if (includeHet) {
              sequence.push('X'); // Unknown amino acid
              unknownCount++;
            }
          }
        }

        if (sequence.length === 0) continue;

        // Create FASTA header
        const proteinName = chain.title || `Chain ${chainId}`;
        const headerInfo = [proteinName];

        if (unknownCount > 0) {
          headerInfo.push(`${unknownCount} unknown residues as X`);
        }

        const header = `>${chainId}|${headerInfo.join(' | ')}`;
        fastaLines.push(header);

        // Add sequence with line wrapping (80 characters per line)
        const sequenceString = sequence.join('');
        for (let i = 0; i < sequenceString.length; i += 80) {
          fastaLines.push(sequenceString.substring(i, i + 80));
        }
      }

      if (fastaLines.length === 0) {
        throw new Error(
          'No valid amino acid sequences could be extracted from the selected chains'
        );
      }

      return fastaLines.join('\n');
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(/\.(pdb|ent)$/i, '');
      return `${nameWithoutExt}.fasta`;
    }
    return 'protein_sequences.fasta';
  };

  // Automatic conversion when input changes
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setAvailableChains([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsProcessing(true);
      setError('');

      setTimeout(() => {
        try {
          const result = convertPdbToFasta(
            input,
            selectedChains,
            specificChains,
            includeHetAtoms
          );
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
  }, [input, selectedChains, specificChains, includeHetAtoms]);

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
    setAvailableChains([]);
    setSpecificChains('');
  };

  return (
    <ToolsLayout
      title="PDB to FASTA converter"
      description="Convert Protein Data Bank (PDB) structure files to FASTA format. Extract amino acid sequences from protein chains with customizable options for chain selection and heteroatom inclusion."
      h1="PDB to FASTA converter"
      subtitle="Extract amino acid sequences from PDB protein structure files. Upload a PDB file or paste the structure data below."
    >
      <div className="flex flex-col gap-16">

        <div class="flex flex-col gap-6">
        <InputSection
          input={input}
          onInputChange={setInput}
          inputFormat="PDB"
          placeholder="HEADER    HYDROLASE                               01-JUN-95   1HTM&#10;TITLE     HUMAN CARBONIC ANHYDRASE II IN COMPLEX WITH A SULFONAMIDE&#10;COMPND    MOL_ID: 1;&#10;COMPND   2 MOLECULE: CARBONIC ANHYDRASE II;&#10;COMPND   3 CHAIN: A;&#10;ATOM      1  N   ALA A   1      20.154  -6.351  -9.353  1.00 17.93           N&#10;ATOM      2  CA  ALA A   1      19.030  -6.508 -10.279  1.00 17.93           C&#10;..."
          acceptedFileTypes=".pdb,.ent"
          fileTypeDescription="PDB file (.pdb, .ent)"
          onClear={clearAll}
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
          error={error}
        />
        {/* Conversion Options */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-300">


          {/* Chain Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Chain selection
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={selectedChains === 'all'}
                  onChange={(e) => setSelectedChains(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">All chains</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="specific"
                  checked={selectedChains === 'specific'}
                  onChange={(e) => setSelectedChains(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Specific chains</span>
              </label>
            </div>

            {selectedChains === 'specific' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={specificChains}
                  onChange={(e) => setSpecificChains(e.target.value)}
                  placeholder="Enter chain IDs (e.g., A, B, C or A,B,C)"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                {availableChains.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Available chains in file: {availableChains.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeHetAtoms}
                onChange={(e) => setIncludeHetAtoms(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">
                Include heteroatoms (modified amino acids, ligands)
              </span>
            </label>
          </div>

          {availableChains.length > 0 && (
            <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
              <p className="text-sm text-indigo-800">
                <strong>Detected chains:</strong> {availableChains.join(', ')}
              </p>
            </div>
          )}
        </div>
        </div>

        <OutputSection
          output={output}
          outputFormat="FASTA"
          placeholder={
            isProcessing
              ? 'Converting PDB to FASTA format...'
              : 'FASTA protein sequences will appear here automatically...'
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

export const getStaticProps = createToolStaticProps('pdb-to-fasta');
