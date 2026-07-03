import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Archive, Copy, Check, Heart, PenTool, Plus, BookOpen, Trash2, Lock, Award } from "lucide-react";
import { DAILY_MESSAGES } from "../data/cozyData";

// Matching emojis for the 12 DAILY_MESSAGES
const STAMP_EMOJIS = ["☀️", "🍪", "🫶", "🧸", "🏆", "🤍", "🍃", "💧", "🎖️", "👣", "💤", "💖"];

export default function DailyAffirmations() {
  const [activeTab, setActiveTab] = useState<"today" | "collection">("today");
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [currentAffirmation, setCurrentAffirmation] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [unlockedArchive, setUnlockedArchive] = useState<string[]>([]);
  const [selectedStampIndex, setSelectedStampIndex] = useState<number>(0);
  
  // Custom user daily promises
  const [customPromises, setCustomPromises] = useState<string[]>(() => {
    const saved = localStorage.getItem("cozy-custom-promises");
    return saved ? JSON.parse(saved) : [];
  });
  const [promiseInput, setPromiseInput] = useState("");

  // Quick positive whisper state to unlock bonus stamp
  const [showWhisperInput, setShowWhisperInput] = useState(false);
  const [whisperText, setWhisperText] = useState("");
  const [whisperCopied, setWhisperCopied] = useState(false);

  // Determine current day's index for rotation
  const getDayOfYearIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day % DAILY_MESSAGES.length;
  };

  useEffect(() => {
    // Determine today's specific message
    const index = getDayOfYearIndex();
    const message = DAILY_MESSAGES[index];
    setCurrentAffirmation(message);

    // Check if revealed state exists for today's date
    const todayStr = new Date().toDateString();
    const savedRevealDate = localStorage.getItem("cozy-affirmation-reveal-date");
    
    if (savedRevealDate === todayStr) {
      setIsRevealed(true);
    }

    // Load previously unlocked archive
    const savedArchive = localStorage.getItem("cozy-affirmation-archive");
    if (savedArchive) {
      const parsed = JSON.parse(savedArchive) as string[];
      setUnlockedArchive(parsed);
    } else {
      // Seed with a couple defaults if empty
      const initialSeed = [
        "A little progress is still progress. Celebrate your tiny steps! 👣✨",
        "Don't worry about being perfect. Just being you is already more than enough. 🤍"
      ];
      setUnlockedArchive(initialSeed);
      localStorage.setItem("cozy-affirmation-archive", JSON.stringify(initialSeed));
    }
  }, []);

  // Save custom promises
  useEffect(() => {
    localStorage.setItem("cozy-custom-promises", JSON.stringify(customPromises));
  }, [customPromises]);

  const handleReveal = () => {
    if (isRevealed) return;
    
    setIsRevealed(true);
    const todayStr = new Date().toDateString();
    localStorage.setItem("cozy-affirmation-reveal-date", todayStr);

    // Add to unlocked archive if not already in there
    if (!unlockedArchive.includes(currentAffirmation)) {
      const updatedArchive = [...unlockedArchive, currentAffirmation];
      setUnlockedArchive(updatedArchive);
      localStorage.setItem("cozy-affirmation-archive", JSON.stringify(updatedArchive));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPromise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promiseInput.trim()) return;

    setCustomPromises((prev) => [promiseInput.trim(), ...prev]);
    setPromiseInput("");
  };

  const handleDeletePromise = (indexToDelete: number) => {
    setCustomPromises((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  // Positive action to unlock a locked stamp randomly
  const handleWhisperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whisperText.trim()) return;

    // Find locked messages
    const lockedMessages = DAILY_MESSAGES.filter(msg => !unlockedArchive.includes(msg));
    
    if (lockedMessages.length > 0) {
      const randomMsg = lockedMessages[Math.floor(Math.random() * lockedMessages.length)];
      const updatedArchive = [...unlockedArchive, randomMsg];
      setUnlockedArchive(updatedArchive);
      localStorage.setItem("cozy-affirmation-archive", JSON.stringify(updatedArchive));
      
      // Select this newly unlocked stamp to celebrate
      const newIndex = DAILY_MESSAGES.indexOf(randomMsg);
      if (newIndex !== -1) {
        setSelectedStampIndex(newIndex);
      }
    }
    
    setWhisperText("");
    setShowWhisperInput(false);
  };

  const totalCount = DAILY_MESSAGES.length;
  // Make sure we include today's revealed one in count
  const actualUnlocked = new Set(unlockedArchive);
  if (isRevealed && currentAffirmation) {
    actualUnlocked.add(currentAffirmation);
  }
  const unlockedCount = actualUnlocked.size;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div id="daily-affirmations-widget" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* CARD 1: TODAY'S SCRATCH AFFIRMATION & COLLECTION BOOK */}
      <div id="scratch-affirmation-card" className="p-6 bg-white rounded-[2.5rem] shadow-sm border-2 border-pink-100 flex flex-col justify-between relative overflow-hidden min-h-[360px]">
        
        {/* Decorative corner tag */}
        <div className="absolute top-4 right-4 text-[9px] font-mono font-black text-pink-400 uppercase tracking-widest pointer-events-none">
          Collection
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-pink-50 mb-4 pb-1 relative z-10">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              activeTab === "today"
                ? "border-pink-500 text-pink-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Today's Scratch ✨
          </button>
          <button
            onClick={() => {
              setActiveTab("collection");
              // default selected stamp to first unlocked one or today's
              const todayIndex = getDayOfYearIndex();
              setSelectedStampIndex(todayIndex);
            }}
            className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              activeTab === "collection"
                ? "border-pink-500 text-pink-600 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Collection Book ({unlockedCount}/{totalCount} 🌸)
          </button>
        </div>

        {/* TAB 1: TODAY'S SCRATCH CARD */}
        {activeTab === "today" && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center border border-pink-100 shadow-sm shrink-0">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Today's Affirmation</h4>
                <p className="text-[9px] text-slate-400 font-mono">
                  {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>

            {/* Interactivity Stage: Scratch Area */}
            <div className="flex-1 flex items-center justify-center my-3 relative">
              {!isRevealed ? (
                <button
                  onClick={handleReveal}
                  id="btn-scratch-affirmation"
                  className="w-full h-32 bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 border-2 border-pink-200/50 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none group transition-all duration-500 hover:scale-[1.01] active:scale-98 shadow-md relative overflow-hidden"
                >
                  <Sparkles className="w-7 h-7 text-white mb-2 animate-bounce" />
                  <span className="text-xs font-extrabold text-white uppercase tracking-widest leading-none drop-shadow-sm">
                    Shed Soft Light ✨
                  </span>
                  <span className="text-[10px] text-pink-100/95 font-medium italic mt-1.5 drop-shadow-sm">
                    Click to break the cover and reveal today's promise
                  </span>
                </button>
              ) : (
                <div className="w-full p-5 bg-gradient-to-b from-pink-50/50 to-amber-50/20 border border-pink-100 rounded-2xl text-center relative animate-scale-up min-h-28 flex flex-col justify-center items-center">
                  <span className="absolute -top-3 text-base animate-ping">✨</span>
                  <p className="text-xs sm:text-sm text-stone-700 font-bold leading-relaxed italic max-w-xs px-2">
                    "{currentAffirmation}"
                  </p>
                  
                  <button
                    onClick={() => copyToClipboard(currentAffirmation)}
                    id="btn-copy-today-affirmation"
                    className="mt-4 flex items-center gap-1 text-[10px] text-pink-500 font-bold hover:underline"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Blessing</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Archive Peek Footer */}
            <div className="border-t border-pink-50 pt-2.5 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Archive className="w-3.5 h-3.5 text-pink-400" />
                <span>Total Collected: {unlockedCount}/{totalCount}</span>
              </span>
              <span className="font-mono text-[9px] italic">Always enough, exactly as you are 🌸</span>
            </div>
          </div>
        )}

        {/* TAB 2: BLESSING COLLECTION BOOK GRID & DETAIL PREVIEW */}
        {activeTab === "collection" && (
          <div className="flex-1 flex flex-col justify-between space-y-3">
            
            {/* Progress bar info */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="text-stone-500 font-bold">Blessings Album Progress</span>
                <span className="text-pink-600 font-extrabold">{progressPercentage}% ({unlockedCount}/{totalCount})</span>
              </div>
              <div className="w-full h-2 bg-pink-50 rounded-full overflow-hidden border border-pink-100">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-amber-300 rounded-full transition-all duration-700" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Stamp Album Grid */}
            <div className="grid grid-cols-4 gap-2 py-1">
              {DAILY_MESSAGES.map((message, index) => {
                // message index is unlocked if it's in actualUnlocked
                const isUnlocked = actualUnlocked.has(message);
                const isSelected = selectedStampIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedStampIndex(index)}
                    id={`stamp-cell-${index}`}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                      isUnlocked
                        ? isSelected
                          ? "bg-pink-100/70 border-pink-400 ring-2 ring-pink-300/40"
                          : "bg-pink-50/40 border-pink-100 hover:bg-pink-50 hover:border-pink-200"
                        : isSelected
                          ? "bg-slate-100 border-slate-400"
                          : "bg-slate-50/60 border-dashed border-slate-200"
                    }`}
                    title={isUnlocked ? "Unlocked Blessing" : "Locked Stamp - discover daily!"}
                  >
                    {isUnlocked ? (
                      <span className="text-lg filter drop-shadow-sm select-none">
                        {STAMP_EMOJIS[index] || "🌸"}
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    <span className="text-[7px] font-mono text-slate-400 absolute bottom-0.5">#{index + 1}</span>
                    
                    {isUnlocked && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Stamp Preview Detail Card */}
            <div className="p-3 bg-gradient-to-b from-stone-50 to-white border border-pink-50 rounded-xl min-h-[92px] flex flex-col justify-center relative">
              {(() => {
                const selectedMessage = DAILY_MESSAGES[selectedStampIndex];
                const isUnlocked = actualUnlocked.has(selectedMessage);

                if (isUnlocked) {
                  return (
                    <div className="text-center animate-scale-up space-y-2">
                      <p className="text-[11px] text-stone-700 italic font-medium leading-relaxed px-1">
                        "{selectedMessage}"
                      </p>
                      <div className="flex justify-between items-center text-[8px] font-mono text-pink-400 pt-1 border-t border-pink-50/40">
                        <span>Stamp #{selectedStampIndex + 1} Unlocked ✨</span>
                        <button
                          onClick={() => copyToClipboard(selectedMessage)}
                          className="flex items-center gap-0.5 font-bold text-pink-500 hover:underline"
                        >
                          {copied ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy Blessing</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center space-y-1.5 py-1">
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                        🔒 Stamp #{selectedStampIndex + 1} is waiting for you! Keep visiting to discover this sweet blessing.
                      </p>
                      
                      {!showWhisperInput ? (
                        <button
                          onClick={() => setShowWhisperInput(true)}
                          className="text-[9px] font-bold text-pink-500 hover:text-pink-600 underline"
                        >
                          Whisper a happy thought to instantly unlock! 🌸
                        </button>
                      ) : (
                        <form onSubmit={handleWhisperSubmit} className="flex gap-1 items-center max-w-xs mx-auto">
                          <input
                            type="text"
                            required
                            value={whisperText}
                            onChange={(e) => setWhisperText(e.target.value)}
                            placeholder="Write something kind..."
                            className="flex-1 px-2 py-0.5 text-[10px] bg-white border border-pink-100 rounded focus:outline-none focus:ring-1 focus:ring-pink-300"
                          />
                          <button
                            type="submit"
                            className="px-2 py-0.5 bg-pink-400 text-white text-[9px] rounded font-bold hover:bg-pink-500 transition-colors"
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowWhisperInput(false)}
                            className="text-[9px] text-slate-400 hover:text-slate-600 px-1"
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </div>
                  );
                }
              })()}
            </div>

          </div>
        )}

      </div>

      {/* CARD 2: REVEALED HISTORY & MY PROMISES LOG */}
      <div id="promises-journal-card" className="p-6 bg-white rounded-[2.5rem] shadow-sm border-2 border-pink-50 flex flex-col justify-between min-h-[360px]">
        
        <div className="space-y-4">
          
          {/* Section 1: Create custom daily promise */}
          <form onSubmit={handleAddPromise} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-pink-400" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">My Personal Daily Promise</h4>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={promiseInput}
                onChange={(e) => setPromiseInput(e.target.value)}
                placeholder="I promise to take deep breaths today..."
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-pink-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white text-stone-800 placeholder-stone-400"
              />
              <button
                type="submit"
                id="btn-add-promise"
                disabled={!promiseInput.trim()}
                className="px-3 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all active:scale-95 text-xs font-bold disabled:opacity-40 disabled:scale-100 flex items-center shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Section 2: Promises List / History View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-pink-400" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">My Logged Promises</h4>
              </div>
              <span className="text-[9px] font-mono text-slate-400">({customPromises.length} saved)</span>
            </div>

            {customPromises.length === 0 ? (
              <div className="py-8 px-4 border border-dashed border-pink-50 rounded-xl text-center text-stone-400 text-[10px] leading-relaxed">
                No custom promises written down yet.<br />
                Write something soft and sweet above! 🖋️💖
              </div>
            ) : (
              <div className="max-h-24 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-pink-100 scrollbar-track-transparent">
                {customPromises.map((promise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-pink-50/30 border border-pink-50/50 rounded-xl text-left text-[11px] text-stone-700 font-medium group transition-all"
                  >
                    <div className="flex items-center gap-2 pr-2">
                      <Heart className="w-3 h-3 text-pink-400 fill-pink-400/20 shrink-0" />
                      <span className="line-clamp-1 italic">"{promise}"</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePromise(index)}
                      id={`btn-delete-promise-${index}`}
                      className="p-1 text-stone-300 hover:text-rose-500 rounded transition-colors shrink-0"
                      title="Delete promise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Weekly Blessing Archive log picker */}
        <div className="border-t border-pink-50 pt-3 mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Archive className="w-4 h-4 text-pink-400" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly Blessings Archive</h4>
          </div>
          
          <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none">
            {unlockedArchive.map((archItem, index) => (
              <button
                key={index}
                id={`archive-item-chip-${index}`}
                onClick={() => copyToClipboard(archItem)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] text-stone-600 font-medium hover:bg-pink-50/50 transition-all shadow-sm shrink-0 flex items-center gap-1"
                title={archItem}
              >
                <span>📜 Day -{index + 1}</span>
                <Copy className="w-2.5 h-2.5 text-stone-400" />
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
