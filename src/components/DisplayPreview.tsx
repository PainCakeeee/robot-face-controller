import { motion, AnimatePresence } from 'motion/react';
import { useRobotControl, KNOWLEDGE_POINTS, ResultType } from '../types';
import RobotFace from './RobotFace';
import ResultPage from './ResultPage';
import { useState, useEffect } from 'react';

export default function DisplayPreview() {
  const { state, resultType, knowledgeId, sendMessage } = useRobotControl('preview');
  const [showResultPage, setShowResultPage] = useState(false);
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

  const scanningText = 'scanning......';
  const totalChars = scanningText.length;

  return (
    <div 
      className="relative w-full bg-slate-950 rounded-2xl border-2 border-slate-700 overflow-hidden"
      style={{ 
        aspectRatio: '16 / 9'
      }}
    >
      {/* Scanning text animation */}
      <AnimatePresence>
        {state === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 z-40"
            style={{ top: 'calc(20%)', transform: 'translateX(-50%) translateY(-50%)' }}
          >
            <div className="flex justify-center gap-0.5">
              {scanningText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  className="font-bold text-cyan-400 inline-block"
                  style={{ fontSize: 'clamp(12px, 2.5vw, 24px)' }}
                  animate={{
                    y: [0, -6, 0],
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

      {/* Content Container - Uses zoom for complete display without clipping */}
      <div 
        className="absolute inset-0 origin-center"
        style={{
          zoom: '0.3',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
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
              <div className="h-screen w-screen pointer-events-none">
                <ResultPage
                  type={resultType}
                  knowledge={currentKnowledge}
                  onBack={() => {}}
                  showAnimations={false}
                />
              </div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
