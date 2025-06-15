import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../../components/tools/ToolsLayout';
import InputSection from '../../components/tools/InputSection';
import OutputSection from '../../components/tools/OutputSection';
import ToolDocumentation from '../../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function DnaToProtein({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [translationOptions, setTranslationOptions] = useState({
    readingFrame: 'all',
    includeStopCodons: false,
    minProteinLength: 20,
    findOrfs: false,
    showNucleotidePositions: false,
    treatTAsU: false,
    showPositionRuler: true,
    useVisualMode: true,
  });

  // Standard genetic code - codon to amino acid mapping
  const geneticCode = {
    TTT: 'F',
    TTC: 'F',
    TTA: 'L',
    TTG: 'L',
    TCT: 'S',
    TCC: 'S',
    TCA: 'S',
    TCG: 'S',
    TAT: 'Y',
    TAC: 'Y',
    TAA: '*',
    TAG: '*',
    TGT: 'C',
    TGC: 'C',
    TGA: '*',
    TGG: 'W',
    CTT: 'L',
    CTC: 'L',
    CTA: 'L',
    CTG: 'L',
    CCT: 'P',
    CCC: 'P',
    CCA: 'P',
    CCG: 'P',
    CAT: 'H',
    CAC: 'H',
    CAA: 'Q',
    CAG: 'Q',
    CGT: 'R',
    CGC: 'R',
    CGA: 'R',
    CGG: 'R',
    ATT: 'I',
    ATC: 'I',
    ATA: 'I',
    ATG: 'M',
    ACT: 'T',
    ACC: 'T',
    ACA: 'T',
    ACG: 'T',
    AAT: 'N',
    AAC: 'N',
    AAA: 'K',
    AAG: 'K',
    AGT: 'S',
    AGC: 'S',
    AGA: 'R',
    AGG: 'R',
    GTT: 'V',
    GTC: 'V',
    GTA: 'V',
    GTG: 'V',
    GCT: 'A',
    GCC: 'A',
    GCA: 'A',
    GCG: 'A',
    GAT: 'D',
    GAC: 'D',
    GAA: 'E',
    GAG: 'E',
    GGT: 'G',
    GGC: 'G',
    GGA: 'G',
    GGG: 'G',
  };

  // Get reverse complement of DNA sequence
  const reverseComplement = (dnaSeq) => {
    const complement = {
      A: 'T',
      T: 'A',
      G: 'C',
      C: 'G',
      N: 'N',
      R: 'Y',
      Y: 'R',
      M: 'K',
      K: 'M',
      S: 'S',
      W: 'W',
      B: 'V',
      V: 'B',
      D: 'H',
      H: 'D',
    };

    return dnaSeq
      .split('')
      .reverse()
      .map((base) => complement[base] || base)
      .join('');
  };

  // Translate DNA sequence to protein in a specific reading frame
  const translateSequence = (dnaSeq, frame, options) => {
    let sequence = dnaSeq.toUpperCase();

    // Handle RNA sequences (U -> T)
    if (options.treatTAsU) {
      sequence = sequence.replace(/U/g, 'T');
    }

    // Handle negative reading frames (reverse complement)
    if (frame < 0) {
      sequence = reverseComplement(sequence);
      frame = Math.abs(frame);
    }

    // Adjust for reading frame (1-based to 0-based indexing)
    const startPos = frame - 1;
    let proteinSeq = '';
    let positions = [];

    // Translate codons
    for (let i = startPos; i < sequence.length - 2; i += 3) {
      const codon = sequence.substring(i, i + 3);
      if (codon.length === 3) {
        let aminoAcid = geneticCode[codon] || 'X';

        // Replace stop codons with "-" and continue translation
        if (aminoAcid === '*') {
          aminoAcid = options.includeStopCodons ? '*' : '-';
        }

        proteinSeq += aminoAcid;

        if (options.showNucleotidePositions) {
          positions.push(i + 1); // 1-based positioning
        }
      }
    }

    return {
      sequence: proteinSeq,
      positions: positions,
      startPosition: startPos + 1,
      frame: frame,
    };
  };

  // Find Open Reading Frames (ORFs)
  const findOrfs = (dnaSeq, options) => {
    const orfs = [];

    // Check all 6 reading frames
    for (let frame = 1; frame <= 3; frame++) {
      // Forward frames
      const forwardOrfs = findOrfsInFrame(dnaSeq, frame, options, false);
      orfs.push(...forwardOrfs);

      // Reverse complement frames
      const reverseOrfs = findOrfsInFrame(dnaSeq, frame, options, true);
      orfs.push(...reverseOrfs);
    }

    // Sort by length (longest first)
    return orfs.sort((a, b) => b.sequence.length - a.sequence.length);
  };

  // Find ORFs in a specific frame
  const findOrfsInFrame = (dnaSeq, frame, options, isReverse) => {
    let sequence = dnaSeq.toUpperCase();

    if (options.treatTAsU) {
      sequence = sequence.replace(/U/g, 'T');
    }

    if (isReverse) {
      sequence = reverseComplement(sequence);
    }

    const orfs = [];
    const startPos = frame - 1;
    let currentOrf = '';
    let orfStartPos = -1;
    let inOrf = false;

    for (let i = startPos; i < sequence.length - 2; i += 3) {
      const codon = sequence.substring(i, i + 3);
      if (codon.length === 3) {
        const aminoAcid = geneticCode[codon] || 'X';

        // Start codon (ATG -> M)
        if (codon === 'ATG' && !inOrf) {
          inOrf = true;
          currentOrf = 'M';
          orfStartPos = i;
        }
        // Continue ORF
        else if (inOrf) {
          if (aminoAcid === '*') {
            // Stop codon - end ORF
            if (currentOrf.length >= options.minProteinLength) {
              orfs.push({
                sequence: currentOrf,
                startPosition: orfStartPos + 1,
                endPosition: i + 3,
                frame: isReverse ? -frame : frame,
                length: currentOrf.length,
                strand: isReverse ? 'reverse' : 'forward',
              });
            }
            currentOrf = '';
            inOrf = false;
            orfStartPos = -1;
          } else {
            currentOrf += aminoAcid;
          }
        }
      }
    }

    // Handle ORF that extends to end of sequence
    if (inOrf && currentOrf.length >= options.minProteinLength) {
      orfs.push({
        sequence: currentOrf,
        startPosition: orfStartPos + 1,
        endPosition: sequence.length,
        frame: isReverse ? -frame : frame,
        length: currentOrf.length,
        strand: isReverse ? 'reverse' : 'forward',
      });
    }

    return orfs;
  };

  // Convert DNA sequences to protein
  const convertDnaToProtein = (fastaText, options) => {
    try {
      const sequences = parseFastaInput(fastaText);
      if (sequences.length === 0) {
        throw new Error('No valid DNA sequences found in input');
      }

      const results = [];

      for (const seq of sequences) {
        if (options.findOrfs) {
          // Find ORFs mode
          const orfs = findOrfs(seq.sequence, options);

          if (orfs.length === 0) {
            results.push({
              header: seq.header.replace(/^>/, '>No_ORFs_found_'),
              sequence: '',
              info: 'No ORFs found meeting minimum length criteria',
            });
          } else {
            orfs.forEach((orf, index) => {
              results.push({
                header: seq.header.replace(
                  /^>/,
                  `>ORF${index + 1}_frame${orf.frame}_`
                ),
                sequence: orf.sequence,
                info: `Frame: ${orf.frame}, Strand: ${orf.strand}, Length: ${orf.length} aa, Pos: ${orf.startPosition}-${orf.endPosition}`,
              });
            });
          }
        } else {
          // Specific reading frame mode
          if (options.readingFrame === 'all') {
            // Translate all 6 reading frames
            for (let frame = 1; frame <= 3; frame++) {
              // Forward frames
              const forwardResult = translateSequence(
                seq.sequence,
                frame,
                options
              );
              if (forwardResult.sequence.length > 0) {
                results.push({
                  header: seq.header.replace(/^>/, `>Frame${frame}_`),
                  sequence: forwardResult.sequence,
                  info: `Reading frame: +${frame}, Length: ${forwardResult.sequence.length} aa`,
                });
              }

              // Reverse frames
              const reverseResult = translateSequence(
                seq.sequence,
                -frame,
                options
              );
              if (reverseResult.sequence.length > 0) {
                results.push({
                  header: seq.header.replace(/^>/, `>Frame${-frame}_`),
                  sequence: reverseResult.sequence,
                  info: `Reading frame: ${-frame}, Length: ${reverseResult.sequence.length} aa`,
                });
              }
            }
          } else {
            // Single reading frame
            const frame = parseInt(options.readingFrame);
            const result = translateSequence(seq.sequence, frame, options);
            results.push({
              header: seq.header.replace(/^>/, `>Frame${frame}_`),
              sequence: result.sequence,
              info: `Reading frame: ${frame > 0 ? '+' : ''}${frame}, Length: ${result.sequence.length} aa`,
            });
          }
        }
      }

      return formatProteinOutput(results);
    } catch (err) {
      throw new Error(`Translation failed: ${err.message}`);
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
            sequence: currentSequence.replace(/\s/g, ''),
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
        sequence: currentSequence.replace(/\s/g, ''),
      });
    }

    return sequences;
  };

  // Format output for display
  const formatProteinOutput = (results) => {
    if (translationOptions.findOrfs) {
      // FASTA format for ORF mode
      let output = '';
      for (const result of results) {
        output += result.header + '\n';
        if (result.info) {
          output += `# ${result.info}\n`;
        }
        // Break sequence into 80-character lines
        for (let i = 0; i < result.sequence.length; i += 80) {
          output += result.sequence.substring(i, i + 80) + '\n';
        }
      }
      return output.trim();
    } else {
      // Return raw results for visual processing
      return results;
    }
  };

  // Create visual highlighted content for a reading frame
  const createHighlightedContent = (sequence, frame, showRuler = true) => {
    const elements = [];

    // Add position ruler if enabled
    if (showRuler && sequence.length > 20) {
      let rulerLine = '';
      for (let i = 0; i < sequence.length; i += 10) {
        const pos = (i + 1).toString();
        rulerLine += pos.padEnd(10, ' ');
      }
      elements.push(
        <div key="ruler" className="text-gray-400 text-xs mb-2 tracking-wider">
          {rulerLine}
        </div>
      );
    }

    // Find ORFs (sequences starting with M and continuing for 20+ amino acids before stop codon)
    const orfs = [];
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i] === 'M') {
        const remainingSequence = sequence.substring(i);
        const nextStopIndex = remainingSequence.indexOf('-');
        const orfLength =
          nextStopIndex === -1 ? remainingSequence.length : nextStopIndex;

        if (orfLength >= 20) {
          orfs.push({
            start: i,
            end: nextStopIndex === -1 ? sequence.length : i + nextStopIndex,
          });
        }
      }
    }

    // Process the entire sequence without line breaks
    const segments = [];
    let currentSegment = '';
    let currentClass = '';

    for (let i = 0; i < sequence.length; i++) {
      const aa = sequence[i];
      let newClass = '';

      // Check if this position is within an ORF
      const isInOrf = orfs.some((orf) => i >= orf.start && i < orf.end);

      if (isInOrf) {
        newClass = 'p-1 mx-0.5 px-0.5 border rounded bg-red-100 border-red-200';
      } else if (aa === 'M') {
        newClass = 'bg-red-200 text-red-800 font-bold px-1 rounded';
      } else if (aa === '-') {
        newClass = 'bg-gray-800 text-white font-bold px-1 rounded';
      } else if (aa === 'X') {
        newClass = 'bg-yellow-200 text-yellow-800 px-1 rounded';
      }

      if (newClass !== currentClass) {
        if (currentSegment) {
          segments.push(
            currentClass ? (
              <span key={segments.length} className={currentClass}>
                {currentSegment}
              </span>
            ) : (
              currentSegment
            )
          );
        }
        currentSegment = aa;
        currentClass = newClass;
      } else {
        currentSegment += aa;
      }
    }

    // Add final segment
    if (currentSegment) {
      segments.push(
        currentClass ? (
          <span key={segments.length} className={currentClass}>
            {currentSegment}
          </span>
        ) : (
          currentSegment
        )
      );
    }

    elements.push(
      <div key="sequence" className="mb-1 leading-8 tracking-wider">
        {segments}
      </div>
    );

    return <div>{elements}</div>;
  };

  // Convert styled content back to plain text for copying
  const convertToPlainText = (results) => {
    if (Array.isArray(results)) {
      let output = '';

      // Group by strand
      const forwardFrames = results.filter(
        (r) => r.info && r.info.includes('+')
      );
      const reverseFrames = results.filter(
        (r) => r.info && r.info.includes('Reading frame: -')
      );

      output +=
        '# Legend: M = Start codon (Methionine), - = Stop codon (translation continues), X = Unknown amino acid\n\n';

      if (forwardFrames.length > 0) {
        output += "=== 5' → 3' Frames (Forward Strand) ===\n\n";

        for (const result of forwardFrames) {
          const frameMatch = result.info.match(/Reading frame: \+?(\d+)/);
          const frame = frameMatch ? frameMatch[1] : '';

          output += `> Frame +${frame} (Length: ${result.sequence.length} amino acids)\n`;

          // Break into 80-character lines
          for (let i = 0; i < result.sequence.length; i += 80) {
            output += result.sequence.substring(i, i + 80) + '\n';
          }

          output += '\n';
        }
      }

      if (reverseFrames.length > 0) {
        output += "=== 3' → 5' Frames (Reverse Strand) ===\n\n";

        for (const result of reverseFrames) {
          const frameMatch = result.info.match(/Reading frame: (-\d+)/);
          const frame = frameMatch ? frameMatch[1] : '';

          output += `> Frame ${frame} (Length: ${result.sequence.length} amino acids)\n`;

          // Break into 80-character lines
          for (let i = 0; i < result.sequence.length; i += 80) {
            output += result.sequence.substring(i, i + 80) + '\n';
          }

          output += '\n';
        }
      }

      return output.trim();
    }

    return typeof results === 'string' ? results : '';
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(
        /\.(fasta|fas|fa|txt)$/i,
        ''
      );
      return `${nameWithoutExt}_protein.fasta`;
    }
    return 'dna_to_protein.fasta';
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
          const result = convertDnaToProtein(input, translationOptions);
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
  }, [input, translationOptions]);

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
    const textToCopy = convertToPlainText(output);
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const downloadFile = () => {
    const textToDownload = convertToPlainText(output);
    const blob = new Blob([textToDownload], { type: 'text/plain' });
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
      title="DNA to Protein converter"
      description="Translate DNA sequences to protein sequences. Find open reading frames (ORFs) or translate specific reading frames with comprehensive analysis options."
      h1="DNA to Protein converter"
      subtitle="Translate your DNA sequences to protein sequences. Upload a FASTA file or paste your DNA sequences below."
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <InputSection
            input={input}
            onInputChange={setInput}
            inputFormat="FASTA (DNA/RNA)"
            placeholder=">sequence1&#10;ATGAAAGTTCTCTGGAAGCTGCATTACTAGTAACATTTCTAGCGGGCTGCCAAGCAAAGGTTGAACAAGCCGTCGAAACGGAGCCAGAGCCAGAGCTACGACAACAGACAGAATGGCAGAGCGGACAAAGATGGGAGCTGGCCCTGGGGAGATTTTTGGGACTACCTGCGATGGGTACAGACCCTATCTGAGCAGGTACAAGAAGAGCTCCTT&#10;>sequence2&#10;ATGGGCAGTAGCAAGTCCAAGCCAAAGGATCCCAGCCAGCGCCGCTCGAGCTCTGATCACGAGGATGAGGATCTCCGGCCACTGTTAAATGAGCGAGCACTGCAGAAGGAAGCATTGCCCAAGAGCCTCTCTTCCCGAGGCCGGAAACAACGGCTCCACTTTGCCGACTACAAGTTTCAAGAAGTCAAGCAAGCGGAGAGCCTGCGG&#10;&#10;Note: Supports both DNA (ATGC) and RNA (AUGC) sequences"
            acceptedFileTypes=".fasta,.fas,.fa,.txt"
            fileTypeDescription="FASTA file (.fasta, .fas, .fa, .txt)"
            onClear={clearAll}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            error={error}
          />

          {/* Translation Options */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">
              Translation options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Translation Mode */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Translation mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      checked={!translationOptions.findOrfs}
                      onChange={() =>
                        setTranslationOptions((prev) => ({
                          ...prev,
                          findOrfs: false,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Translate reading frames</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      checked={translationOptions.findOrfs}
                      onChange={() =>
                        setTranslationOptions((prev) => ({
                          ...prev,
                          findOrfs: true,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Find Open Reading Frames (ORFs)
                    </span>
                  </label>
                </div>
              </div>

              {/* Reading Frame Selection */}
              {!translationOptions.findOrfs && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Reading frame
                  </label>
                  <select
                    value={translationOptions.readingFrame}
                    onChange={(e) =>
                      setTranslationOptions((prev) => ({
                        ...prev,
                        readingFrame: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All 6 reading frames</option>
                    <option value="1">Frame +1 (forward)</option>
                    <option value="2">Frame +2 (forward)</option>
                    <option value="3">Frame +3 (forward)</option>
                    <option value="-1">Frame -1 (reverse)</option>
                    <option value="-2">Frame -2 (reverse)</option>
                    <option value="-3">Frame -3 (reverse)</option>
                  </select>
                </div>
              )}

              {/* ORF Settings */}
              {translationOptions.findOrfs && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Minimum ORF length (amino acids)
                  </label>
                  <input
                    type="number"
                    value={translationOptions.minProteinLength}
                    onChange={(e) =>
                      setTranslationOptions((prev) => ({
                        ...prev,
                        minProteinLength: parseInt(e.target.value) || 20,
                      }))
                    }
                    min="1"
                    max="10000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
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
                    checked={translationOptions.includeStopCodons}
                    onChange={(e) =>
                      setTranslationOptions((prev) => ({
                        ...prev,
                        includeStopCodons: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Include stop codons (*) in output
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={translationOptions.treatTAsU}
                    onChange={(e) =>
                      setTranslationOptions((prev) => ({
                        ...prev,
                        treatTAsU: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Treat T as U (for RNA sequences)
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Display options
                </h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={translationOptions.useVisualMode}
                    onChange={(e) =>
                      setTranslationOptions((prev) => ({
                        ...prev,
                        useVisualMode: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Use visual highlighting</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={translationOptions.showPositionRuler}
                    onChange={(e) =>
                      setTranslationOptions((prev) => ({
                        ...prev,
                        showPositionRuler: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Show position ruler in output</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Output Display */}
        {translationOptions.findOrfs ? (
          // ORF Mode - Single output with FASTA format
          <OutputSection
            output={typeof output === 'string' ? output : ''}
            outputFormat="FASTA (Protein)"
            placeholder={
              isProcessing
                ? 'Finding open reading frames...'
                : 'ORF sequences will appear here automatically...'
            }
            onCopy={copyToClipboard}
            onDownload={downloadFile}
            downloadFilename={getDownloadFilename()}
          />
        ) : (
          // Reading Frame Mode - Visual display with multiple outputs
          <div className="space-y-8">
            {/* Legend */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-red border-red">ORF</span>
                  <span>Open Reading Frame (20+ amino acids)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-200 text-red-800 font-bold px-2 py-1 rounded">
                    M
                  </span>
                  <span>Start codon (Methionine)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-800 text-white font-bold px-2 py-1 rounded">
                    -
                  </span>
                  <span>Stop codon (translation continues)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                    X
                  </span>
                  <span>Unknown amino acid</span>
                </div>
              </div>
            </div>

            {Array.isArray(output) && output.length > 0 ? (
              <>
                {/* Forward Frames */}
                {output.filter((r) => r.info && r.info.includes('+')).length >
                  0 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
                      5' → 3' Frames (Forward Strand)
                    </h3>
                    {[1, 2, 3].map((frame) => {
                      const frameResult = output.find(
                        (r) =>
                          r.info && r.info.includes(`Reading frame: +${frame}`)
                      );
                      if (!frameResult) return null;

                      const orfCount = (
                        frameResult.sequence.match(/M[^-]{19,}/g) || []
                      ).length;

                      return (
                        <OutputSection
                          key={`forward-${frame}`}
                          output={convertToPlainText([frameResult])}
                          outputFormat={`Frame +${frame} • ${frameResult.sequence.length} amino acids • ${orfCount} potential ORFs`}
                          placeholder="Translation will appear here..."
                          onCopy={() => {
                            navigator.clipboard
                              .writeText(frameResult.sequence)
                              .then(() => {
                                alert('Frame sequence copied to clipboard!');
                              });
                          }}
                          onDownload={() => {
                            const blob = new Blob([frameResult.sequence], {
                              type: 'text/plain',
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `frame_+${frame}_${getDownloadFilename()}`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          downloadFilename={`frame_+${frame}_${getDownloadFilename()}`}
                          isStyled={
                            translationOptions.useVisualMode &&
                            !translationOptions.findOrfs
                          }
                          styledContent={
                            translationOptions.useVisualMode &&
                            !translationOptions.findOrfs
                              ? createHighlightedContent(
                                  frameResult.sequence,
                                  frame,
                                  translationOptions.showPositionRuler
                                )
                              : null
                          }
                        />
                      );
                    })}
                  </div>
                )}

                {/* Reverse Frames */}
                {output.filter(
                  (r) => r.info && r.info.includes('Reading frame: -')
                ).length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
                      3' → 5' Frames (Reverse Strand)
                    </h3>
                    {[-1, -2, -3].map((frame) => {
                      const frameResult = output.find(
                        (r) =>
                          r.info && r.info.includes(`Reading frame: ${frame}`)
                      );
                      if (!frameResult) return null;

                      const orfCount = (
                        frameResult.sequence.match(/M[^-]{19,}/g) || []
                      ).length;

                      return (
                        <OutputSection
                          key={`reverse-${frame}`}
                          output={convertToPlainText([frameResult])}
                          outputFormat={`Frame ${frame} • ${frameResult.sequence.length} amino acids • ${orfCount} potential ORFs`}
                          placeholder="Translation will appear here..."
                          onCopy={() => {
                            navigator.clipboard
                              .writeText(frameResult.sequence)
                              .then(() => {
                                alert('Frame sequence copied to clipboard!');
                              });
                          }}
                          onDownload={() => {
                            const blob = new Blob([frameResult.sequence], {
                              type: 'text/plain',
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `frame_${frame}_${getDownloadFilename()}`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          downloadFilename={`frame_${frame}_${getDownloadFilename()}`}
                          isStyled={
                            translationOptions.useVisualMode &&
                            !translationOptions.findOrfs
                          }
                          styledContent={
                            translationOptions.useVisualMode &&
                            !translationOptions.findOrfs
                              ? createHighlightedContent(
                                  frameResult.sequence,
                                  frame,
                                  translationOptions.showPositionRuler
                                )
                              : null
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-gray-500 border border-gray-300 rounded-lg">
                {isProcessing ? (
                  <>
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mb-2"></div>
                    <p>Translating DNA to protein sequences...</p>
                  </>
                ) : error ? (
                  <div className="text-red-600">
                    <p className="font-medium">Translation Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                ) : (
                  <>
                    <p>Protein sequences will appear here automatically...</p>
                    <p className="text-sm mt-2">
                      Enter DNA sequences above to see translation results
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Documentation */}
      <ToolDocumentation mdxSource={mdxSource} frontMatter={frontMatter} />
    </ToolsLayout>
  );
}

export const getStaticProps = createToolStaticProps('dna-to-protein');
