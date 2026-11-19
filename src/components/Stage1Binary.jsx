import React from 'react';

export default function Stage1Binary({ result }) {
  if (!result) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">Stage 1: Binary Conversion</h3>
        <p className="text-xs text-slate-400 mt-1">
          Each character of the input is encoded in UTF-8 and then represented as 8-bit binary.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-wrap gap-2 min-w-0">
          {result.binaryRepresentation.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-slate-50 border border-slate-100
                         hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group"
            >
              <span className="text-lg font-mono text-blue-600 group-hover:text-blue-700">
                {item.byte >= 32 && item.byte < 127 ? String.fromCharCode(item.byte) : '·'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-wide">
                {item.binary}
              </span>
              <span className="text-[10px] font-mono text-purple-500">
                0x{item.hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
        <p className="text-xs font-medium text-slate-500 mb-1">Full Binary String</p>
        <p className="text-xs font-mono text-slate-700 break-all leading-relaxed">
          {result.binaryRepresentation.map((b) => b.binary).join(' ')}
        </p>
      </div>

      <div className="flex gap-4 text-xs text-slate-500">
        <span>Total bytes: <strong className="text-slate-700">{result.messageBytes.length}</strong></span>
        <span>Total bits: <strong className="text-slate-700">{result.messageBytes.length * 8}</strong></span>
      </div>
    </div>
  );
}
