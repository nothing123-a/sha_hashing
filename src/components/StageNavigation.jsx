import React from 'react';

const stages = [
  { num: 1, label: 'Binary Conversion' },
  { num: 2, label: 'Padding' },
  { num: 3, label: 'Message Schedule' },
  { num: 4, label: 'Compression' },
  { num: 5, label: 'Final Hash' },
];

export default function StageNavigation({ stage, setStage, isPlaying, setIsPlaying, onNext, onPrev }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Stage pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {stages.map((s) => (
          <button
            key={s.num}
            onClick={() => setStage(s.num)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${stage === s.num
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                : stage > s.num
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
            {s.num}. {s.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={stage <= 1}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600
                     hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
            ${isPlaying
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          onClick={onNext}
          disabled={stage >= 5}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600
                     hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>

        {/* Progress bar */}
        <div className="flex-1 ml-2">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(stage / 5) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-slate-400 ml-2">{stage}/5</span>
      </div>
    </div>
  );
}
