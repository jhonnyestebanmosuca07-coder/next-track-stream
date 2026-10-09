import React from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  Flame,
  History,
  Music2,
  Youtube,
  Radio,
  ArrowRight,
  ListMusic,
  Mail
} from 'lucide-react';
import { Song, Artist, NavTab } from '../types';

interface InicioViewProps {
  songs: Song[];
  artists: Artist[];
  currentSong: Song;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onTogglePlay: () => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenArtist: (artistName: string) => void;
  onOpenYouTube: () => void;
}

export const InicioView: React.FC<InicioViewProps> = ({
  songs,
  artists,
  currentSong,
  isPlaying,
  onPlaySong,
  onTogglePlay,
  onSelectTab,
  onOpenArtist,
  onOpenYouTube,
}) => {
  // 5 canciones del Historial tal como figuran en el boceto 6 y referencia final
  const historySongs = songs
    .filter((s) => s.historyNum)
    .sort((a, b) => (a.historyNum || 0) - (b.historyNum || 0));

  // Top rock artists for the featured strip
  const featuredRockArtists = artists.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HERO BANNER: "Descubre el Rock Clásico" */}
      <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/50 bg-gradient-to-r from-black via-[#15151A] to-black p-6 md:p-10 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.2),transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[11px] font-bold text-[#F5D77F] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Descubre
            </span>
            <span className="text-xs text-zinc-400">
              Nueva Música &amp; Clásicos Inmortales
            </span>
          </div>

          <h1 className="font-['Cinzel'] text-2xl md:text-4xl lg:text-5xl font-black gold-gradient-text tracking-wide leading-tight mb-4">
            Descubre el Rock Clásico
          </h1>

          <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-6 font-light">
            Explora las guitarras más legendarias de todos los tiempos y los éxitos del momento en una sola plataforma. Escucha en vivo por YouTube y disfruta de playlists personalizadas por cada artista.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const queenSong = songs.find((s) => s.id === 'queen-bohemian') || songs[0];
                onPlaySong(queenSong);
              }}
              className="gold-button text-black font-extrabold text-xs sm:text-sm px-7 py-3 rounded-full flex items-center gap-2.5 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Explorar Ahora</span>
            </button>

            <button
              onClick={() => onSelectTab('playlists')}
              className="px-6 py-3 rounded-full border border-[#2A2720] hover:border-[#D4AF37] text-zinc-300 hover:text-[#F5D77F] text-xs sm:text-sm font-semibold transition bg-[#15151A]/60 backdrop-blur cursor-pointer"
            >
              Ver Playlists por Artista
            </button>
          </div>
        </div>

        {/* Vintage Cassette Graphic in Hero */}
        <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-60 h-36 border-2 border-[#D4AF37]/80 rounded-2xl bg-zinc-950/95 p-4 shadow-[0_0_25px_rgba(212,175,55,0.3)] cassette-rotate">
            <div className="w-full h-8 bg-[#B8972E]/30 rounded-lg border border-[#D4AF37] flex items-center justify-center text-[10px] font-['Cinzel'] font-bold text-[#FDE68A] uppercase tracking-widest truncate px-2">
              LEYENDAS DEL ROCK
            </div>
            <div className="flex items-center justify-around my-3">
              <div className="w-9 h-9 rounded-full border-2 border-dashed border-[#D4AF37] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#D4AF37] rounded-full" />
              </div>
              <div className="h-2 w-16 bg-zinc-800 rounded-full border border-[#8C701B]" />
              <div className="w-9 h-9 rounded-full border-2 border-dashed border-[#D4AF37] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#D4AF37] rounded-full" />
              </div>
            </div>
            <div className="text-[9px] text-center font-mono text-[#F5D77F]/80">
              SIDE A • NEXT TRACK 90 min
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: ARTISTAS DE ROCK & DESTACADOS (Boceto 1, 6 y Referencia) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#F5D77F]" />
            <h2 className="font-['Cinzel'] text-xl md:text-2xl font-bold text-zinc-100">
              Artistas de Rock &amp; Destacados
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('artistas')}
            className="text-xs font-bold text-[#F5D77F] hover:text-[#FDE68A] flex items-center gap-1 group border border-[#D4AF37]/30 px-3 py-1 rounded-full bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 transition cursor-pointer"
          >
            <span>ver todos</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 5 Circular Artist Cards matching the reference layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {featuredRockArtists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => onOpenArtist(artist.name)}
              className="group bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:-translate-y-1 text-center cursor-pointer"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 rounded-full overflow-hidden border-2 border-[#D4AF37]/60 p-1 group-hover:border-[#F5D77F] transition">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const song = songs.find((s) => s.artist.toLowerCase().includes(artist.name.toLowerCase()));
                    if (song) onPlaySong(song);
                  }}
                  className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#D4AF37] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-110"
                  title={`Reproducir ${artist.name}`}
                >
                  <Play className="w-4 h-4 fill-black" />
                </button>
              </div>
              <h3 className="font-['Cinzel'] font-bold text-sm text-[#FDE68A] group-hover:text-[#F5D77F] truncate">
                {artist.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 truncate">{artist.genre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: HISTORIAL RECIENTE & DISCO DE VINILO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historial Reciente (Items 1 al 5 como en Boceto 6 y Ref) */}
        <div className="lg:col-span-2 bg-[#15151A] border border-[#2A2720] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2A2720]">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#F5D77F]" />
              <h3 className="font-['Cinzel'] font-bold text-lg text-zinc-100">
                Historial Reciente
              </h3>
            </div>
            <span className="text-xs text-zinc-400">Tus últimas reproducciones</span>
          </div>

          <div className="space-y-2.5">
            {historySongs.map((song) => {
              const isCurrent = currentSong.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                    isCurrent
                      ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/60'
                      : 'bg-[#0F0F12] hover:bg-[#1E1E26] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 text-center font-['Cinzel'] font-bold text-sm ${
                        isCurrent ? 'text-[#F5D77F]' : 'text-zinc-500'
                      }`}
                    >
                      {song.historyNum}
                    </span>
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover border border-[#2A2720]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p
                          className={`text-xs font-bold truncate ${
                            isCurrent ? 'text-[#FDE68A]' : 'text-zinc-200'
                          }`}
                        >
                          {song.title}
                        </p>
                        {song.isFixedOrRemix && (
                          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 rounded px-1 py-0.2 shrink-0 flex items-center gap-0.5">
                            <span>⚡</span>
                            <span>OK</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-zinc-400">
                      {song.duration}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlaySong(song);
                        onOpenYouTube();
                      }}
                      className="p-1.5 rounded-full text-[#F5D77F] hover:bg-[#D4AF37]/20 transition"
                      title="Ver en YouTube"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) onTogglePlay();
                        else onPlaySong(song);
                      }}
                      className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center hover:scale-105 transition"
                      title="Reproducir"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-black" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disco de Vinilo Interactivo en Rotación */}
        <div className="bg-gradient-to-b from-[#15151A] to-[#09090B] border border-[#B8972E]/40 rounded-2xl p-5 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <div className="w-full text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5D77F]">
              En Rotación
            </span>
            <h4 className="font-['Cinzel'] font-bold text-base text-zinc-200 mt-0.5">
              Disco de Vinilo
            </h4>
          </div>

          <div
            onClick={onTogglePlay}
            className="my-6 relative cursor-pointer group"
            title="Haz clic para reproducir/pausar el vinilo"
          >
            {/* Spinning Vinyl Graphic */}
            <div
              className={`w-40 h-40 rounded-full border-4 border-zinc-800 bg-[radial-gradient(circle,#18181b_20%,#09090b_70%,#27272a_100%)] shadow-2xl flex items-center justify-center vinyl-spinning group-hover:scale-105 transition-transform ${
                isPlaying ? '' : 'paused'
              }`}
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-[#B8972E]/30 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-[#F5D77F] border-2 border-black" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="p-2 bg-black/60 rounded-full text-[#FDE68A]">
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </span>
            </div>
          </div>

          <div className="w-full bg-[#0F0F12] p-3 rounded-xl border border-[#2A2720] text-center">
            <p className="text-xs font-bold text-[#FDE68A] truncate">
              {currentSong.title}
            </p>
            <p className="text-[11px] text-zinc-400 truncate">
              {currentSong.artist}
            </p>
            <button
              onClick={onOpenYouTube}
              className="mt-2 text-[10px] text-red-400 hover:text-red-300 font-semibold flex items-center justify-center gap-1 w-full"
            >
              <Youtube className="w-3 h-3" />
              <span>Ver Video Oficial</span>
            </button>
          </div>
        </div>
      </div>

      {/* BANNER INFERIOR A PLAYLISTS Y CONTACTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div
          onClick={() => onSelectTab('playlists')}
          className="p-5 rounded-2xl bg-gradient-to-r from-[#15151A] to-[#1E1E26] border border-[#D4AF37]/40 hover:border-[#F5D77F] transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#F5D77F]">
              <ListMusic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Cinzel'] font-bold text-sm text-[#FDE68A]">
                Playlists Personalizadas
              </h4>
              <p className="text-xs text-zinc-400">
                Selecciones especiales por cada artista del catálogo
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#F5D77F] group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => onSelectTab('contacto')}
          className="p-5 rounded-2xl bg-gradient-to-r from-[#15151A] to-[#1E1E26] border border-[#2A2720] hover:border-[#D4AF37] transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-[#2A2720] flex items-center justify-center text-[#F5D77F]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Cinzel'] font-bold text-sm text-zinc-200 group-hover:text-[#FDE68A]">
                ¿Quieres sugerir una banda?
              </h4>
              <p className="text-xs text-zinc-400">
                Escríbenos en la sección de contacto sencilla
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-[#F5D77F] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
