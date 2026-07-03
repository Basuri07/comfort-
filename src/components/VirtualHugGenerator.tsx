import React, { useState, useEffect } from "react";
import { Heart, Sparkles, Coffee, ShieldAlert, Check, Moon, VolumeX, Volume2, Shield, ArrowRight, RefreshCw, Star, X } from "lucide-react";

interface HugStyle {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cozyMessage: string;
  closingAction: string;
}

const HUG_STYLES: HugStyle[] = [
  {
    id: "squeezy",
    name: "The Squeezy Bear Hug",
    emoji: "🧸",
    description: "A tight, warm, protective embrace that grounds you completely.",
    cozyMessage: "Close your eyes and cross your arms over your chest. Imagine my arms wrapped snuggly around your shoulders, holding you tight, solid as a rock. Rest your head. You don't have to carry anything alone right now. I am holding you close and protecting you.",
    closingAction: "*Gives you one final squeezy pat on the back and hands you a warm chocolate chip cookie* 🍪"
  },
  {
    id: "fleece",
    name: "The Warm Blanket Hug",
    emoji: "🧥",
    description: "Feels like a fluffy fleece blanket fresh out of the dryer smelling of lavender.",
    cozyMessage: "Imagine a heavy, warm blanket settling over you. Close your eyes. I'm gently smoothing your hair, wiping away the noise, and whispering that you're safe. Let the warmth sink deep into your tired muscles. Just rest.",
    closingAction: "*Tucks you in perfectly and boops your nose gently* 💖"
  },
  {
    id: "sway",
    name: "The Gentle Sway Hug",
    emoji: "🫂",
    description: "A slow, comforting rock that melts away any stress and overthinking.",
    cozyMessage: "Sync your breathing with the soft chest pulse on the screen. We are rocking gently back and forth together. The world is quiet, the lights are low, and there is no rush at all. Just ride the wave of this calm sway with me.",
    closingAction: "*Pats your cheek softly and leaves a glowing stardust kiss on your forehead* ✨"
  }
];

const BEVERAGES = [
  { name: "Hot Cocoa with Marshmallows", emoji: "☕", comfort: "A sweet cup of rich liquid chocolate topped with clouds of soft sugar." },
  { name: "Organic Lavender Chamomile Tea", emoji: "🍵", comfort: "A gentle brew that tastes like a soft sleepy meadow." },
  { name: "Warm Milk with Honey", emoji: "🥛", comfort: "A creamy, smooth draught of sweet liquid comfort." }
];

