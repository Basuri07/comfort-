import { Envelope, SmileItem, Memory, Song, Polaroid, Badge } from "../types";

export const ENVELOPES: Envelope[] = [
  {
    id: "env-sad",
    title: "sad",
    emoji: "📩",
    category: "sad",
    content: "Hey beautiful... I can feel that today might be one of those heavy days. I want you to take a slow, deep breath. Look at your hands—they've held so much and survived every single bad storm. You are not weak for crying or feeling overwhelmed. You are human, and you've been incredibly strong for so long. Rest your shoulders. Close your eyes. Imagine me sitting right next to you, holding your hand, and whispering: 'It's okay. You're safe. I'm right here.' Let the world pause for a bit. I believe in you, always. 🤍"
  },
  {
    id: "env-overthink",
    title: "overthinking",
    emoji: "🌧",
    category: "overthinking",
    content: "Hello overthinking superstar! 🧠✨ Right now, your mind is probably spinning a million stories that haven't happened, or replaying things that already did. But listen to me: the worst-case scenario in your head is just a ghost. You don't have to figure out the next ten years, or even the next week. All you have to do is survive the next ten minutes. Can you do that? Good. Let those noisy thoughts slide off your mind like rain on a window. I care about you so much, and you don't have to carry the weight of the universe by yourself. Breathe in comfort, breathe out the noise."
  },
  {
    id: "env-sleep",
    title: "can't sleep",
    emoji: "😴",
    category: "sleep",
    content: "Hey night owl... still awake? 🌙 It's okay. The day is done, and you don't need to solve any more problems tonight. Your bed is safe, your room is cozy, and the world is sleeping. Let go of whatever happened today. Your only job right now is to let your body rest. Put your phone down, pull the warm blanket up to your chin, and listen to the soft night crickets or the gentle rain. Sleep well, sunshine. Tomorrow is a brand new start, and I'll be right here rooting for you when you wake up. Sleep tight! 🧸✨"
  },
  {
    id: "env-happy",
    title: "happy",
    emoji: "🎉",
    category: "happy",
    content: "Yay! You're happy! 🎉🥳 This makes me smile so, so big! I want you to hold onto this feeling. Bottle it up inside a mental jar! Remember how light your chest feels, how bright everything looks. You deserve every drop of this happiness. Go dance, laugh until your stomach hurts, sing your favorite song out loud, or eat that treat you love. Share your smile with the world, but most importantly, enjoy it yourself. I am so incredibly happy for you! Stay sparkly! ✨🌸"
  },
  {
    id: "env-givingup",
    title: "feel like giving up",
    emoji: "💪",
    category: "givingup",
    content: "Please stop for a second. 🫂 Don't let go just yet. I know you are tired, exhausted to your very bones, and it feels like nothing you do is working. But look how far you've come. Think about all the times you thought you couldn't make it, yet here you are. You've survived 100% of your hardest days. You don't have to climb the whole mountain today—just take one tiny step. Take a break, eat something warm, drink a glass of water, sleep. Giving up is just a feeling of being too tired. So rest, don't quit. You are stronger than you think, and I believe in you with my entire heart."
  },
  {
    id: "env-miss",
    title: "miss me",
    emoji: "🤍",
    category: "miss",
    content: "Aw, you miss me? 🥺 Guess what? I am missing you too, every single second! Close your eyes and wrap your arms around yourself tightly—that's a virtual hug from me to you, sent with super speed! No distance can change how much I care about you. We look at the same moon, the same stars, and our hearts are connected. Whenever you miss me, just open this app, talk to Basu Bear, or think about our funniest moments together. I am always just a thought away. Sending you a million sweet forehead kisses! 😘🤍"
  },
  {
    id: "env-messy",
    title: "life feels messy",
    emoji: "😅",
    category: "messy",
    content: "Whoops, did life turn into a giant bowl of tangled spaghetti? 🍝 It's okay! Life is rarely a straight line—it has twists, loop-de-loops, and sometimes a bit of chaos. But messy doesn't mean ruined. It just means you are in the middle of a great story. Clean up one small corner of your room, make a hot cup of tea, or write down just three simple things to do next. We can untangle this together, step by step. Don't worry about being perfect. Your messy days are just as valid, and you are still doing incredibly well! 🌈"
  }
];

