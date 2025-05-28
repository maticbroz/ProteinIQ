export default function OutputSection({
  output,
  outputFormat,
  placeholder = 'Output will appear here automatically...',
  onCopy,
  onDownload,
  downloadFilename,
  height = 'h-64',
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Output ({outputFormat} Format)
        </label>

        <div className="w-full border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm">
          <textarea
            value={output}
            readOnly
            placeholder={placeholder}
            className={`p-4 w-full ${height} bg-transparent border-none resize-none`}
          />

          {/* Output Controls */}
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
                  <path d="M360-240q-29.7 0-50.85-21.15Q288-282.3 288-312v-480q0-29.7 21.15-50.85Q330.3-864 360-864h384q29.7 0 50.85 21.15Q816-821.7 816-792v480q0 29.7-21.15 50.85Q773.7-240 744-240H360Zm0-72h384v-480H360v480ZM216-96q-29.7 0-50.85-21.15Q144-138.3 144-168v-552h72v552h456v72H216Zm144-216v-480 480Z" />
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
                  <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z" />
                </svg>
              </button>
            </div>
            <span className="text-gray-600 text-sm">{outputFormat}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
