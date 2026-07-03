import React, { useState, useEffect } from "react";
import { Mail, MailOpen, Calendar, Heart, FileText, ArrowRight, Lock, Unlock, Send, Clock, User, Users, PenTool, CheckCircle, AlertCircle, Smile } from "lucide-react";
import { ENVELOPES, LETTERS_FROM_FUTURE } from "../data/cozyData";
import { Envelope } from "../types";

interface OpenWhenProps {
  currentMood?: "happy" | "nice" | "meh" | "sad" | "cry";
}

export interface CustomLetter {
  id: string;
  title: string;
  category: string; // sad, stressed, happy, angry, lonely, tired, overwhelmed etc
  recipient: string; // "Myself" or friend's name
  content: string;
  unlockCondition: "manual" | "date" | "mood";
  unlockValue?: string; // date string (YYYY-MM-DD) or mood code (happy, nice, meh, sad, cry)
  createdAt: string;
  isOpened: boolean;
}

const ENVELOPE_STYLES = [
  { bg: "bg-pink-100/90 hover:bg-pink-200/90 border-pink-200 text-pink-800", shadow: "border-b-4 border-b-pink-200" },
  { bg: "bg-blue-100/90 hover:bg-blue-200/90 border-blue-200 text-blue-800", shadow: "border-b-4 border-b-blue-200" },
  { bg: "bg-yellow-100/90 hover:bg-yellow-200/90 border-yellow-200 text-yellow-800", shadow: "border-b-4 border-b-yellow-200" },
  { bg: "bg-purple-100/90 hover:bg-purple-200/90 border-purple-200 text-purple-800", shadow: "border-b-4 border-b-purple-200" },
  { bg: "bg-emerald-100/90 hover:bg-emerald-200/90 border-emerald-200 text-emerald-800", shadow: "border-b-4 border-b-emerald-200" },
  { bg: "bg-orange-100/90 hover:bg-orange-200/90 border-orange-200 text-orange-800", shadow: "border-b-4 border-b-orange-200" },
];

