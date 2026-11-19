import React, { useState } from 'react';

const operations = [
  {
    id: 'xor',
    title: 'XOR (Exclusive OR)',
    symbol: '⊕',
    description: 'XOR outputs 1 only when the two input bits are different. If both bits are the same (both 0 or both 1), it outputs 0.',
    truth: [
      ['0', '0', '0'],
      ['0', '1', '1'],
      ['1', '0', '1'],
      ['1', '1', '0'],
    ],
    example: { a: '10110011', b: '11001010', result: '01111001' },
    usage: 'XOR is used throughout SHA-256 for mixing bits. It\'s reversible and ensures that every input bit affects the output. The Sigma functions and initial mixing all rely on XOR.',
  },
  {
    id: 'and',
    title: 'AND (Bitwise AND)',
    symbol: '∧',
    description: 'AND outputs 1 only when both input bits are 1. If either bit is 0, the output is 0. Think of it as: "both must be true."',
    truth: [
      ['0', '0', '0'],
      ['0', '1', '0'],
      ['1', '0', '0'],
      ['1', '1', '1'],
    ],
    example: { a: '10110011', b: '11001010', result: '10000010' },
    usage: 'AND is used in the Choice (Ch) and Majority (Maj) functions to selectively mask bits based on control values.',
  },
  {
    id: 'not',
    title: 'NOT (Bitwise Complement)',
    symbol: '¬',
    description: 'NOT simply flips every bit: 0 becomes 1, and 1 becomes 0. It\'s a unary operation (takes only one input).',
    truth: [
      ['0', '1'],
      ['1', '0'],
    ],
    example: { a: '10110011', result: '01001100' },
    usage: 'NOT is used in the Choice function: Ch(e, f, g) uses NOT(e) to select bits from g when e is 0.',
  },
  {
    id: 'rotr',
    title: 'Right Rotation (ROTR)',
    symbol: '⟳',
    description: 'Rotation shifts all bits to the right by n positions. Bits that "fall off" the right end wrap around to the left end. No bits are lost — they just move in a circle.',
    example: { a: '10110011', n: 3, result: '01110110', note: 'ROTR(10110011, 3) — last 3 bits (011) wrap to the front' },
    usage: 'ROTR is the core building block of the Sigma (Σ) functions. SHA-256 uses rotations of 2, 6, 7, 11, 13, 17, 18, 19, 22, and 25 positions.',
  },
  {
    id: 'shr',
    title: 'Right Shift (SHR)',
    symbol: '≫',
    description: 'Shift moves all bits to the right by n positions. Unlike rotation, bits that fall off the right end are discarded, and zeros fill in from the left.',
    example: { a: '10110011', n: 3, result: '00010110', note: 'SHR(10110011, 3) — rightmost 3 bits are lost, zeros fill the left' },
    usage: 'SHR is used in the lowercase sigma (σ) functions in the message schedule expansion. The lost bits add non-linearity.',
  },
  {
    id: 'ch',
    title: 'Choice Function (Ch)',
    symbol: 'Ch',
    description: 'Ch(x, y, z) = (x AND y) XOR (NOT x AND z). For each bit position, if x is 1, choose the bit from y; if x is 0, choose the bit from z. Variable x acts as a "selector switch."',
    example: {
      x: '11001010', y: '10101010', z: '01010101',
      result: '10100000',
      note: 'Where x=1 → take from y, where x=0 → take from z',
    },
    usage: 'Ch is applied in every compression round using working variables e, f, g. It introduces non-linear mixing controlled by variable e.',
  },
  {
    id: 'maj',
    title: 'Majority Function (Maj)',
    symbol: 'Maj',
    description: 'Maj(x, y, z) = (x AND y) XOR (x AND z) XOR (y AND z). For each bit position, the output is whichever value (0 or 1) appears in at least two of the three inputs — the "majority vote."',
    example: {
      x: '11001010', y: '10101010', z: '01010101',
      result: '11001010',
      note: 'Each output bit = majority of the 3 input bits at that position',
    },
    usage: 'Maj is applied in every compression round using working variables a, b, c. Combined with Ch, it ensures thorough bit mixing.',
  },
  {
    id: 'sigma',
    title: 'Sigma Functions (Σ and σ)',
    symbol: 'Σ/σ',
    description: 'SHA-256 uses four Sigma functions that combine multiple rotations and shifts with XOR:\n\n• Σ₀(x) = ROTR²(x) ⊕ ROTR¹³(x) ⊕ ROTR²²(x)\n• Σ₁(x) = ROTR⁶(x) ⊕ ROTR¹¹(x) ⊕ ROTR²⁵(x)\n• σ₀(x) = ROTR⁷(x) ⊕ ROTR¹⁸(x) ⊕ SHR³(x)\n• σ₁(x) = ROTR¹⁷(x) ⊕ ROTR¹⁹(x) ⊕ SHR¹⁰(x)\n\nCapital Σ functions are used in compression rounds; lowercase σ functions are used in message schedule expansion.',
    usage: 'Sigma functions spread the influence of each bit across the word. By XOR-ing three different rotations, a single input bit affects many output positions, creating the "avalanche" behavior.',
  },
  {
    id: 'add',
    title: 'Modular Addition (mod 2³²)',
    symbol: '+',
    description: 'Standard integer addition, but only the lower 32 bits of the result are kept. If the sum exceeds 2³² (4,294,967,296), the overflow is discarded. This makes the operation irreversible.',
    example: {
      a: '0xFFFFFFFF',
      b: '0x00000002',
      result: '0x00000001',
      note: '4294967295 + 2 = 4294967297, but mod 2³² = 1',
    },
    usage: 'Modular addition is used to compute T1, T2, the new working variables, and the final hash values. Its irreversibility is key to making SHA-256 a one-way function.',
  },
];

