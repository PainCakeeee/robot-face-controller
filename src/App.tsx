import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Settings, Play, Scan, Brain, Sparkles, RefreshCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useRobotControl, KNOWLEDGE_POINTS, ResultType, ResultLanguage } from './types';
import RobotFace from './components/RobotFace';
import ResultPage from './components/ResultPage';
import DisplayPreview from './components/DisplayPreview';

// Knowledge Point Emoji Map
const KNOWLEDGE_EMOJIS: { [key: number]: string } = {
  1: '🐙',      // Octopus
  2: '🐻‍❄️',     // Polar Bear
  3: '🐪',      // Camel
  4: '🐁',      // Mouse Face
  5: '🐠',      // Red Fish
  6: '🌸',      // Pink Flower
  7: '💩',      // Poop
  8: '🐦',      // Bird
  9: '🐼',      // Panda
};

function SelectionPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/display"
          className="group p-8 bg-slate-800 border-2 border-slate-700 rounded-3xl hover:border-cyan-500 transition-all flex flex-col items-center gap-4 text-white"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Monitor size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-1">Display Window</h3>
            <p className="text-slate-400 text-sm">Shows the robot face and results to the user.</p>
          </div>
        </Link>

        <Link
          to="/control"
          className="group p-8 bg-slate-800 border-2 border-slate-700 rounded-3xl hover:border-purple-500 transition-all flex flex-col items-center gap-4 text-white"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Settings size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-1">Control Window</h3>
            <p className="text-slate-400 text-sm">Background panel to control the robot's actions.</p>
          </div>
        </Link>
      </div>
      <div className="fixed bottom-8 text-slate-500 text-sm">
        Tip: Open this app in two separate tabs to see the synchronization.
      </div>
    </div>
  );
}

