import { useRef, useState } from 'react';

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
      <label className="block text-sm font-semibold text-gray-700 mb-3">
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
              <p className="text-sm text-gray-600 font-medium">Loading...</p>
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
