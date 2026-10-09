import React from 'react';
import { Users, Play, Youtube, ListMusic, ChevronRight, Music } from 'lucide-react';
import { Artist, Song } from '../types';

interface ArtistasViewProps {
  artists: Artist[];
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onSelectArtistPlaylist: (artistId: string) => void;
  onOpenYouTube: () => void;
}

export const ArtistasView: React.FC<ArtistasViewProps> = ({
  artists,
  songs,
  onPlaySong,
  onSelectArtistPlaylist,
  onOpenYouTube,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2720]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#F5D77F]" />
            <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold gold-gradient-text">
              Artistas del Catálogo
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Íconos legendarios del rock mundial y artistas anotados en tus bocetos. Haz clic en cualquiera para abrir su playlist personalizada o escuchar en YouTube.
          </p>
        </div>
        <span className="text-xs text-[#F5D77F] bg-[#D4AF37]/10 border border-[#D4AF37]/40 px-3 py-1.5 rounded-full font-bold self-start">
          {artists.length} Bandas y Artistas
        </span>
      </div>

      {/* Artists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {artists.map((artist) => {
          // Find songs for this artist
          const artistSongs = songs.filter((s) =>
            s.artist.toLowerCase().includes(artist.name.toLowerCase())
          );

          return (
            <div
              key={artist.id}
              className="bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] group"
            >
              <div>
                {/* Header with circular image */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 p-0.5 shrink-0 group-hover:border-[#F5D77F] transition shadow-md">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#F5D77F] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full uppercase">
                      {artist.genre}
                    </span>
                    <h3 className="font-['Cinzel'] font-bold text-base sm:text-lg text-zinc-100 group-hover:text-[#FDE68A] truncate mt-1">
                      {artist.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {artistSongs.length > 0 ? `${artistSongs.length} temas en catálogo` : 'Playlist exclusiva'}
                    </p>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                  {artist.bio}
                </p>

                {/* Top tracks pills */}
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-zinc-400 mb-2 flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-[#D4AF37]" /> Canciones más escuchadas:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {artist.topTracks.slice(0, 3).map((track, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#0F0F12] border border-[#2A2720] text-zinc-300 truncate max-w-[200px]"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#2A2720] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const song = artistSongs[0] || songs.find((s) => s.artist.toLowerCase().includes(artist.name.toLowerCase()));
                    if (song) {
                      onPlaySong(song);
                      onOpenYouTube();
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-full bg-red-600/15 border border-red-500/40 hover:bg-red-600 hover:text-white text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  title="Escuchar en YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Escuchar</span>
                </button>

                <button
                  onClick={() => onSelectArtistPlaylist(artist.id)}
                  className="flex-1 py-2 px-3 rounded-full gold-button text-black text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
                  title="Ver Playlist Personalizada"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>Ver Playlist</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
