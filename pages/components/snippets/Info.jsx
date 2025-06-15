import { Info } from 'lucide-react';

export function InfoText({ children }) {
  return (
    <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
      <p className="text-sm text-blue-800 flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 inline-flex flex-shrink-0" /> {children}
      </p>
    </div>
  );
}
