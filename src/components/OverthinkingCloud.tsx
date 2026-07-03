import React, { useState } from "react";
import { CloudRain, Wind, Sparkles } from "lucide-react";

export default function OverthinkingCloud() {
  const [thought, setThought] = useState("");
  const [isDestroying, setIsDestroying] = useState(false);
  const [thoughtDestroyed, setThoughtDestroyed] = useState(false);
  const [destroyedText, setDestroyedText] = useState("");

  const handleDestroy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim() || isDestroying) return;

    setIsDestroying(true);

    try {
      const response = await fetch("/api/destroy-thought", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought: thought.trim() }),
      });
      const data = await response.json();
      setDestroyedText(data.text);
    } catch (err) {
      console.error(err);
      setDestroyedText("Oh noes! That silly overthinking cloud was too foggy, but *gently blows it away with a warm puff of breath*... 🌬️ It's gone now! You are safe and doing amazing! 💕");
    }

    // Simulate blowing away animation
    setTimeout(() => {
      setIsDestroying(false);
      setThoughtDestroyed(true);
      setThought("");
    }, 2800);
  };

  const handleReset = () => {
    setThoughtDestroyed(false);
    setDestroyedText("");
  };

  return (
    <div id="overthinking-destroyer" className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-indigo-50 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
          <CloudRain className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500">Overthinking Destroyer</h4>
          <p className="text-[10px] text-slate-400">Hand your worry to the cute cloud and watch it fade</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-2 text-center">
        {/* Animated Cloud SVG */}
        <div className="relative mb-4">
          <svg
            className={`w-32 h-20 text-indigo-100 fill-current filter drop-shadow-md ${isDestroying ? "animate-bounce scale-110" : "animate-bounce-slow"}`}
            viewBox="0 0 100 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 20 40 Q 10 40 10 30 Q 10 20 22 20 Q 25 10 38 10 Q 50 10 54 18 Q 65 10 75 20 Q 85 20 85 32 Q 85 45 70 45 L 20 45 Z" />
            {/* Blinking eyes & pink cheeks on cloud */}
            <circle cx="38" cy="28" r="1.5" fill="#4B5563" />
            <circle cx="54" cy="28" r="1.5" fill="#4B5563" />
            <path d="M 43 32 Q 46 35 49 32" stroke="#4B5563" strokeWidth="1" fill="none" />
            <circle cx="34" cy="30" r="2" fill="#FDA4AF" />
            <circle cx="58" cy="30" r="2" fill="#FDA4AF" />
          </svg>

          {/* Blowing wind lines if blowing away */}
          {isDestroying && (
            <div className="absolute -right-12 top-6 flex flex-col gap-1.5 opacity-80 animate-pulse">
              <div className="w-8 h-1 bg-gradient-to-r from-indigo-200 to-transparent rounded-full animate-ping" />
              <div className="w-12 h-1 bg-gradient-to-r from-sky-200 to-transparent rounded-full" />
              <div className="w-6 h-1 bg-gradient-to-r from-indigo-200 to-transparent rounded-full animate-ping" style={{ animationDelay: "150ms" }} />
            </div>
          )}
        </div>

        {/* Dynamic state content */}
        {!thoughtDestroyed ? (
          <form onSubmit={handleDestroy} className="w-full space-y-3 relative z-10">
            <div className="relative">
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                disabled={isDestroying}
                placeholder="What are you overthinking right now? (e.g. 'I made an awkward comment', 'I am stressed about my next exam'). Let it out..."
                className={`w-full h-20 px-4 py-2.5 text-xs bg-stone-50 border border-indigo-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white text-stone-800 placeholder-stone-400 resize-none transition-all ${isDestroying ? "scale-90 rotate-6 opacity-30 blur-[1px]" : ""}`}
              />
            </div>

            <button
              type="submit"
              id="btn-destroy-thought"
              disabled={!thought.trim() || isDestroying}
              className="w-full py-2.5 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:scale-100 shadow-sm"
            >
              {isDestroying ? (
                <>
                  <Wind className="w-4 h-4 animate-spin-slow" />
                  <span>Blowing worry away... 🌬️</span>
                </>
              ) : (
                <>
                  <span>🌬️ Destroy This Thought</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="w-full bg-indigo-50/60 border border-indigo-100/50 p-4 rounded-2xl animate-scale-up">
            <div className="flex items-center gap-1.5 justify-center text-indigo-700 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold text-xs uppercase tracking-wider">Thought Destroyed</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed italic">
              "{destroyedText || "That thought doesn't deserve this much rent in your head."}"
            </p>
            <p className="text-[10px] text-gray-400 mt-2">
              Let it slide away. Your mind is clean, gentle, and peaceful now. 🍃
            </p>
            <button
              onClick={handleReset}
              id="btn-reset-destroyer"
              className="mt-3.5 px-4 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-full text-[10px] font-bold transition-all active:scale-95"
            >
              Destroy another thought
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
