import React from 'react';
import { Disc, Music2, Sparkles } from 'lucide-react';
import { Song } from '../types';

interface RightSidebarDecorProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenYouTube: () => void;
}

export const RightSidebarDecor: React.FC<RightSidebarDecorProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onOpenYouTube,
}) => {
  return (
    <aside className="hidden 2xl:flex w-72 bg-[#0F0F12] border-l border-[#2A2720] p-6 flex-col justify-between items-center text-center select-none overflow-y-auto">
      {/* Top Vintage Golden Cassette */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-['Cinzel'] font-bold text-[#F5D77F] tracking-widest uppercase">
            Vintage Deck
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Hi-Fi
          </span>
        </div>

        <div className="w-full h-36 bg-zinc-950 border-2 border-[#D4AF37]/70 rounded-2xl p-3 shadow-[0_0_20px_rgba(212,175,55,0.25)] relative cassette-rotate cursor-pointer transition-transform group"
          onClick={onOpenYouTube}
          title="Ver en YouTube"
        >
          <div className="w-full bg-[#B8972E]/30 border border-[#D4AF37] text-[#FDE68A] font-['Cinzel'] font-bold text-[10px] py-1 rounded text-center tracking-wider truncate px-1">
            LEYENDAS DEL ROCK
          </div>
          <div className="flex items-center justify-center gap-6 my-3">
            <div className={`w-8 h-8 rounded-full border border-[#D4AF37] border-dashed flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
            </div>
            <div className="w-12 h-2 bg-zinc-800 rounded-full" />
            <div className={`w-8 h-8 rounded-full border border-[#D4AF37] border-dashed flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
            </div>
          </div>
          <div className="text-[8px] text-zinc-500 font-mono text-center">
            SIDE A • NEXT TRACK 90 MIN
          </div>
        </div>
      </div>

      {/* Middle Golden Vinyl Record */}
      <div className="w-full flex flex-col items-center my-6">
        <div
          onClick={onTogglePlay}
          className={`w-44 h-44 rounded-full bg-gradient-to-tr from-black via-zinc-900 to-black border-4 border-[#D4AF37]/80 shadow-[0_0_35px_rgba(212,175,55,0.35)] flex items-center justify-center relative cursor-pointer hover:scale-105 transition-all vinyl-spinning ${
            isPlaying ? '' : 'paused'
          }`}
          title="Haz clic para reproducir/pausar disco"
        >
          {/* Vinyl grooves */}
          <div className="w-34 h-34 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-[#D4AF37]/40 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#B8972E] to-[#F5D77F] flex items-center justify-center text-[8px] font-bold text-black font-['Cinzel'] shadow-inner">
                GOLD VIP
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs font-['Cinzel'] text-[#F5D77F] font-bold mt-4">
          Edición Coleccionista
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          {isPlaying ? 'Disco en Reproducción' : 'Toca el disco para escuchar'}
        </p>
      </div>

      {/* Bottom info widget */}
      <div className="w-full bg-[#15151A] p-3 rounded-xl border border-[#2A2720] text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase">En Vivo</span>
          <span className="text-[10px] text-emerald-400 font-mono">24-bit / 96kHz</span>
        </div>
        <p className="text-xs text-zinc-200 font-medium truncate mt-1">
          {currentSong.title}
        </p>
        <p className="text-[11px] text-zinc-400 truncate">
          {currentSong.artist}
        </p>
      </div>
    </aside>
  );
};
