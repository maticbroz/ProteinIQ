import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../components/tools/ToolsLayout';
import InputSection from '../components/tools/InputSection';
import OutputSection from '../components/tools/OutputSection';
import ToolDocumentation from '../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function SdfToPdb({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [conversionOptions, setConversionOptions] = useState({
    includeConnect: true,
    includeHeader: true,
    chainId: 'A',
    moleculeName: 'UNL', // Unknown ligand
    preserveCharges: true,
  });

  // Element symbol to atomic number mapping for validation
  const elementMap = {
    H: 1,
    He: 2,
    Li: 3,
    Be: 4,
    B: 5,
    C: 6,
    N: 7,
    O: 8,
    F: 9,
    Ne: 10,
    Na: 11,
    Mg: 12,
    Al: 13,
    Si: 14,
    P: 15,
    S: 16,
    Cl: 17,
    Ar: 18,
    K: 19,
    Ca: 20,
    Sc: 21,
    Ti: 22,
    V: 23,
    Cr: 24,
    Mn: 25,
    Fe: 26,
    Co: 27,
    Ni: 28,
    Cu: 29,
    Zn: 30,
    Ga: 31,
    Ge: 32,
    As: 33,
    Se: 34,
    Br: 35,
    Kr: 36,
    I: 53,
  };

  // Convert SDF to PDB
  const convertSdfToPdb = (sdfText, options) => {
    try {
      const molecules = parseSDF(sdfText);
      if (molecules.length === 0) {
        throw new Error('No valid molecules found in SDF file');
      }

      let pdbContent = '';

      for (let molIndex = 0; molIndex < molecules.length; molIndex++) {
        const molecule = molecules[molIndex];

        if (options.includeHeader) {
          pdbContent += generatePDBHeader(molecule, molIndex + 1, options);
        }

        pdbContent += generateATOMRecords(molecule, options, molIndex + 1);

        if (options.includeConnect && molecule.bonds.length > 0) {
          pdbContent += generateCONECTRecords(molecule);
        }

        pdbContent += 'END\n';

        if (molIndex < molecules.length - 1) {
          pdbContent += '\n'; // Separate multiple molecules
        }
      }

      return pdbContent;
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Parse SDF file format
  const parseSDF = (sdfText) => {
    const molecules = [];
    const molBlocks = sdfText.split('$$$$').filter((block) => block.trim());

    for (const block of molBlocks) {
      try {
        const molecule = parseMolBlock(block.trim());
        if (molecule) {
          molecules.push(molecule);
        }
      } catch (err) {
        console.warn('Failed to parse molecule block:', err.message);
      }
    }

    return molecules;
  };

  // Parse individual MOL block
  const parseMolBlock = (molBlock) => {
    const lines = molBlock.split('\n');
    if (lines.length < 4) {
      throw new Error('Invalid MOL block: too few lines');
    }

    // Parse header
    const molName = lines[0].trim() || 'Unknown';
    const program = lines[1].trim();
    const comment = lines[2].trim();

    // Parse counts line (line 3)
    const countsLine = lines[3];
    if (countsLine.length < 6) {
      throw new Error('Invalid counts line');
    }

    const atomCount = parseInt(countsLine.substring(0, 3).trim());
    const bondCount = parseInt(countsLine.substring(3, 6).trim());

    if (isNaN(atomCount) || isNaN(bondCount)) {
      throw new Error('Invalid atom or bond count');
    }

    // Parse atoms
    const atoms = [];
    for (let i = 4; i < 4 + atomCount; i++) {
      if (i >= lines.length) {
        throw new Error(`Missing atom line ${i - 3}`);
      }
      atoms.push(parseAtomLine(lines[i], i - 3));
    }

    // Parse bonds
    const bonds = [];
    for (let i = 4 + atomCount; i < 4 + atomCount + bondCount; i++) {
      if (i >= lines.length) {
        throw new Error(`Missing bond line ${i - 3 - atomCount}`);
      }
      bonds.push(parseBondLine(lines[i]));
    }

    // Parse properties (optional)
    const properties = {};
    for (let i = 4 + atomCount + bondCount; i < lines.length; i++) {
      if (lines[i].startsWith('>')) {
        const propName = lines[i].replace(/[><]/g, '').trim();
        if (i + 1 < lines.length) {
          properties[propName] = lines[i + 1].trim();
          i++; // Skip the value line
        }
      }
    }

    return {
      name: molName,
      program,
      comment,
      atoms,
      bonds,
      properties,
    };
  };

  // Parse atom line from SDF
  const parseAtomLine = (line, atomIndex) => {
    if (line.length < 31) {
      throw new Error(`Atom line ${atomIndex} too short`);
    }

    const x = parseFloat(line.substring(0, 10).trim());
    const y = parseFloat(line.substring(10, 20).trim());
    const z = parseFloat(line.substring(20, 30).trim());
    const symbol = line.substring(31, 34).trim();

    let charge = 0;
    if (line.length > 38) {
      const chargeCode = parseInt(line.substring(36, 39).trim());
      if (!isNaN(chargeCode)) {
        // Convert SDF charge encoding to actual charge
        if (chargeCode === 1) charge = 3;
        else if (chargeCode === 2) charge = 2;
        else if (chargeCode === 3) charge = 1;
        else if (chargeCode === 5) charge = -1;
        else if (chargeCode === 6) charge = -2;
        else if (chargeCode === 7) charge = -3;
      }
    }

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      throw new Error(`Invalid coordinates for atom ${atomIndex}`);
    }

    if (!elementMap[symbol] && symbol !== 'D' && symbol !== 'T') {
      console.warn(`Unknown element symbol: ${symbol}`);
    }

    return {
      index: atomIndex,
      x,
      y,
      z,
      symbol,
      charge,
    };
  };

  // Parse bond line from SDF
  const parseBondLine = (line) => {
    if (line.length < 9) {
      throw new Error('Bond line too short');
    }

    const atom1 = parseInt(line.substring(0, 3).trim());
    const atom2 = parseInt(line.substring(3, 6).trim());
    const bondType = parseInt(line.substring(6, 9).trim());

    if (isNaN(atom1) || isNaN(atom2) || isNaN(bondType)) {
      throw new Error('Invalid bond data');
    }

    return {
      atom1: atom1 - 1, // Convert to 0-based indexing
      atom2: atom2 - 1,
      type: bondType,
    };
  };

  // Generate PDB header
  const generatePDBHeader = (molecule, molIndex, options) => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const molName = molecule.name || `MOLECULE_${molIndex}`;

    let header = '';
    header += `HEADER    SMALL MOLECULE                          ${date}   MOL${molIndex.toString().padStart(4, ' ')}\n`;
    header += `TITLE     ${molName.substring(0, 70).toUpperCase()}\n`;
    header += `COMPND    MOL_ID: ${molIndex};\n`;
    header += `COMPND   2 MOLECULE: ${molName.substring(0, 50)};\n`;
    header += `COMPND   3 CHAIN: ${options.chainId}\n`;
    header += `AUTHOR    SDF TO PDB CONVERTER\n`;

    if (molecule.properties && Object.keys(molecule.properties).length > 0) {
      header += `REMARK   2 PROPERTIES FROM SDF FILE:\n`;
      for (const [key, value] of Object.entries(molecule.properties)) {
        header += `REMARK   2 ${key}: ${value}\n`;
      }
    }

    return header;
  };

  // Generate ATOM/HETATM records
  const generateATOMRecords = (molecule, options, molIndex) => {
    let atomRecords = '';

    for (let i = 0; i < molecule.atoms.length; i++) {
      const atom = molecule.atoms[i];
      const atomSerial = i + 1;

      // Determine atom name (element symbol + number if needed)
      let atomName = atom.symbol;
      if (atomName.length === 1) {
        atomName = ` ${atomName}  `;
      } else if (atomName.length === 2) {
        atomName = ` ${atomName} `;
      } else {
        atomName = atomName.substring(0, 4);
      }

      // Format coordinates
      const x = atom.x.toFixed(3).padStart(8);
      const y = atom.y.toFixed(3).padStart(8);
      const z = atom.z.toFixed(3).padStart(8);

      // Occupancy and B-factor (default values)
      const occupancy = '  1.00';
      const bFactor = ' 20.00';

      // Element symbol (right-justified in 2 characters)
      const element = atom.symbol.padStart(2);

      // Charge
      let chargeStr = '  ';
      if (options.preserveCharges && atom.charge !== 0) {
        const absCharge = Math.abs(atom.charge);
        const sign = atom.charge > 0 ? '+' : '-';
        chargeStr = `${absCharge}${sign}`;
      }

      // Use HETATM for small molecules
      atomRecords += `HETATM${atomSerial.toString().padStart(5)} ${atomName}${options.moleculeName} ${options.chainId}${molIndex.toString().padStart(4)}    ${x}${y}${z}${occupancy}${bFactor}          ${element}${chargeStr}\n`;
    }

    return atomRecords;
  };

  // Generate CONECT records for bonds
  const generateCONECTRecords = (molecule) => {
    let conectRecords = '';
    const connections = new Map();

    // Build connection map
    for (const bond of molecule.bonds) {
      if (!connections.has(bond.atom1)) {
        connections.set(bond.atom1, []);
      }
      if (!connections.has(bond.atom2)) {
        connections.set(bond.atom2, []);
      }

      connections.get(bond.atom1).push(bond.atom2 + 1); // Convert to 1-based
      connections.get(bond.atom2).push(bond.atom1 + 1);
    }

    // Generate CONECT records
    for (const [atomIndex, connectedAtoms] of connections) {
      const atomSerial = (atomIndex + 1).toString().padStart(5);
      const bondedAtoms = connectedAtoms
        .sort((a, b) => a - b)
        .map((atom) => atom.toString().padStart(5))
        .join('');

      if (bondedAtoms.length > 0) {
        conectRecords += `CONECT${atomSerial}${bondedAtoms}\n`;
      }
    }

    return conectRecords;
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(/\.(sdf|mol|sd)$/i, '');
      return `${nameWithoutExt}.pdb`;
    }
    return 'converted.pdb';
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
          const result = convertSdfToPdb(input, conversionOptions);
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
      title="SDF to PDB converter"
      description="Convert Structure Data Format (SDF) files to Protein Data Bank (PDB) format. Handles small molecules with coordinates, bonds, and properties for structural biology applications."
      h1="SDF to PDB converter"
      subtitle="Convert your SDF molecular structure files to PDB format. Upload an SDF file or paste the structure data below."
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <InputSection
            input={input}
            onInputChange={setInput}
            inputFormat="SDF"
            placeholder="  Benzene&#10;&#10;&#10;  6  6  0  0  0  0  0  0  0  0999 V2000&#10;    1.2124    0.7000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0&#10;    1.2124   -0.7000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0&#10;    0.0000   -1.4000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0&#10;   -1.2124   -0.7000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0&#10;   -1.2124    0.7000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0&#10;    0.0000    1.4000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0&#10;  1  2  2  0  0  0  0&#10;  2  3  1  0  0  0  0&#10;  3  4  2  0  0  0  0&#10;  4  5  1  0  0  0  0&#10;  5  6  2  0  0  0  0&#10;  6  1  1  0  0  0  0&#10;M  END&#10;$$$$"
            acceptedFileTypes=".sdf,.mol,.sd"
            fileTypeDescription="SDF file (.sdf, .mol, .sd)"
            onClear={clearAll}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            error={error}
          />
          {/* Conversion Options */}
          <div className="space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">
              Conversion options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Options */}
              <div className="space-y-2">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionOptions.includeHeader}
                      onChange={(e) =>
                        setConversionOptions((prev) => ({
                          ...prev,
                          includeHeader: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Include PDB header records</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionOptions.includeConnect}
                      onChange={(e) =>
                        setConversionOptions((prev) => ({
                          ...prev,
                          includeConnect: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Include CONECT records for bonds
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionOptions.preserveCharges}
                      onChange={(e) =>
                        setConversionOptions((prev) => ({
                          ...prev,
                          preserveCharges: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Preserve atomic charges</span>
                  </label>
                </div>
              </div>

              {/* Naming Options */}
              <div className="space-y-3 flex flex-row gap-4">
                <div>
                  <label
                    htmlFor="chainID"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Chain ID
                  </label>
                  <input
                    type="text"
                    value={conversionOptions.chainId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setConversionOptions((prev) => ({
                        ...prev,
                        chainId:
                          value === ''
                            ? 'A'
                            : value.substring(0, 2).toUpperCase(),
                      }));
                    }}
                    maxLength="2"
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="A"
                  />
                </div>

                <div>
                  <label
                    htmlFor="residueName"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Residue name (3 letters)
                  </label>
                  <input
                    id="residueName"
                    type="text"
                    value={conversionOptions.moleculeName}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        moleculeName: e.target.value
                          .substring(0, 3)
                          .toUpperCase(),
                      }))
                    }
                    maxLength="3"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="UNL"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    UNL = Unknown ligand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <OutputSection
          output={output}
          outputFormat="PDB"
          placeholder={
            isProcessing
              ? 'Converting SDF to PDB format...'
              : 'PDB output will appear here automatically...'
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

export const getStaticProps = createToolStaticProps('sdf-to-pdb');
