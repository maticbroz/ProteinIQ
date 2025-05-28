import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../components/tools/ToolsLayout';
import OutputSection from '../components/tools/OutputSection';

export default function FastqToFasta() {
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
    <ToolsLayout title="FASTQ to FASTA converter - ProteinIQ">
      <div className="pb-12 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FASTQ to FASTA converter
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Convert your FASTQ sequence files to FASTA format. Upload a file
              or paste your FASTQ data below.
            </p>
          </div>

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

          <section className="prose">
            <div className="mt-16 border-t pt-12">
              <h1>FASTQ to FASTA conversion</h1>

              <p>
                Convert sequence data between FASTQ and FASTA formats for
                bioinformatics workflows.
              </p>

              <p>
                <strong>FASTQ format</strong> is a text-based format for storing
                nucleotide sequences along with their corresponding quality
                scores. Each sequence entry consists of four lines: a sequence
                identifier starting with '@', the raw sequence, a separator line
                starting with '+', and quality scores encoded as ASCII
                characters. FASTQ files are commonly generated by
                high-throughput sequencing platforms and contain both the
                biological sequence data and per-base quality information
                essential for downstream analysis.
              </p>

              <p>
                <strong>FASTA format</strong> is a simpler text-based format
                that stores nucleotide or protein sequences without quality
                information. Each sequence entry consists of a header line
                starting with '&gt;' followed by the sequence identifier and
                description, and subsequent lines containing the actual sequence
                data. FASTA is widely used for reference genomes, gene
                databases, and applications where quality scores are not
                required.
              </p>

              <h2>FASTQ format example</h2>

              <p>
                Here's a typical FASTQ file structure with two sequence reads:
              </p>

              <pre>
                <code>{`@SRR123456.1 HWI-ST1234:100:C1234ACXX:1:1101:1000:2000 1:N:0:ATCACG
GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT
+
!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65
@SRR123456.2 HWI-ST1234:100:C1234ACXX:1:1101:1001:2001 1:N:0:ATCACG
ACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGT
+
IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII`}</code>
              </pre>

              <h2>FASTA format example</h2>

              <p>The same sequences converted to FASTA format:</p>

              <pre>
                <code>{`>SRR123456.1 HWI-ST1234:100:C1234ACXX:1:1101:1000:2000 1:N:0:ATCACG
GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT
>SRR123456.2 HWI-ST1234:100:C1234ACXX:1:1101:1001:2001 1:N:0:ATCACG
ACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGTACGT`}</code>
              </pre>

              <h2>Get started with conversion</h2>

              <p>
                FASTQ to FASTA conversion can be performed using various
                programming languages and bioinformatics tools. Here are
                examples using different approaches.
              </p>

              <p>Basic conversion using Python</p>

              <pre>
                <code>{`def fastq_to_fasta(input_fastq, output_fasta):
    """Convert FASTQ file to FASTA format."""
    with open(input_fastq, 'r') as infile, open(output_fasta, 'w') as outfile:
        line_count = 0
        for line in infile:
            line = line.strip()
            if line_count % 4 == 0:  # Header line
                # Replace @ with > for FASTA format
                fasta_header = '>' + line[1:]
                outfile.write(fasta_header + '\n')
            elif line_count % 4 == 1:  # Sequence line
                outfile.write(line + '\n')
            # Skip quality header (line_count % 4 == 2) and quality scores (line_count % 4 == 3)
            line_count += 1

# Usage
fastq_to_fasta('input.fastq', 'output.fasta')`}</code>
              </pre>

              <p>Using BioPython for robust parsing</p>

              <pre>
                <code>{`from Bio import SeqIO

def convert_fastq_to_fasta(input_file, output_file):
    """Convert FASTQ to FASTA using BioPython."""
    sequences = SeqIO.parse(input_file, "fastq")
    count = SeqIO.write(sequences, output_file, "fasta")
    return count

# Convert with quality filtering
def convert_with_quality_filter(input_file, output_file, min_quality=20):
    """Convert FASTQ to FASTA with quality filtering."""
    with open(output_file, 'w') as output_handle:
        for record in SeqIO.parse(input_file, "fastq"):
            # Calculate average quality score
            avg_quality = sum(record.letter_annotations["phred_quality"]) / len(record)
            if avg_quality >= min_quality:
                SeqIO.write(record, output_handle, "fasta")

# Usage
convert_fastq_to_fasta('input.fastq', 'output.fasta')
convert_with_quality_filter('input.fastq', 'filtered_output.fasta', min_quality=25)`}</code>
              </pre>

              <p>Command-line conversion using standard tools</p>

              <pre>
                <code>{`# Using seqtk (fast and memory efficient)
seqtk seq -a input.fastq > output.fasta

# Using awk (simple one-liner)
awk 'NR%4==1{print ">" substr($0,2)} NR%4==2{print}' input.fastq > output.fasta

# Using sed (stream editor approach)
sed -n '1~4s/^@/>/p;2~4p' input.fastq > output.fasta`}</code>
              </pre>

              <p>Advanced conversion with R</p>

              <pre>
                <code>{`library(Biostrings)
library(ShortRead)

# Read FASTQ file
fastq_data <- readFastq("input.fastq")

# Convert to FASTA
fasta_data <- DNAStringSet(sread(fastq_data))
names(fasta_data) <- as.character(id(fastq_data))

# Write FASTA file
writeXStringSet(fasta_data, "output.fasta")

# With quality filtering
quality_scores <- quality(fastq_data)
min_quality <- 20
keep_indices <- alphabetScore(quality_scores) / width(quality_scores) >= min_quality
filtered_fasta <- fasta_data[keep_indices]
writeXStringSet(filtered_fasta, "filtered_output.fasta")`}</code>
              </pre>

              <h2>How conversion works</h2>

              <p>
                The conversion process involves extracting specific lines from
                the FASTQ format and reformatting them for FASTA output. FASTQ
                files follow a strict four-line pattern for each sequence entry,
                while FASTA uses a simpler two-line pattern.
              </p>

              <p>Here's the line-by-line transformation:</p>

              <h3>Quality score handling</h3>

              <p>
                During conversion, quality scores are typically discarded since
                FASTA format doesn't support them. However, you can implement
                quality-based filtering to exclude low-quality sequences before
                conversion. Quality scores in FASTQ are encoded using ASCII
                characters, where higher ASCII values represent better base call
                confidence.
              </p>

              <h3>Memory considerations</h3>

              <p>
                For large FASTQ files, consider using streaming approaches that
                process one sequence at a time rather than loading the entire
                file into memory. Tools like <code>{`seqtk`}</code> and
                BioPython's <code>{`SeqIO.parse()`}</code> function provide
                memory-efficient parsing capabilities.
              </p>

              <h3>Preserving metadata</h3>

              <p>
                When converting from FASTQ to FASTA, ensure that important
                metadata in sequence headers is preserved. Some analysis
                pipelines depend on specific header formats, so maintain
                compatibility with downstream tools.
              </p>

              <h2>Batch processing</h2>

              <p>
                For processing multiple files or implementing automated
                workflows, consider these batch processing approaches:
              </p>

              <p>Processing multiple files with Python</p>

              <pre>
                <code>{`import os
import glob
from pathlib import Path

def batch_convert_fastq_to_fasta(input_dir, output_dir, pattern="*.fastq"):
    """Convert all FASTQ files in a directory to FASTA format."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    fastq_files = glob.glob(os.path.join(input_dir, pattern))
    
    for fastq_file in fastq_files:
        base_name = Path(fastq_file).stem
        fasta_file = os.path.join(output_dir, f"{base_name}.fasta")
        
        convert_fastq_to_fasta(fastq_file, fasta_file)
        print(f"Converted: {fastq_file} -> {fasta_file}")

# Usage
batch_convert_fastq_to_fasta("./fastq_files", "./fasta_files")`}</code>
              </pre>

              <p>Shell script for batch processing</p>

              <pre>
                <code>{`#!/bin/bash

# Batch convert all FASTQ files in current directory
for fastq_file in *.fastq; do
    base_name=\$(basename "\$fastq_file" .fastq)
    fasta_file="\${base_name}.fasta"
    
    echo "Converting \$fastq_file to \$fasta_file"
    seqtk seq -a "\$fastq_file" > "\$fasta_file"
done

echo "Batch conversion complete"`}</code>
              </pre>

              <h3>Parallel processing</h3>

              <p>
                For improved performance with large datasets, consider parallel
                processing:
              </p>

              <pre>
                <code>{`import multiprocessing as mp
from functools import partial

def parallel_conversion(input_files, output_dir, num_processes=4):
    """Convert FASTQ files to FASTA using parallel processing."""
    convert_func = partial(process_single_file, output_dir=output_dir)
    
    with mp.Pool(processes=num_processes) as pool:
        pool.map(convert_func, input_files)

def process_single_file(input_file, output_dir):
    """Process a single FASTQ file."""
    base_name = Path(input_file).stem
    output_file = os.path.join(output_dir, f"{base_name}.fasta")
    convert_fastq_to_fasta(input_file, output_file)

# Usage
input_files = glob.glob("./data/*.fastq")
parallel_conversion(input_files, "./output", num_processes=8)`}</code>
              </pre>

              <h2>Best practices</h2>

              <p>
                When converting FASTQ to FASTA files, follow these
                recommendations for optimal results:
              </p>

              <ul>
                <li>
                  <strong>Validate input format</strong>: Ensure FASTQ files are
                  properly formatted before conversion to avoid parsing errors
                </li>
                <li>
                  <strong>Quality filtering</strong>: Consider implementing
                  quality thresholds to exclude low-confidence sequences
                </li>
                <li>
                  <strong>Preserve headers</strong>: Maintain sequence
                  identifiers and relevant metadata during conversion
                </li>
                <li>
                  <strong>Handle paired-end data</strong>: For paired-end
                  sequencing data, maintain the relationship between forward and
                  reverse reads
                </li>
                <li>
                  <strong>Use appropriate tools</strong>: Choose conversion
                  tools based on file size, performance requirements, and
                  available computational resources
                </li>
                <li>
                  <strong>Verify output</strong>: Validate converted FASTA files
                  to ensure data integrity and correct formatting
                </li>
              </ul>

              <h3>Error handling</h3>

              <p>Implement robust error handling for production workflows:</p>

              <pre>
                <code>{`def safe_fastq_to_fasta(input_file, output_file):
    """Convert FASTQ to FASTA with comprehensive error handling."""
    try:
        if not os.path.exists(input_file):
            raise FileNotFoundError(f"Input file not found: {input_file}")
        
        if os.path.getsize(input_file) == 0:
            raise ValueError(f"Input file is empty: {input_file}")
        
        sequences_converted = convert_fastq_to_fasta(input_file, output_file)
        
        if sequences_converted == 0:
            raise ValueError("No sequences were converted")
        
        print(f"Successfully converted {sequences_converted} sequences")
        return True
        
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        return False`}</code>
              </pre>

              <h2>Use case examples</h2>

              <p>
                FASTQ to FASTA conversion is essential for many bioinformatics
                workflows. Common applications include preparing reference
                sequences, creating input for alignment tools, and format
                compatibility requirements.
              </p>
            </div>
          </section>
        </div>
      </div>
    </ToolsLayout>
  );
}
