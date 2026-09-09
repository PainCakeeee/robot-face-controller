import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ResultType, KnowledgePoint, ResultLanguage } from '../types';

interface ResultPageProps {
  type: ResultType;
  knowledge: KnowledgePoint;
  language: ResultLanguage;
  onBack: () => void;
  showAnimations?: boolean; // Controls text animation and overlay
}

const RESULT_TYPES: ResultType[] = ['Creative', 'Beautiful', 'Professional', 'Genius'];
const RESULT_TEXT_PATHS: Record<ResultLanguage, Record<ResultType, string>> = {
  en: {
    Creative: '/result-text/creative.svg',
    Beautiful: '/result-text/beautiful.svg',
    Professional: '/result-text/professional.svg',
    Genius: '/result-text/genius.svg',
  },
  fi: {
    Creative: '/result-text/creative.fi.svg',
    Beautiful: '/result-text/beautiful.fi.svg',
    Professional: '/result-text/professional.fi.svg',
    Genius: '/result-text/genius.fi.svg',
  },
};
const RESULT_TEXT_LEFT = '50%';
const RESULT_TEXT_TOP = '22%';
const RESULT_TEXT_WIDTH = '70%';

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

export default function ResultPage({ type, knowledge, language, onBack, showAnimations = true }: ResultPageProps) {
  // Construct the image path based on knowledge point ID
  // All images are in jpg format
  const resultImagePath = `/result/${knowledge.id}${language === 'fi' ? '.1' : ''}.jpg`;
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
  }, [type, showAnimations, language]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen w-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#F5ECDD' }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
        }}
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
          className="absolute right-[2.2%] top-[2.2%] z-30 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white/90 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-white hover:shadow-lg"
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        {/* Overlay - Bottom half cover during animation and result reveal */}
        {showAnimations && (
          <motion.div
            initial={{ y: 0 }}
            animate={isFinished ? { y: '100%' } : { y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-x-0 bottom-0 z-25 pointer-events-none"
            style={{ backgroundColor: '#F5ECDD', height: '55%' }}
          />
        )}

        {/* Result Type Text Image - Positioned in the same 16:9 canvas as the result art */}
        {showAnimations && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute z-20 pointer-events-none"
            style={{
              left: RESULT_TEXT_LEFT,
              top: RESULT_TEXT_TOP,
              transform: 'translate(-50%, -50%)',
              overflow: 'visible',
            }}
          >
            <motion.img
              key={`${language}-${displayType}`}
              src={RESULT_TEXT_PATHS[language][displayType]}
              alt={displayType}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: displayType === type ? 1 : 0.8,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.05 }}
              style={{
                width: RESULT_TEXT_WIDTH,
                height: 'auto',
                display: 'block',
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
