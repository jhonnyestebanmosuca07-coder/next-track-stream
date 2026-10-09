import React, { useState, useEffect } from 'react';
import { Youtube, X, Minimize2, Maximize2, ExternalLink, RefreshCw } from 'lucide-react';
import { Song } from '../types';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
}

export const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  currentSong,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [useAlternative, setUseAlternative] = useState(false);

  useEffect(() => {
    setUseAlternative(false);
  }, [currentSong.id]);

  if (!isOpen) return null;

  const activeVideoId = useAlternative && currentSong.alternativeYoutubeId
    ? currentSong.alternativeYoutubeId
    : currentSong.youtubeId;

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-6 z-50 w-72 bg-[#15151A] border border-[#D4AF37] rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="p-2 bg-[#0F0F12] border-b border-[#2A2720] flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <Youtube className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-[11px] font-bold text-[#F5D77F] truncate">
              {currentSong.title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-zinc-400 hover:text-white"
              title="Maximizar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white"
              title="Cerrar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0`}
            title={`${currentSong.title} - Video YouTube`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#15151A] border-2 border-[#D4AF37]/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.4)] flex flex-col">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-[#0F0F12] border-b border-[#2A2720] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Youtube className="w-5 h-5 text-red-500 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-['Cinzel'] font-bold text-xs sm:text-sm text-[#F5D77F] truncate">
                {currentSong.artist} - {currentSong.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                {currentSong.album} • {useAlternative ? 'Versión Alternativa' : 'Video Oficial'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {currentSong.alternativeYoutubeId && (
              <button
                onClick={() => setUseAlternative(!useAlternative)}
                className="px-2.5 py-1 rounded-full bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] text-[#F5D77F] text-xs font-semibold flex items-center gap-1.5 transition"
                title="Probar versión alternativa"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{useAlternative ? 'Ver Original' : 'Cambiar Video'}</span>
              </button>
            )}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Minimizar a esquina"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${activeVideoId}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full text-zinc-400 hover:text-[#F5D77F] hover:bg-zinc-800 transition"
              title="Abrir en YouTube.com"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Cerrar Reproductor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded YouTube Iframe Player */}
        <div className="aspect-video w-full bg-black relative">
          <iframe
            key={`${currentSong.id}-${activeVideoId}`}
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0`}
            title={`${currentSong.title} - Video YouTube`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 bg-[#09090B] flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Reproducción Oficial YouTube en Vivo</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="px-3 py-1 rounded-full border border-[#2A2720] hover:border-[#D4AF37] text-zinc-300 text-xs transition"
            >
              Ver en segundo plano
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-full bg-[#D4AF37] hover:bg-[#F5D77F] text-black font-bold text-xs transition shadow"
            >
              Cerrar Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
