import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ResultType, KnowledgePoint } from '../types';

interface ResultPageProps {
  type: ResultType;
  knowledge: KnowledgePoint;
  onBack: () => void;
  showAnimations?: boolean; // Controls text animation and overlay
}

const RESULT_TYPES: ResultType[] = ['Creative', 'Beautiful', 'Professional', 'Genius'];

// Global audio cache to ensure audio is loaded only once and reused
let audioCache: HTMLAudioElement | null = null;

// Function to load and cache audio
const getAudio = async (): Promise<HTMLAudioElement | null> => {
  if (audioCache) {
    return audioCache;
  }

  try {
    const audio = new Audio('/Result.m4a');
    audio.preload = 'auto';
    audio.volume = 1.0;

    // Wait for audio to be loadable
    await new Promise<void>((resolve, reject) => {
      const handleCanPlay = () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        resolve();
      };

      const handleError = () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        reject(new Error('Failed to load audio file'));
      };

      // Set timeout to resolve even if canplay doesn't fire
      const timeout = setTimeout(() => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        resolve(); // Resolve anyway, audio might still work
      }, 2000);

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      // Trigger loading
      audio.load();
    });

    audioCache = audio;
    return audio;
  } catch (error) {
    console.error('Error loading audio:', error);
    return null;
  }
};

// Function to play audio with retry logic
const playAudio = async (): Promise<void> => {
  try {
    const audio = await getAudio();
    if (!audio) {
      console.warn('Audio not available');
      return;
    }

    // Reset to beginning
    audio.currentTime = 0;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      try {
        await playPromise;
        console.log('✅ Audio playback started successfully');
      } catch (error: any) {
        console.error('❌ Failed to play audio:', error);

        // If autoplay is blocked, try user interaction approach
        if (error.name === 'NotAllowedError') {
          console.log('⚠️ Autoplay blocked - audio will play on user interaction');
          // In some cases, audio will play after first user interaction
        }
      }
    }
  } catch (error) {
    console.error('Error in playAudio:', error);
  }
};

export default function ResultPage({ type, knowledge, onBack, showAnimations = true }: ResultPageProps) {
  // Construct the image path based on knowledge point ID
  // All images are in jpg format
  const resultImagePath = `/result/${knowledge.id}.jpg`;
  const [displayType, setDisplayType] = useState<ResultType>(type);
  const [isFinished, setIsFinished] = useState(!showAnimations); // Skip animation if showAnimations is false
  const audioPlayedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation effect: cycle through result types for 4 seconds, then stop at the selected one
  useEffect(() => {
    console.log('ResultPage useEffect - showAnimations:', showAnimations, 'audioPlayedRef:', audioPlayedRef.current);
    
    if (!showAnimations) {
      console.log('showAnimations is false, skipping animation and audio');
      setDisplayType(type);
      setIsFinished(true);
      return;
    }

    // Reset audio flag for this animation cycle
    audioPlayedRef.current = false;

    // Play audio when animation starts
    if (!audioPlayedRef.current) {
      audioPlayedRef.current = true;
      console.log('🎵 Attempting to play audio');
      playAudio().catch(err => console.error('Audio playback error:', err));
    }

    let currentIndex = 0;
    const startTime = Date.now();
    const animationDuration = 4000; // 4 seconds
    const switchInterval = 100; // Switch every 100ms

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= animationDuration) {
        // Animation finished, show the correct type
        setDisplayType(type);
        setIsFinished(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // Still animating, cycle through types
        setDisplayType(RESULT_TYPES[currentIndex % RESULT_TYPES.length]);
        currentIndex++;
      }
    }, switchInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [type, showAnimations]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-screen overflow-hidden"
    >
      {/* Full screen result image */}
      <img
        src={resultImagePath}
        alt="result"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Back Button - Top Right with responsive sizing */}
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-[2vw] top-[2vw] z-30 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white/90 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-white hover:shadow-lg"
      >
        <ArrowLeft size={18} />
        Back
      </motion.button>

      {/* Overlay - Bottom half cover during animation and result reveal */}
      {showAnimations && (
        <motion.div
          initial={{ y: 0 }}
          animate={isFinished ? { y: window.innerHeight } : { y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: 'easeInOut' }}
          className="fixed left-0 right-0 bottom-0 z-25 pointer-events-none"
          style={{ backgroundColor: '#F5ECDD', height: '55vh', top: '45vh' }}
        />
      )}

      {/* Result Type Text Image - Top Center */}
      {/* 
        ⚠️ 结果文字位置配置在这里 - 需要调整时请修改下方 style 中的 left 和 top 值
        当前设置: left: '50%' (水平中心), top: '25%' (距离顶部25%)
        调整建议:
        - 向上移动: 减小 top 值 (如 20%, 15%)
        - 向下移动: 增大 top 值 (如 30%, 35%)
        - 向左移动: 减小 left 值 (如 45%)
        - 向右移动: 增大 left 值 (如 55%)
      */}
      {showAnimations && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed z-20"
          style={{ 
            left: '48%',      // 水平位置: 改为 '45%' 或 '55%' 等
            top: '22%',       // 垂直位置: 改为 '20%', '30%' 等
            transform: 'translate(-50%, -50%)',
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <motion.img
            key={displayType}
            src={`/result-text/${displayType.toLowerCase()}.svg`}
            alt={displayType}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: displayType === type ? 1 : 0.8 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.05 }}
            style={{ 
              width: '90vw',
              maxWidth: '600px',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
