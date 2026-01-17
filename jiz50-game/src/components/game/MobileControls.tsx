'use client';

import { useInput } from '@/hooks/useInput';

export function MobileControls() {
  const { moveLeft, moveRight, startPush } = useInput();

  return (
    <div className="flex justify-center items-center gap-4 p-3 bg-gray-900 border-t-4 border-gray-700 md:hidden">
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          moveLeft();
        }}
        onClick={moveLeft}
        className="w-16 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 border-4 border-gray-600 border-b-gray-800 border-r-gray-800 text-white text-2xl font-bold rounded transition-colors select-none"
      >
        ◀
      </button>

      <button
        onTouchStart={(e) => {
          e.preventDefault();
          startPush();
        }}
        onClick={startPush}
        className="w-24 h-14 bg-orange-600 hover:bg-orange-500 active:bg-orange-400 border-4 border-orange-500 border-b-orange-800 border-r-orange-800 text-white text-sm font-bold font-mono rounded transition-colors select-none"
      >
        ODRAZ
      </button>

      <button
        onTouchStart={(e) => {
          e.preventDefault();
          moveRight();
        }}
        onClick={moveRight}
        className="w-16 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 border-4 border-gray-600 border-b-gray-800 border-r-gray-800 text-white text-2xl font-bold rounded transition-colors select-none"
      >
        ▶
      </button>
    </div>
  );
}
