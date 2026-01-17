'use client';

interface RetroWindowProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function RetroWindow({ children, title, className = '' }: RetroWindowProps) {
  return (
    <div
      className={`bg-gray-300 border-4 border-t-white border-l-white border-b-gray-600 border-r-gray-600 ${className}`}
    >
      {title && (
        <div className="bg-blue-800 text-white px-2 py-1 flex items-center justify-between">
          <span className="font-mono text-sm font-bold">{title}</span>
          <div className="flex gap-1">
            <button className="w-4 h-4 bg-gray-300 border border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-xs leading-none">
              _
            </button>
            <button className="w-4 h-4 bg-gray-300 border border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-xs leading-none">
              X
            </button>
          </div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
