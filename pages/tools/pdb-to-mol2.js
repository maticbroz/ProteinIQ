import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../../components/tools/ToolsLayout';
import InputSection from '../../components/tools/InputSection';
import OutputSection from '../../components/tools/OutputSection';
import ToolDocumentation from '../../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function PdbToMol2({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [conversionOptions, setConversionOptions] = useState({
    includeHydrogens: true,
    bondGuessing: true,
    selectedChains: 'all',
    specificChains: '',
    atomTyping: 'sybyl', // sybyl, tripos
  });

  // Sybyl atom type mapping
  const sybylAtomTypes = {
    'C.3': 'C.3', // sp3 carbon
    'C.2': 'C.2', // sp2 carbon
    'C.1': 'C.1', // sp carbon
    'C.ar': 'C.ar', // aromatic carbon
    'N.3': 'N.3', // sp3 nitrogen
    'N.2': 'N.2', // sp2 nitrogen
    'N.1': 'N.1', // sp nitrogen
    'N.ar': 'N.ar', // aromatic nitrogen
    'N.pl3': 'N.pl3', // trigonal planar nitrogen
    'N.4': 'N.4', // quaternary nitrogen
    'O.3': 'O.3', // sp3 oxygen
    'O.2': 'O.2', // sp2 oxygen
    'O.co2': 'O.co2', // carboxyl oxygen
    'S.3': 'S.3', // sp3 sulfur
    'S.2': 'S.2', // sp2 sulfur
    'P.3': 'P.3', // phosphorus
    H: 'H', // hydrogen
  };

  // Amino acid residue data for atom typing
  const aminoAcidData = {
    ALA: { backbone: ['N', 'CA', 'C', 'O'], sidechain: ['CB'] },
    ARG: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'CD', 'NE', 'CZ', 'NH1', 'NH2'],
    },
    ASN: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'OD1', 'ND2'],
    },
    ASP: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'OD1', 'OD2'],
    },
    CYS: { backbone: ['N', 'CA', 'C', 'O'], sidechain: ['CB', 'SG'] },
    GLU: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'CD', 'OE1', 'OE2'],
    },
    GLN: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'CD', 'OE1', 'NE2'],
    },
    GLY: { backbone: ['N', 'CA', 'C', 'O'], sidechain: [] },
    HIS: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'ND1', 'CD2', 'CE1', 'NE2'],
    },
    ILE: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG1', 'CG2', 'CD1'],
    },
    LEU: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'CD1', 'CD2'],
    },
    LYS: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'CD', 'CE', 'NZ'],
    },
    MET: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'SD', 'CE'],
    },
    PHE: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'CD1', 'CD2', 'CE1', 'CE2', 'CZ'],
    },
    PRO: { backbone: ['N', 'CA', 'C', 'O'], sidechain: ['CB', 'CG', 'CD'] },
    SER: { backbone: ['N', 'CA', 'C', 'O'], sidechain: ['CB', 'OG'] },
    THR: { backbone: ['N', 'CA', 'C', 'O'], sidechain: ['CB', 'OG1', 'CG2'] },
    TRP: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: [
        'CB',
        'CG',
        'CD1',
        'CD2',
        'NE1',
        'CE2',
        'CE3',
        'CZ2',
        'CZ3',
        'CH2',
      ],
    },
    TYR: {
      backbone: ['N', 'CA', 'C', 'O'],
      sidechain: ['CB', 'CG', 'CD1', 'CD2', 'CE1', 'CE2', 'CZ', 'OH'],
    },
    VAL: { backbone: ['N', 'CA', 'C', 'O'], sidechain: ['CB', 'CG1', 'CG2'] },
  };

  // Convert PDB to MOL2
  const convertPdbToMol2 = (pdbText, options) => {
    try {
      const molecules = parsePDB(pdbText, options);
      if (molecules.length === 0) {
        throw new Error('No valid molecules found in PDB file');
      }

      let mol2Content = '';
      for (let i = 0; i < molecules.length; i++) {
        mol2Content += generateMol2(molecules[i], i + 1, options);
        if (i < molecules.length - 1) {
          mol2Content += '\n';
        }
      }

      return mol2Content;
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Parse PDB file
  const parsePDB = (pdbText, options) => {
    const lines = pdbText.split('\n');
    const molecules = new Map(); // chainId -> molecule data
    let moleculeName = 'Unknown';

    for (const line of lines) {
      const recordType = line.substring(0, 6).trim();

      // Extract molecule name from HEADER or COMPND
      if (recordType === 'HEADER') {
        moleculeName = line.substring(10, 50).trim() || 'Unknown';
      } else if (recordType === 'COMPND' && line.includes('MOLECULE:')) {
        moleculeName = line
          .substring(line.indexOf('MOLECULE:') + 9)
          .trim()
          .replace(/;$/, '');
      }

      // Parse ATOM and HETATM records
      if (recordType === 'ATOM' || recordType === 'HETATM') {
        const chainId = line.charAt(21) || 'A';
        const atomSerial = parseInt(line.substring(6, 11).trim());
        const atomName = line.substring(12, 16).trim();
        const resName = line.substring(17, 20).trim();
        const resNum = parseInt(line.substring(22, 26).trim());
        const x = parseFloat(line.substring(30, 38).trim());
        const y = parseFloat(line.substring(38, 46).trim());
        const z = parseFloat(line.substring(46, 54).trim());
        const element = line.substring(76, 78).trim() || atomName.charAt(0);

        // Filter chains if specified
        if (options.selectedChains === 'specific' && options.specificChains) {
          const requestedChains = options.specificChains
            .split(',')
            .map((c) => c.trim().toUpperCase());
          if (!requestedChains.includes(chainId)) {
            continue;
          }
        }

        if (!molecules.has(chainId)) {
          molecules.set(chainId, {
            name: `${moleculeName}_chain_${chainId}`,
            atoms: [],
            bonds: [],
            chainId: chainId,
          });
        }

        const molecule = molecules.get(chainId);
        molecule.atoms.push({
          serial: atomSerial,
          name: atomName,
          x,
          y,
          z,
          element: element,
          resName: resName,
          resNum: resNum,
          atomType: assignAtomType(
            atomName,
            resName,
            element,
            options.atomTyping
          ),
          charge: 0.0, // Default charge, could be calculated
        });
      }
    }

    // Generate bonds if requested
    const moleculeArray = Array.from(molecules.values());
    if (options.bondGuessing) {
      for (const molecule of moleculeArray) {
        molecule.bonds = guessBonds(molecule.atoms);
      }
    }

    return moleculeArray;
  };

  // Assign Sybyl atom types
  const assignAtomType = (atomName, resName, element, typingMethod) => {
    if (typingMethod !== 'sybyl') {
      return element; // Fallback to element symbol
    }

    // Simple atom typing based on atom name and residue
    const atomUpper = atomName.toUpperCase();

    if (element === 'C') {
      if (
        atomUpper === 'CA' ||
        atomUpper.includes('CB') ||
        atomUpper.includes('CG')
      ) {
        return 'C.3'; // sp3 carbon
      } else if (
        atomUpper === 'C' ||
        (atomUpper.includes('CD') && aminoAcidData[resName])
      ) {
        return 'C.2'; // sp2 carbon (backbone or aromatic)
      } else if (
        resName === 'PHE' ||
        resName === 'TYR' ||
        resName === 'TRP' ||
        resName === 'HIS'
      ) {
        return 'C.ar'; // aromatic carbon
      }
      return 'C.3'; // default
    } else if (element === 'N') {
      if (atomUpper === 'N') {
        return 'N.3'; // backbone nitrogen
      } else if (
        resName === 'ARG' &&
        (atomUpper === 'NE' || atomUpper === 'NH1' || atomUpper === 'NH2')
      ) {
        return 'N.pl3'; // planar nitrogen
      } else if (
        resName === 'HIS' &&
        (atomUpper === 'ND1' || atomUpper === 'NE2')
      ) {
        return 'N.ar'; // aromatic nitrogen
      }
      return 'N.3'; // default
    } else if (element === 'O') {
      if (atomUpper === 'O') {
        return 'O.2'; // backbone carbonyl
      } else if (resName === 'ASP' || resName === 'GLU') {
        return 'O.co2'; // carboxyl oxygen
      }
      return 'O.3'; // default
    } else if (element === 'S') {
      return 'S.3';
    } else if (element === 'P') {
      return 'P.3';
    } else if (element === 'H') {
      return 'H';
    }

    return element; // fallback
  };

  // Simple bond guessing based on distance
  const guessBonds = (atoms) => {
    const bonds = [];
    const maxDistance = 1.8; // Maximum bond distance in Angstroms

    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const atom1 = atoms[i];
        const atom2 = atoms[j];

        // Skip if atoms are too far apart in sequence (for proteins)
        if (
          Math.abs(atom1.resNum - atom2.resNum) > 1 &&
          atom1.resNum === atom2.resNum &&
          !isBackboneBond(atom1, atom2)
        ) {
          continue;
        }

        const distance = Math.sqrt(
          Math.pow(atom1.x - atom2.x, 2) +
            Math.pow(atom1.y - atom2.y, 2) +
            Math.pow(atom1.z - atom2.z, 2)
        );

        if (distance <= maxDistance) {
          bonds.push({
            atom1: i + 1, // 1-based indexing
            atom2: j + 1,
            type: 1, // single bond
          });
        }
      }
    }

    return bonds;
  };

  // Check if two atoms form a backbone bond
  const isBackboneBond = (atom1, atom2) => {
    const backboneAtoms = ['N', 'CA', 'C', 'O'];
    return (
      backboneAtoms.includes(atom1.name) && backboneAtoms.includes(atom2.name)
    );
  };

  // Generate MOL2 format
  const generateMol2 = (molecule, molIndex, options) => {
    let mol2Content = '';

    // Header
    mol2Content += `# MOL2 file generated from PDB\n`;
    mol2Content += `# Molecule: ${molecule.name}\n`;
    mol2Content += `\n@<TRIPOS>MOLECULE\n`;
    mol2Content += `${molecule.name}\n`;
    mol2Content += `${molecule.atoms.length} ${molecule.bonds.length} 0 0 0\n`;
    mol2Content += `SMALL\n`;
    mol2Content += `GASTEIGER\n\n`;

    // Atoms section
    mol2Content += `@<TRIPOS>ATOM\n`;
    for (let i = 0; i < molecule.atoms.length; i++) {
      const atom = molecule.atoms[i];
      mol2Content += `${(i + 1).toString().padStart(7)} `;
      mol2Content += `${atom.name.padEnd(8)} `;
      mol2Content += `${atom.x.toFixed(4).padStart(10)} `;
      mol2Content += `${atom.y.toFixed(4).padStart(10)} `;
      mol2Content += `${atom.z.toFixed(4).padStart(10)} `;
      mol2Content += `${atom.atomType.padEnd(8)} `;
      mol2Content += `${atom.resNum.toString().padStart(4)} `;
      mol2Content += `${atom.resName.padEnd(8)} `;
      mol2Content += `${atom.charge.toFixed(4)}\n`;
    }

    // Bonds section
    if (molecule.bonds.length > 0) {
      mol2Content += `\n@<TRIPOS>BOND\n`;
      for (let i = 0; i < molecule.bonds.length; i++) {
        const bond = molecule.bonds[i];
        mol2Content += `${(i + 1).toString().padStart(6)} `;
        mol2Content += `${bond.atom1.toString().padStart(5)} `;
        mol2Content += `${bond.atom2.toString().padStart(5)} `;
        mol2Content += `${bond.type}\n`;
      }
    }

    return mol2Content;
  };

  // Generate download filename
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(/\.(pdb|ent)$/i, '');
      return `${nameWithoutExt}.mol2`;
    }
    return 'converted.mol2';
  };

  // Auto-conversion effect
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
          const result = convertPdbToMol2(input, conversionOptions);
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
      title="PDB to MOL2 converter"
      description="Convert Protein Data Bank (PDB) files to Tripos MOL2 format. Includes Sybyl atom typing, bond detection, and support for multiple chains."
      h1="PDB to MOL2 converter"
      subtitle="Convert PDB protein structure files to MOL2 format for molecular modeling and drug design applications."
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <InputSection
            input={input}
            onInputChange={setInput}
            inputFormat="PDB"
            placeholder="HEADER    HYDROLASE                               01-JUN-95   1HTM&#10;ATOM      1  N   ALA A   1      20.154  -6.351  -9.353  1.00 17.93           N&#10;ATOM      2  CA  ALA A   1      19.030  -6.508 -10.279  1.00 17.93           C&#10;..."
            acceptedFileTypes=".pdb,.ent"
            fileTypeDescription="PDB file (.pdb, .ent)"
            onClear={clearAll}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            error={error}
          />

          {/* Conversion Options */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">
              Conversion options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.bondGuessing}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        bondGuessing: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Generate bonds automatically</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.includeHydrogens}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        includeHydrogens: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Include hydrogen atoms</span>
                </label>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-600">
                  Atom typing method
                </label>
                <select
                  value={conversionOptions.atomTyping}
                  onChange={(e) =>
                    setConversionOptions((prev) => ({
                      ...prev,
                      atomTyping: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="sybyl">Sybyl atom types</option>
                  <option value="element">Element symbols only</option>
                </select>
              </div>
            </div>

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
                    checked={conversionOptions.selectedChains === 'all'}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        selectedChains: e.target.value,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">All chains</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="specific"
                    checked={conversionOptions.selectedChains === 'specific'}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        selectedChains: e.target.value,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Specific chains</span>
                </label>
              </div>

              {conversionOptions.selectedChains === 'specific' && (
                <input
                  type="text"
                  value={conversionOptions.specificChains}
                  onChange={(e) =>
                    setConversionOptions((prev) => ({
                      ...prev,
                      specificChains: e.target.value,
                    }))
                  }
                  placeholder="Enter chain IDs (e.g., A, B, C)"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              )}
            </div>
          </div>
        </div>

        <OutputSection
          output={output}
          outputFormat="MOL2"
          placeholder={
            isProcessing
              ? 'Converting PDB to MOL2 format...'
              : 'MOL2 output will appear here automatically...'
          }
          onCopy={copyToClipboard}
          onDownload={downloadFile}
          downloadFilename={getDownloadFilename()}
        />
      </div>

      <ToolDocumentation mdxSource={mdxSource} frontMatter={frontMatter} />
    </ToolsLayout>
  );
}

export const getStaticProps = createToolStaticProps('pdb-to-mol2');
