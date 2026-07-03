import React, { useState, useEffect } from "react";
import { Flower, Sparkles, Plus, BookOpen } from "lucide-react";
import { GardenFlower } from "../types";

export default function AffirmationGarden() {
  const [flowers, setFlowers] = useState<GardenFlower[]>([
    {
      id: "f-init-1",
      type: "rose",
      color: "from-rose-400 to-pink-500",
      scale: 1,
      bloomProgress: 100,
      x: 20,
      y: 75,
      plantedAt: new Date().toLocaleDateString(),
      note: "You survived every hard day! 🌸"
    },
    {
      id: "f-init-2",
      type: "lavender",
      color: "from-purple-400 to-lavender-500",
      scale: 0.9,
      bloomProgress: 100,
      x: 50,
      y: 80,
      plantedAt: new Date().toLocaleDateString(),
      note: "You matter more than you know. 🤍"
    },
    {
      id: "f-init-3",
      type: "sunflower",
      color: "from-amber-400 to-yellow-500",
      scale: 1.1,
      bloomProgress: 100,
      x: 80,
      y: 70,
      plantedAt: new Date().toLocaleDateString(),
      note: "Sunshine is loading! 🌻"
    }
  ]);

  const [noteInput, setNoteInput] = useState("");
  const [flowerType, setFlowerType] = useState<"rose" | "tulip" | "sunflower" | "daisy" | "lavender">("rose");
  const [flowerColor, setFlowerColor] = useState("from-pink-400 to-rose-400");
  const [selectedFlower, setSelectedFlower] = useState<GardenFlower | null>(null);

  // Auto-grow blooming flowers
  useEffect(() => {
    const growInterval = setInterval(() => {
      setFlowers((prev) =>
        prev.map((f) => {
          if (f.bloomProgress < 100) {
            return { ...f, bloomProgress: Math.min(100, f.bloomProgress + 5) };
          }
          return f;
        })
      );
    }, 150);

    return () => clearInterval(growInterval);
  }, []);

  const handlePlantFlower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    const colorsMap = {
      rose: "from-rose-400 to-pink-500",
      tulip: "from-pink-400 to-rose-400",
      sunflower: "from-amber-400 to-yellow-500",
      daisy: "from-sky-300 to-blue-400",
      lavender: "from-purple-400 to-indigo-500"
    };

    const newFlower: GardenFlower = {
      id: `flower-${Date.now()}`,
      type: flowerType,
      color: colorsMap[flowerType],
      scale: 0.8 + Math.random() * 0.4,
      bloomProgress: 10,
      x: 15 + Math.random() * 70, // Keep in bounds of flower bed
      y: 65 + Math.random() * 20,
      plantedAt: new Date().toLocaleDateString(),
      note: noteInput.trim()
    };

    setFlowers((prev) => [...prev, newFlower]);
    setNoteInput("");
  };

  return (
    <div id="affirmation-garden" className="p-5 bg-white/80 backdrop-blur-md border-2 border-green-100 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 text-green-600 rounded-xl">
            <Flower className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-base">Affirmation Garden</h3>
            <p className="text-xs text-gray-500">Plant lovely intentions & watch them bloom</p>
          </div>
        </div>
      </div>

      {/* Flower Bed Stage */}
      <div className="relative h-44 bg-gradient-to-b from-sky-50 to-emerald-50 rounded-2xl border border-green-100 overflow-hidden mb-4 shadow-inner">
        {/* Sky sparkles */}
        <div className="absolute inset-x-0 top-3 flex justify-around opacity-40">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
          <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" style={{ animationDuration: "4s" }} />
          <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
        </div>

        {/* Soil Bed */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-emerald-600/30 to-emerald-500/10 border-t border-emerald-500/20" />

        {/* Render flowers */}
        {flowers.map((f) => {
          let flowerIcon = "🌹";
          if (f.type === "lavender") flowerIcon = "🪻";
          else if (f.type === "sunflower") flowerIcon = "🌻";
          else if (f.type === "tulip") flowerIcon = "🌷";
          else if (f.type === "daisy") flowerIcon = "🌼";

          return (
            <button
              key={f.id}
              id={`garden-flower-${f.id}`}
              onClick={() => setSelectedFlower(f)}
              className="absolute group focus:outline-none"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                transform: `translate(-50%, -50%) scale(${(f.bloomProgress / 100) * f.scale})`,
                transition: "transform 0.5s ease-out",
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Flower top */}
                <div className="text-3xl filter drop-shadow hover:scale-125 hover:rotate-12 transition-transform duration-300 cursor-pointer select-none">
                  {flowerIcon}
                </div>
                {/* Flower stem */}
                <div className="w-1.5 h-6 bg-emerald-500/70 rounded-full -mt-1" />
                {/* Floating active flower bloom spark */}
                {f.bloomProgress < 100 && (
                  <span className="absolute -top-1 text-xs text-yellow-400 animate-ping">✨</span>
                )}
              </div>
            </button>
          );
        })}

        {/* Selected flower note display */}
        {selectedFlower && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] p-3 flex flex-col items-center justify-center text-center transition-all z-20">
            <div className="bg-white p-3 rounded-2xl shadow-lg max-w-[85%] border border-amber-100 relative animate-scale-up">
              <p className="text-xs text-stone-700 font-medium italic">"{selectedFlower.note}"</p>
              <p className="text-[9px] text-stone-400 mt-1.5 font-mono">Planted: {selectedFlower.plantedAt}</p>
              <button
                onClick={() => setSelectedFlower(null)}
                id="btn-close-flower-note"
                className="mt-2 text-[10px] text-rose-500 font-bold hover:underline"
              >
                Close note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Flower Planting Form */}
      <form onSubmit={handlePlantFlower} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write a sweet promise or affirmation..."
            className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-green-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:bg-white text-stone-800 placeholder-stone-400"
          />
          <button
            type="submit"
            id="btn-plant-seed"
            disabled={!noteInput.trim()}
            className="px-3.5 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95 text-xs font-bold disabled:opacity-40 disabled:scale-100 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plant Seed</span>
          </button>
        </div>

        {/* Flower species selector */}
        <div className="flex justify-between items-center bg-green-50/50 p-2 rounded-xl border border-green-100/40">
          <span className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Flower Type:</span>
          <div className="flex gap-2">
            {(["rose", "tulip", "sunflower", "daisy", "lavender"] as const).map((type) => {
              let emo = "🌹";
              if (type === "tulip") emo = "🌷";
              if (type === "sunflower") emo = "🌻";
              if (type === "daisy") emo = "🌼";
              if (type === "lavender") emo = "🪻";

              const isSelected = flowerType === type;
              return (
                <button
                  key={type}
                  type="button"
                  id={`btn-select-flower-${type}`}
                  onClick={() => setFlowerType(type)}
                  className={`text-lg p-1.5 rounded-lg border transition-all ${isSelected ? "bg-white border-green-400 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"}`}
                  title={type}
                >
                  {emo}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
