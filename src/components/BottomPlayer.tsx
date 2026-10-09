import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  Volume1,
  VolumeX,
  Youtube,
  Music
} from 'lucide-react';
import { Song } from '../types';

interface BottomPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTimeSec: number;
  onSeek: (seconds: number) => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  isRepeat: boolean;
  onToggleRepeat: () => void;
  onToggleFavorite: (songId: string) => void;
  volume: number;
  onChangeVolume: (val: number) => void;
  onOpenYouTubeModal: () => void;
  isDockedVideoOpen: boolean;
  onToggleDockedVideo: () => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  currentTimeSec,
  onSeek,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  onToggleFavorite,
  volume,
  onChangeVolume,
  onOpenYouTubeModal,
  isDockedVideoOpen,
  onToggleDockedVideo,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const totalSec = currentSong.durationSec || 240;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#09090B]/98 backdrop-blur-xl border-t border-[#B8972E]/50 shadow-[0_-5px_30px_rgba(0,0,0,0.9)] px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        {/* Track Metadata & Heart Button */}
        <div className="flex items-center gap-3 w-full md:w-1/4 justify-between md:justify-start">
          <div className="relative group cursor-pointer" onClick={onOpenYouTubeModal}>
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/60 shadow-md group-hover:opacity-80 transition"
            />
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/15 px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                NEXT TRACK
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
                {currentSong.title}
              </h4>
            </div>
            <p className="text-[11px] text-zinc-400 truncate">
              {currentSong.artist} • {currentSong.album}
            </p>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(currentSong.id)}
            className="p-2 transition text-zinc-400 hover:text-[#D4AF37]"
            title={currentSong.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
            aria-label="Favorito"
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-125 ${
                currentSong.isFavorite
                  ? 'text-[#D4AF37] fill-[#D4AF37]'
                  : 'text-zinc-400 hover:text-[#F5D77F]'
              }`}
            />
          </button>
        </div>

        {/* Center Controls & Timeline Bar */}
        <div className="flex-1 max-w-xl w-full flex flex-col items-center">
          {/* Controls */}
          <div className="flex items-center gap-4 sm:gap-6 mb-1">
            <button
              onClick={onToggleShuffle}
              className={`transition p-1 ${
                isShuffle
                  ? 'text-[#F5D77F] font-bold'
                  : 'text-zinc-400 hover:text-[#F5D77F]'
              }`}
              title={isShuffle ? 'Modo Aleatorio: Activado' : 'Modo Aleatorio: Desactivado'}
              aria-label="Aleatorio"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrev}
              className="text-zinc-300 hover:text-[#F5D77F] transition p-1"
              title="Canción Anterior"
              aria-label="Canción Anterior"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full gold-button text-black flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95 transition"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="text-zinc-300 hover:text-[#F5D77F] transition p-1"
              title="Siguiente Canción"
              aria-label="Siguiente Canción"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`transition p-1 ${
                isRepeat
                  ? 'text-[#F5D77F] font-bold'
                  : 'text-zinc-400 hover:text-[#F5D77F]'
              }`}
              title={isRepeat ? 'Repetir Canción: Activado' : 'Repetir: Desactivado'}
              aria-label="Repetir"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Bar */}
          <div className="w-full flex items-center gap-3 text-[11px] font-mono text-zinc-400">
            <span className="w-9 text-right">{formatTime(currentTimeSec)}</span>
            <input
              type="range"
              min={0}
              max={totalSec}
              value={Math.min(currentTimeSec, totalSec)}
              onChange={(e) => onSeek(Number(e.target.value))}
              aria-label="Posición de reproducción"
              className="flex-1 h-1.5 accent-[#D4AF37] cursor-pointer"
            />
            <span className="w-9">{currentSong.duration}</span>
          </div>
        </div>

        {/* Right Volume & Direct YouTube Video Controls */}
        <div className="hidden md:flex items-center gap-2.5 w-1/4 justify-end">
          {/* Toggle Docked Mini Video */}
          <button
            onClick={onToggleDockedVideo}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition shadow ${
              isDockedVideoOpen
                ? 'bg-[#D4AF37] text-black border-[#F5D77F]'
                : 'bg-[#15151A] border-[#2A2720] hover:border-[#D4AF37] text-zinc-300'
            }`}
            title="Mostrar / Ocultar pantalla de video y audio flotante"
          >
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
            <span>{isDockedVideoOpen ? 'Ocultar Pantalla' : 'Ver Video'}</span>
          </button>

          {/* Fullscreen YouTube Video Modal Trigger */}
          <button
            onClick={onOpenYouTubeModal}
            className="p-1.5 rounded-full bg-red-600/15 border border-red-500/50 hover:bg-red-600 hover:text-white text-red-400 transition"
            title="Abrir Video en pantalla completa"
          >
            <Youtube className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChangeVolume(volume === 0 ? 80 : 0)}
              className="text-zinc-400 hover:text-[#F5D77F] transition p-1"
              aria-label="Silenciar / Activar sonido"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : volume < 50 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="w-16 accent-[#D4AF37] cursor-pointer h-1.5 bg-zinc-700 rounded-lg"
              title={`Volumen: ${volume}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