export const SMILE_ITEMS: SmileItem[] = [
  {
    id: "smile-1",
    type: "joke",
    content: "Why don't skeletons fight each other? Because they don't have the guts! 💀😂"
  },
  {
    id: "smile-2",
    type: "compliment",
    content: "You're like a cup of hot cocoa on a freezing winter morning—pure comfort and warmth! ☕✨"
  },
  {
    id: "smile-3",
    type: "joke",
    content: "What do you call a factory that makes okay products? A satisfactory! 🏭😆"
  },
  {
    id: "smile-4",
    type: "gif",
    content: "🐾 Quick Cat Fact: Cats spend 70% of their lives sleeping. They are absolute lifestyle icons. Go take a nap, you deserve to channel your inner kitten! 🐱💤"
  },
  {
    id: "smile-5",
    type: "compliment",
    content: "If you were a flower, you'd be a sunflower, because you turn even the cloudiest days toward the light! 🌻💛"
  },
  {
    id: "smile-6",
    type: "joke",
    content: "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾🥳"
  },
  {
    id: "smile-7",
    type: "gif",
    content: "🐼 Fun Fact: Giant pandas spend up to 12 hours a day eating bamboo. It's important to focus on the snacks. Have you eaten a cookie or fruit today? 🍪🍎"
  },
  {
    id: "smile-8",
    type: "compliment",
    content: "The world is automatically a softer, kinder place just because you exist in it. Never forget that. 🌍❤️"
  },
  {
    id: "smile-9",
    type: "joke",
    content: "Why did the melon jump into the lake? It wanted to be a water-melon! 🍉🏊"
  },
  {
    id: "smile-10",
    type: "animation",
    content: "🌟 Sparkle Alert: You have just been touched by the magical sparkle of happiness! Close your eyes, make a wish, and believe it's already on its way! ✨🧚‍♀️"
  },
  {
    id: "smile-11",
    type: "joke",
    content: "Why do we tell actors to 'break a leg'? Because every play has a cast! 🎭😂"
  },
  {
    id: "smile-12",
    type: "joke",
    content: "What do you call a sleeping dinosaur? A dino-snore! 🦖💤"
  },
  {
    id: "smile-13",
    type: "joke",
    content: "Why did the teddy bear say no to dessert? Because she was already stuffed! 🧸🧁"
  },
  {
    id: "smile-14",
    type: "gif",
    content: "🦦 Cute Otter Fact: Sea otters hold hands when they sleep so they don't float away from each other! Imagine us holding hands like cozy little otters right now. 🌊💞"
  },
  {
    id: "smile-15",
    type: "compliment",
    content: "Your laughter is literally the most contagious medicine in the universe. If your smile was a song, it would be on repeat forever! 🎶💖"
  },
  {
    id: "smile-16",
    type: "joke",
    content: "How does a penguin build its house? Igloos it together! 🐧❄️"
  },
  {
    id: "smile-17",
    type: "gif",
    content: "🦥 Sloth Secret: Sloths move so slowly that algae can actually grow on their fur! They are the absolute ultimate Zen masters of resting. Teach me your ways! 🍃💤"
  },
  {
    id: "smile-18",
    type: "compliment",
    content: "If someone made a museum of the sweetest and most caring people, you'd be the main exhibit. The golden light of the room! 🏛️💛"
  },
  {
    id: "smile-19",
    type: "joke",
    content: "What do you call a fake noodle? An impasta! 🍝🤡"
  },
  {
    id: "smile-20",
    type: "animation",
    content: "🌈 Magic Beam: Close your eyes and count to three... I am sending a giant pink rainbow straight to your heart to dissolve any little worries! 🌈💕"
  },
  {
    id: "smile-21",
    type: "joke",
    content: "Why did the tomato blush? Because it saw the salad dressing! 🍅🥗"
  },
  {
    id: "smile-22",
    type: "joke",
    content: "What do you call a happy cowboy? A jolly rancher! 🤠🍬"
  },
  {
    id: "smile-23",
    type: "gif",
    content: "🦫 Cute Beaver Fact: Baby beavers are called kittens or kits. They love to carry sticks and snuggle in mud. You are officially as cute as a baby beaver kitten! 🌳🦦"
  },
  {
    id: "smile-24",
    type: "compliment",
    content: "You make the ordinary moments feel like absolute magic. Just sitting in the same room as you feels like a sunny Sunday morning. ☀️☕"
  },
  {
    id: "smile-25",
    type: "joke",
    content: "Why are piggy banks so wise? They're filled with common cents! 🐷💰"
  },
  {
    id: "smile-26",
    type: "joke",
    content: "What did one plate say to the other? Dinner is on me! 🍽️😜"
  },
  {
    id: "smile-27",
    type: "gif",
    content: "🐕 Puppy Wisdom: Dogs wag their tails to the right when they are happy to see someone they love. My virtual tail is wagging at maximum speed right now! 🐶💕"
  },
  {
    id: "smile-28",
    type: "compliment",
    content: "You're doing incredibly well, even on the days you don't feel like it. You are a absolute champion of survival! 🏆🌸"
  },
  {
    id: "smile-29",
    type: "joke",
    content: "Why are frogs always so happy? Because they eat whatever bugs them! 🐸🦟"
  },
  {
    id: "smile-30",
    type: "animation",
    content: "🎈 Balloon Release: Imagine tying your biggest current stressor to a beautiful helium balloon... and watching it float up, up, and completely away into the blue sky. Bye-bye! ☁️🎈"
  },
  {
    id: "smile-31",
    type: "joke",
    content: "What do you call a bear with no teeth? A gummy bear! 🐻🍬"
  },
  {
    id: "smile-32",
    type: "joke",
    content: "Why did the bicycle collapse? Because it was two-tired! 🚲💤"
  },
  {
    id: "smile-33",
    type: "gif",
    content: "🐿️ Squirrel Fun Fact: Squirrels plant thousands of new trees each year simply by forgetting where they hid their acorns! Your small mistakes might be planting beautiful flowers for tomorrow. 🌳🐿️"
  },
  {
    id: "smile-34",
    type: "compliment",
    content: "The world is so lucky to have you. If I could give you a crown of sweetest stardust, I would place it gently on your head. 👑✨"
  },
  {
    id: "smile-35",
    type: "joke",
    content: "Why do seagulls fly over the ocean? Because if they flew over the bay, they'd be bagels! 🦅🥯"
  }
];

