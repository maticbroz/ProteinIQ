import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../components/tools/ToolsLayout';
import OutputSection from '../components/tools/OutputSection';
import ToolDocumentation from '../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function FastqToFasta({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState(''); // Track uploaded filename
  const fileInputRef = useRef(null);

  // Convert FASTQ to FASTA
  const convertFastqToFasta = (fastqText) => {
    try {
      const lines = fastqText.trim().split('\n');
      const fastaLines = [];

      for (let i = 0; i < lines.length; i += 4) {
        if (i + 3 >= lines.length) break;

        const header = lines[i];
        const sequence = lines[i + 1];
        const plus = lines[i + 2];
        const quality = lines[i + 3];

        // Validate FASTQ format
        if (!header.startsWith('@')) {
          throw new Error(
            `Invalid FASTQ format: Header at line ${i + 1} should start with '@'`
          );
        }
        if (!plus.startsWith('+')) {
          throw new Error(
            `Invalid FASTQ format: Plus line at line ${i + 3} should start with '+'`
          );
        }

        const fastaHeader = '>' + header.substring(1);
        fastaLines.push(fastaHeader);
        fastaLines.push(sequence);
      }

      return fastaLines.join('\n');
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      // Remove existing extension and add .fasta
      const nameWithoutExt = uploadedFilename.replace(/\.(fastq|fq|txt)$/i, '');
      return `${nameWithoutExt}.fasta`;
    }
    return 'converted.fasta';
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

      // Add a small delay to ensure the processing indicator is visible
      setTimeout(() => {
        try {
          const result = convertFastqToFasta(input);
          setOutput(result);
        } catch (err) {
          setError(err.message);
          setOutput('');
        } finally {
          setIsProcessing(false);
        }
      }, 100); // Small delay to show processing indicator
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [input]);

  const handleFileUpload = (file) => {
    if (!file) return;

    setIsUploading(true);
    setError('');
    setUploadedFilename(file.name); // Store the filename

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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (
      file &&
      (file.type === 'text/plain' ||
        file.name.endsWith('.fastq') ||
        file.name.endsWith('.fq'))
    ) {
      handleFileUpload(file);
    } else {
      setError(`Please upload a valid FASTQ file (.fastq, .fq, or .txt)`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      // You could add a toast notification here
      alert(`Copied to clipboard!`);
    });
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getDownloadFilename(); // Use the dynamic filename
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
    setUploadedFilename(''); // Clear the filename
  };

  return (
    <ToolsLayout
      title="FASTQ to FASTA Converter - Free Online Tool | ProteinIQ"
      description="Convert FASTQ sequence files to FASTA format instantly. Free browser-based tool with drag & drop upload, no installation required. Perfect for bioinformatics research."
      h1="FASTQ to FASTA converter"
      subtitle="Convert your FASTQ sequence files to FASTA format. Upload a file or paste your FASTQ data below."
    >
      <div className="flex flex-col gap-16">
        {/* Input Section */}
        <div className="space-y-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Input (FASTQ Format)
          </label>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Text Area */}
            <div className="w-full border border-gray-300 rounded-lg bg-white font-mono text-sm overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="@SEQ_ID_1&#10;GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT&#10;+&#10;!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65"
                className="p-4 w-full h-64 bg-transparent border-none resize-none"
              ></textarea>
              <div className="flex justify-between items-center border-t bg-gray-50 border-gray-200 px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={clearAll}
                    title="Clear All"
                    className="p-2 text-gray-700 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!input}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                    </svg>
                  </button>
                </div>
                <span className="text-gray-600 text-sm">FASTQ</span>
              </div>
            </div>
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors relative lg:w-1/3 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {isUploading ? (
                <div className="space-y-3">
                  <div className="mx-auto h-12 w-12 text-blue-500">
                    <svg
                      className="animate-spin h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Loading...
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span
                        className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Click to upload
                      </span>{' '}
                      or drag and drop a
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      FASTQ file (.fastq, .fq, .txt)
                    </p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".fastq,.fq,.txt"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Output Section */}
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

export const getStaticProps = createToolStaticProps('fastq-to-fasta');
