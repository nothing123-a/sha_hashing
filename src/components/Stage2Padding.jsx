import React from 'react';

function byteToHex(b) {
  return b.toString(16).padStart(2, '0');
}

export default function Stage2Padding({ result }) {
  if (!result) return null;
  const { padding, paddedMessage, messageBytes } = result;
  const msgLen = messageBytes.length;

  // Build a visual representation of the padded message
  const segments = [];

  // Original message bytes
  for (let i = 0; i < msgLen; i++) {
    segments.push({ byte: paddedMessage[i], type: 'message' });
  }
  // 0x80 byte
  segments.push({ byte: 0x80, type: 'one-bit' });
  // Zero padding
  for (let i = msgLen + 1; i < paddedMessage.length - 8; i++) {
    segments.push({ byte: paddedMessage[i], type: 'zeros' });
  }
  // Length field (last 8 bytes)
  for (let i = paddedMessage.length - 8; i < paddedMessage.length; i++) {
    segments.push({ byte: paddedMessage[i], type: 'length' });
  }

  const typeColors = {
    message: 'bg-blue-50 border-blue-200 text-blue-700',
    'one-bit': 'bg-amber-50 border-amber-200 text-amber-700',
    zeros: 'bg-slate-50 border-slate-200 text-slate-400',
    length: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">Stage 2: SHA-256 Padding</h3>
        <p className="text-xs text-slate-400 mt-1">
          The message is padded so its length is a multiple of 512 bits (64 bytes).
          A single '1' bit is appended, then zeros, then the original message length as a 64-bit big-endian integer.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" /> Message
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-200" /> 1-bit (0x80)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" /> Zero padding
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-100 border border-purple-200" /> Length (64-bit)
        </span>
      </div>

      {/* Byte grid */}
      <div className="overflow-x-auto">
        <div className="inline-grid grid-cols-16 gap-0.5 min-w-0" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
          {segments.map((seg, i) => (
            <div
              key={i}
              className={`w-10 h-8 flex items-center justify-center rounded text-[10px] font-mono border
                         transition-all duration-200 hover:scale-110 cursor-default ${typeColors[seg.type]}`}
              title={`Byte ${i}: 0x${byteToHex(seg.byte)} (${seg.type})`}
            >
              {byteToHex(seg.byte)}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Original</p>
          <p className="text-sm font-bold text-slate-700">{padding.originalBitLength} bits</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Zero Bytes</p>
          <p className="text-sm font-bold text-slate-700">{padding.zeroBytes}</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Padded Size</p>
          <p className="text-sm font-bold text-slate-700">{padding.totalLength * 8} bits</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Blocks</p>
          <p className="text-sm font-bold text-slate-700">{padding.numBlocks}</p>
        </div>
      </div>

      {/* Formula */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
        <p className="text-xs font-mono text-slate-600">
          message ‖ 1 ‖ 0<sup>{padding.zeroBytes * 8 + 7}</sup> ‖ length<sub>64</sub>
          &nbsp;= {padding.totalLength} bytes = {padding.numBlocks} × 512-bit block{padding.numBlocks > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
