import React from 'react';

const properties = [
  { label: 'Output Size', value: '256 bits', desc: '32 bytes / 64 hex characters' },
  { label: 'Block Size', value: '512 bits', desc: '64 bytes per block' },
  { label: 'Rounds', value: '64', desc: 'Compression iterations per block' },
];

export default function Dashboard() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">SHA-256 Cryptographic Hash Simulator</h2>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
          SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a
          fixed 256-bit digest from any input. It is deterministic, collision-resistant, and
          irreversible — widely used in digital signatures, certificates, and blockchain.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {properties.map((p) => (
          <div
            key={p.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{p.label}</p>
            <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {p.value}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
