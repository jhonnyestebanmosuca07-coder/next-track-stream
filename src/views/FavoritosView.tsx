import React from 'react';
import { Heart, Play, Youtube, Trash2, Music } from 'lucide-react';
import { Song } from '../types';

interface FavoritosViewProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onOpenYouTube: () => void;
}

export const FavoritosView: React.FC<FavoritosViewProps> = ({
  songs,
  onPlaySong,
  onToggleFavorite,
  onOpenYouTube,
}) => {
  const favoriteSongs = songs.filter((s) => s.isFavorite);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2720]">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
            <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold gold-gradient-text">
              Canciones Favoritas
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Tus temas guardados con acceso inmediato y reproducción continua.
          </p>
        </div>

        {favoriteSongs.length > 0 && (
          <button
            onClick={() => onPlaySong(favoriteSongs[0])}
            className="gold-button text-black font-extrabold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 self-start cursor-pointer shadow"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Reproducir Todas</span>
          </button>
        )}
      </div>

      {favoriteSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] rounded-2xl p-4 flex items-center justify-between gap-3 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-14 h-14 rounded-xl object-cover border border-[#2A2720] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-['Cinzel'] font-bold text-xs sm:text-sm text-zinc-100 group-hover:text-[#FDE68A] truncate">
                      {song.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {song.artist}
                  </p>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {song.duration}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(song.id);
                  }}
                  className="p-1 text-[#D4AF37] hover:text-red-400 transition"
                  title="Quitar de favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaySong(song);
                      onOpenYouTube();
                    }}
                    className="p-1.5 rounded-full text-red-400 hover:text-red-300 transition"
                    title="Ver en YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaySong(song);
                    }}
                    className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center hover:scale-105 transition shadow"
                    title="Reproducir"
                  >
                    <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#15151A] rounded-2xl border border-[#2A2720] space-y-3">
          <Music className="w-10 h-10 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="font-['Cinzel'] font-bold text-base text-zinc-200">
            Aún no has agregado canciones a favoritos
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Explora el inicio, artistas o el catálogo general y pulsa el corazón en cualquier tema para guardarlo aquí.
          </p>
        </div>
      )}
    </div>
  );
};
