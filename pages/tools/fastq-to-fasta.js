import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../../components/tools/ToolsLayout';
import InputSection from '../../components/tools/InputSection';
import OutputSection from '../../components/tools/OutputSection';
import ToolDocumentation from '../../components/tools/ToolDocumentation';
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
      title="FASTQ to FASTA converter"
      description="Convert FASTQ sequence files to FASTA format instantly. Free browser-based tool with drag & drop upload, no installation required. Perfect for bioinformatics research."
      h1="FASTQ to FASTA converter"
      subtitle="Convert your FASTQ sequence files to FASTA format. Upload a file or paste your FASTQ data below."
    >
      <div className="flex flex-col gap-16">
        <InputSection
          input={input}
          onInputChange={setInput} // Changed this
          inputFormat="FASTQ"
          placeholder="@SEQ_ID_1&#10;GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT&#10;+&#10;!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65"
          acceptedFileTypes=".fastq,.fq,.txt"
          fileTypeDescription="FASTQ file (.fastq, .fq, .txt)"
          onClear={clearAll} // Changed this
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
          error={error}
        />

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
