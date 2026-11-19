import React, { useState } from 'react';
import { toHex32 } from '../utils/sha256';

const VARS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function VarBox({ label, value, changed }) {
  return (
    <div className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-300
      ${changed
        ? 'bg-blue-50 border-blue-300 shadow-sm scale-105'
        : 'bg-slate-50 border-slate-200'}`}
    >
      <span className="text-[10px] font-semibold text-slate-400 uppercase">{label}</span>
      <span className="text-[10px] font-mono text-slate-700 mt-0.5">{toHex32(value)}</span>
    </div>
  );
}

export default function Stage4Compression({ result, currentBlock, setCurrentBlock, currentRound, setCurrentRound }) {
  const [showDetail, setShowDetail] = useState(true);

  if (!result || !result.blockResults.length) return null;

  const blockResult = result.blockResults[currentBlock];
  if (!blockResult) return null;

  const { compression } = blockResult;
  const round = compression.rounds[currentRound];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Stage 4: Compression Rounds</h3>
          <p className="text-xs text-slate-400 mt-1">
            64 rounds of mixing using Ch, Maj, Σ₀, Σ₁ functions with constants K and schedule words W.
          </p>
        </div>
        <div className="flex gap-2">
          {result.blockResults.length > 1 &&
            result.blockResults.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentBlock(i); setCurrentRound(0); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition
                  ${currentBlock === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                Block {i}
              </button>
            ))}
        </div>
      </div>

      {/* Round selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRound(Math.max(0, currentRound - 1))}
            disabled={currentRound === 0}
            className="px-2 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-600
                       hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ‹ Prev
          </button>
          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Round {currentRound}
          </span>
          <button
            onClick={() => setCurrentRound(Math.min(63, currentRound + 1))}
            disabled={currentRound === 63}
            className="px-2 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-600
                       hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next ›
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition"
          >
            {showDetail ? 'Hide' : 'Show'} Math
          </button>
        </div>

        {/* Round progress bar */}
        <div className="relative h-6 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden cursor-pointer"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const x = e.clientX - rect.left;
               const round = Math.floor((x / rect.width) * 64);
               setCurrentRound(Math.max(0, Math.min(63, round)));
             }}
        >
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-200"
            style={{ width: `${((currentRound + 1) / 64) * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-slate-600">
            {currentRound + 1} / 64
          </div>
        </div>

        {/* Quick round buttons */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {[0, 7, 15, 23, 31, 39, 47, 55, 63].map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRound(r)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition shrink-0
                ${currentRound === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Working variables — Before */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Input State (before round {currentRound})
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {VARS.map((v) => (
            <VarBox key={v} label={v} value={round.prevState[v]} changed={false} />
          ))}
        </div>
      </div>

      {/* Math detail */}
      {showDetail && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600">
            <div className="space-y-1">
              <p><span className="text-slate-400">Ch(e,f,g)</span> = <span className="text-blue-600">{toHex32(round.intermediates.ch)}</span></p>
              <p><span className="text-slate-400">Maj(a,b,c)</span> = <span className="text-blue-600">{toHex32(round.intermediates.maj)}</span></p>
              <p><span className="text-slate-400">Σ₁(e)</span> = <span className="text-purple-600">{toHex32(round.intermediates.bigSigma1)}</span></p>
              <p><span className="text-slate-400">Σ₀(a)</span> = <span className="text-purple-600">{toHex32(round.intermediates.bigSigma0)}</span></p>
            </div>
            <div className="space-y-1">
              <p><span className="text-slate-400">K[{currentRound}]</span> = <span className="text-emerald-600">{toHex32(round.intermediates.K)}</span></p>
              <p><span className="text-slate-400">W[{currentRound}]</span> = <span className="text-emerald-600">{toHex32(round.intermediates.W)}</span></p>
              <p><span className="text-slate-400">T1</span> = h + Σ₁ + Ch + K + W = <span className="text-amber-600 font-semibold">{toHex32(round.intermediates.T1)}</span></p>
              <p><span className="text-slate-400">T2</span> = Σ₀ + Maj = <span className="text-amber-600 font-semibold">{toHex32(round.intermediates.T2)}</span></p>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-200/50 text-xs font-mono text-slate-500">
            <p>a = T1 + T2 = <strong className="text-slate-700">{toHex32(round.newState.a)}</strong></p>
            <p>e = d + T1 = <strong className="text-slate-700">{toHex32(round.newState.e)}</strong></p>
            <p>b←a, c←b, d←c, f←e, g←f, h←g (shifted)</p>
          </div>
        </div>
      )}

      {/* Working variables — After */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Output State (after round {currentRound})
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {VARS.map((v) => (
            <VarBox
              key={v}
              label={v}
              value={round.newState[v]}
              changed={round.prevState[v] !== round.newState[v]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
