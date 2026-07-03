import React, { useState, useEffect } from "react";
import { Smile, Sparkles, RefreshCw, Heart, Copy, Check, MessageCircle, AlertCircle } from "lucide-react";

interface StreamSmileItem {
  id: string;
  type: "joke" | "compliment" | "gif" | "animation";
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  hasLiked?: boolean;
  avatar: string;
  handle: string;
}

const CUTE_NICKNAMES = [
  "my little sunshine",
  "kiddo",
  "nana",
  "nanluuu",
  "bangaraluuu",
  "buji=ji panduuuuu",
  "buji-ji panduuuuu",
  "little kid",
  "haruuu"
];

const getRandomNickname = () => {
  return CUTE_NICKNAMES[Math.floor(Math.random() * CUTE_NICKNAMES.length)];
};

const AVATARS = [
  { emoji: "🐻", handle: "basu_bear" },
  { emoji: "🐱", handle: "mochi_cat" },
  { emoji: "🐰", handle: "pip_bunny" },
  { emoji: "🦦", handle: "cappy_capybara" }
];

const SUBJECTS = [
  "A chubby red panda", "A tiny fluffy duckling", "A sleepy baby capybara", "A fat little hamster",
  "A joyful corgi puppy", "A round baby seal", "A polite little otter", "A mini piglet in rainboots",
  "A cozy kitten eating a pancake", "A tiny fluffy hedgehog", "A quokka holding a flower"
];

const ACTIONS = [
  "wearing a tiny knitted matching wizard hat 🧙‍♂️", "doing a little joyful tippy-tap dance 🐾",
  "taking a serious business call on a toy walkie-talkie 📞", "trying to balance a giant strawberry on its head 🍓",
  "making tiny kneaded biscuit dough on a soft fleece blanket 🍞", "floating peacefully on a miniature pool noodle 🏊‍♂️",
  "having a very deep conversation with a yellow dandelion 🌼", "snuggling into a warm, freshly toasted waffle 🧇",
  "sliding down a smooth velvet cushion and looking surprised 😮", "learning how to whistle to a little ladybug 🐞"
];

const OUTCOMES = [
  "It officially wants to be your best friend and promises to protect you from any scary thoughts today! 💖",
  "It is sending you a high-five of pure, golden positive energy right this second! 🌟",
  "It declares that you are doing an amazing job and deserve a big soft plate of warm cookies! 🍪",
  "It wants you to drop your shoulders, smile back, and know you are deeply loved! 🧸",
  "It is cheering for you with all its little fluffy heart! Go team! 🎉",
  "It soft-pats your cheek and whispers that you are more than enough exactly as you are! 🥰"
];

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1501820488136-72669a482d14?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1503066211283-433fa6b7d20f?auto=format&fit=crop&w=400&q=80"
];

let counter = 200;