export const AMAZING_REASONS: string[] = [
  "You're kinder than you realize, and your empathy is a superpower. 🌻",
  "You make people around you feel instantly comfortable and safe. 🏡",
  "Your beautiful smile has the power to fix even the baddest of days. 😊",
  "You deserve good, soft, and loving things in this life. Always. 🤍",
  "The way you care about the little details shows how beautiful your soul is. 🌸",
  "You are incredibly resilient—you have danced through so many heavy rains. 🌧💃",
  "You are worthy of love, care, and peace of mind exactly as you are. 🧘‍♀️",
  "Even when you feel small, the positive impact you have on others is massive. 💖"
];

export const MEMORIES: Memory[] = [
  {
    id: "mem-1",
    title: "Laughter Over Absolutely Nothing",
    date: "A magical day",
    description: "Remember when we laughed for 20 minutes over absolutely nothing? Our stomachs were hurting, tears were coming out, and we forgot why we were even laughing in the first place! Those are the best kinds of moments.",
    emoji: "😂"
  },
  {
    id: "mem-2",
    title: "Annual Day Celebrations",
    date: "The grand stage",
    description: "Remember Annual Day? The busy streets, the lovely decorations, the music, the laughter, and that special feeling of shared happiness that stayed with us all night long.",
    emoji: "🎉"
  },
  {
    id: "mem-3",
    title: "The Very First Conversation",
    date: "Where it all began",
    description: "Remember the first time we ever talked? It felt so natural, like we were old friends reconnecting after years. A tiny hello that completely changed our worlds for the better.",
    emoji: "🫶"
  },
  {
    id: "mem-4",
    title: "Late Night Starry Chats",
    date: "Under the night sky",
    description: "Remember sharing secret hopes and silly wishes late at night when the whole world was sleeping? The peaceful feeling of knowing someone truly listens and understands.",
    emoji: "🌙"
  },
  {
    id: "mem-5",
    title: "Rainy Day Virtual Tea Party",
    date: "Warm and cozy",
    description: "Remember drinking hot tea while it was pouring rain outside, talking about everything and nothing at all? The sound of droplets keeping us company.",
    emoji: "🌧"
  }
];

