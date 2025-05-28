import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../components/tools/ToolsLayout';
import OutputSection from '../components/tools/OutputSection';
import ToolDocumentation from '../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../components/utils/loadToolDocumentation';

export default function FastqToFasta({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
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

      try {
        const result = convertFastqToFasta(input);
        setOutput(result);
      } catch (err) {
        setError(err.message);
        setOutput('');
      } finally {
        setIsProcessing(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [input]);

  const handleFileUpload = (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const reader = new FileReader();

    // Track progress for large files
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percentLoaded);
      }
    };

    reader.onload = (e) => {
      setInput(e.target.result);
      setIsUploading(false);
      setUploadProgress(0);
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
      setUploadProgress(0);
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
    a.download = 'converted.fasta';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <ToolsLayout
      title="FASTQ to FASTA converter - ProteinIQ"
      h1="FASTQ to FASTA converter"
      subtitle="Convert your FASTQ sequence files to FASTA format. Upload a file or paste your FASTQ data below."
    >

          <div className="flex flex-col gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Input (FASTQ Format)
              </label>
              <div className="flex flex-col lg:flex-row gap-6">
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
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Uploading... {uploadProgress}%
                        </p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
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

                {/* Text Area */}
                <div className="lg:w-2/3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="@SEQ_ID_1&#10;GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT&#10;+&#10;!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65&#10;@SEQ_ID_2&#10;AGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTC&#10;+&#10;IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII"
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-end">
                <button
                  onClick={clearAll}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Converting to FASTA format...
                  </p>
                </div>
              )}

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
              placeholder="FASTA output will appear here automatically..."
              onCopy={copyToClipboard}
              onDownload={downloadFile}
              downloadFilename="converted.fasta"
            />
          </div>

          {/* Documentation */}
          <ToolDocumentation mdxSource={mdxSource} frontMatter={frontMatter} />

    </ToolsLayout>
  );
}

export const getStaticProps = createToolStaticProps('fastq-to-fasta');
