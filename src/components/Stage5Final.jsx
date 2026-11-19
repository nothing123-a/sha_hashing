import React from 'react';
import { toHex32, toBin32, H_INIT } from '../utils/sha256';

export default function Stage5Final({ result }) {
  if (!result) return null;

  const labels = ['H₀', 'H₁', 'H₂', 'H₃', 'H₄', 'H₅', 'H₆', 'H₇'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">Stage 5: Final Hash Computation</h3>
        <p className="text-xs text-slate-400 mt-1">
          After processing all blocks, the eight hash values (H₀–H₇) are concatenated to form the 256-bit digest.
        </p>
      </div>

      {/* Hash value evolution per block */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-2 text-slate-400 font-medium">Stage</th>
              {labels.map((l) => (
                <th key={l} className="text-center py-2 px-1 text-slate-400 font-medium">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {/* Initial values */}
            <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
              <td className="py-2 px-2 text-slate-500">Initial</td>
              {H_INIT.map((h, i) => (
                <td key={i} className="py-2 px-1 text-center text-slate-600 text-[10px]">{toHex32(h)}</td>
              ))}
            </tr>
            {/* After each block */}
            {result.blockResults.map((br, bi) => (
              <tr key={bi} className="border-b border-slate-100 hover:bg-blue-50/50 transition">
                <td className="py-2 px-2 text-blue-600 font-medium">Block {bi}</td>
                {br.hashAfter.map((h, i) => (
                  <td key={i} className="py-2 px-1 text-center text-slate-700 text-[10px] font-semibold">{toHex32(h)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Concatenation visual */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
        <p className="text-xs font-medium text-slate-500 mb-2">Concatenation: H₀ ‖ H₁ ‖ H₂ ‖ H₃ ‖ H₄ ‖ H₅ ‖ H₆ ‖ H₇</p>
        <div className="flex flex-wrap gap-1">
          {result.finalHash.map((h, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded bg-white border border-blue-200 text-[11px] font-mono text-blue-700 shadow-sm"
            >
              {toHex32(h)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