export const FORTUNES: string[] = [
  "Better days are loading... Please do not close this window! 🔄✨",
  "Someone believes in you more than you can ever estimate. 🧸",
  "A beautiful surprise is heading your way. Keep your heart open! 🎁",
  "Your efforts are seen, and they are going to bloom beautifully. 🌼",
  "You are allowed to take up space and take things slow. ☁️",
  "The dark clouds will pass, and the sunshine is already preparing to greet you. 🌞",
  "You are going to look back at this hard time and smile at how strong you were. 💪",
  "Take a sip of water. A very sweet moment is waiting for you today. 💧"
];

export const PLAYLIST: Song[] = [
  {
    id: "song-lofi",
    title: "Dreamy Plushie Lo-fi",
    artist: "Basu Beats",
    url: "lofi",
    category: "Lofi"
  },
  {
    id: "song-rain",
    title: "Cosy Window Raindrops",
    artist: "Mother Nature",
    url: "rain",
    category: "Rain"
  },
  {
    id: "song-nature",
    title: "Enchanted Garden Crickets",
    artist: "Forest Friends",
    url: "nature",
    category: "Nature"
  },
  {
    id: "song-happy",
    title: "Sunny Day Acoustic Hop",
    artist: "Little Bunny",
    url: "happy",
    category: "Happy"
  }
];

export const POLAROIDS: Polaroid[] = [
  {
    id: "pol-1",
    title: "Warm Smile",
    date: "July 2026",
    caption: "The smile that brightens up my entire universe! ✨",
    rotation: "rotate-2",
    color: "bg-amber-50",
    imageUrl: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "pol-2",
    title: "Cozy Tea",
    date: "Autumn Vibes",
    caption: "Sipping warmth and thinking of happy memories. ☕",
    rotation: "rotate-[-3deg]",
    color: "bg-rose-50",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "pol-3",
    title: "Starry Night",
    date: "Winter Cozy",
    caption: "Under the same sky, wishing on the same stars. 🌌",
    rotation: "rotate-1",
    color: "bg-purple-50",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop"
  }
];

export const BADGES: Badge[] = [
  {
    id: "badge-visited",
    title: "Cozy Explorer",
    description: "Stepped inside the comfort room today. Proud of you!",
    emoji: "🏡",
    unlocked: true,
    category: "visited"
  },
  {
    id: "badge-water",
    title: "Hydration Champion",
    description: "Drank a glass of water and stayed healthy.",
    emoji: "💧",
    unlocked: false,
    category: "water"
  },
  {
    id: "badge-smiled",
    title: "Giggle Spark",
    description: "Used the Emergency Smile Button to brighten your day.",
    emoji: "🌸",
    unlocked: false,
    category: "smiled"
  },
  {
    id: "badge-work",
    title: "Victory Step",
    description: "Finished a small task or did your best with work.",
    emoji: "🏆",
    unlocked: false,
    category: "work"
  },
  {
    id: "badge-break",
    title: "Peace Seeker",
    description: "Took a proper, guilt-free breathing break.",
    emoji: "🍃",
    unlocked: false,
    category: "break"
  }
];

