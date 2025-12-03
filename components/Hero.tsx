import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ThreeBackground from './ThreeBackground';
import { generateSpeech } from '../services/geminiService';
import { decodeAudioData, base64Decode } from '../utils/audioUtils';
import { magneticButton } from '../utils/animations';

const Hero: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(headlineRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' })
      .fromTo(subheadRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.6');

    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll('button');
      buttons.forEach((btn) => magneticButton(btn as HTMLElement));
    }
  }, []);

  const handleSpeakWelcome = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const base64Audio = await generateSpeech("Welcome to D.O.C Wash. We provide world-class industrial and residential cleaning services.");
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await decodeAudioData(base64Decode(base64Audio), audioContext, 24000);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        source.onended = () => setIsPlaying(false);
      } else {
          setIsPlaying(false);
      }
    } catch (e) {
      console.error("TTS Error", e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-industrial.jpg"
          alt="Industrial Cleaning"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6 inline-block p-2 px-4 rounded-full bg-blue-100/80 backdrop-blur-sm text-blue-800 text-sm font-semibold tracking-wide uppercase shadow-sm animate-fade-in-up">
            Hygiene Solutions
        </div>
        <h1 ref={headlineRef} className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">
          D.O.C <span className="text-blue-600">Wash</span>
        </h1>
        <p ref={subheadRef} className="text-xl md:text-2xl text-white/40 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          The future of clean. We combine advanced robotics and eco-friendly chemistry to deliver pristine results for homes and industries.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
             onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth'})}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl">
            Explore Services
          </button>
          <button
            onClick={handleSpeakWelcome}
            disabled={isPlaying}
            className="px-8 py-4 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-blue-400 text-slate-700 font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 hover:bg-white">
            {isPlaying ? (
                <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                Speaking...
                </>
            ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Hear Welcome
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
