import React, { useState, useEffect } from 'react';
import { ListMusic, Play, Youtube, Heart, Sparkles, Music, Check, Share2 } from 'lucide-react';
import { ArtistPlaylist, Song } from '../types';

interface PlaylistsViewProps {
  playlists: ArtistPlaylist[];
  songs: Song[];
  selectedArtistId?: string;
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onOpenYouTube: () => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  playlists,
  songs,
  selectedArtistId,
  onPlaySong,
  onToggleFavorite,
  onOpenYouTube,
}) => {
  const [activePlaylistId, setActivePlaylistId] = useState<string>(
    selectedArtistId
      ? playlists.find((p) => p.artistId === selectedArtistId)?.id || playlists[0].id
      : playlists[0].id
  );

  useEffect(() => {
    if (selectedArtistId) {
      const found = playlists.find((p) => p.artistId === selectedArtistId);
      if (found) {
        setActivePlaylistId(found.id);
      }
    }
  }, [selectedArtistId, playlists]);

  const activePlaylist =
    playlists.find((p) => p.id === activePlaylistId) || playlists[0];

  // Resolve songs in this playlist
  const playlistSongs = songs.filter(
    (s) =>
      activePlaylist.songIds.includes(s.id) ||
      s.artist.toLowerCase().includes(activePlaylist.artistName.toLowerCase())
  );

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      onPlaySong(playlistSongs[0]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2720]">
        <div>
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#F5D77F]" />
            <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold gold-gradient-text">
              Playlists Personalizadas por Artista
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Cada banda y artista cuenta con su propia lista curada, con enlaces directos a sus videos más escuchados en YouTube.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#F5D77F] bg-[#D4AF37]/10 border border-[#D4AF37]/40 px-3 py-1.5 rounded-full font-bold">
            {playlists.length} Playlists Disponibles
          </span>
        </div>
      </div>

      {/* Selector de Artista / Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {playlists.map((pl) => (
          <button
            key={pl.id}
            onClick={() => setActivePlaylistId(pl.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activePlaylistId === pl.id
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'bg-[#15151A] border border-[#2A2720] text-zinc-300 hover:border-[#D4AF37]/60 hover:text-[#F5D77F]'
            }`}
          >
            <span>{pl.artistName}</span>
          </button>
        ))}
      </div>

      {/* Featured Playlist Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/60 bg-gradient-to-r from-black via-[#15151A] to-[#1E1E26] p-6 md:p-8 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0">
            <img
              src={activePlaylist.cover}
              alt={activePlaylist.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="p-3 bg-black/60 rounded-full text-[#F5D77F] border border-[#D4AF37]">
                <ListMusic className="w-6 h-6" />
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[10px] font-bold text-[#F5D77F] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" /> Playlist Oficial de {activePlaylist.artistName}
            </div>
            <h3 className="font-['Cinzel'] font-black text-xl sm:text-2xl lg:text-3xl gold-gradient-text">
              {activePlaylist.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-xl font-light leading-relaxed">
              {activePlaylist.description}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-5">
              <button
                onClick={handlePlayAll}
                className="gold-button text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Reproducir Todo</span>
              </button>

              <button
                onClick={() => {
                  if (playlistSongs.length > 0) {
                    onPlaySong(playlistSongs[0]);
                    onOpenYouTube();
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-red-600/15 border border-red-500/50 hover:bg-red-600 hover:text-white text-red-400 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
                <span>Ver en YouTube</span>
              </button>

              <span className="text-xs text-zinc-400 font-mono self-center">
                {playlistSongs.length} temas seleccionados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Tracklist Table */}
      <div className="bg-[#15151A] border border-[#2A2720] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2A2720]">
          <h4 className="font-['Cinzel'] font-bold text-base text-zinc-100 flex items-center gap-2">
            <Music className="w-4 h-4 text-[#F5D77F]" /> Canciones en esta Playlist
          </h4>
          <span className="text-xs text-zinc-400">Audio &amp; Video Oficial</span>
        </div>

        {playlistSongs.length > 0 ? (
          <div className="space-y-2">
            {playlistSongs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => onPlaySong(song)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F12] hover:bg-[#1E1E26] border border-transparent hover:border-[#D4AF37]/50 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center font-mono text-xs text-zinc-500 group-hover:text-[#F5D77F]">
                    {index + 1}
                  </span>
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-10 h-10 rounded-lg object-cover border border-[#2A2720]"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-bold text-zinc-100 group-hover:text-[#FDE68A] truncate">
                        {song.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {song.artist} • {song.album}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                    {song.duration}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(song.id);
                    }}
                    className="p-1.5 text-zinc-400 hover:text-[#D4AF37] transition"
                    title={song.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        song.isFavorite
                          ? 'text-[#D4AF37] fill-[#D4AF37]'
                          : 'text-zinc-500'
                      }`}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaySong(song);
                      onOpenYouTube();
                    }}
                    className="p-1.5 text-red-400 hover:text-red-300 transition"
                    title="Ver Video en YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaySong(song);
                    }}
                    className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center group-hover:scale-105 transition shadow"
                    title="Reproducir"
                  >
                    <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 text-center py-6">
            Cargando pistas de {activePlaylist.artistName}...
          </p>
        )}
      </div>

      {/* Más Playlists por Artista en Cuadrícula */}
      <div>
        <h4 className="font-['Cinzel'] font-bold text-lg text-zinc-100 mb-4">
          Otras Playlists Disponibles
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists
            .filter((p) => p.id !== activePlaylistId)
            .map((pl) => (
              <div
                key={pl.id}
                onClick={() => setActivePlaylistId(pl.id)}
                className="bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] rounded-2xl p-3 text-center cursor-pointer group transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2.5 border border-[#2A2720]">
                  <img
                    src={pl.cover}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h5 className="font-['Cinzel'] font-bold text-xs text-zinc-100 group-hover:text-[#FDE68A] truncate">
                  {pl.artistName}
                </h5>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {pl.title}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