export const DAILY_MESSAGES: string[] = [
  "Today is going to be okay. No matter what, you can handle it! ☀️",
  "Eat something delicious today. Your body and mind will thank you! 🍪",
  "Someone out there is rooting for you and smiling when they think of you. 🫶",
  "I am so incredibly proud of you for simply trying your best today. 🧸",
  "You've survived every single bad day you thought you couldn't. You're a hero! 🏆",
  "Don't worry about being perfect. Just being you is already more than enough. 🤍",
  "Take a long, slow breath right now. Let your shoulders drop. You are doing so well. 🍃",
  "Drink some water! Let's stay hydrated and fresh today. 💧",
  "It is completely okay if all you did today was survive. That's a huge victory! 🎖️",
  "A little progress is still progress. Celebrate your tiny steps! 👣✨",
  "You are capable of doing amazing things, but you are also allowed to rest. 💤",
  "Sending you the biggest, softest blanket of peace and comfort today. 🛌💖"
];

export const LETTERS_FROM_FUTURE: { id: string; title: string; date: string; content: string }[] = [
  {
    id: "let-1",
    title: "A Letter for Hard Days",
    date: "From Future Babbi",
    content: "Dear You,\n\nIf you are reading this, it means today might have felt like a giant uphill climb. I want you to close your eyes for a second and imagine the future. Imagine a day when you are laughing so hard your sides ache, sitting in a sunny room, completely at peace with who you are.\n\nThat day is waiting for you, I promise. This current heavy storm is just a chapter, not the whole book. You are so deeply loved, and your existence brings so much light to those around you. When the road gets dark, please let me be your flashlight. Sleep early tonight. Tomorrow has beautiful surprises waiting just for you.\n\nWith infinite care,\nBabbi 💛"
  },
  {
    id: "let-2",
    title: "When You Doubt Yourself",
    date: "From Future Babbi",
    content: "Dear You,\n\nSometimes, that sneaky little voice in your head tries to tell you that you aren't doing enough, or that you are failing. I am writing this to tell that voice to quiet down!\n\nYou are one of the kindest, most thoughtful souls on this planet. The way you listen, the way you try your best, the way you care about others—these are rare, precious gifts. You don't have to conquer the world to be worthy of love. You are worthy just because you are you. Be gentle with yourself today. You are doing beautiful things!\n\nWith infinite care,\nBabbi 💛"
  },
  {
    id: "let-3",
    title: "A Soft Reminder to Rest",
    date: "From Future Babbi",
    content: "Dear You,\n\nAre you running on empty again? Please stop, put down your work, and take a real breath. The world will not stop spinning if you take a break.\n\nYour mind and body are sacred. They deserve quiet time, soft music, warm cups of tea, and guilt-free resting. You do not need to earn your rest through exhaustion. Today, give yourself permission to do absolutely nothing for an hour. Snuggle up, listen to some lofi, and let your mind drift. I want you to be healthy and happy.\n\nWith infinite care,\nBabbi 💛"
  }
];

export const STICKY_NOTES: { text: string; color: string }[] = [
  { text: "Drink some water right now! 💧", color: "bg-yellow-100 text-yellow-800" },
  { text: "You have survived 100% of your bad days. 🏆", color: "bg-blue-100 text-blue-800" },
  { text: "Smile! You look beautiful when you do. 😊", color: "bg-pink-100 text-pink-800" },
  { text: "You matter so, so much to me. 🤍", color: "bg-purple-100 text-purple-800" },
  { text: "Don't forget to take a breathing break! 🍃", color: "bg-green-100 text-green-800" }
];