export default function VirtualHugGenerator() {
  const [step, setStep] = useState<"setup" | "prep" | "breathing" | "embrace" | "afterglow">("setup");
  const [selectedStyle, setSelectedStyle] = useState<HugStyle>(HUG_STYLES[0]);
  const [deepImmersion, setDeepImmersion] = useState<boolean>(true);
  const [isPressingHeart, setIsPressingHeart] = useState<boolean>(false);
  const [breathState, setBreathState] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathCount, setBreathCount] = useState<number>(4);
  const [embraceSecondsLeft, setEmbraceSecondsLeft] = useState<number>(10);
  const [selectedBeverage, setSelectedBeverage] = useState<typeof BEVERAGES[0]>(BEVERAGES[0]);

  // Handle breathing sequence cycle
  useEffect(() => {
    if (step !== "breathing") return;

    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          // Switch breathing phase
          setBreathState((current) => {
            if (current === "Inhale") {
              setBreathCount(4);
              return "Hold";
            } else if (current === "Hold") {
              setBreathCount(5);
              return "Exhale";
            } else {
              // Finished one full cycle, proceed to core embrace
              clearInterval(interval);
              setTimeout(() => {
                setStep("embrace");
              }, 500);
              return "Inhale";
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, breathState]);

  // Handle embrace timer
  useEffect(() => {
    if (step !== "embrace") return;

    const interval = setInterval(() => {
      setEmbraceSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep("afterglow");
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const startHugSequence = () => {
    setEmbraceSecondsLeft(12);
    setBreathCount(4);
    setBreathState("Inhale");
    setStep("prep");
  };

  const resetHug = () => {
    setStep("setup");
    setIsPressingHeart(false);
  };

  return (
    <div id="virtual-hug-generator-panel" className="bg-white rounded-[2.5rem] p-6 border-2 border-pink-100 shadow-sm relative overflow-hidden transition-all duration-500">
      
      {/* Dynamic Immersive Full-Screen Cozy Light Dimming Overlay */}
      {deepImmersion && step !== "setup" && (
        <div className="fixed inset-0 bg-stone-950 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-6 text-center animate-fade-in text-white select-none animate-warm-ambient-glow">
          
          {/* Full-screen Comfort Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none animate-comfort-vignette z-[1]" />

          {/* Left and Right Glowing Hugging Arms wrapper */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
            {/* Left Arm embrace */}
            <div className="absolute left-[-5%] top-[-10%] bottom-[-10%] w-[35vw] bg-gradient-to-r from-pink-500/15 via-rose-500/5 to-transparent rounded-r-[50rem] blur-2xl animate-arm-left" />
            {/* Right Arm embrace */}
            <div className="absolute right-[-5%] top-[-10%] bottom-[-10%] w-[35vw] bg-gradient-to-l from-pink-500/15 via-rose-500/5 to-transparent rounded-l-[50rem] blur-2xl animate-arm-right" />
          </div>

          {/* Somatic Quick Heartbeat overlay when holding */}
          {isPressingHeart && (
            <div className="absolute inset-0 pointer-events-none bg-rose-500/5 z-[3] animate-pulse" style={{ animationDuration: "0.8s" }} />
          )}

          {/* Close button to escape if needed */}
          <button 
            onClick={resetHug}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all active:scale-90 z-[210]"
            title="Exit Hug Session"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating stardust ambient stars */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-[4]">
            <div className="absolute top-10 left-[15%] w-2 h-2 bg-pink-300 rounded-full animate-ping" />
            <div className="absolute top-[40%] right-[10%] w-3 h-3 bg-amber-200 rounded-full animate-pulse" />
            <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-sky-200 rounded-full animate-pulse" />
            <div className="absolute top-[80%] left-[60%] w-2.5 h-2.5 bg-yellow-100 rounded-full animate-ping" style={{ animationDelay: "1s" }} />
          </div>

          <div className="max-w-md mx-auto space-y-6 z-[10]">

            {/* STAGE 1: PREPARATION */}
            {step === "prep" && (
              <div className="space-y-6 animate-scale-up">
                <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-pink-500/10">
                  <Moon className="w-10 h-10 text-pink-300 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-widest">Step 1: Get Comfy</p>
                  <h3 className="text-xl font-serif italic text-pink-100 font-bold">Prepare Your Space</h3>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
                    Put down any distractions. Lean back comfortably in your chair, or curl up. 
                    If you can, <span className="text-pink-300 font-bold">wrap your arms around your own chest</span> or hold a pillow to physically receive the embrace.
                  </p>
                </div>
                <button
                  onClick={() => setStep("breathing")}
                  className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-lg shadow-pink-500/20"
                >
                  I'm Cozy, Let's Connect
                </button>
              </div>
            )}

            {/* STAGE 2: SOMATIC BREATHING SYNC */}
            {step === "breathing" && (
              <div className="space-y-8 animate-scale-up">
                {/* Breathing Circle Ring with pulsating scale */}
                <div className={`w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-pink-500/30 to-amber-500/30 flex items-center justify-center border-4 border-pink-400/40 relative ${
                  breathState === "Inhale" ? "scale-125 transition-all duration-[4000ms]" :
                  breathState === "Hold" ? "scale-125 duration-1000" :
                  "scale-95 transition-all duration-[5000ms]"
                }`}>
                  <div className="text-center">
                    <p className="text-lg font-bold tracking-wider text-pink-100 font-serif animate-pulse">{breathState}</p>
                    <p className="text-2xl font-mono font-black">{breathCount}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-widest">Step 2: Breathe Together</p>
                  <h3 className="text-lg font-bold text-stone-100">Synchronize your heartbeat</h3>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
                    {breathState === "Inhale" && "Draw in the soft, warm lavender energy..."}
                    {breathState === "Hold" && "Keep that gentle warmth circulating in your chest..."}
                    {breathState === "Exhale" && "Let all the heavy worry and muscle tightness melt away..."}
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 3: CORE COMFORT PERSON EMBRACE */}
            {step === "embrace" && (
              <div className="space-y-6 animate-scale-up">
                {/* Immersive Somatic Heart Pulse */}
                <div 
                  onMouseDown={() => setIsPressingHeart(true)}
                  onMouseUp={() => setIsPressingHeart(false)}
                  onTouchStart={() => setIsPressingHeart(true)}
                  onTouchEnd={() => setIsPressingHeart(false)}
                  className={`w-32 h-32 mx-auto rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 ${
                    isPressingHeart 
                      ? "bg-rose-600/30 ring-8 ring-rose-500/20 scale-105" 
                      : "bg-rose-500/20 ring-4 ring-rose-500/10 hover:bg-rose-500/25 animate-heartbeat"
                  }`}
                >
                  <Heart className={`w-14 h-14 text-rose-400 fill-rose-400 transition-all ${isPressingHeart ? "scale-110" : ""}`} />
                  <span className="text-[8px] font-mono text-rose-300 absolute bottom-4 uppercase tracking-widest font-black animate-pulse">
                    {isPressingHeart ? "PRESING HARD 💕" : "HOLD HERE"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-1.5 text-rose-400 font-mono text-xs font-bold">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                    <span>HUGGING IN PROGRESS... {embraceSecondsLeft}s</span>
                  </div>
                  
                  <h3 className="text-base font-serif italic text-pink-100 font-bold max-w-xs mx-auto leading-relaxed">
                    "{selectedStyle.cozyMessage}"
                  </h3>

                  <p className="text-[10px] text-stone-400 italic font-medium max-w-xs mx-auto">
                    💡 <span className="text-pink-300">Somatic Tip:</span> Press and hold your palm or finger against the beating heart to feel a comforting physical connection. Imagine the safe warmth of someone who cares deeply about you, wrapping you up.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 4: AFTERGLOW RECOVERY */}
            {step === "afterglow" && (
              <div className="space-y-6 animate-scale-up max-w-sm mx-auto">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-amber-500/10">
                  <Coffee className="w-8 h-8 text-amber-300 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">Step 3: Gentle Afterglow</p>
                  <h3 className="text-lg font-bold text-stone-100">Welcome Back, Sunshine</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {selectedStyle.closingAction}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
                  <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-mono">Grab a hot cozy drink:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {BEVERAGES.map((bev) => (
                      <button
                        key={bev.name}
                        onClick={() => setSelectedBeverage(bev)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                          selectedBeverage.name === bev.name
                            ? "bg-amber-500/20 border-amber-400 text-white"
                            : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-lg mb-0.5">{bev.emoji}</span>
                        <span className="text-[8px] font-bold tracking-tight leading-tight line-clamp-2">{bev.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-stone-400 leading-snug">
                    <strong className="text-stone-300">{selectedBeverage.emoji} {selectedBeverage.name}:</strong> {selectedBeverage.comfort}
                  </p>
                </div>

                <button
                  onClick={resetHug}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-full font-bold text-xs uppercase tracking-wider"
                >
                  I feel better. Thank you 💖
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* STANDARD LIGHT PANEL (SETUP MODE) */}
      <div className="space-y-4">
        
        {/* Widget Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center border border-pink-100 shadow-sm">
            <Heart className="w-5 h-5 fill-pink-100 animate-heartbeat" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-pink-500">Virtual Hug Generator</h3>
            <p className="text-[10px] text-slate-400">Feel the somatic embrace of a comforting person</p>
          </div>
        </div>

        {/* Hug Styles Radio Selection */}
        <div className="space-y-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Choose your hug vibe:</p>
          <div className="space-y-2">
            {HUG_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  selectedStyle.id === style.id
                    ? "bg-pink-50/50 border-pink-300 ring-1 ring-pink-200"
                    : "bg-stone-50/40 border-stone-100 hover:bg-stone-50 hover:border-stone-200"
                }`}
              >
                <span className="text-2xl select-none">{style.emoji}</span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-stone-700">{style.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Immersion Light Swinger */}
        <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-100 rounded-2xl text-[10px]">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <div>
              <p className="font-bold text-stone-700">Dim Surrounding Lights (Cozy Room Mode)</p>
              <p className="text-[9px] text-stone-400">Dim the screen completely to block out external noise</p>
            </div>
          </div>
          <button
            onClick={() => setDeepImmersion(!deepImmersion)}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-all ${
              deepImmersion ? "bg-pink-500 flex justify-end" : "bg-stone-300 flex justify-start"
            }`}
          >
            <div className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        {/* Trigger Button */}
        <button
          onClick={startHugSequence}
          id="btn-hug-trigger-immersive"
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{selectedStyle.emoji}</span>
          <span>Embrace me now</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