function DisplayPage() {
  const [showResultPage, setShowResultPage] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const displayRootRef = useRef<HTMLDivElement | null>(null);
  const { state, resultType, knowledgeId, resultLanguage, sendMessage } = useRobotControl('display');

  const currentKnowledge = knowledgeId ? KNOWLEDGE_POINTS.find(k => k.id === knowledgeId) : null;

  useEffect(() => {
    if (state === 'result') {
      setShowResultPage(false);
      const timer = setTimeout(() => {
        setShowResultPage(true);
      }, 1000);
      return () => clearTimeout(timer);
    }

    setShowResultPage(false);
  }, [state]);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    syncFullscreenState();
    document.addEventListener('fullscreenchange', syncFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await (displayRootRef.current || document.documentElement).requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      // Ignore browser fullscreen API rejection to keep UI responsive.
    }
  };

  const scanningText = 'scanning......';
  const totalChars = scanningText.length;

  return (
    <div ref={displayRootRef} className="min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Scanning text animation */}
      <AnimatePresence>
        {state === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-1/2 z-40"
            style={{ top: 'calc(20% - 70px)', transform: 'translate(-50%, -50%)' }}
          >
            <div className="flex justify-center gap-1">
              {scanningText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  className="font-bold text-cyan-400 inline-block"
                  style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: Infinity,
                    repeatDelay: (totalChars - 1) * 0.15,
                    delay: index * 0.15,
                    ease: 'easeInOut',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showResultPage ? (
          <motion.div
            key="robot"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="h-screen w-screen"
          >
            <RobotFace state={state} />
          </motion.div>
        ) : (
          currentKnowledge &&
          resultType && (
            <ResultPage
              type={resultType}
              knowledge={currentKnowledge}
              language={resultLanguage}
              onBack={() => sendMessage({ type: 'SET_STATE', state: 'idle' })}
            />
          )
        )}
      </AnimatePresence>

      <button
        onClick={toggleFullscreen}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-900 rounded-l-xl px-3 py-4 backdrop-blur-sm transition-colors"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );
}

function ControlPage() {
  const navigate = useNavigate();
  const { state, resultType, knowledgeId, resultLanguage, sendMessage } = useRobotControl('controller');
  const [selectedResultType, setSelectedResultType] = useState<ResultType | null>(resultType);
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<number | null>(knowledgeId);
  const [selectedLanguage, setSelectedLanguage] = useState<ResultLanguage>(resultLanguage);

  useEffect(() => {
    setSelectedResultType(resultType);
  }, [resultType]);

  useEffect(() => {
    setSelectedKnowledgeId(knowledgeId);
  }, [knowledgeId]);

  useEffect(() => {
    setSelectedLanguage(resultLanguage);
  }, [resultLanguage]);

  const canConfirmResult = selectedResultType !== null && selectedKnowledgeId !== null;

  const handleConfirmResult = () => {
    if (!selectedResultType || !selectedKnowledgeId) return;

    sendMessage({
      type: 'SET_STATE',
      state: 'result',
      resultType: selectedResultType,
      knowledgeId: selectedKnowledgeId,
      resultLanguage: selectedLanguage,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '25px' }}>
        {/* Header - Top of Page */}
        <header className="flex items-center justify-between" style={{ marginBottom: '50px' }}>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Robot Controller</h1>
            <p className="text-slate-500 mt-3">Manage robot states and knowledge delivery</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCcw size={20} className="text-slate-400" />
          </button>
        </header>

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', width: '100%' }}>
          {/* Left Column - Basic States and Display Monitor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Basic States Section */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100" style={{ width: '100%', padding: '34px' }}>
              <h2 className="flex items-center gap-2" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '34px' }}>
                <Play size={18} className="text-cyan-500" />
                Basic States
              </h2>
              <div className="grid grid-cols-2" style={{ gap: '34px' }}>
                <button 
                  onClick={() => sendMessage({ type: 'SET_STATE', state: 'idle' })}
                  className={`rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${state === 'idle' ? 'bg-cyan-50 border-cyan-500 text-cyan-700' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'}`}
                  style={{ padding: '21px' }}
                >
                  <Brain size={20} />
                  Idle
                </button>
                <button 
                  onClick={() => sendMessage({ type: 'SET_STATE', state: 'scanning' })}
                  className={`rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${state === 'scanning' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'}`}
                  style={{ padding: '21px' }}
                >
                  <Scan size={20} />
                  Scan
                </button>
                <button 
                  onClick={() => sendMessage({ type: 'SET_STATE', state: 'love' })}
                  className={`rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${state === 'love' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'}`}
                  style={{ padding: '21px' }}
                >
                  ❤️
                  Love
                </button>
                <button 
                  onClick={() => sendMessage({ type: 'SET_STATE', state: 'surprise' })}
                  className={`rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${state === 'surprise' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'}`}
                  style={{ padding: '21px' }}
                >
                  😲
                  Surprise
                </button>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-sm border border-slate-100" style={{ width: '100%', padding: '34px' }}>
              <h2 className="flex items-center gap-2" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '34px' }}>
                <Monitor size={18} className="text-cyan-500" />
                Display Preview
              </h2>
              <DisplayPreview />
            </section>
          </div>

          {/* Right Column - Result Generation */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <section className="bg-white rounded-3xl shadow-sm border border-slate-100" style={{ width: '100%', padding: '24px' }}>
              <h2 className="flex items-center gap-2" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                <Sparkles size={18} className="text-purple-500" />
                Result Generation
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="text-sm font-medium text-slate-500 block" style={{ marginBottom: '12px' }}>1. Select Result Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: '14px' }}>
                    {(['Creative', 'Beautiful', 'Professional', 'Genius'] as ResultType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedResultType(type)}
                        className={`rounded-xl border transition-all text-sm font-bold ${selectedResultType === type ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-100 hover:border-purple-300 hover:bg-purple-50 text-slate-700'}`}
                        style={{ padding: '14px' }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-500 block" style={{ marginBottom: '12px' }}>2. Select Knowledge Point</label>
                  <div className="grid grid-cols-3" style={{ gap: '14px' }}>
                    {KNOWLEDGE_POINTS.map((kp) => (
                      <button
                        key={kp.id}
                        onClick={() => setSelectedKnowledgeId(kp.id)}
                        className={`rounded-lg border transition-all font-bold flex items-center justify-center text-4xl ${selectedKnowledgeId === kp.id ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        style={{ padding: '28px 0px' }}
                      >
                        {KNOWLEDGE_EMOJIS[kp.id] || kp.id}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-500 block" style={{ marginBottom: '12px' }}>3. Select Language</label>
                  <div className="grid grid-cols-2" style={{ gap: '14px' }}>
                    {([
                      { value: 'en' as ResultLanguage, label: 'English' },
                      { value: 'fi' as ResultLanguage, label: 'Finnish' },
                    ]).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedLanguage(option.value)}
                        className={`rounded-xl border transition-all text-sm font-bold ${selectedLanguage === option.value ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-100 hover:border-purple-300 hover:bg-purple-50 text-slate-700'}`}
                        style={{ padding: '14px' }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConfirmResult}
                  disabled={!canConfirmResult}
                  className={`w-full rounded-xl font-bold transition-all ${canConfirmResult ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  style={{ padding: '14px' }}
                >
                  Confirm
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />
      <Route path="/display" element={<DisplayPage />} />
      <Route path="/control" element={<ControlPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
