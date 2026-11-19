import React, { useState, useRef, useEffect } from 'react';
import { toHex32 } from '../utils/sha256';

const VARS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export default function RoundTable({ result, currentBlock, setCurrentBlock }) {
  const [selectedRound, setSelectedRound] = useState(null);
  const [animatingRound, setAnimatingRound] = useState(null);
  const tableRef = useRef(null);

  if (!result || !result.blockResults.length) return null;

  const blockResult = result.blockResults[currentBlock];
  if (!blockResult) return null;
  const { compression } = blockResult;

  const handleAnimate = (roundIdx) => {
    setAnimatingRound(roundIdx);
    setSelectedRound(roundIdx);
    setTimeout(() => setAnimatingRound(null), 800);
  };

  // Scroll selected round into view
  useEffect(() => {
    if (selectedRound !== null && tableRef.current) {
      const row = tableRef.current.querySelector(`[data-round="${selectedRound}"]`);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedRound]);

  const round = selectedRound !== null ? compression.rounds[selectedRound] : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-700">64-Round Visualization</h3>
          </div>
          <p className="text-xs text-slate-400">
            Click any row to inspect that round's calculations in detail.
          </p>
        </div>
        {result.blockResults.length > 1 && (
          <div className="flex gap-1">
            {result.blockResults.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentBlock(i); setSelectedRound(null); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition
                  ${currentBlock === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                Block {i}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable table */}
      <div ref={tableRef} className="max-h-[420px] overflow-auto rounded-lg border border-slate-100">
        <table className="w-full text-[10px]">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-2 text-slate-400 font-semibold">t</th>
              <th className="text-center py-2 px-1 text-slate-400 font-semibold">W[t]</th>
              <th className="text-center py-2 px-1 text-slate-400 font-semibold">K[t]</th>
              <th className="text-center py-2 px-1 text-slate-400 font-semibold">T1</th>
              <th className="text-center py-2 px-1 text-slate-400 font-semibold">T2</th>
              {VARS.map((v) => (
                <th key={v} className="text-center py-2 px-1 text-slate-400 font-semibold uppercase">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono divide-y divide-slate-50">
            {compression.rounds.map((r, t) => {
              const isSelected = selectedRound === t;
              const isAnimating = animatingRound === t;
              return (
                <tr
                  key={t}
                  data-round={t}
                  onClick={() => handleAnimate(t)}
                  className={`cursor-pointer transition-all duration-300
                    ${isSelected ? 'bg-blue-50 shadow-sm' : 'hover:bg-slate-50'}
                    ${isAnimating ? 'scale-[1.01] bg-blue-100' : ''}`}
                >
                  <td className={`py-1.5 px-2 font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>{t}</td>
                  <td className="py-1.5 px-1 text-center text-emerald-600">{toHex32(r.intermediates.W)}</td>
                  <td className="py-1.5 px-1 text-center text-emerald-600">{toHex32(r.intermediates.K)}</td>
                  <td className="py-1.5 px-1 text-center text-amber-600 font-semibold">{toHex32(r.intermediates.T1)}</td>
                  <td className="py-1.5 px-1 text-center text-amber-600 font-semibold">{toHex32(r.intermediates.T2)}</td>
                  {VARS.map((v) => {
                    const changed = r.prevState[v] !== r.newState[v];
                    return (
                      <td
                        key={v}
                        className={`py-1.5 px-1 text-center transition-colors duration-300
                          ${changed
                            ? (isAnimating ? 'text-blue-700 bg-blue-100 font-bold' : 'text-blue-600 font-semibold')
                            : 'text-slate-500'}`}
                      >
                        {toHex32(r.newState[v])}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected round detail */}
      {round && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 space-y-3
                        animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-xs font-semibold text-slate-700">
            Round {selectedRound} — Detailed Computation
          </p>

          {/* Before state */}
          <div>
            <p className="text-[10px] text-slate-400 font-medium mb-1">Input Working Variables</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
              {VARS.map((v) => (
                <div key={v} className="text-center p-1.5 rounded bg-white border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase block">{v}</span>
                  <span className="text-[10px] font-mono text-slate-700">{toHex32(round.prevState[v])}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Intermediate computations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600">
            <div className="space-y-1 p-2 rounded-lg bg-white/60">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Functions</p>
              <p><span className="text-slate-400 w-16 inline-block">Ch(e,f,g)</span> = <span className="text-blue-600">{toHex32(round.intermediates.ch)}</span></p>
              <p><span className="text-slate-400 w-16 inline-block">Maj(a,b,c)</span> = <span className="text-blue-600">{toHex32(round.intermediates.maj)}</span></p>
              <p><span className="text-slate-400 w-16 inline-block">Σ₁(e)</span> = <span className="text-purple-600">{toHex32(round.intermediates.bigSigma1)}</span></p>
              <p><span className="text-slate-400 w-16 inline-block">Σ₀(a)</span> = <span className="text-purple-600">{toHex32(round.intermediates.bigSigma0)}</span></p>
            </div>
            <div className="space-y-1 p-2 rounded-lg bg-white/60">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Temporaries</p>
              <p><span className="text-slate-400 w-16 inline-block">K[{selectedRound}]</span> = <span className="text-emerald-600">{toHex32(round.intermediates.K)}</span></p>
              <p><span className="text-slate-400 w-16 inline-block">W[{selectedRound}]</span> = <span className="text-emerald-600">{toHex32(round.intermediates.W)}</span></p>
              <p className="pt-1 border-t border-slate-200/50">
                <span className="text-slate-400">T1</span> = h + Σ₁(e) + Ch(e,f,g) + K + W = <span className="text-amber-600 font-bold">{toHex32(round.intermediates.T1)}</span>
              </p>
              <p>
                <span className="text-slate-400">T2</span> = Σ₀(a) + Maj(a,b,c) = <span className="text-amber-600 font-bold">{toHex32(round.intermediates.T2)}</span>
              </p>
            </div>
          </div>

          {/* After state with change indicators */}
          <div>
            <p className="text-[10px] text-slate-400 font-medium mb-1">Output Working Variables</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
              {VARS.map((v) => {
                const changed = round.prevState[v] !== round.newState[v];
                return (
                  <div key={v} className={`text-center p-1.5 rounded border transition-all duration-500
                    ${changed ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] text-slate-400 uppercase block">{v}</span>
                    <span className={`text-[10px] font-mono ${changed ? 'text-blue-700 font-bold' : 'text-slate-700'}`}>
                      {toHex32(round.newState[v])}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Update equations */}
          <div className="text-[11px] font-mono text-slate-500 p-2 rounded bg-white/60 space-y-0.5">
            <p>a ← T1 + T2 = <strong className="text-slate-700">{toHex32(round.newState.a)}</strong></p>
            <p>e ← d + T1 = <strong className="text-slate-700">{toHex32(round.newState.e)}</strong></p>
            <p className="text-slate-400">b←a, c←b, d←c, f←e, g←f, h←g</p>
          </div>
        </div>
      )}
    </div>
  );
}
