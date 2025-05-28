// OutputSection component (update your existing component)
export default function OutputSection({ 
  output, 
  outputFormat, 
  placeholder, 
  onCopy, 
  onDownload, 
  downloadFilename,
}) {
  return (
    <div className="space-y-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Output ({outputFormat} Format)
      </label>

      {/* Output Text Area */}
      <div className="w-full border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm overflow-hidden">
        <textarea
          value={output}
          readOnly
          placeholder={placeholder}
          className="p-6 w-full h-64 bg-transparent border-none resize-none"
        />
        <div className="flex justify-between items-center border-t bg-gray-100 border-gray-200 px-4 py-2">
          <div className="flex gap-2">
            <button
              onClick={onCopy}
              title="Copy to Clipboard"
              className="p-2 text-gray-700 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!output}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
              </svg>
            </button>
            <button
              onClick={onDownload}
              title="Download File"
              className="p-2 text-gray-700 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!output}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"/>
              </svg>
            </button>
          </div>
          <span className="text-gray-600 text-sm">{outputFormat}</span>
        </div>
      </div>
    </div>
  );
}