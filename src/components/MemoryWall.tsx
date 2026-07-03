import React, { useState } from "react";
import { Camera, Calendar, Sparkles, Heart } from "lucide-react";
import { POLAROIDS, MEMORIES } from "../data/cozyData";
import { Polaroid, Memory } from "../types";

export default function MemoryWall() {
  const [activePolaroid, setActivePolaroid] = useState<Polaroid | null>(null);
  const [jarMemory, setJarMemory] = useState<string | null>(null);
  const [isSparkling, setIsSparkling] = useState(false);

  const triggerJarMemory = () => {
    setIsSparkling(true);
    const randomIndex = Math.floor(Math.random() * MEMORIES.length);
    const memory = MEMORIES[randomIndex];
    setJarMemory(`✨ ${memory.emoji} ${memory.title} (${memory.date}): ${memory.description}`);
    
    setTimeout(() => {
      setIsSparkling(false);
    }, 1200);
  };

  return (
    <div id="memory-wall-panel" className="space-y-6">
      {/* 6. Memory Jar Section */}
      <div className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-pink-100 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-pink-50 text-pink-500 rounded-xl">
            <Heart className="w-5 h-5 fill-pink-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">Nostalgia Memory Jar</h4>
            <p className="text-[10px] text-slate-400">Tap the glass jar to release sweet memories</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-5">
          {/* Glass Jar Graphic Button */}
          <button
            onClick={triggerJarMemory}
            id="btn-trigger-jar"
            className="group relative flex items-center justify-center p-2 focus:outline-none focus:ring-0 active:scale-90 transition-transform duration-200 shrink-0"
          >
            {/* Adorable SVG Glass Jar */}
            <svg
              className={`w-28 h-32 transition-all duration-300 ${isSparkling ? "animate-bounce scale-110" : "group-hover:scale-105"}`}
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lid */}
              <rect x="35" y="10" width="30" height="8" rx="3" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
              <rect x="38" y="18" width="24" height="6" fill="#F43F5E" />
              {/* Jar Neck */}
              <path d="M 38 24 L 30 35 L 30 40 L 70 40 L 70 35 L 62 24 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
              {/* Jar Body */}
              <path d="M 30 40 Q 15 50 15 75 Q 15 110 30 110 L 70 110 Q 85 110 85 75 Q 85 50 70 40 Z" fill="url(#jarGrad)" stroke="#E2E8F0" strokeWidth="3" />
              
              {/* Cute Hearts inside Jar */}
              <text x="35" y="70" className="text-xl select-none animate-pulse" style={{ animationDuration: "2s" }}>❤️</text>
              <text x="50" y="85" className="text-base select-none animate-pulse" style={{ animationDuration: "1.5s" }}>💖</text>
              <text x="45" y="55" className="text-xs select-none animate-pulse" style={{ animationDuration: "3s" }}>⭐</text>
              
              <defs>
                <linearGradient id="jarGrad" x1="50" y1="20" x2="50" y2="110" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDF2F8" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#FFF1F2" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FFE4E6" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
            {isSparkling && (
              <span className="absolute text-xl text-yellow-400 animate-ping -top-2">✨</span>
            )}
          </button>

          {/* Render Memory Output Card */}
          <div className="flex-1 w-full min-h-[90px] bg-pink-50/20 border border-pink-100/40 rounded-2xl p-4 flex items-center justify-center text-center">
            {jarMemory ? (
              <div className="animate-scale-up">
                <p className="text-stone-700 text-xs font-semibold leading-relaxed italic">{jarMemory}</p>
                <p className="text-[10px] text-pink-500 font-bold mt-2 uppercase tracking-wide">Remember this? 💖</p>
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic">Tap the jar to draw a happy memory...</p>
            )}
          </div>
        </div>
      </div>

      {/* 15. Photo Wall Section */}
      <div className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-amber-50">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Polaroid Photo Wall</h4>
            <p className="text-[10px] text-slate-400">Hover to wiggle, click to expand memories</p>
          </div>
        </div>

        {/* Polaroids grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 justify-items-center">
          {POLAROIDS.map((p) => (
            <button
              key={p.id}
              id={`polaroid-btn-${p.id}`}
              onClick={() => setActivePolaroid(p)}
              className={`block bg-white p-3 pb-6 rounded-md shadow-md border border-stone-100/80 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 transform ${p.rotation} select-none shrink-0 w-44`}
            >
              <div className="relative aspect-square w-full rounded overflow-hidden mb-3 bg-stone-100">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-sans font-semibold text-gray-800 text-xs text-center line-clamp-1">{p.title}</p>
              <p className="font-mono text-[9px] text-gray-400 text-center mt-1">{p.date}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Polaroid Expanded Modal overlay */}
      {activePolaroid && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm p-4 flex items-center justify-center z-[110] transition-opacity duration-300">
          <div className="bg-white p-5 pb-8 rounded-xl shadow-2xl max-w-sm w-full border-4 border-white animate-scale-up">
            <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-stone-100 mb-4 shadow-inner">
              <img
                src={activePolaroid.imageUrl}
                alt={activePolaroid.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-lg">📸</span>
                <h4 className="font-sans font-bold text-gray-900 text-base">{activePolaroid.title}</h4>
              </div>
              <p className="text-xs text-gray-500 text-center font-mono flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{activePolaroid.date}</span>
              </p>
              <div className="p-3 bg-rose-50/30 rounded-xl border border-rose-100/40 text-center mt-2">
                <p className="text-xs text-stone-700 font-medium leading-relaxed">{activePolaroid.caption}</p>
              </div>
              <button
                onClick={() => setActivePolaroid(null)}
                id="btn-close-polaroid"
                className="mt-4 w-full py-2 bg-stone-800 text-white hover:bg-stone-900 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                Close Polaroid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
