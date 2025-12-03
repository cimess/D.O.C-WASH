import React, { useState, useRef, useEffect } from 'react';
import { connectLiveSession } from '../services/geminiService';
import { createPcmBlob, decodeAudioData, base64Decode } from '../utils/audioUtils';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionResolveRef = useRef<((session: any) => void) | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const cleanup = () => {
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    sessionPromiseRef.current = null;
    setStatus('idle');
    setIsActive(false);
  };

  const startSession = async () => {
    try {
      setStatus('connecting');
      setIsActive(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Create a manual promise to resolve the session once connected
      let sessionResolver: (s: any) => void;
      sessionPromiseRef.current = new Promise((resolve) => {
          sessionResolver = resolve;
          sessionResolveRef.current = resolve;
      });

      const sessionPromise = connectLiveSession(
        // onOpen
        () => {
            console.log("Live Session Open");
            setStatus('connected');
            
            const ctx = inputAudioContextRef.current!;
            const source = ctx.createMediaStreamSource(stream);
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createPcmBlob(inputData);
                sessionPromiseRef.current?.then(session => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            };
            
            source.connect(processor);
            processor.connect(ctx.destination);

            // Pass the session object to the promise resolver is tricky here because
            // the `connect` function returns the session promise, but we are inside the callback.
            // Actually, `ai.live.connect` returns the sessionPromise.
        },
        // onMessage
        async (msg) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const buffer = await decodeAudioData(base64Decode(base64Audio), ctx, 24000);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
            }
            
            if (msg.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
        },
        // onClose
        cleanup,
        // onError
        (err) => {
            console.error(err);
            setStatus('error');
            setTimeout(cleanup, 2000);
        }
      );

      // Resolve the session promise for our input handler
      sessionPromise.then(session => {
        if(sessionResolveRef.current) sessionResolveRef.current(session);
      });

    } catch (e) {
      console.error(e);
      setStatus('error');
      setIsActive(false);
    }
  };

  return (
    <section className="bg-slate-900 text-white py-16">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="inline-block p-4 rounded-full bg-slate-800 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Talk to a D.O.C Expert Live</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Have a complex cleaning challenge? Connect instantly with our AI voice assistant to discuss your needs in real-time.
        </p>

        <div className="flex justify-center">
          {!isActive ? (
            <button 
              onClick={startSession}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 flex items-center gap-3">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              Start Voice Conversation
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500 rounded-full text-red-400">
                    <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                    {status === 'connecting' ? 'Connecting...' : 'Live Session Active'}
                </div>
                <button 
                  onClick={cleanup}
                  className="text-slate-400 hover:text-white underline text-sm">
                  End Call
                </button>
            </div>
          )}
        </div>
        
        {status === 'error' && <p className="mt-4 text-red-400">Connection failed. Please try again.</p>}
      </div>
    </section>
  );
};

export default LiveAssistant;