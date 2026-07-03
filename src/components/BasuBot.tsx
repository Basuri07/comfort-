import React, { useState, useRef, useEffect } from "react";
import { Send, Heart, Sparkles, Smile, MessageCircle, Gift, Sparkle } from "lucide-react";
import { ChatMessage } from "../types";

type MascotType = "bear" | "cat" | "bunny" | "capybara";

const CUTE_NICKNAMES = [
  "my little sunshine",
  "kiddo",
  "nana",
  "nanluuu",
  "bangaraluuu",
  "buji=ji panduuuuu",
  "buji-ji panduuuuu",
  "little kid",
  "haruuu",
  "my precious little bean",
  "sweet pea",
  "honeybun"
];

const getRandomNickname = () => {
  const index = Math.floor(Math.random() * CUTE_NICKNAMES.length);
  return CUTE_NICKNAMES[index];
};

export default function BasuBot() {
  const [mascot, setMascot] = useState<MascotType>(() => {
    return (localStorage.getItem("cozy-mascot") as MascotType) || "bear";
  });

  const [mascotActionState, setMascotActionState] = useState<"idle" | "petted" | "eating" | "playing">("idle");
  const [actionText, setActionText] = useState<string>("");

  const getMascotIntro = (type: MascotType) => {
    const nick = getRandomNickname();
    switch (type) {
      case "cat":
        return `Meow! I'm Mochi Cat, your soft, warm virtual kitten. 🐾 I love taking long sunny naps, chasing paper balls, and purring on your lap. Whenever you feel worried, just pet my soft ears! What's on your mind today, ${nick}? 🥛🐟`;
      case "bunny":
        return `Hi there, ${nick}! 🐰 I'm Pip Bunny, your ultimate cheerleader! I'm super excited to sit with you today. Remember: we don't have to be perfect, we just have to take tiny hops forward. Want a carrot biscuit? How is your heart feeling? 🥕✨`;
      case "capybara":
        return `Hello ${nick}. I am Cappy Capybara. 🦦 The world outside can be so fast and noisy, but here, we can take things as slow as water ripples. Let's sit by the warm yuzu bath, take a slow breath, and relax together. What is bothering you? 🍊🛀`;
      default:
        return `Hi ${nick}!! 🐻 I'm Basu Bear, your cuddly virtual teddy best friend. I noticed you came to our cozy room today. That means you might need a little comfort, a sweet smile, or just a safe place to rest. Sit with me! How was your day? 🥞🍯`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize or change intro message when mascot changes
  useEffect(() => {
    localStorage.setItem("cozy-mascot", mascot);
    
    // Set mascot initial message
    setMessages([
      {
        id: "init",
        role: "model",
        text: getMascotIntro(mascot),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [mascot]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map existing messages to history (excluding the first model one to keep things clean)
      const history = messages
        .filter((m) => m.id !== "init")
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const response = await fetch("/api/basu-bear/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history, mascot }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text || "Oh noes, my plushie ears fuzzy wuzzy lost connection... But *gives you a super soft hug*! Tell me again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `My ${mascot} brain had a little sparkle-glitch! But I still love you and am holding your hand! 💖`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger interactive actions (Pet, Feed, Play)
  const triggerMascotAction = (action: "pet" | "feed" | "play") => {
    if (mascotActionState !== "idle") return;

    if (action === "pet") {
      setMascotActionState("petted");
      const petResponses = {
        cat: "😸 *Mochi closes her eyes, purring loudly, and gently rubs her fluffy chin against your finger!* 'Meoww... that's the spot. You have the kindest hands!'",
        bunny: "🐰 *Pip wiggles his ears in pure delight and does a happy little head-nuzzle!* 'Aww, that tickles so good! You make me feel so safe!'",
        capybara: "🦦 *Cappy slowly blinks and sighs in absolute zen peace as you pat his warm head.* 'Mmm... very peaceful. Thank you, friend. Let's relax.'",
        bear: "🐻 *Basu leans into your palm with a giant cuddly smile!* 'Your touches are like warm sunshine! I love sitting right next to you.'"
      };
      setActionText(petResponses[mascot].split("'")[0]);
      
      setTimeout(() => {
        const systemResponse: ChatMessage = {
          id: `pet-${Date.now()}`,
          role: "model",
          text: petResponses[mascot],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, systemResponse]);
        setMascotActionState("idle");
        setActionText("");
      }, 1500);

    } else if (action === "feed") {
      setMascotActionState("eating");
      const snacks = {
        cat: "salmon biscuit 🐟",
        bunny: "crispy carrot cookie 🥕",
        capybara: "sweet juicy orange slice 🍊",
        bear: "sweet honey pancake 🥞"
      };
      const feedResponses = {
        cat: "😸 *Mochi nibbles the salmon biscuit happily!* 'Crunch crunch... yummy! Thank you for the delicious snack. *licks paws cleanly*'",
        bunny: "🐰 *Pip snatches the crispy carrot cookie and nibbles with rapid speed!* 'Chomp chomp chomp! This is the best carrot cookie in the universe! *giggles happily*'",
        capybara: "🦦 *Cappy carries the orange slice onto his head, then takes a slow, polite bite.* 'Ah, so refreshing. Eating oranges in the sun is true happiness.'",
        bear: "🐻 *Basu claps his paws and eats the honey pancake with starry eyes!* 'Mmm, warm and sweet! Just like you! Thank you, friend!'"
      };
      setActionText(`Eating ${snacks[mascot]}...`);

      setTimeout(() => {
        const systemResponse: ChatMessage = {
          id: `feed-${Date.now()}`,
          role: "model",
          text: feedResponses[mascot],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, systemResponse]);
        setMascotActionState("idle");
        setActionText("");
      }, 1800);

    } else if (action === "play") {
      setMascotActionState("playing");
      const activities = {
        cat: "chasing a tiny glowing laser dot 🔴",
        bunny: "doing a massive, joyful bunny binky leap! 💫",
        capybara: "splashing in a warm yuzu essential oil bath 🛀",
        bear: "doing a slow, happy fluffy summersault 🤸‍♂️"
      };
      const playResponses = {
        cat: "😸 *Mochi pounces left and right, swatting at the red dot!* 'Gotcha! Hehe, that was so much fun! See how fast my paws are?'",
        bunny: "🐰 *Pip does a high-speed sprint and twists in mid-air with absolute joy!* 'Whooooopeeee! That's my signature binky hop! Moving around makes my heart sparkle!'",
        capybara: "🦦 *Cappy sinks up to his nose in the hot tub, slow-blinking with a yuzu orange on his head.* 'Ahh... the water is perfectly warm. Floating with you makes all worries drift away.'",
        bear: "🐻 *Basu rolls onto his back with a soft chuckle!* 'Ta-da! Fluffy bear roll complete! Your laughter is my favorite sound ever!'"
      };
      setActionText(activities[mascot]);

      setTimeout(() => {
        const systemResponse: ChatMessage = {
          id: `play-${Date.now()}`,
          role: "model",
          text: playResponses[mascot],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, systemResponse]);
        setMascotActionState("idle");
        setActionText("");
      }, 2000);
    }
  };

  const getPresetOptions = () => {
    switch (mascot) {
      case "cat":
        return [
          { text: "Give me a virtual soft kitty massage 🐾", label: "Cat Massage" },
          { text: "I'm having a lot of stressful thoughts 🥺", label: "Stressful Day" },
          { text: "Tell me a sweet bedtime story about mice 🐭", label: "Bedtime Story" },
          { text: "Nudge me to feel better 🌸", label: "Soft Nudge" },
        ];
      case "bunny":
        return [
          { text: "Give me an energetic bunny cheer! 🐰💫", label: "Bunny Cheer" },
          { text: "I feel like giving up on my work... 🥺", label: "Tired/Giving Up" },
          { text: "Tell me a cozy story about the carrot forest 🥕", label: "Carrot Story" },
          { text: "Why am I amazing? 💖", label: "Why I Matter" },
        ];
      case "capybara":
        return [
          { text: "Help me breathe with slow water ripples 🌊", label: "Zen Breathing" },
          { text: "My mind is spinning with overthinking 🌧️", label: "Overthinking" },
          { text: "Tell me a serene hot spring story 🍊", label: "Serene Story" },
          { text: "Share some capybara wisdom with me 🌿", label: "Capy Wisdom" },
        ];
      default:
        return [
          { text: "Give me a virtual hug 🐻", label: "Need a Hug" },
          { text: "I had a super stressful day 🥺", label: "Stressful Day" },
          { text: "Tell me a cozy bedtime story 🌙", label: "Cozy Story" },
          { text: "Remind me why I matter 🌸", label: "Little Reminder" },
        ];
    }
  };

  return (
    <div id="basu-bot" className="flex flex-col bg-white border-2 border-amber-100 rounded-[2.5rem] shadow-sm overflow-hidden h-[480px]">
      
      {/* Mascot Selection Tabs Bar */}
      <div className="flex bg-amber-50/40 border-b border-amber-100/30 p-1 justify-around text-xs">
        {([
          { code: "bear", label: "🐻 Basu Bear" },
          { code: "cat", label: "🐱 Mochi Cat" },
          { code: "bunny", label: "🐰 Pip Bunny" },
          { code: "capybara", label: "🦦 Cappy Capy" }
        ] as const).map((m) => (
          <button
            key={m.code}
            id={`mascot-select-btn-${m.code}`}
            onClick={() => {
              if (!isLoading && mascotActionState === "idle") {
                setMascot(m.code);
              }
            }}
            className={`flex-1 py-1 px-1.5 rounded-full font-bold text-[10px] transition-all uppercase tracking-wide text-center ${
              mascot === m.code
                ? "bg-amber-100 text-amber-800 shadow-sm scale-102"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            {m.label.split(" ")[0]} <span className="hidden sm:inline">{m.label.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      {/* Header section with cute mascot animated drawing */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-rose-50/50 border-b border-amber-100/50">
        <div className="relative">
          {/* Dynamic animated mascot drawing */}
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-200 shadow-inner overflow-visible relative">
            
            {/* 1. Bear SVG Details */}
            {mascot === "bear" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-bounce-slow">
                {/* Ears */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-200 rounded-full border border-amber-300" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-200 rounded-full border border-amber-300" />
                {/* Face details */}
                <div className="flex flex-col items-center mt-1">
                  <div className="flex gap-2.5 mb-1">
                    <div className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
                  </div>
                  <div className="w-4 h-2.5 bg-white rounded-full flex items-center justify-center p-0.5 border border-amber-200">
                    <div className="w-1.5 h-1 bg-stone-800 rounded-full" />
                  </div>
                </div>
                {/* Cheeks */}
                <div className="absolute bottom-3 left-2 w-2 h-1 bg-rose-300 rounded-full opacity-70 animate-pulse" />
                <div className="absolute bottom-3 right-2 w-2 h-1 bg-rose-300 rounded-full opacity-70 animate-pulse" />
              </div>
            )}

            {/* 2. Cat SVG Details */}
            {mascot === "cat" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Pointy Ears */}
                <div className="absolute -top-1 -left-0.5 w-4 h-5 bg-stone-100 border border-stone-200 rounded-tl-full rotate-[-15deg] overflow-hidden">
                  <div className="w-2.5 h-3.5 bg-pink-200 rounded-tl-full m-0.5" />
                </div>
                <div className="absolute -top-1 -right-0.5 w-4 h-5 bg-stone-100 border border-stone-200 rounded-tr-full rotate-[15deg] overflow-hidden">
                  <div className="w-2.5 h-3.5 bg-pink-200 rounded-tr-full m-0.5" />
                </div>
                {/* Cat face */}
                <div className="flex flex-col items-center mt-1.5 animate-pulse">
                  <div className="flex gap-3 mb-1">
                    <div className="text-[7px]">👀</div>
                  </div>
                  <div className="text-[5px] text-pink-400 font-bold -mt-1.5">✿</div>
                  {/* Whiskers */}
                  <div className="absolute left-1.5 w-2 h-0.5 bg-stone-400 rounded" />
                  <div className="absolute left-1 w-2.5 h-0.5 bg-stone-400 rounded mt-1.5" />
                  <div className="absolute right-1.5 w-2 h-0.5 bg-stone-400 rounded" />
                  <div className="absolute right-1 w-2.5 h-0.5 bg-stone-400 rounded mt-1.5" />
                </div>
                {/* Cheeks */}
                <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-80" />
                <div className="absolute bottom-3 right-2 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-80" />
              </div>
            )}

            {/* 3. Bunny SVG Details */}
            {mascot === "bunny" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Long ears */}
                <div className="absolute -top-3.5 left-2 w-3.5 h-7 bg-white border border-stone-200 rounded-full origin-bottom rotate-[-5deg] animate-wiggle">
                  <div className="w-2 h-5 bg-pink-100 rounded-full mx-auto mt-0.5" />
                </div>
                <div className="absolute -top-3.5 right-2 w-3.5 h-7 bg-white border border-stone-200 rounded-full origin-bottom rotate-[5deg] animate-wiggle" style={{ animationDelay: '150ms' }}>
                  <div className="w-2 h-5 bg-pink-100 rounded-full mx-auto mt-0.5" />
                </div>
                {/* Face details */}
                <div className="flex flex-col items-center mt-2.5">
                  <div className="flex gap-3 mb-1">
                    <div className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
                  </div>
                  <div className="text-[5px] text-pink-400 -mt-1 font-black">▼</div>
                </div>
                <div className="absolute bottom-2.5 left-2 w-2 h-1 bg-rose-200 rounded-full" />
                <div className="absolute bottom-2.5 right-2 w-2 h-1 bg-rose-200 rounded-full" />
              </div>
            )}

            {/* 4. Capybara SVG Details */}
            {mascot === "capybara" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Small capy ears */}
                <div className="absolute top-1.5 -left-1 w-3 h-2 bg-amber-700/80 rounded-full" />
                <div className="absolute top-1.5 -right-1 w-3 h-2 bg-amber-700/80 rounded-full" />
                {/* Sleepy capy face */}
                <div className="flex flex-col items-center mt-1">
                  {/* Sleeping eyes */}
                  <div className="flex gap-4 mb-1">
                    <span className="text-[6px] font-bold text-stone-700">-.-</span>
                  </div>
                  {/* Big cute dark nose area */}
                  <div className="w-5 h-3.5 bg-amber-950/20 rounded-lg flex items-center justify-center p-0.5">
                    <div className="w-2.5 h-1.5 bg-amber-900 rounded-full" />
                  </div>
                </div>
                {/* Yuzu orange on head */}
                <div className={`absolute -top-2 w-4.5 h-4 bg-orange-400 border border-orange-500 rounded-full flex items-center justify-center origin-bottom ${mascotActionState === "petted" ? "animate-bounce" : ""}`}>
                  <div className="w-1 h-1.5 bg-green-600 rounded-full -mt-2" />
                  <span className="text-[5px] text-white font-extrabold absolute mt-0.5">🍊</span>
                </div>
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-60" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-60" />
              </div>
            )}

            {/* Mascot Action Animation overlay */}
            {mascotActionState !== "idle" && (
              <span className="absolute -top-2 -right-2 text-base animate-ping select-none">
                {mascotActionState === "petted" && "💖"}
                {mascotActionState === "eating" && "😋"}
                {mascotActionState === "playing" && "✨"}
              </span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-gray-800 text-sm">
              {mascot === "cat" && "Mochi Cat"}
              {mascot === "bunny" && "Pip Bunny"}
              {mascot === "capybara" && "Cappy Capy"}
              {mascot === "bear" && "Basu Bear"}
            </h3>
            <span className="text-[8px] px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded-full font-extrabold uppercase tracking-widest animate-pulse">
              {mascotActionState !== "idle" ? "ACTIVE RESPONSE" : "ONLINE"}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 line-clamp-1 italic">
            {mascotActionState !== "idle" ? `*${actionText}*` : `"${getMascotIntro(mascot).split(".")[1]?.trim() || "You're doing better than you think."}"`}
          </p>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => triggerMascotAction("pet")}
            disabled={mascotActionState !== "idle" || isLoading}
            className="p-1.5 bg-pink-50 border border-pink-100 text-pink-500 hover:bg-pink-100 rounded-full text-[10px] font-bold transition-all active:scale-90 disabled:opacity-40"
            title="Pet me"
          >
            👋 Pet
          </button>
          <button
            onClick={() => triggerMascotAction("feed")}
            disabled={mascotActionState !== "idle" || isLoading}
            className="p-1.5 bg-yellow-50 border border-yellow-100 text-yellow-600 hover:bg-yellow-100 rounded-full text-[10px] font-bold transition-all active:scale-90 disabled:opacity-40"
            title="Give Snack"
          >
            🍪 Snack
          </button>
          <button
            onClick={() => triggerMascotAction("play")}
            disabled={mascotActionState !== "idle" || isLoading}
            className="p-1.5 bg-sky-50 border border-sky-100 text-sky-600 hover:bg-sky-100 rounded-full text-[10px] font-bold transition-all active:scale-90 disabled:opacity-40"
            title="Play game"
          >
            ✨ Play
          </button>
        </div>
      </div>

      {/* Messages bubble body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent bg-slate-50/20">
        {messages.map((msg) => {
          const isModel = msg.role === "model";
          let avatar = "🐻";
          if (mascot === "cat") avatar = "🐱";
          if (mascot === "bunny") avatar = "🐰";
          if (mascot === "capybara") avatar = "🦦";

          return (
            <div
              key={msg.id}
              className={`flex ${isModel ? "justify-start" : "justify-end"} items-end gap-1.5`}
            >
              {isModel && (
                <div className="w-6 h-6 rounded-full bg-amber-100 text-xs flex items-center justify-center font-bold shadow-sm shrink-0">
                  {avatar}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                  isModel
                    ? "bg-amber-50/70 text-stone-800 rounded-bl-none border border-amber-100/30"
                    : "bg-pink-400 text-white rounded-br-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[8px] text-right mt-1 font-mono ${
                    isModel ? "text-stone-400" : "text-pink-100"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start items-end gap-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-xs flex items-center justify-center font-bold shadow-sm shrink-0 animate-bounce">
              {mascot === "cat" && "🐱"}
              {mascot === "bunny" && "🐰"}
              {mascot === "capybara" && "🦦"}
              {mascot === "bear" && "🐻"}
            </div>
            <div className="bg-amber-50/50 border border-amber-100/30 text-stone-500 rounded-2xl rounded-bl-none px-4 py-3 text-xs shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset options chips */}
      <div className="px-4 py-2 bg-amber-50/30 border-t border-amber-100/20 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        {getPresetOptions().map((preset, index) => (
          <button
            key={index}
            id={`preset-chip-${index}`}
            onClick={() => handleSendMessage(preset.text)}
            className="px-3 py-1 bg-white border border-amber-100/50 rounded-full text-[10px] font-semibold text-amber-800 hover:bg-amber-100/20 active:scale-95 transition-all shadow-sm shrink-0"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input container */}
      <div className="p-3 bg-white border-t border-amber-100/30 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
          placeholder={`Type a heartwarming whisper to ${mascot === "cat" ? "Mochi Cat" : mascot === "bunny" ? "Pip Bunny" : mascot === "capybara" ? "Cappy Capy" : "Basu Bear"}...`}
          className="flex-1 px-4 py-2 text-xs bg-stone-50 border border-amber-100/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:bg-white text-stone-800 placeholder-stone-400"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          id="btn-send-basu-msg"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 bg-amber-400 text-amber-950 rounded-2xl hover:bg-amber-500 transition-all active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-sm flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
