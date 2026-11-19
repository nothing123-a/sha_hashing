import React, { useState } from 'react';
import { toHex32 } from '../utils/sha256';

export default function Stage3Schedule({ result, currentBlock, setCurrentBlock }) {
  const [expandedWord, setExpandedWord] = useState(null);

  if (!result || !result.blockResults.length) return null;

  const blockResult = result.blockResults[currentBlock];
  if (!blockResult) return null;

  const { schedule } = blockResult;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Stage 3: Message Schedule</h3>
          <p className="text-xs text-slate-400 mt-1">
            Each 512-bit block is expanded into 64 words (W₀ – W₆₃). The first 16 come directly from
            the block; words 16–63 are derived using σ₀ and σ₁ functions.
          </p>
        </div>
        {result.blockResults.length > 1 && (
          <div className="flex gap-1">
            {result.blockResults.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentBlock(i); setExpandedWord(null); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition
                  ${currentBlock === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
              >
                Block {i}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Word grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {schedule.details.map((detail, t) => (
          <button
            key={t}
            onClick={() => setExpandedWord(expandedWord === t ? null : t)}
            className={`p-2 rounded-lg text-center transition-all duration-200 border cursor-pointer
              ${t < 16
                ? 'bg-blue-50 border-blue-100 hover:border-blue-300'
                : 'bg-purple-50 border-purple-100 hover:border-purple-300'
              }
              ${expandedWord === t ? 'ring-2 ring-blue-400 shadow-md' : ''}`}
          >
            <p className="text-[9px] text-slate-400 font-medium">W{t}</p>
            <p className="text-[10px] font-mono text-slate-700 truncate">{toHex32(detail.w)}</p>
          </button>
        ))}
      </div>

      {/* Expanded word detail */}
      {expandedWord !== null && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 space-y-2">
          <p className="text-xs font-semibold text-slate-700">
            W<sub>{expandedWord}</sub> = <code className="text-blue-600">{toHex32(schedule.W[expandedWord])}</code>
          </p>
          {schedule.details[expandedWord].source === 'computed' ? (
            <div className="space-y-1 text-xs font-mono text-slate-600">
              <p>σ₁(W<sub>{expandedWord - 2}</sub>) = σ₁({toHex32(schedule.details[expandedWord].sigma1.input)}) = <span className="text-purple-600">{toHex32(schedule.details[expandedWord].sigma1.result)}</span></p>
              <p>W<sub>{expandedWord - 7}</sub> = <span className="text-blue-600">{toHex32(schedule.details[expandedWord].wt7)}</span></p>
              <p>σ₀(W<sub>{expandedWord - 15}</sub>) = σ₀({toHex32(schedule.details[expandedWord].sigma0.input)}) = <span className="text-purple-600">{toHex32(schedule.details[expandedWord].sigma0.result)}</span></p>
              <p>W<sub>{expandedWord - 16}</sub> = <span className="text-blue-600">{toHex32(schedule.details[expandedWord].wt16)}</span></p>
              <p className="pt-1 border-t border-slate-200">
                W<sub>{expandedWord}</sub> = σ₁(W<sub>{expandedWord - 2}</sub>) + W<sub>{expandedWord - 7}</sub> + σ₀(W<sub>{expandedWord - 15}</sub>) + W<sub>{expandedWord - 16}</sub>
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Directly from block data (bytes {expandedWord * 4}–{expandedWord * 4 + 3})</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /> Direct (W₀–W₁₅)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-50 border border-purple-200" /> Computed (W₁₆–W₆₃)
        </span>
      </div>
    </div>
  );
}
