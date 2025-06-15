import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../../components/tools/ToolsLayout';
import InputSection from '../../components/tools/InputSection';
import OutputSection from '../../components/tools/OutputSection';
import ToolDocumentation from '../../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function TxtToFasta({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [inputFormat, setInputFormat] = useState('auto'); // auto, plain, tab, labeled

  // Convert TXT to FASTA
  const convertTxtToFasta = (txtText, format = 'auto') => {
    try {
      const lines = txtText
        .trim()
        .split('\n')
        .filter((line) => line.trim());
      const fastaLines = [];
      let sequenceCounter = 1;

      // Auto-detect format if needed
      let detectedFormat = format;
      if (format === 'auto') {
        // Check if first line contains tab (tab-separated)
        if (lines[0] && lines[0].includes('\t')) {
          detectedFormat = 'tab';
        }
        // Check if lines alternate between non-sequence and sequence-like patterns
        else if (
          lines.length >= 2 &&
          !lines[0].match(/^[ATCGN]+$/i) &&
          lines[1].match(/^[ATCGN]+$/i)
        ) {
          detectedFormat = 'labeled';
        }
        // Default to plain sequences
        else {
          detectedFormat = 'plain';
        }
      }

      switch (detectedFormat) {
        case 'tab':
          // Tab-separated format: ID\tSequence
          for (const line of lines) {
            const parts = line.split('\t');
            if (parts.length >= 2) {
              const id = parts[0].trim();
              const sequence = parts[1].trim();

              if (!sequence) continue;

              // Validate sequence contains only valid nucleotides
              if (!sequence.match(/^[ATCGN]+$/i)) {
                throw new Error(
                  `Invalid sequence characters in: ${sequence.substring(0, 50)}...`
                );
              }

              const header = id.startsWith('>') ? id : `>${id}`;
              fastaLines.push(header);
              fastaLines.push(sequence.toUpperCase());
            }
          }
          break;

        case 'labeled':
          // Alternating lines: label, sequence, label, sequence...
          for (let i = 0; i < lines.length; i += 2) {
            if (i + 1 >= lines.length) break;

            const label = lines[i].trim();
            const sequence = lines[i + 1].trim();

            if (!sequence) continue;

            // Validate sequence
            if (!sequence.match(/^[ATCGN]+$/i)) {
              throw new Error(
                `Invalid sequence characters in: ${sequence.substring(0, 50)}...`
              );
            }

            const header = label.startsWith('>') ? label : `>${label}`;
            fastaLines.push(header);
            fastaLines.push(sequence.toUpperCase());
          }
          break;

        case 'plain':
        default:
          // Plain sequences, one per line
          for (const line of lines) {
            const sequence = line.trim();
            if (!sequence) continue;

            // Validate sequence contains only valid nucleotides
            if (!sequence.match(/^[ATCGN]+$/i)) {
              throw new Error(
                `Invalid sequence characters in: ${sequence.substring(0, 50)}...`
              );
            }

            fastaLines.push(`>seq${sequenceCounter}`);
            fastaLines.push(sequence.toUpperCase());
            sequenceCounter++;
          }
          break;
      }

      if (fastaLines.length === 0) {
        throw new Error('No valid sequences found in input');
      }

      return fastaLines.join('\n');
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(/\.(txt|tsv|csv)$/i, '');
      return `${nameWithoutExt}.fasta`;
    }
    return 'converted.fasta';
  };

  // Get placeholder text based on input format
  const getPlaceholder = () => {
    switch (inputFormat) {
      case 'tab':
        return 'seq1\tATCGATCGATCG\nseq2\tGCTAGCTAGCTA';
      case 'labeled':
        return 'seq1\nATCGATCGATCG\nseq2\nGCTAGCTAGCTA';
      default:
        return 'seq1\nATCGATCGATCG\nseq2\nGCTAGCTAGCTA';
    }
  };

  // Automatic conversion when input changes
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
          const result = convertTxtToFasta(input, inputFormat);
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
  }, [input, inputFormat]);

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
      title="TXT to FASTA converter"
      description="Convert text files containing DNA/RNA sequences to FASTA format. Supports multiple input formats including plain sequences, tab-separated, and labeled sequences."
      h1="TXT to FASTA converter"
      subtitle="Convert your text files containing sequences to FASTA format. Upload a file or paste your data below."
    >
      <div className="flex flex-col gap-16">
        <div>
          <InputSection
            input={input}
            onInputChange={setInput}
            inputFormat="Text"
            placeholder={getPlaceholder()}
            acceptedFileTypes=".txt,.tsv,.csv"
            fileTypeDescription="Text file (.txt, .tsv, .csv)"
            onClear={clearAll}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            error={error}
          />

          {/* Format Selection */}
          <div className="space-y-3 mt-4">
            <label className="block text-sm font-semibold text-gray-700">
              Input format
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="auto"
                  checked={inputFormat === 'auto'}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Auto-detect</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="plain"
                  checked={inputFormat === 'plain'}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Plain sequences</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="tab"
                  checked={inputFormat === 'tab'}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Tab-separated (ID\tSequence)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="labeled"
                  checked={inputFormat === 'labeled'}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Labeled (alternating lines)</span>
              </label>
            </div>
          </div>
        </div>

        <OutputSection
          output={output}
          outputFormat="FASTA"
          placeholder={
            isProcessing
              ? 'Converting to FASTA format...'
              : 'FASTA output will appear here automatically...'
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

export const getStaticProps = createToolStaticProps('txt-to-fasta');
