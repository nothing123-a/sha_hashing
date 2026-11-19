import React from 'react';

export default function InputSection({ input, setInput, onGenerate, onReset, hasResult }) {
  const byteLength = new TextEncoder().encode(input).length;
  const bitLength = byteLength * 8;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Input Message</h3>
        <div className="flex gap-3 text-xs text-slate-400">
          <span>{input.length} chars</span>
          <span>{byteLength} bytes</span>
          <span>{bitLength} bits</span>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter any message to hash…"
        rows={3}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono text-slate-800
                   placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                   transition resize-none"
      />

      <div className="flex gap-3">
        <button
          onClick={onGenerate}
          disabled={!input.trim()}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium
                     shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200 active:scale-[0.98]"
        >
          Generate Hash
        </button>
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium
                     hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
