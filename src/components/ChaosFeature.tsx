import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface ChaosItem {
  id: string;
  type: "duck" | "cat" | "capybara";
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  scale: number;
}

interface Confetti {
  id: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  rotation: number;
}

export default function ChaosFeature() {
  const [activeChaos, setActiveChaos] = useState<ChaosItem[]>([]);
  const [particles, setParticles] = useState<Confetti[]>([]);
  
  // Cursor companion tracking state
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const [companionPos, setCompanionPos] = useState({ x: 180, y: 180 });
  const [companionSpeech, setCompanionSpeech] = useState("I'm right here! 🧸");
  const [showBubble, setShowBubble] = useState(true);

  // Smooth lerp follow for tiny friend
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const companionChase = setInterval(() => {
      setCompanionPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        // smooth chase
        return {
          x: prev.x + dx * 0.08,
          y: prev.y + dy * 0.08,
        };
      });
    }, 16);

    return () => clearInterval(companionChase);
  }, [mousePos]);

  // Periodic companion dialogue updates
  useEffect(() => {
    const phrases = [
      "You got this! 🌟",
      "Proud of you! 🥰",
      "I'm here with you! 🧸",
      "Have a cookie? 🍪",
      "Breathe in, breathe out... 🍃",
      "Babbi says hi! 💕",
      "Your smile is beautiful! ✨",
      "Take a tiny water sip! 💧",
    ];

    const speechTimer = setInterval(() => {
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCompanionSpeech(phrase);
      setShowBubble(true);

      setTimeout(() => {
        setShowBubble(false);
      }, 3500);

    }, 8000);

    return () => clearInterval(speechTimer);
  }, []);

  // Update loop for spawned chaos animals & confetti particles
  useEffect(() => {
    if (activeChaos.length === 0 && particles.length === 0) return;

    const gameLoop = setInterval(() => {
      // Update chaos creatures positions
      setActiveChaos((prev) =>
        prev
          .map((item) => ({
            ...item,
            x: item.x + item.speedX,
            y: item.y + item.speedY,
            rotation: item.rotation + 2,
          }))
          .filter((item) => item.x > -150 && item.x < window.innerWidth + 150 && item.y < window.innerHeight + 150)
      );

      // Update confetti falling
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y + 4,
            rotation: p.rotation + 5,
          }))
          .filter((p) => p.y < window.innerHeight + 10)
      );
    }, 24);

    return () => clearInterval(gameLoop);
  }, [activeChaos, particles]);

  // Trigger random adorable chaos!
  const triggerChaos = () => {
    // 1. Spawning 3-4 random creatures
    const types: ("duck" | "cat" | "capybara")[] = ["duck", "cat", "capybara"];
    const newItems: ChaosItem[] = [];

    for (let i = 0; i < 6; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const fromLeft = Math.random() > 0.5;
      
      newItems.push({
        id: `chaos-${Date.now()}-${i}-${Math.random()}`,
        type,
        x: fromLeft ? -100 : window.innerWidth + 50,
        y: Math.random() * (window.innerHeight - 300) + 100,
        speedX: fromLeft ? (3 + Math.random() * 5) : -(3 + Math.random() * 5),
        speedY: (Math.random() * 4) - 2,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.5,
      });
    }

    setActiveChaos((prev) => [...prev, ...newItems]);

    // 2. Generating 50 confetti burst particles
    const colors = ["bg-pink-300", "bg-rose-400", "bg-amber-300", "bg-purple-300", "bg-blue-300", "bg-green-300", "bg-orange-300"];
    const newParticles: Confetti[] = [];
    for (let i = 0; i < 45; i++) {
      newParticles.push({
        id: `confetti-${Date.now()}-${i}-${Math.random()}`,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.6 + Math.random() * 0.8,
        rotation: Math.random() * 360,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  return (
    <>
      {/* Trigger Button container inside the main screen */}
      <div id="chaos-panel" className="p-5 bg-white/80 backdrop-blur-md border-2 border-pink-100 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
        <h3 className="font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-1.5 justify-center">
          <span>😂 Random Chaos Button</span>
        </h3>
        <p className="text-xs text-gray-500 mb-3.5">Need a boost of pure silly joy?</p>
        <button
          onClick={triggerChaos}
          id="btn-trigger-chaos"
          className="px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold rounded-2xl hover:from-pink-500 hover:to-rose-500 active:scale-95 transition-all shadow-md flex items-center gap-2 text-sm bounce-hover border-b-4 border-rose-600"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>I Need Chaos!</span>
        </button>
      </div>

      {/* Global render space for the walking ducks/capybaras */}
      {activeChaos.map((item) => {
        let characterEmoji = "🦆";
        let title = "Walking Duck";
        if (item.type === "cat") {
          characterEmoji = "🐱";
          title = "Falling Cat";
        } else if (item.type === "capybara") {
          characterEmoji = "🦫";
          title = "Wiggling Capy";
        }

        return (
          <div
            key={item.id}
            className="fixed pointer-events-none z-50 text-4xl select-none filter drop-shadow"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              transition: "transform 0.05s linear",
            }}
            title={title}
          >
            {characterEmoji}
          </div>
        );
      })}

      {/* Global falling confetti rendering */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`fixed pointer-events-none z-40 rounded-sm ${p.color}`}
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${10 * p.scale}px`,
            height: `${10 * p.scale}px`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.85,
          }}
        />
      ))}

      {/* Cursor Companion Tiny Friend! */}
      <div
        id="cursor-companion-friend"
        className="fixed pointer-events-none z-[100] transition-all duration-300 ease-out"
        style={{
          left: `${companionPos.x + 15}px`,
          top: `${companionPos.y + 15}px`,
        }}
      >
        <div className="relative flex flex-col items-center">
          {/* Adorable little speech bubble */}
          {showBubble && (
            <div className="mb-2 bg-white border border-rose-100 text-[10px] font-bold text-rose-800 px-2 py-1 rounded-xl shadow-md whitespace-nowrap animate-bounce-slow">
              {companionSpeech}
              {/* Little Speech bubble tail */}
              <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 rotate-45 w-1.5 h-1.5 bg-white border-r border-b border-rose-100" />
            </div>
          )}
          {/* Mascot Drawing */}
          <div className="text-2xl animate-pulse">
            🐰
          </div>
        </div>
      </div>
    </>
  );
}
