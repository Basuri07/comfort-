import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Moon, Sun, Coffee, Footprints, BadgeCheck, Check, LogOut, ArrowLeft } from "lucide-react";
import { AMAZING_REASONS, FORTUNES, DAILY_MESSAGES, STICKY_NOTES, BADGES } from "./data/cozyData";
import { Badge } from "./types";

// Import custom interactive sub-components
import AudioPlayer from "./components/AudioPlayer";
import BasuBot from "./components/BasuBot";
import ChaosFeature from "./components/ChaosFeature";
import AffirmationGarden from "./components/AffirmationGarden";
import BubblePop from "./components/BubblePop";
import MemoryWall from "./components/MemoryWall";
import OpenWhen from "./components/OpenWhen";
import DailyAffirmations from "./components/DailyAffirmations";
import OverthinkingCloud from "./components/OverthinkingCloud";
import EmergencySmile from "./components/EmergencySmile";
import VirtualHugGenerator from "./components/VirtualHugGenerator";

export default function App() {
  // Global site theme states
  const [mood, setMood] = useState<"happy" | "nice" | "meh" | "sad" | "cry">("nice");
  const [sleepMode, setSleepMode] = useState<boolean>(false);
  const [showGoodbyePage, setShowGoodbyePage] = useState<boolean>(false);

  // Feature-specific states
  const [currentGreeting, setCurrentGreeting] = useState<string>("");
  const [currentReason, setCurrentReason] = useState<string>("");
  const [dailyMsg, setDailyMsg] = useState<string>("");
  const [fortuneOpened, setFortuneOpened] = useState<boolean>(false);
  const [currentFortune, setCurrentFortune] = useState<string>("");
  const [isCrackingCookie, setIsCrackingCookie] = useState<boolean>(false);

  // Hug button animations helper
  const [hugState, setHugState] = useState<"idle" | "sending" | "delivered">("idle");
  const [hugHearts, setHugHearts] = useState<{ id: number; left: number; emoji: string }[]>([]);

  // Badges state
  const [badgesList, setBadgesList] = useState<Badge[]>(() => {
    // Try to load state or use defaults
    return BADGES;
  });

  // Calculate dynamic hour greeting
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setCurrentGreeting("🌞 Good Morning, Sunshine!");
    } else if (hours >= 12 && hours < 18) {
      setCurrentGreeting("☀️ Hey! Don't forget to drink some water.");
    } else {
      setCurrentGreeting("🌙 Long day? I'm glad you're here.");
    }

    // Set a random initial amazing reason, fortune, and daily note
    setCurrentReason(AMAZING_REASONS[Math.floor(Math.random() * AMAZING_REASONS.length)]);
    setDailyMsg(DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)]);
    setCurrentFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
  }, []);

  const changeReason = () => {
    const filtered = AMAZING_REASONS.filter((r) => r !== currentReason);
    setCurrentReason(filtered[Math.floor(Math.random() * filtered.length)]);
  };

  const crackFortuneCookie = () => {
    if (isCrackingCookie) return;
    setIsCrackingCookie(true);
    setFortuneOpened(false);

    setTimeout(() => {
      const filtered = FORTUNES.filter((f) => f !== currentFortune);
      setCurrentFortune(filtered[Math.floor(Math.random() * filtered.length)]);
      setFortuneOpened(true);
      setIsCrackingCookie(false);
      
      // Update badge: Smiled!
      toggleBadge("badge-smiled", true);
    }, 1000);
  };

  const triggerVirtualHug = () => {
    if (hugState !== "idle") return;
    setHugState("sending");

    // Spawn 8 floating virtual hugs (using 🤗, 🫂, 🧸 emojis)
    const HUG_EMOJIS = ["🤗", "🫂", "🧸"];
    const hearts = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      left: 10 + Math.random() * 80,
      emoji: HUG_EMOJIS[Math.floor(Math.random() * HUG_EMOJIS.length)]
    }));
    setHugHearts(hearts);

    setTimeout(() => {
      setHugState("delivered");
      // Update badge: Took a break!
      toggleBadge("badge-break", true);

      setTimeout(() => {
        setHugState("idle");
        setHugHearts([]);
      }, 3000);
    }, 2000);
  };

  // Toggle achievement badges
  const toggleBadge = (id: string, forceValue?: boolean) => {
    setBadgesList((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updatedVal = forceValue !== undefined ? forceValue : !b.unlocked;
          return { ...b, unlocked: updatedVal };
        }
        return b;
      })
    );
  };

  // Mood class mapper
  const getThemeBackgroundClass = () => {
    if (sleepMode) {
      return "bg-[#0F172A] text-slate-100 selection:bg-indigo-950/80";
    }

    switch (mood) {
      case "happy":
        return "bg-[#FFFDF5] text-slate-700 selection:bg-pink-100";
      case "nice":
        return "bg-[#FFFDF5] text-slate-700 selection:bg-pink-100";
      case "meh":
        return "bg-[#FCF9EE] text-slate-700 selection:bg-indigo-100";
      case "sad":
        return "bg-[#F4F9FB] text-slate-700 selection:bg-blue-100";
      case "cry":
        return "bg-[#ECF5F8] text-slate-700 selection:bg-blue-200";
      default:
        return "bg-[#FFFDF5] text-slate-700";
    }
  };

  // Custom rain particles generator for "cry" or "sad" mood
  const renderRainOverlays = () => {
    if (mood !== "cry" && mood !== "sad") return null;
    return (
      <div className="rain-overlay">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${0.8 + Math.random() * 0.5}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>
    );
  };

  // Custom floating fireflies for sleep mode
  const renderFireflies = () => {
    if (!sleepMode) return null;
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-200/60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
              animationDuration: `${1.5 + Math.random() * 2.5}s`,
              boxShadow: "0 0 8px #fef08a"
            }}
          />
        ))}
      </div>
    );
  };

  // Handle final page display
  if (showGoodbyePage) {
    return (
      <div id="final-goodbye-page" className="min-h-screen bg-gradient-to-b from-[#111] to-[#222] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
        {/* Background stars */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Breathtaking Final Page letter */}
        <div className="max-w-md w-full bg-stone-900/80 border-2 border-stone-800 backdrop-blur-md p-8 rounded-3xl shadow-2xl relative z-10 text-center space-y-6 animate-scale-up">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner animate-pulse">
            💛
          </div>

          <h2 className="font-serif font-black text-2xl tracking-wide text-rose-200">Hey...</h2>

          <div className="space-y-4 text-stone-200 text-sm leading-relaxed text-left font-sans italic">
            <p>Thanks for spending some precious time here today.</p>
            <p>If today was hard, please remember... someone believes in you completely.</p>
            <p>Someone smiles when they think about you.</p>
            <p>And no matter how busy or overwhelming life gets...</p>
            <p className="font-semibold text-rose-300">This little corner will always be waiting for you.</p>
          </div>

          <p className="text-right text-rose-300 font-bold font-serif text-sm mt-6">
            — With lots of care, Babbi 🧸
          </p>

          <button
            onClick={() => setShowGoodbyePage(false)}
            id="btn-reenter-cozy-room"
            className="w-full mt-6 py-3 bg-gradient-to-r from-amber-400 to-rose-400 text-stone-900 font-black text-xs uppercase tracking-widest rounded-xl hover:from-amber-500 hover:to-rose-500 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Step Back Inside 🏡</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-1000 relative pb-16 font-sans ${getThemeBackgroundClass()}`}>
      
      {/* Interactive atmosphere overlays */}
      {renderRainOverlays()}
      {renderFireflies()}

      {/* Hanging Fairy Lights Decoration */}
      <div className="w-full h-8 flex justify-around items-start pointer-events-none select-none relative z-10 px-4">
        {Array.from({ length: 14 }).map((_, i) => {
          const colors = ["glow-yellow bg-yellow-200", "glow-pink bg-pink-300", "glow-blue bg-blue-300", "glow-purple bg-purple-300"];
          const lightColor = colors[i % colors.length];
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-3.5 bg-stone-700/60" />
              <div className={`w-3.5 h-3.5 rounded-full animate-pulse ${lightColor}`} style={{ animationDelay: `${i * 200}ms`, animationDuration: "1.2s" }} />
            </div>
          );
        })}
      </div>

      {/* Main Room Layout Wrapper */}
      <main className="max-w-6xl mx-auto px-4 mt-6 relative z-10 space-y-8">
        
        {/* Welcome Dashboard Header Card */}
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 mt-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-pink-500 font-extrabold">
              {sleepMode ? "🌙 Night Mode Active" : "✨ Active Digital Refuge"}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-slate-700 leading-tight">
              {currentGreeting}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Mood selector pill */}
            <div className="flex items-center space-x-2 bg-white/60 p-2 rounded-full border-2 border-slate-200/60 shadow-sm">
              {([
                { code: "happy", emo: "😀", title: "Happy", ring: "ring-pink-300 bg-pink-100 border-pink-200" },
                { code: "nice", emo: "🙂", title: "Peaceful", ring: "ring-emerald-300 bg-emerald-100 border-emerald-200" },
                { code: "meh", emo: "😐", title: "Meh", ring: "ring-indigo-300 bg-indigo-100 border-indigo-200" },
                { code: "sad", emo: "😔", title: "Sad", ring: "ring-blue-300 bg-blue-100 border-blue-200" },
                { code: "cry", emo: "😭", title: "Crying", ring: "ring-purple-300 bg-purple-100 border-purple-200" }
              ] as const).map((m) => {
                const isActive = mood === m.code && !sleepMode;
                return (
                  <button
                    key={m.code}
                    id={`mood-btn-${m.code}`}
                    onClick={() => {
                      setMood(m.code);
                      setSleepMode(false);
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all active:scale-90 ${
                      isActive
                        ? `shadow-inner border-2 ring-2 ${m.ring}`
                        : "bg-slate-100/50 grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
                    }`}
                    title={m.title}
                  >
                    {m.emo}
                  </button>
                );
              })}
              <span className="hidden sm:inline-block px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Mood Meter
              </span>
            </div>

            {/* Action buttons (Sleep Mode & Exit) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSleepMode(!sleepMode);
                }}
                id="btn-sleep-mode"
                className={`p-3 rounded-full border-2 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
                  sleepMode
                    ? "bg-slate-900 text-yellow-300 border-yellow-300/40 shadow-inner"
                    : "bg-white text-stone-700 hover:bg-stone-50 border-slate-200/80 shadow-sm"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>{sleepMode ? "Sleepy" : "Sleep Mode"}</span>
              </button>

              <button
                onClick={() => setShowGoodbyePage(true)}
                id="btn-goodbye-exit"
                className="p-3 bg-rose-400 text-white hover:bg-rose-500 rounded-full border-b-4 border-rose-600 transition-all active:scale-95 flex items-center gap-1 text-xs font-bold shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>
        </header>

        {/* Bento Grid Features Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Playlist, Emergency Smile, Overthinking Destroyer */}
          <div className="space-y-6">
            <AudioPlayer />
            <EmergencySmile />
            <OverthinkingCloud />
          </div>

          {/* Center Column: Basu Bear Bot Chat, Hug Button, Sleep Mode Banner */}
          <div className="space-y-6">
            <BasuBot />
            
            {/* Feature 7: Interactive Somatic Virtual Hug Generator */}
            <VirtualHugGenerator />

            {/* Feature 12: Sleep Mode Display Banner */}
            {sleepMode && (
              <div className="p-5 bg-stone-900 border border-yellow-300/30 rounded-3xl text-center space-y-2 animate-scale-up">
                <span className="text-3xl">🌙</span>
                <h4 className="font-bold text-yellow-300 text-sm">Sleepy Mode Active</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  "It's okay to rest now. The stars are looking after you, and the moon is shining bright."
                </p>
                <p className="text-[10px] text-yellow-400/80 font-mono italic">Sweet dreams... 💤</p>
              </div>
            )}
          </div>

          {/* Right Column: Reasons Amazing, Envelopes, Memory Jar & Wall */}
          <div className="space-y-6">
            
            {/* Feature 4: Reasons You're Amazing (Spotify Card) */}
            <div id="amazing-reasons-panel" className="p-5 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[180px]">
              {/* Card visual elements mirroring Spotify */}
              <div className="flex items-center justify-between opacity-80 mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold">Amazing Cards</span>
                <Heart className="w-4 h-4 fill-white" />
              </div>

              <div className="py-2">
                <p className="text-base font-bold italic leading-relaxed">
                  "{currentReason}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-4">
                <span className="text-[10px] text-pink-100 font-mono">By Babbi 💛</span>
                <button
                  onClick={changeReason}
                  id="btn-next-reason"
                  className="px-3.5 py-1 bg-white text-rose-600 hover:bg-pink-50 text-[10px] font-extrabold rounded-full transition-all active:scale-95"
                >
                  Next Card ✨
                </button>
              </div>
            </div>

            {/* Feature 16: Fortune Cookies */}
            <div id="fortune-cookie-panel" className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-amber-50 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Magic Fortune Cookie</h4>
              <p className="text-[10px] text-slate-400 mb-4">Crack it open to read your lucky note</p>

              <button
                onClick={crackFortuneCookie}
                id="btn-crack-fortune"
                className={`text-5xl cursor-pointer select-none focus:outline-none transition-transform duration-300 ${isCrackingCookie ? "animate-bounce scale-110 rotate-12" : "hover:scale-105 active:scale-90"}`}
              >
                🥠
              </button>

              {fortuneOpened && !isCrackingCookie && (
                <div className="mt-4 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/30 animate-scale-up w-full">
                  <p className="text-xs text-stone-700 italic font-medium">"{currentFortune}"</p>
                </div>
              )}
            </div>

            {/* Soft encouragement card */}
            <div id="side-comfort-panel" className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl border-2 border-amber-100/60 relative overflow-hidden">
              <span className="absolute top-3.5 right-3.5 text-[8px] font-mono font-bold text-amber-500 uppercase tracking-wider">GUIDE</span>
              <p className="text-xs font-serif italic text-stone-700 leading-relaxed mb-3">
                "Take a slow breath, rest your shoulders, and look at the sweet flower garden or write a letter to your future self below."
              </p>
              <div className="flex justify-between items-center text-[10px] text-stone-400">
                <span>With sweet care ♥</span>
                <span className="font-mono text-amber-600">Active Room</span>
              </div>
            </div>

          </div>
        </div>

        {/* Full-width interactive blocks */}
        <div className="space-y-6">
          <OpenWhen currentMood={mood} />
          
          {/* Main interactive daily blessings widget */}
          <DailyAffirmations />
        </div>

        {/* Affirmation Garden, Memory Wall & Bubble Pop row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MemoryWall />
          <BubblePop />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AffirmationGarden />
          {/* Extra balance container */}
          <div className="p-6 bg-gradient-to-tr from-purple-50/20 via-pink-50/30 to-amber-50/10 rounded-[2rem] border-2 border-dashed border-pink-100/40 flex flex-col items-center justify-center text-center">
            <span className="text-3xl animate-bounce" style={{ animationDuration: "5s" }}>🧘‍♀️✨</span>
            <h4 className="font-serif italic text-stone-700 text-sm mt-3">"You are completely safe here."</h4>
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed mt-1.5">
              Every flower planted, pop bubbled, and word whispered in this room is preserved to comfort your heart. Take all the time you need.
            </p>
          </div>
        </div>

        {/* Feature 18: Achievement Badges Panel */}
        <section id="achievement-badges-panel" className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-amber-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <BadgeCheck className="w-5 h-5 animate-bounce-slow" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Daily Comfort Badges</h4>
              <p className="text-[10px] text-slate-400">Tick off small acts of self-care and watch your reward badges glow</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {badgesList.map((badge) => (
              <button
                key={badge.id}
                id={`badge-check-btn-${badge.id}`}
                onClick={() => toggleBadge(badge.id)}
                className={`flex flex-col items-center text-center p-4 border rounded-2xl transition-all active:scale-95 ${badge.unlocked ? "bg-amber-50 border-amber-300 shadow-md scale-102" : "bg-stone-50 border-stone-100 opacity-60 hover:opacity-100"}`}
              >
                <div className={`text-3xl mb-2 filter drop-shadow relative ${badge.unlocked ? "animate-bounce" : ""}`} style={{ animationDuration: "3s" }}>
                  {badge.emoji}
                  {badge.unlocked && (
                    <span className="absolute -top-1 -right-1 text-xs text-yellow-400 animate-pulse">✨</span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-stone-800 leading-tight">{badge.title}</h4>
                <p className="text-[9px] text-gray-400 mt-1 leading-normal">{badge.description}</p>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-2.5 ${badge.unlocked ? "bg-emerald-500 border-emerald-600 text-white" : "bg-white border-stone-200"}`}>
                  {badge.unlocked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Feature 11: Sticky Notes Board */}
        <section id="sticky-notes-board" className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-pink-50">
          <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500 text-center mb-6">Sweet Sticky Reminders</h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {STICKY_NOTES.map((note, index) => {
              const rotations = ["rotate-1", "rotate-[-2deg]", "rotate-[3deg]", "rotate-[-1deg]", "rotate-2"];
              const rot = rotations[index % rotations.length];
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl shadow-sm ${note.color} ${rot} transform transition-transform duration-300 hover:scale-105 select-none shrink-0 border border-stone-100/10`}
                >
                  <p className="text-xs font-semibold leading-relaxed">
                    {note.text}
                  </p>
                  <p className="text-[9px] text-right mt-3 font-mono opacity-60">♥ Babbi</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Chaos Feature Component Trigger (Floating mouse tracking + Chaos animals overlay) */}
        <ChaosFeature />

      </main>
    </div>
  );
}
