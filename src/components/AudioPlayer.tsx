import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Music, Volume2, Sparkles } from "lucide-react";
import { PLAYLIST } from "../data/cozyData";
import { Song } from "../types";

export default function AudioPlayer() {
  const [currentSong, setCurrentSong] = useState<Song>(PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3);
  
  // Audio context and nodes refs for dynamic synthesis!
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lofiOscRef = useRef<OscillatorNode | null>(null);
  const lofiGainRef = useRef<GainNode | null>(null);
  const soundIntervalRef = useRef<any>(null);

  // Initialize or resume AudioContext
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Stop current synthetic sound generator
  const stopSynthesis = () => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
    try {
      if (lofiOscRef.current) {
        lofiOscRef.current.stop();
        lofiOscRef.current.disconnect();
        lofiOscRef.current = null;
      }
    } catch (e) {}
  };

  // Start synthesis based on song type
  const startSynthesis = (song: Song) => {
    stopSynthesis();
    if (!isPlaying) return;

    const ctx = getAudioContext();
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    mainGain.connect(ctx.destination);

    if (song.id === "song-lofi") {
      // Synthesize deep, relaxing cozy lofi humming chords
      const playLofiChord = () => {
        const chords = [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [293.66, 349.23, 440.00, 523.25], // Dm7
          [329.63, 392.00, 493.88, 587.33], // Em7
          [349.23, 440.00, 523.25, 659.25], // Fmaj7
        ];
        // Select random chord
        const chord = chords[Math.floor(Math.random() * chords.length)];
        
        chord.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          // Soft attack and decay
          oscGain.gain.setValueAtTime(0, ctx.currentTime);
          oscGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1);
          oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);
          
          // Add a simple lowpass filter to make it sound muffled/cozy
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(800, ctx.currentTime);

          osc.connect(oscGain);
          oscGain.connect(filter);
          filter.connect(mainGain);
          
          osc.start();
          osc.stop(ctx.currentTime + 5);
        });
      };

      playLofiChord();
      soundIntervalRef.current = setInterval(playLofiChord, 4500);

    } else if (song.id === "song-rain") {
      // Synthesize soothing white-noise-like window rain drops
      const playRain = () => {
        // Soft white noise burst to simulate wind/steady rain
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(0.6, ctx.currentTime);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(mainGain);
        whiteNoise.start();

        // High frequency random droplets
        for (let i = 0; i < 8; i++) {
          const dropTime = ctx.currentTime + Math.random() * 1.8;
          const dropOsc = ctx.createOscillator();
          const dropGain = ctx.createGain();

          dropOsc.type = "sine";
          dropOsc.frequency.setValueAtTime(800 + Math.random() * 600, dropTime);
          dropOsc.frequency.exponentialRampToValueAtTime(200, dropTime + 0.08);

          dropGain.gain.setValueAtTime(0.015, dropTime);
          dropGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.08);

          dropOsc.connect(dropGain);
          dropGain.connect(mainGain);
          dropOsc.start(dropTime);
          dropOsc.stop(dropTime + 0.1);
        }
      };

      playRain();
      soundIntervalRef.current = setInterval(playRain, 1800);

    } else if (song.id === "song-nature") {
      // Synthesize cute cricket chirps and soft breeze rustle
      const playCricketChirp = () => {
        const now = ctx.currentTime;
        const chirpCount = 3 + Math.floor(Math.random() * 3);
        const startDelay = Math.random() * 0.5;

        for (let j = 0; j < chirpCount; j++) {
          const chirpTime = now + startDelay + j * 0.12;
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();

          osc.type = "sine";
          // High-pitch cricket frequency
          osc.frequency.setValueAtTime(4500, chirpTime);
          
          // Fast pulse simulation
          oscGain.gain.setValueAtTime(0, chirpTime);
          oscGain.gain.linearRampToValueAtTime(0.03, chirpTime + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.001, chirpTime + 0.08);

          osc.connect(oscGain);
          oscGain.connect(mainGain);
          osc.start(chirpTime);
          osc.stop(chirpTime + 0.1);
        }
      };

      playCricketChirp();
      soundIntervalRef.current = setInterval(playCricketChirp, 3000);

    } else if (song.id === "song-happy") {
      // Synthesize bright happy acoustic vibes (plinks and plunks)
      const playHappyPlink = () => {
        const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major
        const now = ctx.currentTime;
        
        // Play 4 notes in a cute sequence
        for (let i = 0; i < 4; i++) {
          const noteTime = now + i * 0.25;
          const noteFreq = scale[Math.floor(Math.random() * scale.length)];
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(noteFreq, noteTime);

          // Woodblock/Pluck synthesis
          oscGain.gain.setValueAtTime(0.12, noteTime);
          oscGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

          // Add subtle warmth filter
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(1200, noteTime);

          osc.connect(filter);
          filter.connect(oscGain);
          oscGain.connect(mainGain);

          osc.start(noteTime);
          osc.stop(noteTime + 0.4);
        }
      };

      playHappyPlink();
      soundIntervalRef.current = setInterval(playHappyPlink, 2000);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startSynthesis(currentSong);
    } else {
      stopSynthesis();
    }
    return () => stopSynthesis();
  }, [isPlaying, currentSong]);

  // Adjust volume dynamically
  useEffect(() => {
    if (isPlaying) {
      // Restart with new volume context
      startSynthesis(currentSong);
    }
  }, [volume]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const selectSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div id="comfort-playlist" className="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-yellow-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-yellow-500">Comfort Playlist</h4>
            <p className="text-[10px] text-slate-400 font-mono">Synthesizer Cozy Audio</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-50 rounded-full text-yellow-700 text-[10px] font-bold">
          <Sparkles className="w-3 h-3 animate-spin-slow" />
          <span>Synthesizer</span>
        </div>
      </div>

      {/* Main player display */}
      <div className="flex items-center gap-4 bg-yellow-50/30 p-4 rounded-2xl mb-4 border border-yellow-100/50">
        <div className="relative">
          <div className={`w-14 h-14 bg-gradient-to-tr from-yellow-200 to-rose-200 rounded-full border-2 border-white shadow flex items-center justify-center transition-all duration-1000 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: '6s' }}>
            <div className="w-5 h-5 bg-stone-800 rounded-full border-2 border-white" />
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-xs truncate">{currentSong.title}</p>
          <p className="text-[10px] text-gray-500 truncate">by {currentSong.artist}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <Volume2 className="w-3 h-3 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>
        </div>

        <button
          onClick={handlePlayPause}
          id="btn-play-pause-toggle"
          className={`p-3 rounded-full shadow-md transition-all active:scale-95 ${isPlaying ? "bg-stone-800 text-white hover:bg-stone-900" : "bg-yellow-400 text-white hover:bg-yellow-500"}`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      </div>

      {/* Songs selector */}
      <div className="grid grid-cols-2 gap-2">
        {PLAYLIST.map((song) => {
          const isSelected = currentSong.id === song.id;
          return (
            <button
              key={song.id}
              id={`btn-select-song-${song.id}`}
              onClick={() => selectSong(song)}
              className={`flex flex-col items-start p-2.5 rounded-2xl border text-left transition-all ${isSelected ? "bg-yellow-50 border-yellow-200 shadow-sm font-medium" : "bg-white border-yellow-50 hover:bg-yellow-50/20"}`}
            >
              <span className="text-[9px] font-bold text-yellow-600 font-mono tracking-wider uppercase mb-0.5">
                {song.category}
              </span>
              <span className="text-xs text-gray-800 font-semibold line-clamp-1">{song.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