export default function MathExplainer() {
  const [activeOp, setActiveOp] = useState('xor');
  const op = operations.find((o) => o.id === activeOp);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Mathematical Operations</h3>
        </div>
        <p className="text-xs text-slate-400">
          SHA-256 uses these core bitwise and arithmetic operations. Click each one to learn how it works.
        </p>
      </div>

      {/* Operation selector */}
      <div className="flex flex-wrap gap-1.5">
        {operations.map((o) => (
          <button
            key={o.id}
            onClick={() => setActiveOp(o.id)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${activeOp === o.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <span className="mr-1 opacity-70">{o.symbol}</span> {o.title.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Operation detail */}
      {op && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{op.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{op.description}</p>
          </div>

          {/* Truth table if available */}
          {op.truth && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-2">Truth Table</p>
              <table className="text-xs font-mono">
                <thead>
                  <tr className="text-slate-400">
                    {op.id === 'not' ? (
                      <>
                        <th className="pr-4 pb-1 text-left">Input</th>
                        <th className="pb-1 text-left">Output</th>
                      </>
                    ) : (
                      <>
                        <th className="pr-4 pb-1 text-left">A</th>
                        <th className="pr-4 pb-1 text-left">B</th>
                        <th className="pb-1 text-left">A {op.symbol} B</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {op.truth.map((row, i) => (
                    <tr key={i} className="text-slate-700">
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`pr-4 py-0.5 ${j === row.length - 1 ? 'font-semibold text-blue-600' : ''}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Example */}
          {op.example && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-2">Example</p>
              <div className="space-y-1 text-xs font-mono text-slate-700">
                {op.example.a && (
                  <p>
                    <span className="text-slate-400 w-20 inline-block">{op.example.x ? 'x' : 'A'}:</span>
                    <span className="text-blue-600 tracking-widest">{op.example.a || op.example.x}</span>
                  </p>
                )}
                {op.example.x && (
                  <>
                    <p><span className="text-slate-400 w-20 inline-block">x:</span><span className="text-blue-600 tracking-widest">{op.example.x}</span></p>
                    <p><span className="text-slate-400 w-20 inline-block">y:</span><span className="text-emerald-600 tracking-widest">{op.example.y}</span></p>
                    <p><span className="text-slate-400 w-20 inline-block">z:</span><span className="text-purple-600 tracking-widest">{op.example.z}</span></p>
                  </>
                )}
                {op.example.b && (
                  <p><span className="text-slate-400 w-20 inline-block">B:</span><span className="text-purple-600 tracking-widest">{op.example.b}</span></p>
                )}
                {op.example.n !== undefined && (
                  <p><span className="text-slate-400 w-20 inline-block">n:</span><span className="text-emerald-600">{op.example.n}</span></p>
                )}
                <p className="pt-1 border-t border-blue-200/50">
                  <span className="text-slate-400 w-20 inline-block">Result:</span>
                  <span className="text-amber-600 font-semibold tracking-widest">{op.example.result}</span>
                </p>
                {op.example.note && (
                  <p className="text-[11px] text-slate-400 pt-1 font-sans">{op.example.note}</p>
                )}
              </div>
            </div>
          )}

          {/* Usage in SHA-256 */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <p className="text-[10px] text-emerald-500 uppercase tracking-wide font-medium mb-1">Role in SHA-256</p>
            <p className="text-xs text-slate-600 leading-relaxed">{op.usage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