function generateNextSmile(type?: "joke" | "compliment" | "gif" | "animation"): StreamSmileItem {
  counter++;
  const itemType = type || (["joke", "compliment", "gif", "animation"][Math.floor(Math.random() * 4)] as any);
  
  let content = "";
  let title = "";
  let imageUrl: string | undefined;

  const nickname = getRandomNickname();

  if (itemType === "joke") {
    const jokes = [
      `Why do we tell actors to 'break a leg', ${nickname}? Because every play has a cast! 🎭😂`,
      `What do you call a sleeping dinosaur? A dino-snore! Hope this makes you giggle, ${nickname}! 🦖💤`,
      `Why did the teddy bear say no to dessert? Because she was already stuffed, just like my love for you, ${nickname}! 🧸🧁`,
      `How does a penguin build its house, ${nickname}? Igloos it together! 🐧❄️`,
      `What do you call a fake noodle, ${nickname}? An impasta! 🍝🤡`,
      `Why did the tomato blush, ${nickname}? Because it saw the salad dressing! 🍅🥗`,
      `What do you call a happy cowboy, ${nickname}? A jolly rancher! 🤠🍬`,
      `Why are piggy banks so wise, ${nickname}? They're filled with common cents! 🐷💰`,
      `What did one plate say to the other, ${nickname}? Dinner is on me! 🍽️😜`,
      `Why are frogs always so happy, ${nickname}? Because they eat whatever bugs them! 🐸🦟`,
      `What do you call a bear with no teeth, ${nickname}? A gummy bear! 🐻🍬`,
      `Why did the bicycle collapse, ${nickname}? Because it was two-tired! 🚲💤`,
      `Why do seagulls fly over the ocean, ${nickname}? Because if they flew over the bay, they'd be bagels! 🦅🥯`
    ];
    content = jokes[Math.floor(Math.random() * jokes.length)];
    title = "Wholesome Joke 🎭";
  } else if (itemType === "compliment") {
    const compliments = [
      `Your laughter is literally the most contagious medicine in the universe, ${nickname}. If your smile was a song, it would be on repeat forever! 🎶💖`,
      `If someone made a museum of the sweetest and most caring people, you'd be the main exhibit, ${nickname}. The golden light of the room! 🏛️💛`,
      `You make the ordinary moments feel like absolute magic, ${nickname}. Just sitting in the same room as you feels like a sunny Sunday morning. ☀️☕`,
      `You're doing incredibly well, even on the days you don't feel like it, ${nickname}. You are an absolute champion of survival! 🏆🌸`,
      `The world is so lucky to have you, ${nickname}. If I could give you a crown of sweetest stardust, I would place it gently on your head. 👑✨`,
      `You are a breath of clean mountain air in a noisy world, ${nickname}. Thank you for just being yourself. 🌲🌾`,
      `Your heart has such a beautiful warmth, ${nickname}, that even flowers grow a little taller when you walk past them. 🌸✨`
    ];
    content = compliments[Math.floor(Math.random() * compliments.length)];
    title = "Sweet Compliment 💌";
  } else if (itemType === "gif") {
    const randomImg = UNSPLASH_IMAGES[Math.floor(Math.random() * UNSPLASH_IMAGES.length)];
    const animalFacts = [
      `Sea otters hold hands when they sleep so they don't float away from each other! Imagine us holding hands like cozy little otters right now, ${nickname}. 🌊💞`,
      `Sloths move so slowly that algae can actually grow on their fur! They are the absolute ultimate Zen masters of resting, ${nickname}. Let's relax! 🍃💤`,
      `Baby beavers are called kittens or kits. They love to carry sticks and snuggle in mud. You are officially as cute as a baby beaver kitten, ${nickname}! 🌳🦦`,
      `Dogs wag their tails to the right when they are happy to see someone they love. My virtual tail is wagging at maximum speed for you, ${nickname}! 🐶💕`,
      `Squirrels plant thousands of new trees each year simply by forgetting where they hid their acorns! Your small mistakes might be planting beautiful flowers, ${nickname}. 🌳🐿️`,
      `Cows have best friends and get stressed out when they are separated! You are officially my favorite cow-buddy, ${nickname}. 🐄🌾`
    ];
    content = animalFacts[Math.floor(Math.random() * animalFacts.length)];
    title = "Cute Animal Meme 🐾";
    imageUrl = randomImg;
  } else {
    // Generative
    const sub = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const act = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const out = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)];
    content = `🌈 Magic Scene: ${sub} is currently ${act}. ${out}`;
    title = "Magic Sparkle ✨";
  }

  const creator = AVATARS[Math.floor(Math.random() * AVATARS.length)];

  return {
    id: `stream-smile-${counter}-${Math.random()}`,
    type: itemType,
    title,
    content,
    imageUrl,
    likes: 12 + Math.floor(Math.random() * 45),
    hasLiked: false,
    avatar: creator.emoji,
    handle: creator.handle
  };
}