const EMOTION_OPTIONS = [
  { code: "sad", label: "Sad", emoji: "😔", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { code: "stressed", label: "Stressed", emoji: "🤯", color: "bg-amber-50 border-amber-100 text-amber-700" },
  { code: "happy", label: "Happy", emoji: "😀", color: "bg-pink-50 border-pink-100 text-pink-700" },
  { code: "angry", label: "Angry", emoji: "😡", color: "bg-rose-50 border-rose-100 text-rose-700" },
  { code: "lonely", label: "Lonely", emoji: "🥺", color: "bg-purple-50 border-purple-100 text-purple-700" },
  { code: "tired", label: "Tired/Sleepless", emoji: "🥱", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { code: "overwhelmed", label: "Overwhelmed", emoji: "🌪️", color: "bg-teal-50 border-teal-100 text-teal-700" }
];

export default function OpenWhen({ currentMood = "nice" }: OpenWhenProps) {
  const [activeTab, setActiveTab] = useState<"read" | "write" | "my-letters">("read");
  const [activeEnvelope, setActiveEnvelope] = useState<Envelope | null>(null);
  const [activeLetter, setActiveLetter] = useState<{ id: string; title: string; date: string; content: string } | null>(null);
  
  // Custom letters state
  const [customLetters, setCustomLetters] = useState<CustomLetter[]>(() => {
    const saved = localStorage.getItem("cozy-custom-letters");
    return saved ? JSON.parse(saved) : [];
  });

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("sad");
  const [formRecipientType, setFormRecipientType] = useState<"self" | "friend">("self");
  const [formFriendName, setFormFriendName] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formUnlockCondition, setFormUnlockCondition] = useState<"manual" | "date" | "mood">("manual");
  const [formUnlockDate, setFormUnlockDate] = useState("");
  const [formUnlockMood, setFormUnlockMood] = useState("sad");
  
  // Success toast helper
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCustomLetter, setActiveCustomLetter] = useState<CustomLetter | null>(null);
  
  // Early open confirmation states
  const [letterToConfirmOpen, setLetterToConfirmOpen] = useState<CustomLetter | null>(null);

  // Save custom letters to localStorage
  useEffect(() => {
    localStorage.setItem("cozy-custom-letters", JSON.stringify(customLetters));
  }, [customLetters]);

  // Check if a custom letter is unlocked based on rules
  const isLetterUnlocked = (letter: CustomLetter): boolean => {
    if (letter.unlockCondition === "manual") return true;
    
    if (letter.unlockCondition === "date" && letter.unlockValue) {
      const today = new Date().toISOString().split("T")[0];
      return today >= letter.unlockValue;
    }
    
    if (letter.unlockCondition === "mood" && letter.unlockValue) {
      // Map global currentMood state to unlock value mood selection
      // E.g. user selected 'sad' mood on mood meter, letter is unlocked when mood becomes 'sad' or 'cry'
      const unlockMood = letter.unlockValue;
      if (unlockMood === "sad" && (currentMood === "sad" || currentMood === "cry")) return true;
      if (unlockMood === "happy" && currentMood === "happy") return true;
      if (unlockMood === "nice" && currentMood === "nice") return true;
      if (unlockMood === "meh" && currentMood === "meh") return true;
      return currentMood === unlockMood;
    }
    
    return true;
  };

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const newLetter: CustomLetter = {
      id: `letter-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      recipient: formRecipientType === "self" ? "Myself" : formFriendName.trim() || "A Friend",
      content: formContent.trim(),
      unlockCondition: formUnlockCondition,
      unlockValue: formUnlockCondition === "date" ? formUnlockDate : (formUnlockCondition === "mood" ? formUnlockMood : undefined),
      createdAt: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      isOpened: false
    };

    setCustomLetters((prev) => [newLetter, ...prev]);
    
    // Clear form
    setFormTitle("");
    setFormContent("");
    setFormFriendName("");
    setFormUnlockDate("");
    setFormRecipientType("self");
    setFormUnlockCondition("manual");
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setActiveTab("my-letters");
  };

  const handleOpenCustomLetter = (letter: CustomLetter) => {
    if (isLetterUnlocked(letter)) {
      // Unlocked naturally, open immediately
      markAsOpened(letter.id);
      setActiveCustomLetter(letter);
    } else {
      // Locked, trigger bypass double confirmation check
      setLetterToConfirmOpen(letter);
    }
  };

  const confirmBypassLock = () => {
    if (!letterToConfirmOpen) return;
    markAsOpened(letterToConfirmOpen.id);
    setActiveCustomLetter(letterToConfirmOpen);
    setLetterToConfirmOpen(null);
  };

  const markAsOpened = (id: string) => {
    setCustomLetters((prev) =>
      prev.map((letItem) => {
        if (letItem.id === id) {
          return { ...letItem, isOpened: true };
        }
        return letItem;
      })
    );
  };

  const getMascotEmojiForCategory = (cat: string) => {
    const matched = EMOTION_OPTIONS.find((e) => e.code === cat);
    return matched ? matched.emoji : "✉️";
  };

  return (
    <div id="open-when-panel" className="space-y-6">
      
      {/* Tab Navigation header */}
      <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-1.5 border border-pink-100 shadow-sm gap-2">
        <button
          onClick={() => setActiveTab("read")}
          id="btn-tab-read-envelopes"
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "read"
              ? "bg-pink-100 text-pink-700 shadow-inner"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Cozy Envelopes</span>
        </button>
        <button
          onClick={() => setActiveTab("my-letters")}
          id="btn-tab-my-letters"
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "my-letters"
              ? "bg-amber-100 text-amber-800 shadow-inner"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Sealed Letters ({customLetters.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("write")}
          id="btn-tab-write-letter"
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "write"
              ? "bg-indigo-100 text-indigo-700 shadow-inner"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Write Desk</span>
        </button>
      </div>

      {/* SUCCESS TOAST FOR SENT LETTERS */}
      {showSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-scale-up">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold uppercase tracking-wide">Letter Sealed Successfully!</p>
            <p className="text-emerald-600">Your cozy letter is sealed in a beautiful wax envelope.</p>
          </div>
        </div>
      )}

      {/* TAB 1: READ COZY ENVELOPES */}
      {activeTab === "read" && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-pink-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-pink-50 text-pink-500 rounded-xl">
                <Mail className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Open When...</h4>
                <p className="text-[10px] text-slate-400">Pick an envelope matching your current feeling</p>
              </div>
            </div>

            {/* Envelopes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ENVELOPES.map((env, index) => {
                const style = ENVELOPE_STYLES[index % ENVELOPE_STYLES.length];
                return (
                  <button
                    key={env.id}
                    id={`envelope-btn-${env.id}`}
                    onClick={() => setActiveEnvelope(env)}
                    className={`group ${style.bg} ${style.shadow} rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95 shrink-0`}
                  >
                    <div className="text-2xl mb-1 filter drop-shadow group-hover:scale-110 transition-transform">
                      {env.emoji}
                    </div>
                    <span className="text-[9px] font-bold tracking-wider uppercase opacity-85">Open When</span>
                    <span className="text-xs font-extrabold capitalize leading-tight mt-0.5">{env.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature 17: Letters From Future Basuri / Babbi */}
          <div className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-amber-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Letters From Babbi</h4>
                <p className="text-[10px] text-slate-400 font-mono">Deep, heartfelt letters written just for you</p>
              </div>
            </div>

            {/* Letters list */}
            <div className="space-y-2.5">
              {LETTERS_FROM_FUTURE.map((letItem) => (
                <button
                  key={letItem.id}
                  id={`letter-btn-${letItem.id}`}
                  onClick={() => setActiveLetter(letItem)}
                  className="w-full flex items-center justify-between p-3.5 bg-amber-50/20 hover:bg-amber-50/50 border border-amber-100/40 rounded-2xl text-left transition-all active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💌</span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-800 leading-tight">{letItem.title}</h4>
                      <p className="text-[9px] text-stone-400 font-mono mt-0.5">{letItem.date}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY SEALED LETTERS INBOX */}
      {activeTab === "my-letters" && (
        <div className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-amber-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">My Sealed Envelopes</h4>
              <p className="text-[10px] text-slate-400">Heartfelt messages locked under custom conditions</p>
            </div>
          </div>

          {customLetters.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl">
              <span className="text-4xl block mb-2">🕯️✉️</span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Your Letter Box is Empty</h4>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed mb-4">
                Write a sweet note to yourself or a friend, seal it with virtual wax, and watch it rest safely until the special moment!
              </p>
              <button
                onClick={() => setActiveTab("write")}
                id="btn-goto-write"
                className="px-4 py-1.5 bg-indigo-500 text-white hover:bg-indigo-600 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                Open Writing Desk 🖋️
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customLetters.map((letter) => {
                const unlocked = isLetterUnlocked(letter);
                const emoji = getMascotEmojiForCategory(letter.category);
                
                return (
                  <div
                    key={letter.id}
                    className={`relative p-5 border-2 rounded-2xl flex flex-col justify-between transition-all hover:shadow-md ${
                      unlocked 
                        ? "bg-amber-50/20 border-amber-100" 
                        : "bg-slate-50/40 border-slate-200/60"
                    }`}
                  >
                    <div>
                      {/* Top status header */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-[9px] font-bold text-slate-400 font-mono">
                          From: {letter.createdAt}
                        </span>
                        
                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                          {unlocked ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Unlock className="w-2.5 h-2.5" />
                              UNLOCKED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              <Lock className="w-2.5 h-2.5" />
                              LOCKED
                            </span>
                          )}
                          {letter.isOpened && (
                            <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                              READ 📖
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main info */}
                      <div className="flex items-start gap-3">
                        <div className="text-3xl filter drop-shadow select-none bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100">
                          {emoji}
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block leading-none">
                            To: {letter.recipient}
                          </span>
                          <h4 className="text-xs font-extrabold text-stone-800 leading-snug mt-1 capitalize">
                            Open When {letter.title}
                          </h4>
                          
                          {/* Condition text description */}
                          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                            {letter.unlockCondition === "manual" && (
                              <span>🔓 Open manually anytime with wax-seal break</span>
                            )}
                            {letter.unlockCondition === "date" && (
                              <>
                                <Calendar className="w-3 h-3 text-amber-500" />
                                <span>Unlock Date: {letter.unlockValue}</span>
                              </>
                            )}
                            {letter.unlockCondition === "mood" && (
                              <>
                                <Smile className="w-3 h-3 text-pink-500" />
                                <span>Unlock Mood: <span className="capitalize font-bold text-pink-500">{letter.unlockValue}</span></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action open letter button */}
                    <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center">
                      <span className="text-[9px] text-slate-400 font-mono capitalize">
                        Feelings: {letter.category}
                      </span>
                      <button
                        onClick={() => handleOpenCustomLetter(letter)}
                        id={`btn-open-custom-letter-${letter.id}`}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1 shadow-sm ${
                          unlocked
                            ? "bg-amber-400 text-amber-950 hover:bg-amber-500"
                            : "bg-indigo-400 text-white hover:bg-indigo-500"
                        }`}
                      >
                        {unlocked ? "Crack Wax Seal 🕯️" : "Attempt Open 🔒"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WRITE A LETTER DESK FORM */}
      {activeTab === "write" && (
        <form onSubmit={handleCreateLetter} className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-indigo-100 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
              <PenTool className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-500">The Stationary Writing Desk</h4>
              <p className="text-[10px] text-slate-400">Pour your thoughts into vintage envelopes, add locks, and seal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Left Fields Column */}
            <div className="space-y-4">
              
              {/* Title / Trigger */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Open When... (Selected Moment or Sentiment) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., You feel stressed, You graduate, Having a stormy day"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white text-stone-800"
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Designated Recipient *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormRecipientType("self")}
                    className={`py-2 px-3 border rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      formRecipientType === "self"
                        ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Myself</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormRecipientType("friend")}
                    className={`py-2 px-3 border rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      formRecipientType === "friend"
                        ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>A Designated Friend</span>
                  </button>
                </div>

                {formRecipientType === "friend" && (
                  <input
                    type="text"
                    required
                    value={formFriendName}
                    onChange={(e) => setFormFriendName(e.target.value)}
                    placeholder="Enter your friend's sweet name..."
                    className="w-full mt-2 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white text-stone-800"
                  />
                )}
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Primary Emotion Categorization *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOTION_OPTIONS.map((e) => {
                    const isSelected = formCategory === e.code;
                    return (
                      <button
                        key={e.code}
                        type="button"
                        onClick={() => setFormCategory(e.code)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all ${
                          isSelected
                            ? "bg-indigo-500 border-indigo-600 text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-stone-500 hover:bg-slate-100"
                        }`}
                      >
                        {e.emoji} {e.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unlocking Lock Condition */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Wax Seal Unlocking Rule *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormUnlockCondition("manual")}
                    className={`py-2 px-1 border rounded-xl font-extrabold text-[10px] flex flex-col items-center justify-center transition-all ${
                      formUnlockCondition === "manual"
                        ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Unlock className="w-4 h-4 mb-1" />
                    <span>Open Anytime</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormUnlockCondition("date")}
                    className={`py-2 px-1 border rounded-xl font-extrabold text-[10px] flex flex-col items-center justify-center transition-all ${
                      formUnlockCondition === "date"
                        ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Calendar className="w-4 h-4 mb-1" />
                    <span>Time Lock Date</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormUnlockCondition("mood")}
                    className={`py-2 px-1 border rounded-xl font-extrabold text-[10px] flex flex-col items-center justify-center transition-all ${
                      formUnlockCondition === "mood"
                        ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Smile className="w-4 h-4 mb-1" />
                    <span>Mood Meter Lock</span>
                  </button>
                </div>

                {/* Sub controls depending on option */}
                {formUnlockCondition === "date" && (
                  <div className="mt-3 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/60">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-indigo-800 mb-1">
                      Choose Future Release Date:
                    </label>
                    <input
                      type="date"
                      required
                      value={formUnlockDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setFormUnlockDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg text-slate-800"
                    />
                  </div>
                )}

                {formUnlockCondition === "mood" && (
                  <div className="mt-3 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/60 space-y-1.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-indigo-800">
                      Unlocks When Mood Meter is set to:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {([
                        { code: "happy", emo: "😀" },
                        { code: "nice", emo: "🙂" },
                        { code: "meh", emo: "😐" },
                        { code: "sad", emo: "😔" },
                        { code: "cry", emo: "😭" }
                      ] as const).map((m) => (
                        <button
                          key={m.code}
                          type="button"
                          onClick={() => setFormUnlockMood(m.code)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-base transition-all ${
                            formUnlockMood === m.code
                              ? "bg-indigo-500 text-white ring-2 ring-indigo-300"
                              : "bg-white border border-indigo-100 text-slate-500"
                          }`}
                        >
                          {m.emo}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-indigo-600 font-mono">
                      (Currently: <span className="uppercase font-bold">{currentMood}</span>)
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Letter Body Content Column */}
            <div className="flex flex-col justify-between">
              
              <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Heartfelt Note Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Dear friend / Dear Me,

Pour your heart out. Tell them why you wrote this letter, give them your softest support, and remind them that everything passes...

With infinite love,"
                  className="flex-1 w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white text-stone-800 whitespace-pre-wrap leading-relaxed"
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  id="btn-seal-envelope-wax"
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-md border-b-4 border-indigo-700 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Seal Letter with Virtual Wax 🕯️✉️</span>
                </button>
              </div>

            </div>

          </div>
        </form>
      )}

      {/* DEFAULT COZY ENVELOPE MODAL */}
      {activeEnvelope && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm p-4 flex items-center justify-center z-[110] transition-opacity duration-300">
          <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full border-2 border-rose-100 relative animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="absolute top-0 inset-x-0 h-3 bg-rose-200 rounded-t-3xl" />
            
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl shadow-sm mb-2">
                <MailOpen className="w-8 h-8 stroke-1.5" />
              </div>
              <span className="text-xs font-bold text-rose-500 tracking-widest uppercase font-mono">Handwritten Note</span>
              <h4 className="text-sm font-bold text-stone-800 capitalize mt-1">Open when you're {activeEnvelope.title}</h4>
            </div>

            <div className="p-5 bg-white/70 border border-stone-100 rounded-2xl shadow-inner mb-5 relative min-h-[140px] flex items-center justify-center">
              <div className="absolute inset-0 bg-notebook-lines opacity-10 pointer-events-none rounded-2xl" />
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap italic text-center relative z-10 font-sans">
                {activeEnvelope.content}
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 border-t border-stone-100 pt-4">
              <span>Warmly, Babbi 💛</span>
              <button
                onClick={() => setActiveEnvelope(null)}
                id="btn-close-envelope"
                className="px-4 py-1.5 bg-rose-400 text-white hover:bg-rose-500 rounded-full text-xs font-bold font-sans transition-all active:scale-95 shadow-sm"
              >
                Close note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LETTERS FROM BABBI FUTURE MODAL */}
      {activeLetter && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm p-4 flex items-center justify-center z-[110]">
          <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full border-2 border-amber-100 relative animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="absolute top-0 inset-x-0 h-3 bg-amber-200 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖋️</span>
                <div>
                  <h4 className="text-sm font-bold text-stone-800">{activeLetter.title}</h4>
                  <p className="text-[10px] text-stone-400 font-mono">{activeLetter.date}</p>
                </div>
              </div>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            </div>

            <div className="p-5 bg-white/60 border border-stone-100 rounded-2xl shadow-inner mb-5">
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {activeLetter.content}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveLetter(null)}
                id="btn-close-letter"
                className="px-4 py-1.5 bg-amber-500 text-white hover:bg-amber-600 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                Put Letter Away
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM LETTER VIEWER DIALOG */}
      {activeCustomLetter && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md p-4 flex items-center justify-center z-[120]">
          <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-[2rem] shadow-2xl max-w-lg w-full border-4 border-amber-100 relative animate-scale-up max-h-[85vh] overflow-y-auto">
            {/* Stamp drawing visual */}
            <div className="absolute top-6 right-6 border-2 border-dashed border-pink-200 p-2 text-center bg-white rounded-lg rotate-12 select-none">
              <span className="text-xl block">✉️</span>
              <span className="text-[8px] font-bold text-pink-400 uppercase tracking-widest font-mono">SEALED IN LOVE</span>
            </div>

            <div className="border-b-2 border-stone-200 pb-4 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-500 font-mono">
                Sealed Letter to {activeCustomLetter.recipient}
              </span>
              <h3 className="text-lg font-serif italic text-stone-800 capitalize mt-1">
                Open When {activeCustomLetter.title}
              </h3>
              <p className="text-[9px] text-stone-400 font-mono mt-1">
                Written: {activeCustomLetter.createdAt} | Categorized: <span className="capitalize">{activeCustomLetter.category}</span>
              </p>
            </div>

            <div className="p-5 bg-white border border-stone-200/60 rounded-2xl shadow-inner mb-5 relative">
              {/* Lines paper motif */}
              <div className="absolute inset-x-0 top-0 bottom-0 bg-notebook-lines opacity-10 pointer-events-none rounded-2xl" />
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-serif italic text-slate-700 relative z-10">
                {activeCustomLetter.content}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-[10px] text-slate-400">
              <span className="font-mono">🕯️ Wax Seal Broken</span>
              <button
                onClick={() => setActiveCustomLetter(null)}
                id="btn-close-custom-letter-viewer"
                className="px-4 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                Put back in Envelope
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOUBLE CONFIRM BYPASS DIALOG FOR LOCKED LETTERS */}
      {letterToConfirmOpen && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm p-4 flex items-center justify-center z-[130]">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border-2 border-amber-300 text-center animate-scale-up">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            
            <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Break the Wax Seal Early? 🕯️</h4>
            
            <div className="my-3.5 bg-amber-50/40 p-4 rounded-xl border border-amber-100 text-xs text-stone-600 leading-relaxed space-y-1">
              <p>
                This letter is locked: <strong className="text-stone-800">
                  {letterToConfirmOpen.unlockCondition === "date" 
                    ? `unlocks on ${letterToConfirmOpen.unlockValue}`
                    : `unlocks when active mood becomes ${letterToConfirmOpen.unlockValue}`
                  }
                </strong>
              </p>
              <p className="text-[10px] text-slate-400 italic">
                (Current active mood on the Mood Meter is "{currentMood}")
              </p>
              <p className="mt-2 text-[10px] text-amber-700 font-bold">
                Are you sure you want to sneak a peek? The lock was created for a special moment!
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setLetterToConfirmOpen(null)}
                id="btn-cancel-bypass-seal"
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-stone-700 text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Keep Sealed 🔒
              </button>
              <button
                onClick={confirmBypassLock}
                id="btn-confirm-bypass-seal"
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm"
              >
                Break Seal anyway 🕯️
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
