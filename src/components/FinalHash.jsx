import React, { useState } from 'react';
import { toBin32, toHex32 } from '../utils/sha256';

export default function FinalHash({ result, isValid }) {
  const [copied, setCopied] = useState(false);
  const [showBinary, setShowBinary] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.hashHex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = result.hashHex;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-md space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">SHA-256 Hash Result</h3>
          <p className="text-xs text-slate-400 mt-0.5">256-bit cryptographic digest</p>
        </div>
        {isValid !== null && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${isValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {isValid ? '✓ Verified' : '✗ Mismatch'}
          </span>
        )}
      </div>

      {/* Hex output */}
      <div className="relative">
        <div className="p-4 rounded-lg bg-slate-900 overflow-x-auto">
          <code className="text-sm sm:text-base font-mono text-emerald-400 tracking-wider break-all select-all">
            {result.hashHex}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
            ${copied
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          {copied ? '✓ Copied!' : 'Copy Hash'}
        </button>
      </div>

      {/* Toggle binary / hex view */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowBinary(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
            ${!showBinary ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Hexadecimal
        </button>
        <button
          onClick={() => setShowBinary(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
            ${showBinary ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          Binary
        </button>
      </div>

      {showBinary ? (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 overflow-x-auto">
          <div className="space-y-1">
            {result.finalHash.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium w-6">H{i}</span>
                <code className="text-[10px] font-mono text-slate-700 tracking-widest">{toBin32(h)}</code>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex flex-wrap gap-1">
            {result.finalHash.map((h, i) => (
              <span key={i} className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-mono text-slate-700">
                {toHex32(h)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>Input: <strong className="text-slate-700">"{result.input.length > 50 ? result.input.substring(0, 50) + '…' : result.input}"</strong></span>
        <span>Output: <strong className="text-slate-700">64 hex chars</strong> = <strong className="text-slate-700">256 bits</strong></span>
      </div>
    </div>
  );
}