export default function EmergencySmile() {
  const [smiles, setSmiles] = useState<StreamSmileItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "joke" | "compliment" | "gif" | "animation">("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize stream with 3 items
  useEffect(() => {
    const initialSmiles = [
      generateNextSmile("compliment"),
      generateNextSmile("gif"),
      generateNextSmile("joke")
    ];
    setSmiles(initialSmiles);
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Add 3 completely fresh smiles to the feed
      const newItems = [
        generateNextSmile(),
        generateNextSmile(),
        generateNextSmile()
      ];
      setSmiles((prev) => [...prev, ...newItems]);
      setIsLoading(false);
    }, 700);
  };

  const handleLike = (id: string) => {
    setSmiles((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            likes: item.hasLiked ? item.likes - 1 : item.likes + 1,
            hasLiked: !item.hasLiked
          };
        }
        return item;
      })
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSmiles = smiles.filter(
    (item) => activeFilter === "all" || item.type === activeFilter
  );

  return (
    <div id="emergency-smile-panel" className="bg-[#FFE4E1]/80 backdrop-blur-md rounded-[2.5rem] p-6 border-2 border-[#FFC0CB]/80 shadow-sm flex flex-col gap-4">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#FFC0CB]/40 pb-3">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-pink-600 uppercase tracking-widest font-mono">Dopamine Feed</p>
          <h3 className="text-lg font-serif italic font-bold text-pink-700 flex items-center gap-1.5">
            <Smile className="w-5 h-5 text-pink-500 fill-pink-50" />
            <span>Endless Emergency Smile</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/70 rounded-full border border-pink-200 text-pink-700 text-[10px] font-bold font-mono">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span>LIVE FLOW</span>
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(["all", "joke", "compliment", "gif", "animation"] as const).map((filter) => {
          let label = "All Boosts";
          if (filter === "joke") label = "Jokes 🎭";
          if (filter === "compliment") label = "Sweet Words 💌";
          if (filter === "gif") label = "Animal Memes 🐾";
          if (filter === "animation") label = "Magic Scenes ✨";

          const isSelected = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? "bg-pink-500 border-pink-600 text-white shadow-sm scale-102"
                  : "bg-white border-pink-100 text-pink-600 hover:bg-pink-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Endless Stream Container */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
        {filteredSmiles.length === 0 ? (
          <div className="py-12 text-center bg-white/40 border border-[#FFC0CB]/20 rounded-2xl p-4">
            <AlertCircle className="w-8 h-8 text-pink-400 mx-auto mb-2 animate-bounce" />
            <p className="text-stone-600 text-xs font-semibold">No boosts loaded for this category.</p>
            <button
              onClick={handleLoadMore}
              className="mt-3 px-3 py-1.5 bg-pink-400 text-white rounded-lg text-[10px] font-bold"
            >
              Fetch Next Boosts ✨
            </button>
          </div>
        ) : (
          filteredSmiles.map((item) => (
            <div
              key={item.id}
              className="bg-white/95 border border-[#FFC0CB]/40 rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden transition-all hover:shadow-md animate-scale-up"
            >
              {/* Creator Tag Line */}
              <div className="flex items-center justify-between text-[10px] border-b border-pink-50/50 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base select-none">{item.avatar}</span>
                  <span className="font-bold text-stone-700 font-mono">@{item.handle}</span>
                </div>
                <span className="text-[8px] font-bold text-pink-400 uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-full font-mono">
                  {item.type}
                </span>
              </div>

              {/* Meme image if present */}
              {item.imageUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-stone-50 border border-pink-50 relative group">
                  <img
                    src={item.imageUrl}
                    alt="Cute animal illustration"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-[8px] text-white px-2 py-0.5 rounded font-mono uppercase">
                    cute animal
                  </div>
                </div>
              )}

              {/* Main Content text */}
              <p className="text-xs text-stone-800 font-medium leading-relaxed italic pr-2">
                "{item.content}"
              </p>

              {/* Interactive Feed Footer */}
              <div className="flex items-center justify-between border-t border-pink-50/50 pt-2 text-[10px]">
                <div className="flex items-center gap-3">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1.5 font-bold transition-all ${
                      item.hasLiked ? "text-rose-500 scale-110" : "text-stone-400 hover:text-rose-400"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.hasLiked ? "fill-rose-500" : ""}`} />
                    <span>{item.likes}</span>
                  </button>

                  <div className="flex items-center gap-1 text-stone-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{Math.floor(item.likes / 3) + 1} replies</span>
                  </div>
                </div>

                {/* Copy content */}
                <button
                  onClick={() => copyToClipboard(item.content, item.id)}
                  className="flex items-center gap-1 text-pink-500 hover:underline font-bold"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Load More Trigger Section */}
      <div className="border-t border-[#FFC0CB]/40 pt-2.5 flex justify-center">
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          id="btn-load-more-smiles"
          className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl hover:from-pink-600 hover:to-rose-500 active:scale-98 transition-all font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Pouring more sweet dopamine... 🍿✨</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Load More Endless Smiles 🍿✨</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
