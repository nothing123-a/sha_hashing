import React, { useState, useMemo } from 'react';
import { sha256Full, toBin32, toHex32 } from '../utils/sha256';

export default function AvalancheEffect() {
  const [inputA, setInputA] = useState('hello');
  const [inputB, setInputB] = useState('hallo');

  const resultA = useMemo(() => (inputA ? sha256Full(inputA) : null), [inputA]);
  const resultB = useMemo(() => (inputB ? sha256Full(inputB) : null), [inputB]);

  // Compute bit differences
  const bitDiff = useMemo(() => {
    if (!resultA || !resultB) return null;
    let changed = 0;
    const total = 256;
    const diffMap = []; // array of 256 booleans

    for (let i = 0; i < 8; i++) {
      const xor = (resultA.finalHash[i] ^ resultB.finalHash[i]) >>> 0;
      for (let bit = 31; bit >= 0; bit--) {
        const isDiff = (xor >>> bit) & 1;
        diffMap.push(!!isDiff);
        if (isDiff) changed++;
      }
    }

    return { changed, total, percentage: ((changed / total) * 100).toFixed(1), diffMap };
  }, [resultA, resultB]);

  // Build hex chars with diff highlighting
  const hexDiffPairs = useMemo(() => {
    if (!resultA || !resultB) return [];
    const hexA = resultA.hashHex;
    const hexB = resultB.hashHex;
    const pairs = [];
    for (let i = 0; i < 64; i++) {
      pairs.push({
        charA: hexA[i],
        charB: hexB[i],
        isDiff: hexA[i] !== hexB[i],
      });
    }
    return pairs;
  }, [resultA, resultB]);

  // Find character differences between inputs
  const inputDiffs = useMemo(() => {
    const maxLen = Math.max(inputA.length, inputB.length);
    const diffs = [];
    for (let i = 0; i < maxLen; i++) {
      diffs.push(inputA[i] !== inputB[i]);
    }
    return diffs;
  }, [inputA, inputB]);

  const charDiffCount = inputDiffs.filter(Boolean).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Avalanche Effect</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          A single-bit change in the input should change approximately 50% of the output bits.
          Modify one input slightly to see this fundamental property of SHA-256.
        </p>
      </div>

      {/* Side-by-side inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-blue-600">Message A</label>
          <input
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            placeholder="Enter first message…"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-purple-600">Message B</label>
          <input
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition"
            placeholder="Enter second message…"
          />
        </div>
      </div>

      {/* Quick diff buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 self-center">Try:</span>
        {[
          { a: 'hello', b: 'hallo', label: 'hello → hallo' },
          { a: 'abc', b: 'abd', label: 'abc → abd' },
          { a: 'SHA-256', b: 'SHA-257', label: 'SHA-256 → SHA-257' },
          { a: 'password', b: 'Password', label: 'case change' },
        ].map((ex, i) => (
          <button
            key={i}
            onClick={() => { setInputA(ex.a); setInputB(ex.b); }}
            className="px-2.5 py-1 rounded-md bg-slate-100 text-[11px] text-slate-500 hover:bg-slate-200
                       hover:text-slate-700 transition font-medium"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Input character comparison */}
      {inputA && inputB && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-2">
            Input Comparison — {charDiffCount} character{charDiffCount !== 1 ? 's' : ''} differ
          </p>
          <div className="flex flex-wrap gap-0.5">
            {Array.from({ length: Math.max(inputA.length, inputB.length) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-mono
                  ${inputDiffs[i] ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                  {inputA[i] || '·'}
                </span>
                <span className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-mono mt-0.5
                  ${inputDiffs[i] ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                  {inputB[i] || '·'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hash comparison */}
      {resultA && resultB && (
        <>
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Hash Output Comparison</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-500 font-medium w-5 shrink-0">A</span>
                <div className="flex flex-wrap font-mono text-xs">
                  {hexDiffPairs.map((p, i) => (
                    <span key={i} className={`w-[13px] text-center transition-colors duration-300
                      ${p.isDiff ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                      {p.charA}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-purple-500 font-medium w-5 shrink-0">B</span>
                <div className="flex flex-wrap font-mono text-xs">
                  {hexDiffPairs.map((p, i) => (
                    <span key={i} className={`w-[13px] text-center transition-colors duration-300
                      ${p.isDiff ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                      {p.charB}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bit difference visualization */}
          {bitDiff && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-2">
                  Bit-Level Difference Map (256 bits)
                </p>
                <div className="flex flex-wrap gap-[2px]">
                  {bitDiff.diffMap.map((isDiff, i) => (
                    <div
                      key={i}
                      className={`w-[7px] h-[7px] rounded-[1px] transition-colors duration-300
                        ${isDiff ? 'bg-red-400' : 'bg-emerald-200'}`}
                      title={`Bit ${i}: ${isDiff ? 'changed' : 'same'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 text-center">
                  <p className="text-2xl font-bold text-red-600">{bitDiff.changed}</p>
                  <p className="text-[10px] text-red-400 font-medium">Bits Changed</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{bitDiff.total - bitDiff.changed}</p>
                  <p className="text-[10px] text-emerald-400 font-medium">Bits Same</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {bitDiff.percentage}%
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Change Rate</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {parseFloat(bitDiff.percentage) > 45 && parseFloat(bitDiff.percentage) < 55
                  ? '✓ Close to ideal 50% — the avalanche effect is clearly demonstrated.'
                  : parseFloat(bitDiff.percentage) === 0
                    ? 'Identical inputs produce identical outputs (deterministic).'
                    : `${bitDiff.percentage}% of bits changed — SHA-256's mixing ensures broad diffusion.`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
