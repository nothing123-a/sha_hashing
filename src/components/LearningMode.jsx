import React, { useState } from 'react';

// ─── Quiz ───────────────────────────────────────────────────────
const quizQuestions = [
  {
    q: 'What is the output size of SHA-256?',
    options: ['128 bits', '256 bits', '512 bits', '1024 bits'],
    answer: 1,
    explanation: 'SHA-256 always produces a 256-bit (32-byte) hash digest, regardless of input size.',
  },
  {
    q: 'How many compression rounds does SHA-256 perform per block?',
    options: ['16', '32', '64', '128'],
    answer: 2,
    explanation: 'SHA-256 performs 64 rounds of compression for each 512-bit block of the padded message.',
  },
  {
    q: 'What is the block size in SHA-256?',
    options: ['128 bits', '256 bits', '512 bits', '1024 bits'],
    answer: 2,
    explanation: 'SHA-256 processes data in 512-bit (64-byte) blocks after padding.',
  },
  {
    q: 'What does the Choice function Ch(x, y, z) do?',
    options: [
      'Returns the majority vote of x, y, z',
      'If x=1, choose y; if x=0, choose z',
      'XORs all three inputs together',
      'Rotates x by y positions',
    ],
    answer: 1,
    explanation: 'Ch(x,y,z) = (x AND y) XOR (NOT x AND z). Bit x acts as a switch: pick from y when 1, from z when 0.',
  },
  {
    q: 'What happens to the SHA-256 output if you change just one bit of the input?',
    options: [
      'One bit of the output changes',
      'About 50% of the output bits change',
      'The output stays the same',
      'All 256 bits change',
    ],
    answer: 1,
    explanation: 'This is the avalanche effect — a single-bit input change causes roughly half the output bits to flip.',
  },
  {
    q: 'What is appended to the message during SHA-256 padding?',
    options: [
      'Random bytes',
      'A 1-bit, zero bits, then the original message length',
      'The hash of the message',
      'Nothing — the message is used as-is',
    ],
    answer: 1,
    explanation: 'Padding appends a 1-bit (0x80), enough zeros to reach 448 mod 512, then the 64-bit message length.',
  },
  {
    q: 'Where do the initial hash values (H₀–H₇) come from?',
    options: [
      'They are all zeros',
      'Randomly generated each time',
      'Fractional parts of the square roots of the first 8 primes',
      'Chosen by the user',
    ],
    answer: 2,
    explanation: 'The initial values are the first 32 bits of the fractional parts of √2, √3, √5, √7, √11, √13, √17, √19.',
  },
  {
    q: 'What type of operation is modular addition (mod 2³²)?',
    options: [
      'Reversible and linear',
      'Irreversible — overflow is discarded',
      'The same as normal addition',
      'Only works on even numbers',
    ],
    answer: 1,
    explanation: 'When the sum exceeds 2³² (4,294,967,296), the overflow is discarded, making it irreversible.',
  },
];

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[current];

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= quizQuestions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {score}/{quizQuestions.length}
        </div>
        <p className="text-sm text-slate-600">
          {pct >= 80 ? '🎉 Excellent! You have a strong understanding of SHA-256.' :
           pct >= 50 ? '👍 Good effort! Review the topics you missed.' :
           '📚 Keep studying! Try the algorithm walkthrough and math explanations.'}
        </p>
        <button onClick={handleRestart}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium
                     shadow-sm hover:shadow-md transition">
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Question {current + 1} of {quizQuestions.length}</span>
        <span className="text-xs text-blue-600 font-medium">Score: {score}</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
             style={{ width: `${((current + 1) / quizQuestions.length) * 100}%` }} />
      </div>

      <p className="text-sm font-medium text-slate-800">{question.q}</p>

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
          if (showResult) {
            if (i === question.answer) style = 'bg-emerald-50 border-emerald-300 text-emerald-800';
            else if (i === selected) style = 'bg-red-50 border-red-300 text-red-800';
            else style = 'bg-slate-50 border-slate-100 text-slate-400';
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs font-medium transition-all duration-200 ${style}`}>
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`p-3 rounded-lg text-xs leading-relaxed
          ${selected === question.answer ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
          {selected === question.answer ? '✓ Correct! ' : '✗ Not quite. '}
          {question.explanation}
        </div>
      )}

      {showResult && (
        <button onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600
                     hover:bg-slate-50 transition">
          {current + 1 >= quizQuestions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

// ─── Glossary ───────────────────────────────────────────────────
const glossaryTerms = [
  { term: 'Hash Function', def: 'A mathematical function that converts an arbitrary-size input into a fixed-size output (digest). It is deterministic — the same input always produces the same output.' },
  { term: 'Digest', def: 'The fixed-length output of a hash function. For SHA-256, the digest is always 256 bits (32 bytes, 64 hex characters).' },
  { term: 'Collision Resistance', def: 'The property that it is computationally infeasible to find two different inputs that produce the same hash output.' },
  { term: 'Preimage Resistance', def: 'Given a hash output, it should be computationally infeasible to find any input that produces that output. This is the "one-way" property.' },
  { term: 'Avalanche Effect', def: 'A small change in the input (even one bit) causes a drastic, unpredictable change in the output — roughly 50% of bits should flip.' },
  { term: 'Padding', def: 'The process of extending the input message so its bit length is a multiple of 512. SHA-256 appends a 1-bit, zeros, and the original 64-bit message length.' },
  { term: 'Message Schedule', def: 'The expansion of each 512-bit block from 16 words to 64 words (W₀–W₆₃) using the σ₀ and σ₁ functions.' },
  { term: 'Compression Function', def: 'The core mixing function that takes the current hash state and a message block, then produces an updated hash state through 64 rounds.' },
  { term: 'Working Variables', def: 'Eight 32-bit registers (a, b, c, d, e, f, g, h) that are updated in each compression round.' },
  { term: 'Round Constant (K)', def: 'Sixty-four fixed 32-bit values derived from the fractional parts of the cube roots of the first 64 primes. They ensure each round behaves differently.' },
  { term: 'Merkle–Damgård Construction', def: 'The iterative structure used by SHA-256: the message is broken into blocks, and each block is processed sequentially, chaining the output of one block as input to the next.' },
  { term: 'Deterministic', def: 'The same input always produces the exactly same output. There is no randomness in a hash function.' },
  { term: 'Bitwise Operation', def: 'An operation that works on individual bits of a number (AND, OR, XOR, NOT, shifts, rotations).' },
  { term: 'Modular Arithmetic', def: 'Arithmetic where numbers "wrap around" after reaching a maximum value. SHA-256 uses mod 2³² (4,294,967,296).' },
];

function Glossary() {
  const [search, setSearch] = useState('');
  const filtered = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search terms…"
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
      />
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filtered.map((t) => (
          <div key={t.term} className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
            <p className="text-xs font-semibold text-slate-800">{t.term}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.def}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No matching terms found.</p>
        )}
      </div>
    </div>
  );
}

// ─── Algorithm Walkthrough ──────────────────────────────────────
const walkthroughSteps = [
  {
    title: '1. Input & Encoding',
    content: 'The input message (any text, file, or data) is first encoded into bytes using UTF-8. Each character becomes one or more bytes. For example, "abc" becomes three bytes: 0x61, 0x62, 0x63.',
    icon: '📝',
  },
  {
    title: '2. Padding the Message',
    content: 'SHA-256 processes data in 512-bit (64-byte) blocks, so the message must be padded:\n\n• Append a single 1-bit (byte 0x80)\n• Append zeros until the message is 448 bits mod 512\n• Append the original message length as a 64-bit big-endian integer\n\nThis ensures the padded message is an exact multiple of 512 bits.',
    icon: '📐',
  },
  {
    title: '3. Initialize Hash Values',
    content: 'Eight 32-bit hash values (H₀–H₇) are initialized to specific constants. These come from the fractional parts of the square roots of the first eight prime numbers (2, 3, 5, 7, 11, 13, 17, 19). These "nothing-up-my-sleeve" numbers prove no hidden backdoor was designed in.',
    icon: '🔢',
  },
  {
    title: '4. Process Each Block',
    content: 'For each 512-bit block, SHA-256 performs two main steps:\n\na) Message Schedule Expansion — The 16 words (512 bits) from the block are expanded to 64 words using the σ₀ and σ₁ functions.\n\nb) 64 Compression Rounds — Eight working variables (a–h) are initialized from the current hash values and updated through 64 rounds of mixing.',
    icon: '⚙️',
  },
  {
    title: '5. Compression Round Details',
    content: 'Each of the 64 rounds computes:\n\n• T1 = h + Σ₁(e) + Ch(e,f,g) + K[t] + W[t]\n• T2 = Σ₀(a) + Maj(a,b,c)\n\nThen the working variables shift: h←g, g←f, f←e, e←d+T1, d←c, c←b, b←a, a←T1+T2.\n\nEach round uses a different constant K[t] and message schedule word W[t], ensuring unique mixing at every step.',
    icon: '🔄',
  },
  {
    title: '6. Update Hash Values',
    content: 'After all 64 rounds, the final working variables are added (mod 2³²) to the previous hash values:\n\nH₀ = H₀ + a, H₁ = H₁ + b, … H₇ = H₇ + h\n\nThis addition is crucial — it means the compression function cannot be inverted even if you know the working variables.',
    icon: '➕',
  },
  {
    title: '7. Produce the Digest',
    content: 'After processing all blocks, the eight 32-bit hash values are concatenated:\n\nDigest = H₀ ‖ H₁ ‖ H₂ ‖ H₃ ‖ H₄ ‖ H₅ ‖ H₆ ‖ H₇\n\nThis produces the final 256-bit (64 hex character) hash. The result is always the same length, whether the input was 1 byte or 1 gigabyte.',
    icon: '🎯',
  },
];

function Walkthrough() {
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="space-y-2">
      {walkthroughSteps.map((step, i) => (
        <div key={i} className={`rounded-lg border transition-all duration-300
          ${expanded === i ? 'border-blue-200 bg-blue-50/30 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
          <button
            onClick={() => setExpanded(expanded === i ? -1 : i)}
            className="w-full flex items-center gap-3 p-3 text-left"
          >
            <span className="text-lg">{step.icon}</span>
            <span className={`text-xs font-semibold flex-1 ${expanded === i ? 'text-blue-700' : 'text-slate-700'}`}>
              {step.title}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          {expanded === i && (
            <div className="px-3 pb-3 ml-9">
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{step.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main LearningMode Component ────────────────────────────────
const tabs = [
  { id: 'walkthrough', label: 'Algorithm Walkthrough', icon: '📖' },
  { id: 'quiz', label: 'Quiz', icon: '🧠' },
  { id: 'glossary', label: 'Glossary', icon: '📚' },
];

export default function LearningMode() {
  const [activeTab, setActiveTab] = useState('walkthrough');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Learning Mode</h3>
        </div>
        <p className="text-xs text-slate-400">
          Study how SHA-256 works step by step, test your knowledge, and explore cryptographic terminology.
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'glossary' && <Glossary />}
        {activeTab === 'walkthrough' && <Walkthrough />}
      </div>
    </div>
  );
}
