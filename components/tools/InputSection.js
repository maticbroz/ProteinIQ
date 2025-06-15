import { useRef, useState } from 'react';
import { Trash2, Loader2, Upload } from 'lucide-react';

export default function InputSection({
  input,
  onInputChange,
  inputFormat = 'FASTQ',
  placeholder = "@SEQ_ID_1\nGATTTGGGGTTCAAAGCAGTATCGATCAAATA...\n+\n!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65",
  acceptedFileTypes = '.fastq,.fq,.txt',
  fileTypeDescription = 'FASTQ file (.fastq, .fq, .txt)',
  onClear,
  onFileUpload,
  isUploading = false,
  error = null,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileUpload?.(files[0]);
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

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
    }
  };

  const handleClearClick = () => {
    onClear?.();
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <label className="block font-semibold text-gray-700 mb-3">
        Input ({inputFormat} Format)
      </label>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Text Area */}
        <div className="w-full border border-gray-300 rounded-lg bg-white font-mono text-sm overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => onInputChange?.(e.target.value)}
            placeholder={placeholder}
            className="p-4 w-full h-64 bg-transparent border-none resize-none"
          />
          <div className="flex justify-between items-center border-t bg-gray-50 border-gray-200 px-4 py-2">
            <div className="flex gap-2">
              <button
                onClick={handleClearClick}
                title="Clear All"
                className="p-2 text-gray-700 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!input}
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
            <span className="text-gray-600 text-sm">{inputFormat}</span>
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
                <Loader2 size={48} className="animate-spin" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-gray-600 font-medium">Loading...</p>
            </div>
          ) : (
            <>
              <Upload
                size={48}
                className="mx-auto text-gray-400"
                strokeWidth={1.5}
              />
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
                  {fileTypeDescription}
                </p>
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileInputChange}
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
  );
}
