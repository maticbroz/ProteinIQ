import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../../components/tools/ToolsLayout';
import InputSection from '../../components/tools/InputSection';
import OutputSection from '../../components/tools/OutputSection';
import ToolDocumentation from '../../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function SmilesToSdf({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [conversionOptions, setConversionOptions] = useState({
    generate3D: true,
    addHydrogens: false,
    includeName: true,
    includeProperties: true,
    multipleStructures: true,
    optimizeGeometry: false,
  });

  // Element properties for 3D coordinate generation
  const elementData = {
    H: { atomicNumber: 1, covalentRadius: 0.31, valence: 1 },
    C: { atomicNumber: 6, covalentRadius: 0.76, valence: 4 },
    N: { atomicNumber: 7, covalentRadius: 0.71, valence: 3 },
    O: { atomicNumber: 8, covalentRadius: 0.66, valence: 2 },
    F: { atomicNumber: 9, covalentRadius: 0.57, valence: 1 },
    P: { atomicNumber: 15, covalentRadius: 1.07, valence: 3 },
    S: { atomicNumber: 16, covalentRadius: 1.05, valence: 2 },
    Cl: { atomicNumber: 17, covalentRadius: 0.99, valence: 1 },
    Br: { atomicNumber: 35, covalentRadius: 1.2, valence: 1 },
    I: { atomicNumber: 53, covalentRadius: 1.39, valence: 1 },
  };

  // Parse SMILES string into molecular graph
  const parseSmiles = (smiles) => {
    const atoms = [];
    const bonds = [];
    const rings = new Map();
    let atomIndex = 0;
    let i = 0;
    let lastAtomIndex = -1;
    const branchStack = [];

    while (i < smiles.length) {
      const char = smiles[i];

      if (char === '(') {
        // Start branch
        branchStack.push(lastAtomIndex);
        i++;
      } else if (char === ')') {
        // End branch
        if (branchStack.length === 0) {
          throw new Error('Unmatched closing parenthesis');
        }
        lastAtomIndex = branchStack.pop();
        i++;
      } else if (char.match(/[0-9]/)) {
        // Ring closure
        const ringNumber = parseInt(char);
        if (rings.has(ringNumber)) {
          // Close ring
          const firstAtom = rings.get(ringNumber);
          bonds.push({
            atom1: firstAtom,
            atom2: lastAtomIndex,
            bondType: 1,
            isRing: true,
          });
          rings.delete(ringNumber);
        } else {
          // Open ring
          rings.set(ringNumber, lastAtomIndex);
        }
        i++;
      } else if (char === '=') {
        // Double bond (affects next bond)
        i++;
        const nextBondType = 2;
        // Continue to parse next atom and create double bond
        const nextAtomResult = parseNextAtom(smiles, i);
        if (nextAtomResult) {
          atoms.push(nextAtomResult.atom);
          if (lastAtomIndex >= 0) {
            bonds.push({
              atom1: lastAtomIndex,
              atom2: atomIndex,
              bondType: nextBondType,
              isRing: false,
            });
          }
          lastAtomIndex = atomIndex;
          atomIndex++;
          i = nextAtomResult.nextIndex;
        }
      } else if (char === '#') {
        // Triple bond
        i++;
        const nextBondType = 3;
        const nextAtomResult = parseNextAtom(smiles, i);
        if (nextAtomResult) {
          atoms.push(nextAtomResult.atom);
          if (lastAtomIndex >= 0) {
            bonds.push({
              atom1: lastAtomIndex,
              atom2: atomIndex,
              bondType: nextBondType,
              isRing: false,
            });
          }
          lastAtomIndex = atomIndex;
          atomIndex++;
          i = nextAtomResult.nextIndex;
        }
      } else if (char.match(/[A-Z]/)) {
        // Atom
        const atomResult = parseNextAtom(smiles, i);
        if (atomResult) {
          atoms.push(atomResult.atom);
          if (lastAtomIndex >= 0) {
            bonds.push({
              atom1: lastAtomIndex,
              atom2: atomIndex,
              bondType: 1,
              isRing: false,
            });
          }
          lastAtomIndex = atomIndex;
          atomIndex++;
          i = atomResult.nextIndex;
        } else {
          i++;
        }
      } else {
        i++;
      }
    }

    if (rings.size > 0) {
      throw new Error('Unclosed ring detected');
    }

    return { atoms, bonds };
  };

  // Parse next atom from SMILES string
  const parseNextAtom = (smiles, startIndex) => {
    let i = startIndex;
    let element = '';
    let charge = 0;
    let hydrogenCount = 0;

    // Parse element symbol
    if (i < smiles.length && smiles[i].match(/[A-Z]/)) {
      element += smiles[i];
      i++;

      // Check for second character (lowercase)
      if (i < smiles.length && smiles[i].match(/[a-z]/)) {
        element += smiles[i];
        i++;
      }
    }

    // Handle bracketed atoms [C+], [NH3+], etc.
    if (startIndex > 0 && smiles[startIndex - 1] === '[') {
      const bracketEnd = smiles.indexOf(']', startIndex);
      if (bracketEnd !== -1) {
        const bracketContent = smiles.substring(startIndex, bracketEnd);
        const match = bracketContent.match(/([A-Z][a-z]?)(\d*)([+-]?\d*)/);
        if (match) {
          element = match[1];
          hydrogenCount = match[2] ? parseInt(match[2]) : 0;
          const chargeStr = match[3];
          if (chargeStr) {
            charge =
              chargeStr === '+'
                ? 1
                : chargeStr === '-'
                  ? -1
                  : parseInt(chargeStr);
          }
        }
        i = bracketEnd + 1;
      }
    }

    if (!element || !elementData[element]) {
      return null;
    }

    return {
      atom: {
        element,
        charge,
        hydrogenCount,
        x: 0,
        y: 0,
        z: 0,
      },
      nextIndex: i,
    };
  };

  // Generate 3D coordinates using distance geometry
  const generate3DCoordinates = (atoms, bonds) => {
    if (atoms.length === 0) return atoms;

    // Single atom case
    if (atoms.length === 1) {
      atoms[0].x = 0;
      atoms[0].y = 0;
      atoms[0].z = 0;
      return atoms;
    }

    // Two atom case
    if (atoms.length === 2) {
      const bondLength = getBondLength(atoms[0].element, atoms[1].element);
      atoms[0].x = 0;
      atoms[0].y = 0;
      atoms[0].z = 0;
      atoms[1].x = bondLength;
      atoms[1].y = 0;
      atoms[1].z = 0;
      return atoms;
    }

    // Initialize first atom at origin
    atoms[0].x = 0;
    atoms[0].y = 0;
    atoms[0].z = 0;

    // Build connectivity graph
    const adjacencyList = new Map();
    for (let i = 0; i < atoms.length; i++) {
      adjacencyList.set(i, []);
    }

    for (const bond of bonds) {
      adjacencyList
        .get(bond.atom1)
        .push({ atom: bond.atom2, bondType: bond.bondType });
      adjacencyList
        .get(bond.atom2)
        .push({ atom: bond.atom1, bondType: bond.bondType });
    }

    // Use breadth-first search to place atoms
    const placed = new Set([0]);
    const queue = [0];

    while (queue.length > 0 && placed.size < atoms.length) {
      const currentAtom = queue.shift();
      const neighbors = adjacencyList.get(currentAtom);

      for (const neighbor of neighbors) {
        if (!placed.has(neighbor.atom)) {
          placeAtom(
            atoms,
            currentAtom,
            neighbor.atom,
            neighbor.bondType,
            placed,
            adjacencyList
          );
          placed.add(neighbor.atom);
          queue.push(neighbor.atom);
        }
      }
    }

    return atoms;
  };

  // Place an atom relative to already placed atoms
  const placeAtom = (
    atoms,
    parentAtom,
    newAtom,
    bondType,
    placed,
    adjacencyList
  ) => {
    const bondLength = getBondLength(
      atoms[parentAtom].element,
      atoms[newAtom].element,
      bondType
    );

    // Find other placed neighbors of parent
    const placedNeighbors = adjacencyList
      .get(parentAtom)
      .filter((n) => placed.has(n.atom) && n.atom !== newAtom)
      .map((n) => n.atom);

    if (placedNeighbors.length === 0) {
      // First neighbor - place along x-axis with some randomization
      const angle = Math.random() * Math.PI * 2;
      atoms[newAtom].x = atoms[parentAtom].x + bondLength * Math.cos(angle);
      atoms[newAtom].y = atoms[parentAtom].y + bondLength * Math.sin(angle);
      atoms[newAtom].z = atoms[parentAtom].z;
    } else if (placedNeighbors.length === 1) {
      // Second neighbor - place with tetrahedral angle
      const neighbor1 = placedNeighbors[0];
      const vec1 = {
        x: atoms[neighbor1].x - atoms[parentAtom].x,
        y: atoms[neighbor1].y - atoms[parentAtom].y,
        z: atoms[neighbor1].z - atoms[parentAtom].z,
      };

      // Normalize
      const len1 = Math.sqrt(
        vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z
      );
      vec1.x /= len1;
      vec1.y /= len1;
      vec1.z /= len1;

      // Create perpendicular vector
      let perpVec = { x: 1, y: 0, z: 0 };
      if (Math.abs(vec1.x) > 0.9) {
        perpVec = { x: 0, y: 1, z: 0 };
      }

      // Cross product to get perpendicular
      const cross = {
        x: vec1.y * perpVec.z - vec1.z * perpVec.y,
        y: vec1.z * perpVec.x - vec1.x * perpVec.z,
        z: vec1.x * perpVec.y - vec1.y * perpVec.x,
      };

      // Normalize cross product
      const crossLen = Math.sqrt(
        cross.x * cross.x + cross.y * cross.y + cross.z * cross.z
      );
      cross.x /= crossLen;
      cross.y /= crossLen;
      cross.z /= crossLen;

      // Place at tetrahedral angle (109.5 degrees)
      const tetraAngle = Math.cos((109.5 * Math.PI) / 180);
      const newVec = {
        x: -vec1.x * tetraAngle + cross.x * Math.sin(Math.acos(tetraAngle)),
        y: -vec1.y * tetraAngle + cross.y * Math.sin(Math.acos(tetraAngle)),
        z: -vec1.z * tetraAngle + cross.z * Math.sin(Math.acos(tetraAngle)),
      };

      atoms[newAtom].x = atoms[parentAtom].x + newVec.x * bondLength;
      atoms[newAtom].y = atoms[parentAtom].y + newVec.y * bondLength;
      atoms[newAtom].z = atoms[parentAtom].z + newVec.z * bondLength;
    } else {
      // Multiple neighbors - place to minimize overlap
      let bestPosition = null;
      let maxMinDistance = 0;

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
        const testPos = {
          x: atoms[parentAtom].x + bondLength * Math.cos(angle),
          y: atoms[parentAtom].y + bondLength * Math.sin(angle),
          z: atoms[parentAtom].z + bondLength * Math.sin(angle) * 0.5,
        };

        let minDistance = Infinity;
        for (const neighborIdx of placedNeighbors) {
          const dist = distance(testPos, atoms[neighborIdx]);
          minDistance = Math.min(minDistance, dist);
        }

        if (minDistance > maxMinDistance) {
          maxMinDistance = minDistance;
          bestPosition = testPos;
        }
      }

      if (bestPosition) {
        atoms[newAtom].x = bestPosition.x;
        atoms[newAtom].y = bestPosition.y;
        atoms[newAtom].z = bestPosition.z;
      }
    }
  };

  // Calculate distance between two points
  const distance = (p1, p2) => {
    return Math.sqrt(
      (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2
    );
  };

  // Get bond length between two elements
  const getBondLength = (element1, element2, bondType = 1) => {
    const data1 = elementData[element1];
    const data2 = elementData[element2];

    if (!data1 || !data2) return 1.5; // Default bond length

    let baseLength = data1.covalentRadius + data2.covalentRadius;

    // Adjust for bond type
    switch (bondType) {
      case 2:
        return baseLength * 0.87; // Double bond
      case 3:
        return baseLength * 0.78; // Triple bond
      default:
        return baseLength; // Single bond
    }
  };

  // Convert parsed molecule to SDF format
  const generateSDF = (molecule, name, options) => {
    const { atoms, bonds } = molecule;
    let sdf = '';

    // Header block (3 lines)
    sdf += `${name || 'Molecule'}\n`;
    sdf += `  Generated from SMILES\n`;
    sdf += `\n`;

    // Counts line
    const atomCount = atoms.length.toString().padStart(3);
    const bondCount = bonds.length.toString().padStart(3);
    sdf += `${atomCount}${bondCount}  0  0  0  0  0  0  0  0999 V2000\n`;

    // Atom block
    for (const atom of atoms) {
      const x = atom.x.toFixed(4).padStart(10);
      const y = atom.y.toFixed(4).padStart(10);
      const z = atom.z.toFixed(4).padStart(10);
      const element = atom.element.padEnd(3);
      const charge =
        atom.charge === 0 ? '  0' : atom.charge.toString().padStart(3);

      sdf += `${x}${y}${z} ${element} 0${charge}  0  0  0  0  0  0  0  0  0  0\n`;
    }

    // Bond block
    for (const bond of bonds) {
      const atom1 = (bond.atom1 + 1).toString().padStart(3);
      const atom2 = (bond.atom2 + 1).toString().padStart(3);
      const bondType = bond.bondType.toString().padStart(3);

      sdf += `${atom1}${atom2}${bondType}  0  0  0  0\n`;
    }

    // Properties
    if (options.includeProperties) {
      sdf += 'M  END\n';
      if (name) {
        sdf += `> <Name>\n${name}\n\n`;
      }
      sdf += `> <SMILES>\n${molecule.originalSmiles}\n\n`;
    } else {
      sdf += 'M  END\n';
    }

    sdf += '$$$$\n';
    return sdf;
  };

  // Main conversion function
  const convertSmilesToSdf = (smilesText, options) => {
    try {
      const lines = smilesText
        .trim()
        .split('\n')
        .filter((line) => line.trim());
      let sdfOutput = '';
      let moleculeCount = 0;

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Parse line - could be just SMILES or SMILES + name
        const parts = trimmedLine.split(/\s+/);
        const smiles = parts[0];
        const name =
          parts.length > 1
            ? parts.slice(1).join(' ')
            : `molecule_${moleculeCount + 1}`;

        try {
          // Validate SMILES characters
          if (!smiles.match(/^[A-Za-z0-9\[\]()=#+\-@\/\\%]*$/)) {
            throw new Error(`Invalid SMILES characters in: ${smiles}`);
          }

          // Parse SMILES
          const molecule = parseSmiles(smiles);
          molecule.originalSmiles = smiles;

          if (molecule.atoms.length === 0) {
            throw new Error(`No atoms found in SMILES: ${smiles}`);
          }

          // Generate 3D coordinates if requested
          if (options.generate3D) {
            generate3DCoordinates(molecule.atoms, molecule.bonds);
          }

          // Convert to SDF
          const sdf = generateSDF(
            molecule,
            options.includeName ? name : null,
            options
          );
          sdfOutput += sdf;
          moleculeCount++;

          if (!options.multipleStructures) {
            break; // Only convert first molecule
          }
        } catch (molError) {
          console.warn(
            `Failed to process molecule "${smiles}": ${molError.message}`
          );
          if (lines.length === 1) {
            throw molError; // Re-throw if only one molecule
          }
        }
      }

      if (moleculeCount === 0) {
        throw new Error('No valid molecules could be processed');
      }

      return sdfOutput;
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(
        /\.(txt|smi|smiles)$/i,
        ''
      );
      return `${nameWithoutExt}.sdf`;
    }
    return 'molecules.sdf';
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
          const result = convertSmilesToSdf(input, conversionOptions);
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
      title="SMILES to SDF converter"
      description="Convert SMILES strings to Structure Data Format (SDF) files with 3D coordinate generation. Perfect for cheminformatics and molecular modeling applications."
      h1="SMILES to SDF converter"
      subtitle="Convert your SMILES strings to SDF format with 3D coordinates. Enter SMILES strings or upload a file below."
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <InputSection
            input={input}
            onInputChange={setInput}
            inputFormat="SMILES"
            placeholder="CCO ethanol&#10;c1ccccc1 benzene&#10;CC(=O)O acetic_acid&#10;C1CCC(CC1)N cyclohexylamine"
            acceptedFileTypes=".txt,.smi,.smiles"
            fileTypeDescription="SMILES file (.txt, .smi, .smiles)"
            onClear={clearAll}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            error={error}
          />

          {/* Conversion Options */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">
              Conversion options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  3D Structure
                </h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.generate3D}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        generate3D: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Generate 3D coordinates</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.addHydrogens}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        addHydrogens: e.target.checked,
                      }))
                    }
                    className="mr-2"
                    disabled
                  />
                  <span className="text-sm text-gray-500">
                    Add explicit hydrogens (coming soon)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.optimizeGeometry}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        optimizeGeometry: e.target.checked,
                      }))
                    }
                    className="mr-2"
                    disabled
                  />
                  <span className="text-sm text-gray-500">
                    Optimize geometry (coming soon)
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Output Options
                </h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.includeName}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        includeName: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Include molecule names</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.includeProperties}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        includeProperties: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Include properties (SMILES, names)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.multipleStructures}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        multipleStructures: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Process multiple molecules</span>
                </label>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> 3D coordinate generation uses simplified
                algorithms. For high-quality conformers, consider using
                specialized chemistry software like RDKit or OpenBabel.
              </p>
            </div>
          </div>
        </div>

        <OutputSection
          output={output}
          outputFormat="SDF"
          placeholder={
            isProcessing
              ? 'Converting SMILES to SDF format...'
              : 'SDF output will appear here automatically...'
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

export const getStaticProps = createToolStaticProps('smiles-to-sdf');
