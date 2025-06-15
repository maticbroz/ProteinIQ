import { useState, useRef, useEffect } from 'react';
import ToolsLayout from '../components/tools/ToolsLayout';
import InputSection from '../components/tools/InputSection';
import OutputSection from '../components/tools/OutputSection';
import ToolDocumentation from '../components/tools/ToolDocumentation';
import { createToolStaticProps } from '../../lib/loadToolDocumentation';

export default function PdbToCif({ mdxSource, frontMatter }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [conversionOptions, setConversionOptions] = useState({
    includeHeader: true,
    includeRemarks: true,
    includeConnectivity: true,
    preserveSecondaryStructure: true,
    validateAtoms: true,
  });

  // Convert PDB to CIF format
  const convertPdbToCif = (pdbText, options) => {
    try {
      const lines = pdbText.split('\n');
      const pdbData = parsePdbFile(lines);

      if (!pdbData.atoms || pdbData.atoms.length === 0) {
        throw new Error('No atom records found in PDB file');
      }

      return generateCifFile(pdbData, options);
    } catch (err) {
      throw new Error(`Conversion failed: ${err.message}`);
    }
  };

  // Parse PDB file into structured data
  const parsePdbFile = (lines) => {
    const data = {
      header: {},
      title: '',
      remarks: [],
      atoms: [],
      hetatms: [],
      connections: [],
      secondaryStructure: [],
      chains: new Set(),
      resolution: null,
    };

    for (const line of lines) {
      const recordType = line.substring(0, 6).trim();

      switch (recordType) {
        case 'HEADER':
          data.header = parseHeaderRecord(line);
          break;

        case 'TITLE':
          const title = line.substring(10).trim();
          data.title += (data.title ? ' ' : '') + title;
          break;

        case 'REMARK':
          const remarkNum = line.substring(7, 10).trim();
          if (remarkNum === '2' && line.includes('RESOLUTION')) {
            const resMatch = line.match(/RESOLUTION\.\s*([0-9.]+)/);
            if (resMatch) {
              data.resolution = parseFloat(resMatch[1]);
            }
          }
          data.remarks.push(line.substring(10).trim());
          break;

        case 'ATOM':
          const atom = parseAtomRecord(line, 'ATOM');
          if (atom) {
            data.atoms.push(atom);
            data.chains.add(atom.chainId);
          }
          break;

        case 'HETATM':
          const hetatm = parseAtomRecord(line, 'HETATM');
          if (hetatm) {
            data.hetatms.push(hetatm);
            data.chains.add(hetatm.chainId);
          }
          break;

        case 'CONECT':
          const connection = parseConnectRecord(line);
          if (connection) {
            data.connections.push(connection);
          }
          break;

        case 'HELIX':
        case 'SHEET':
          data.secondaryStructure.push(
            parseSecondaryStructure(line, recordType)
          );
          break;
      }
    }

    return data;
  };

  // Parse HEADER record
  const parseHeaderRecord = (line) => {
    return {
      classification: line.substring(10, 50).trim(),
      depDate: line.substring(50, 59).trim(),
      pdbId: line.substring(62, 66).trim(),
    };
  };

  // Parse ATOM/HETATM record
  const parseAtomRecord = (line, recordType) => {
    if (line.length < 54) return null;

    try {
      return {
        recordType,
        serial: parseInt(line.substring(6, 11).trim()),
        atomName: line.substring(12, 16).trim(),
        altLoc: line.substring(16, 17).trim(),
        resName: line.substring(17, 20).trim(),
        chainId: line.substring(21, 22).trim() || 'A',
        resSeq: parseInt(line.substring(22, 26).trim()),
        iCode: line.substring(26, 27).trim(),
        x: parseFloat(line.substring(30, 38).trim()),
        y: parseFloat(line.substring(38, 46).trim()),
        z: parseFloat(line.substring(46, 54).trim()),
        occupancy:
          line.length > 54
            ? parseFloat(line.substring(54, 60).trim()) || 1.0
            : 1.0,
        bFactor:
          line.length > 60
            ? parseFloat(line.substring(60, 66).trim()) || 20.0
            : 20.0,
        element:
          line.length > 76
            ? line.substring(76, 78).trim()
            : line.substring(12, 16).trim().replace(/[0-9]/g, ''),
        charge: line.length > 78 ? line.substring(78, 80).trim() : '',
      };
    } catch (err) {
      console.warn(`Failed to parse atom record: ${line}`);
      return null;
    }
  };

  // Parse CONECT record
  const parseConnectRecord = (line) => {
    try {
      const atomSerial = parseInt(line.substring(6, 11).trim());
      const connections = [];

      for (let i = 11; i < line.length; i += 5) {
        const bondedAtom = line.substring(i, i + 5).trim();
        if (bondedAtom) {
          const bondedSerial = parseInt(bondedAtom);
          if (!isNaN(bondedSerial)) {
            connections.push(bondedSerial);
          }
        }
      }

      return { atomSerial, connections };
    } catch (err) {
      return null;
    }
  };

  // Parse secondary structure records
  const parseSecondaryStructure = (line, recordType) => {
    return {
      type: recordType,
      id: line.substring(7, 10).trim(),
      initChainId: line.substring(19, 20).trim(),
      initSeqNum: parseInt(line.substring(21, 25).trim()),
      endChainId: line.substring(31, 32).trim(),
      endSeqNum: parseInt(line.substring(33, 37).trim()),
    };
  };

  // Generate CIF file from parsed PDB data
  const generateCifFile = (data, options) => {
    let cifContent = '';

    // CIF header
    cifContent += 'data_' + (data.header.pdbId || 'unknown') + '\n#\n';

    if (options.includeHeader) {
      cifContent += generateCifHeader(data);
    }

    // Structure information
    cifContent += generateStructInfo(data);

    // Entity information
    cifContent += generateEntityInfo(data);

    // Atom site information
    cifContent += generateAtomSite(data, options);

    if (options.includeConnectivity && data.connections.length > 0) {
      cifContent += generateConnectivity(data);
    }

    if (
      options.preserveSecondaryStructure &&
      data.secondaryStructure.length > 0
    ) {
      cifContent += generateSecondaryStructure(data);
    }

    return cifContent;
  };

  // Generate CIF header section
  const generateCifHeader = (data) => {
    let content = '';

    content +=
      '_entry.id                                ' +
      (data.header.pdbId || 'unknown') +
      '\n';

    if (data.header.depDate) {
      content +=
        '_database_PDB_rev.date_original          ' +
        data.header.depDate +
        '\n';
    }

    content += '#\n';
    return content;
  };

  // Generate structure information
  const generateStructInfo = (data) => {
    let content = '';

    if (data.title) {
      content += '_struct.title                           \n';
      content += ';' + data.title + '\n;\n';
    }

    if (data.header.classification) {
      content +=
        '_struct_keywords.pdbx_keywords           ' +
        data.header.classification +
        '\n';
    }

    content += '#\n';
    return content;
  };

  // Generate entity information
  const generateEntityInfo = (data) => {
    let content = '';

    content += 'loop_\n';
    content += '_entity.id\n';
    content += '_entity.type\n';
    content += '_entity.pdbx_description\n';

    let entityId = 1;
    for (const chainId of Array.from(data.chains).sort()) {
      content += `${entityId}  polymer  'Chain ${chainId}'\n`;
      entityId++;
    }

    content += '#\n';
    return content;
  };

  // Generate atom site loop
  const generateAtomSite = (data, options) => {
    let content = '';

    content += 'loop_\n';
    content += '_atom_site.group_PDB\n';
    content += '_atom_site.id\n';
    content += '_atom_site.type_symbol\n';
    content += '_atom_site.label_atom_id\n';
    content += '_atom_site.label_alt_id\n';
    content += '_atom_site.label_comp_id\n';
    content += '_atom_site.label_asym_id\n';
    content += '_atom_site.label_seq_id\n';
    content += '_atom_site.pdbx_PDB_ins_code\n';
    content += '_atom_site.Cartn_x\n';
    content += '_atom_site.Cartn_y\n';
    content += '_atom_site.Cartn_z\n';
    content += '_atom_site.occupancy\n';
    content += '_atom_site.B_iso_or_equiv\n';
    content += '_atom_site.pdbx_formal_charge\n';
    content += '_atom_site.auth_seq_id\n';
    content += '_atom_site.auth_comp_id\n';
    content += '_atom_site.auth_asym_id\n';
    content += '_atom_site.auth_atom_id\n';
    content += '_atom_site.pdbx_PDB_model_num\n';

    // Combine ATOM and HETATM records
    const allAtoms = [...data.atoms, ...data.hetatms];

    for (const atom of allAtoms) {
      if (
        options.validateAtoms &&
        (isNaN(atom.x) || isNaN(atom.y) || isNaN(atom.z))
      ) {
        continue;
      }

      const groupPDB = atom.recordType;
      const altLoc = atom.altLoc || '.';
      const iCode = atom.iCode || '?';
      const charge = atom.charge || '?';

      content += `${groupPDB.padEnd(6)} `;
      content += `${atom.serial.toString().padEnd(6)} `;
      content += `${atom.element.padEnd(4)} `;
      content += `${atom.atomName.padEnd(4)} `;
      content += `${altLoc.padEnd(4)} `;
      content += `${atom.resName.padEnd(4)} `;
      content += `${atom.chainId.padEnd(4)} `;
      content += `${atom.resSeq.toString().padEnd(6)} `;
      content += `${iCode.padEnd(4)} `;
      content += `${atom.x.toFixed(3).padStart(8)} `;
      content += `${atom.y.toFixed(3).padStart(8)} `;
      content += `${atom.z.toFixed(3).padStart(8)} `;
      content += `${atom.occupancy.toFixed(2).padStart(6)} `;
      content += `${atom.bFactor.toFixed(2).padStart(6)} `;
      content += `${charge.padEnd(4)} `;
      content += `${atom.resSeq.toString().padEnd(6)} `;
      content += `${atom.resName.padEnd(4)} `;
      content += `${atom.chainId.padEnd(4)} `;
      content += `${atom.atomName.padEnd(4)} `;
      content += '1\n';
    }

    content += '#\n';
    return content;
  };

  // Generate connectivity information
  const generateConnectivity = (data) => {
    let content = '';

    content += 'loop_\n';
    content += '_struct_conn.id\n';
    content += '_struct_conn.conn_type_id\n';
    content += '_struct_conn.ptnr1_label_atom_id\n';
    content += '_struct_conn.ptnr1_label_comp_id\n';
    content += '_struct_conn.ptnr1_label_asym_id\n';
    content += '_struct_conn.ptnr1_label_seq_id\n';
    content += '_struct_conn.ptnr2_label_atom_id\n';
    content += '_struct_conn.ptnr2_label_comp_id\n';
    content += '_struct_conn.ptnr2_label_asym_id\n';
    content += '_struct_conn.ptnr2_label_seq_id\n';

    let connId = 1;
    for (const conn of data.connections) {
      for (const bondedSerial of conn.connections) {
        const atom1 = [...data.atoms, ...data.hetatms].find(
          (a) => a.serial === conn.atomSerial
        );
        const atom2 = [...data.atoms, ...data.hetatms].find(
          (a) => a.serial === bondedSerial
        );

        if (atom1 && atom2) {
          content += `${connId} covalent ${atom1.atomName} ${atom1.resName} ${atom1.chainId} ${atom1.resSeq} `;
          content += `${atom2.atomName} ${atom2.resName} ${atom2.chainId} ${atom2.resSeq}\n`;
          connId++;
        }
      }
    }

    content += '#\n';
    return content;
  };

  // Generate secondary structure information
  const generateSecondaryStructure = (data) => {
    let content = '';

    if (data.secondaryStructure.length > 0) {
      content += 'loop_\n';
      content += '_struct_conf.conf_type_id\n';
      content += '_struct_conf.id\n';
      content += '_struct_conf.beg_label_asym_id\n';
      content += '_struct_conf.beg_label_seq_id\n';
      content += '_struct_conf.end_label_asym_id\n';
      content += '_struct_conf.end_label_seq_id\n';

      for (const ss of data.secondaryStructure) {
        const confType = ss.type === 'HELIX' ? 'HELX_P' : 'STRN';
        content += `${confType} ${ss.id} ${ss.initChainId} ${ss.initSeqNum} ${ss.endChainId} ${ss.endSeqNum}\n`;
      }

      content += '#\n';
    }

    return content;
  };

  // Generate download filename based on uploaded file or default
  const getDownloadFilename = () => {
    if (uploadedFilename) {
      const nameWithoutExt = uploadedFilename.replace(/\.(pdb|ent)$/i, '');
      return `${nameWithoutExt}.cif`;
    }
    return 'converted.cif';
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
          const result = convertPdbToCif(input, conversionOptions);
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
      title="PDB to CIF converter"
      description="Convert Protein Data Bank (PDB) format files to Crystallographic Information File (CIF) format. Modern mmCIF format for structural biology data with enhanced capabilities."
      h1="PDB to CIF converter"
      subtitle="Convert your PDB structure files to modern CIF format. Upload a PDB file or paste the structure data below."
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
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
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800">
              Conversion options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
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
                  <span className="text-sm">Include header information</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.includeRemarks}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        includeRemarks: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Include remarks and metadata</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.validateAtoms}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        validateAtoms: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Validate atom coordinates</span>
                </label>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.includeConnectivity}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        includeConnectivity: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Include connectivity (CONECT records)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={conversionOptions.preserveSecondaryStructure}
                    onChange={(e) =>
                      setConversionOptions((prev) => ({
                        ...prev,
                        preserveSecondaryStructure: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Preserve secondary structure</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> CIF format is the modern standard for
                structural data and supports larger structures and more metadata
                than the legacy PDB format.
              </p>
            </div>
          </div>
        </div>

        <OutputSection
          output={output}
          outputFormat="CIF"
          placeholder={
            isProcessing
              ? 'Converting PDB to CIF format...'
              : 'CIF output will appear here automatically...'
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

export const getStaticProps = createToolStaticProps('pdb-to-cif');
