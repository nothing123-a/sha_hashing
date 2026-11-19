import React, { useState, useCallback, useEffect, useRef } from 'react';
import { sha256Full, validateHash } from './utils/sha256';
import Dashboard from './components/Dashboard';
import InputSection from './components/InputSection';
import StageNavigation from './components/StageNavigation';
import Stage1Binary from './components/Stage1Binary';
import Stage2Padding from './components/Stage2Padding';
import Stage3Schedule from './components/Stage3Schedule';
import Stage4Compression from './components/Stage4Compression';
import Stage5Final from './components/Stage5Final';
import FinalHash from './components/FinalHash';
import AvalancheEffect from './components/AvalancheEffect';
import RoundTable from './components/RoundTable';
import MathExplainer from './components/MathExplainer';
import LearningMode from './components/LearningMode';

const mainTabs = [
  { id: 'simulator', label: 'Simulator', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )},
  { id: 'avalanche', label: 'Avalanche', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  )},
  { id: 'math', label: 'Math Ops', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )},
  { id: 'learn', label: 'Learn', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )},
];

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState(0);
  const [isValid, setIsValid] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [activeTab, setActiveTab] = useState('simulator');
  const playRef = useRef(null);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) return;
    const r = sha256Full(input);
    setResult(r);
    setStage(1);
    setCurrentRound(0);
    setCurrentBlock(0);
    setIsPlaying(false);

    try {
      const v = await validateHash(input);
      setIsValid(v.match);
    } catch {
      setIsValid(null);
    }
  }, [input]);

  const handleReset = useCallback(() => {
    setInput('');
    setResult(null);
    setStage(0);
    setIsValid(null);
    setIsPlaying(false);
    setCurrentRound(0);
    setCurrentBlock(0);
  }, []);

  const nextStage = useCallback(() => setStage((s) => Math.min(s + 1, 5)), []);
  const prevStage = useCallback(() => setStage((s) => Math.max(s - 1, 1)), []);

  // Auto-play through stages
  useEffect(() => {
    if (isPlaying && result) {
      playRef.current = setInterval(() => {
        setStage((s) => {
          if (s >= 5) { setIsPlaying(false); return 5; }
          return s + 1;
        });
      }, 2500);
    }
    return () => clearInterval(playRef.current);
  }, [isPlaying, result]);

  const stageComponents = {
    1: <Stage1Binary result={result} />,
    2: <Stage2Padding result={result} />,
    3: <Stage3Schedule result={result} currentBlock={currentBlock} setCurrentBlock={setCurrentBlock} />,
    4: <Stage4Compression result={result} currentBlock={currentBlock} setCurrentBlock={setCurrentBlock}
         currentRound={currentRound} setCurrentRound={setCurrentRound} />,
    5: <Stage5Final result={result} />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-slate-900">SHA-256 Simulator</h1>
            </div>
            <div className="flex items-center gap-2">
              {isValid !== null && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {isValid ? '✓ Verified' : '✗ Mismatch'}
                </span>
              )}
              {result && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 border border-red-100
                             hover:bg-red-100 transition-all duration-200"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>

          {/* Main tab navigation */}
          <nav className="flex gap-1 -mb-3 overflow-x-auto">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-medium transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-white text-blue-600 border border-slate-200 border-b-white -mb-px shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Simulator Tab ── */}
        {activeTab === 'simulator' && (
          <>
            <Dashboard />

            <InputSection
              input={input}
              setInput={setInput}
              onGenerate={handleGenerate}
              onReset={handleReset}
              hasResult={!!result}
            />

            {result && (
              <>
                <StageNavigation
                  stage={stage}
                  setStage={setStage}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  onNext={nextStage}
                  onPrev={prevStage}
                />

                <div className="transition-all duration-300 ease-in-out">
                  {stageComponents[stage]}
                </div>

                {/* Round Table (shown alongside Stage 4 or independently) */}
                {stage === 4 && (
                  <RoundTable
                    result={result}
                    currentBlock={currentBlock}
                    setCurrentBlock={setCurrentBlock}
                  />
                )}

                {stage === 5 && <FinalHash result={result} isValid={isValid} />}
              </>
            )}
          </>
        )}

        {/* ── Avalanche Tab ── */}
        {activeTab === 'avalanche' && <AvalancheEffect />}

        {/* ── Math Operations Tab ── */}
        {activeTab === 'math' && <MathExplainer />}

        {/* ── Learning Tab ── */}
        {activeTab === 'learn' && <LearningMode />}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400">
          SHA-256 Cryptographic Hash Simulator — Interactive Educational Tool
        </div>
      </footer>
    </div>
  );
}
