import React, { useState } from 'react';
import { Disc3, Plus, Play, Heart, Youtube, Search, Check, Sparkles, Music } from 'lucide-react';
import { Song } from '../types';

const getYouTubeVideoId = (value: string): string | null => {
  const input = value.trim();
  if (/^[\w-]{11}$/.test(input)) return input;

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (!['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'youtube-nocookie.com'].includes(host)) {
      return null;
    }

    const videoId = host === 'youtu.be'
      ? url.pathname.split('/').filter(Boolean)[0]
      : url.searchParams.get('v') ||
        url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];

    return videoId && /^[\w-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
};

interface ListasViewProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onOpenYouTube: () => void;
  onAddCustomSong: (song: Song) => void;
}

export const ListasView: React.FC<ListasViewProps> = ({
  songs,
  onPlaySong,
  onToggleFavorite,
  onOpenYouTube,
  onAddCustomSong,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newAlbum, setNewAlbum] = useState('');
  const [newYoutubeId, setNewYoutubeId] = useState('');
  const [youtubeThumbnail, setYoutubeThumbnail] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<'rock' | 'espanol' | 'urbano'>('rock');
  const [formError, setFormError] = useState('');
  const [isLookingUpVideo, setIsLookingUpVideo] = useState(false);

  // Canciones esquematizadas en el boceto 4 con tarjetas redondeadas
  const wireframe4Songs = songs.filter((s) => s.wireframe4);

  const filteredCatalogue = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.album.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) {
      setFormError('Por favor completa el nombre de la canción y del artista.');
      return;
    }

    const ytId = getYouTubeVideoId(newYoutubeId);
    if (!ytId) {
      setFormError('Pega un enlace válido de YouTube o un ID de video de 11 caracteres.');
      return;
    }

    if (songs.some((song) => song.youtubeId === ytId || song.alternativeYoutubeId === ytId)) {
      setFormError('Ese video ya está agregado al catálogo.');
      return;
    }

    const createdSong: Song = {
      id: `custom-${ytId}`,
      title: newTitle.trim(),
      artist: newArtist.trim(),
      album: newAlbum.trim() || 'Tu Lista Personalizada',
      category: newCategory,
      cover: youtubeThumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      duration: '—',
      durationSec: 0,
      youtubeId: ytId,
      isFavorite: true,
      wireframe4: true,
    };

    onAddCustomSong(createdSong);
    setShowAddModal(false);
    setNewTitle('');
    setNewArtist('');
    setNewAlbum('');
    setNewYoutubeId('');
    setYoutubeThumbnail(null);
    setFormError('');
  };

  const handleYouTubeLinkBlur = async () => {
    const videoId = getYouTubeVideoId(newYoutubeId);
    if (!videoId) return;
    if (songs.some((song) => song.youtubeId === videoId || song.alternativeYoutubeId === videoId)) {
      setFormError('Ese video ya está agregado al catálogo.');
      return;
    }

    setIsLookingUpVideo(true);
    setFormError('');
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`
      );
      if (!response.ok) {
        throw new Error(`YouTube respondió ${response.status}`);
      }
      const metadata: { title?: string; author_name?: string; thumbnail_url?: string } =
        await response.json();
      if (!metadata.title || !metadata.author_name) {
        throw new Error('YouTube no devolvió el título ni el canal del video.');
      }
      setNewTitle((value) => value.trim() || metadata.title || '');
      setNewArtist((value) => value.trim() || metadata.author_name || '');
      setYoutubeThumbnail(metadata.thumbnail_url || null);
    } catch {
      setFormError('No se pudieron consultar los datos de YouTube. Completa título y artista manualmente; algunos videos no permiten inserción.');
    } finally {
      setIsLookingUpVideo(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2720]">
        <div>
          <div className="flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-[#F5D77F]" />
            <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold gold-gradient-text">
              Listas &amp; Álbumes
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Canciones representadas en los Bocetos 3 y 4. Agrega temas a tu lista personal y explora el catálogo completo.
          </p>
        </div>

        {/* Button to add custom song (Boceto 3: "+ Agrega 1 canción / Tu lista") */}
        <button
          onClick={() => setShowAddModal(true)}
          className="gold-button text-black font-extrabold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 self-start cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.35)]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agregar Canción</span>
        </button>
      </div>

      {/* 5 Tarjetas Ovaladas (Boceto 4: Un Osito Dormilón, Monastery, Una, Reina, etc.) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Cinzel'] font-bold text-base sm:text-lg text-[#FDE68A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Canciones Destacadas (Boceto 4)
          </h3>
          <span className="text-[11px] text-zinc-400">Tarjetas de formato ovalado</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {wireframe4Songs.slice(0, 5).map((song) => (
            <div
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="p-4 rounded-3xl bg-[#15151A] border border-[#D4AF37]/40 hover:border-[#F5D77F] transition-all cursor-pointer text-center group shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:-translate-y-1"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl overflow-hidden border border-[#D4AF37]/60 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h4 className="font-['Cinzel'] font-bold text-xs text-[#FDE68A] group-hover:text-[#F5D77F] truncate">
                {song.title}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {song.artist}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlaySong(song);
                }}
                className="mt-3 w-full py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[10px] font-bold text-[#F5D77F] group-hover:bg-[#D4AF37] group-hover:text-black transition flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Reproducir</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Catálogo Completo de Canciones con Enlaces de YouTube */}
      <div className="bg-[#15151A] border border-[#2A2720] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2A2720]">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#F5D77F]" />
            <div>
              <h3 className="font-['Cinzel'] font-bold text-base text-zinc-100">
                Catálogo General y Reproducción en Vivo
              </h3>
              <p className="text-[11px] text-zinc-400">
                Total: {filteredCatalogue.length} canciones con videos oficiales de YouTube
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar canciones..."
              className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-full pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* List of songs */}
        <div className="divide-y divide-[#2A2720]/50">
          {filteredCatalogue.map((song, index) => (
            <div
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1E1E26] transition cursor-pointer group"
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
                  className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center opacity-80 group-hover:opacity-100 transition shadow"
                  title="Reproducir ahora"
                >
                  <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: + AGREGAR CANCIÓN (Boceto 3: Tu Lista) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#15151A] border-2 border-[#D4AF37]/70 rounded-3xl w-full max-w-md p-6 shadow-[0_0_35px_rgba(212,175,55,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2720] pb-3">
              <h3 className="font-['Cinzel'] font-bold text-lg text-[#FDE68A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> Agregar Canción a Tu Lista
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre de la Canción *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Hotel California"
                  className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Artista / Banda *
                </label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="ej. Eagles"
                  className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Álbum o Año (opcional)
                </label>
                <input
                  type="text"
                  value={newAlbum}
                  onChange={(e) => setNewAlbum(e.target.value)}
                  placeholder="ej. Hotel California (1976)"
                  className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Enlace o ID del video de YouTube *
                </label>
                <input
                  type="text"
                  value={newYoutubeId}
                  onChange={(e) => setNewYoutubeId(e.target.value)}
                  onBlur={handleYouTubeLinkBlur}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none"
                  required
                />
                <p className="mt-1 text-[10px] text-zinc-500">
                  Pega el enlace y sal del campo para completar título, canal e imagen automáticamente.
                  {isLookingUpVideo ? ' Consultando YouTube…' : ''}
                </p>
                {youtubeThumbnail && (
                  <p className="mt-1 text-[10px] text-emerald-400">Datos del video listos para agregar.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Categoría
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Song['category'])}
                  className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none"
                >
                  <option value="rock">Rock Clásico</option>
                  <option value="espanol">Rock en Español</option>
                  <option value="urbano">Urbano / Bocetos</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#2A2720]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-[#2A2720] text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="gold-button text-black font-extrabold text-xs px-6 py-2 rounded-full shadow"
                >
                  Guardar en mi lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
