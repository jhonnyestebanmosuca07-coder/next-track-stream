import React, { useState } from 'react';
import { Play, Heart, Youtube, Sparkles, Filter } from 'lucide-react';
import { Song } from '../types';

interface ExplorarViewProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onOpenYouTube: () => void;
}

export const ExplorarView: React.FC<ExplorarViewProps> = ({
  songs,
  onPlaySong,
  onToggleFavorite,
  onOpenYouTube,
}) => {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'rock' | 'espanol' | 'urbano' | 'reparadas'>('todos');

  const filteredSongs = activeFilter === 'todos' 
    ? songs 
    : activeFilter === 'reparadas'
    ? songs.filter((s) => s.isFixedOrRemix)
    : songs.filter((s) => s.category === activeFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2A2720]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F5D77F]" />
            <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold gold-gradient-text">
              Explorar Catálogo
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Matriz de 12 bloques esquematizada en el Boceto 2: Rock legendario, rock en español y ritmos de los bocetos con audio y video 100% verificados.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'todos'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'bg-[#15151A] border border-[#2A2720] text-zinc-300 hover:text-[#F5D77F]'
            }`}
          >
            Todos ({songs.length})
          </button>
          <button
            onClick={() => setActiveFilter('reparadas')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'reparadas'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'bg-[#15151A] border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
            }`}
            title="Ver canciones que fueron identificadas y reparadas con video y remix 100% funcionales"
          >
            ⚡ Videos Reparados / Remixes ({songs.filter(s => s.isFixedOrRemix).length})
          </button>
          <button
            onClick={() => setActiveFilter('rock')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'rock'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'bg-[#15151A] border border-[#2A2720] text-zinc-300 hover:text-[#F5D77F]'
            }`}
          >
            Rock Clásico
          </button>
          <button
            onClick={() => setActiveFilter('espanol')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'espanol'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'bg-[#15151A] border border-[#2A2720] text-zinc-300 hover:text-[#F5D77F]'
            }`}
          >
            Rock en Español
          </button>
          <button
            onClick={() => setActiveFilter('urbano')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === 'urbano'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'bg-[#15151A] border border-[#2A2720] text-zinc-300 hover:text-[#F5D77F]'
            }`}
          >
            Urbano / Bocetos
          </button>
        </div>
      </div>

      {/* Grid de tarjetas (Representación fiel de la cuadrícula de 12 bloques del Boceto 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            onClick={() => onPlaySong(song)}
            className="bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] rounded-2xl p-3.5 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 border border-zinc-800">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2">
                  <span className="text-[10px] font-mono text-[#F5D77F] bg-black/70 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                    {song.category.toUpperCase()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaySong(song);
                      onOpenYouTube();
                    }}
                    className="p-1 rounded bg-black/70 text-red-400 hover:text-white"
                    title="Ver en YouTube"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
                {/* Center Hover Play button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaySong(song);
                  }}
                  className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#D4AF37] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-110"
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </button>
              </div>

              {/* Title & Artist */}
              <h4 className="font-['Cinzel'] font-bold text-xs sm:text-sm text-zinc-100 group-hover:text-[#FDE68A] truncate">
                {song.title}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {song.artist}
              </p>

              {song.isFixedOrRemix && (
                <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded px-1.5 py-0.5 w-fit shadow-xs">
                  <span className="animate-pulse">⚡</span>
                  <span>Video / Remix 100% OK</span>
                </div>
              )}
            </div>

            {/* Bottom info row */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#2A2720]/60 text-[11px] text-zinc-400">
              <span className="font-mono text-zinc-500">{song.duration}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(song.id);
                }}
                className="p-1 hover:text-[#D4AF37] transition"
                title={song.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart
                  className={`w-4 h-4 ${
                    song.isFavorite
                      ? 'text-[#D4AF37] fill-[#D4AF37]'
                      : 'text-zinc-500 hover:text-[#F5D77F]'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
