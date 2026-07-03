import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Trophy } from "lucide-react";
import { Bubble } from "../types";

export default function BubblePop() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize bubbles
  const WORRIES = ["Worry", "Stress", "Fear", "Anxiety", "Doubt", "Sadness", "Noise", "Exhaustion", "Pressure"];
  const COLORS = [
    "bg-sky-100/70 border-sky-300 text-sky-800",
    "bg-pink-100/70 border-pink-300 text-pink-800",
    "bg-purple-100/70 border-purple-300 text-purple-800",
    "bg-blue-100/70 border-blue-300 text-blue-800",
    "bg-indigo-100/70 border-indigo-300 text-indigo-800",
    "bg-rose-100/70 border-rose-300 text-rose-800"
  ];

  const spawnBubble = () => {
    const text = WORRIES[Math.floor(Math.random() * WORRIES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = 55 + Math.random() * 25; // 55px to 80px
    return {
      id: `bubble-${Date.now()}-${Math.random()}`,
      text,
      x: 10 + Math.random() * 80, // Percentage width
      y: 110, // Start slightly below bottom
      size,
      speed: 0.5 + Math.random() * 0.6,
      color
    };
  };

  useEffect(() => {
    // Initial 10 bubbles to fill the larger stage beautifully
    const initial = Array.from({ length: 10 }, (_, i) => {
      const b = spawnBubble();
      b.y = 10 + i * 9; // spread them out vertically
      return b;
    });
    setBubbles(initial);
  }, []);

  // Float bubbles up
  useEffect(() => {
    const floatInterval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y - b.speed,
          }))
          // Reset if float past top
          .map((b) => {
            if (b.y < -15) {
              const fresh = spawnBubble();
              return { ...fresh, y: 110 };
            }
            return b;
          })
      );
    }, 30);

    return () => clearInterval(floatInterval);
  }, []);

  // Synthesize popping bubble sound
  const playPopSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // high-pitch quick bubble pop frequency
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      console.log("AudioContext blocked or uninitialized", e);
    }
  };

  const handlePop = (id: string) => {
    playPopSound();
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setPoppedCount((prev) => prev + 1);

    // Spawn 1 fresh bubble from bottom after 1.5 seconds
    setTimeout(() => {
      setBubbles((prev) => [...prev, spawnBubble()]);
    }, 1500);
  };

  return (
    <div id="bubble-pop-panel" className="p-5 bg-white/80 backdrop-blur-md border-2 border-sky-100 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-base">Bubble Pop Stress Relief</h3>
            <p className="text-xs text-gray-500">Tap to pop your heavy feelings away</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 rounded-full text-sky-700 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5 text-sky-500" />
          <span>Popped: {poppedCount}</span>
        </div>
      </div>

      {/* Bubble Stage */}
      <div className="relative h-[440px] bg-gradient-to-b from-sky-50/20 to-sky-100/20 rounded-2xl border border-sky-100 overflow-hidden shadow-inner">
        {bubbles.map((b) => (
          <button
            key={b.id}
            id={`worry-bubble-${b.id}`}
            onClick={() => handlePop(b.id)}
            className={`absolute flex items-center justify-center rounded-full border-2 shadow-sm font-medium transition-transform active:scale-75 select-none hover:brightness-95 animate-pulse`}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              fontSize: `${Math.max(10, b.size * 0.15)}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center relative p-1 text-center ${b.color}`}>
              {b.text}
              {/* Highlight shine on bubble */}
              <div className="absolute top-1 right-2 w-2 h-2 bg-white/60 rounded-full" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
