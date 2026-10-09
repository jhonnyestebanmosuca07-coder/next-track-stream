import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, ShieldCheck, X } from 'lucide-react';
import { Song } from '../types';
import { searchEmbeddableYouTubeVideos } from '../services/youtube';

interface YouTubePlayerInstance {
  destroy: () => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
}

interface YouTubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: { target: YouTubePlayerInstance }) => void;
        onStateChange: (event: { data: number; target: YouTubePlayerInstance }) => void;
        onError: (event: { data: number; target: YouTubePlayerInstance }) => void;
      };
    }
  ) => YouTubePlayerInstance;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApiPromise: Promise<void> | undefined;

const loadYouTubeApi = () => {
  if (window.YT?.Player) return Promise.resolve();
  if (youTubeApiPromise) return youTubeApiPromise;

  youTubeApiPromise = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    window.onYouTubeIframeAPIReady = resolve;

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => reject(new Error('No se pudo cargar el reproductor de YouTube.'));
      document.head.appendChild(script);
    }
  });

  return youTubeApiPromise;
};

interface PersistentAudioPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  volume: number;
  isDockedVideoOpen: boolean;
  isModalOpen: boolean;
  seekRequest: { seconds: number; id: number } | null;
  onTimeUpdate: (seconds: number) => void;
  onPlaybackChange: (isPlaying: boolean) => void;
  onSongEnded: () => void;
  onCloseModal: () => void;
  onToggleDockedVideo: () => void;
}

export const PersistentAudioPlayer: React.FC<PersistentAudioPlayerProps> = ({
  currentSong,
  isPlaying,
  volume,
  isDockedVideoOpen,
  isModalOpen,
  seekRequest,
  onTimeUpdate,
  onPlaybackChange,
  onSongEnded,
  onCloseModal,
  onToggleDockedVideo,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState(currentSong.youtubeId);
  const playerElementRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const latestPropsRef = useRef({ isPlaying, onPlaybackChange, onSongEnded, onTimeUpdate });
  const currentSongRef = useRef(currentSong);
  const fallbackAttemptedRef = useRef(false);
  const fallbackCandidatesRef = useRef<string[]>([]);

  useEffect(() => {
    currentSongRef.current = currentSong;
    fallbackAttemptedRef.current = false;
    fallbackCandidatesRef.current = [];
    setActiveVideoId(currentSong.youtubeId);
    setPlayerError(null);
  }, [currentSong.id]);

  useEffect(() => {
    latestPropsRef.current = { isPlaying, onPlaybackChange, onSongEnded, onTimeUpdate };
  }, [isPlaying, onPlaybackChange, onSongEnded, onTimeUpdate]);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi()
      .then(() => {
        if (cancelled || !playerElementRef.current || !window.YT) return;

        playerRef.current = new window.YT.Player(playerElementRef.current, {
          videoId: activeVideoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              playerRef.current = target;
              target.setVolume(volume);
              setIsReady(true);
            },
            onStateChange: ({ data, target }) => {
              if (data === 1) {
                latestPropsRef.current.onPlaybackChange(true);
                latestPropsRef.current.onTimeUpdate(target.getCurrentTime());
              } else if (data === 2) {
                latestPropsRef.current.onPlaybackChange(false);
              } else if (data === 0) {
                latestPropsRef.current.onSongEnded();
              }
            },
            onError: ({ data, target }) => {
              const needsReplacement = data === 2 || data === 100 || data === 101 || data === 150;
              if (needsReplacement) {
                const nextCandidate = fallbackCandidatesRef.current.shift();
                if (nextCandidate) {
                  setActiveVideoId(nextCandidate);
                  setPlayerError(null);
                  target.loadVideoById(nextCandidate);
                  return;
                }

                if (!fallbackAttemptedRef.current) {
                  fallbackAttemptedRef.current = true;
                  const failedSong = currentSongRef.current;
                  setPlayerError('Este video no permite inserción. Buscando una versión que sí permita reproducirse aquí…');
                  searchEmbeddableYouTubeVideos(failedSong.title, failedSong.artist)
                    .then((results) => {
                      if (currentSongRef.current.id !== failedSong.id) return;
                      const candidates = results
                        .filter((result) => result.videoId !== failedSong.youtubeId)
                        .map((result) => result.videoId);
                      if (candidates.length === 0) {
                        throw new Error('YouTube no encontró videos insertables para esta canción.');
                      }
                      fallbackCandidatesRef.current = candidates.slice(1);
                      setActiveVideoId(candidates[0]);
                      setPlayerError(null);
                      playerRef.current?.loadVideoById(candidates[0]);
                    })
                    .catch((error: unknown) => {
                      if (currentSongRef.current.id === failedSong.id) {
                        const message = error instanceof Error
                          ? error.message
                          : 'No se pudo buscar una versión insertable.';
                        setPlayerError(`${message} Abre el video original o revisa la API key.`);
                        latestPropsRef.current.onPlaybackChange(false);
                      }
                    });
                  return;
                }
              }

              const reason = data === 100
                  ? 'El video fue eliminado o es privado.'
                  : data === 101 || data === 150
                    ? 'YouTube tampoco permitió insertar las versiones alternativas encontradas.'
                  : data === 2
                    ? 'El enlace no contiene un ID de video válido.'
                    : data === 5
                      ? 'El reproductor HTML5 de YouTube no pudo cargar este video.'
                      : data === 153
                        ? 'YouTube no pudo verificar el origen de esta reproducción.'
                        : `YouTube no pudo reproducir este video (error ${data}).`;
              setPlayerError(reason);
              latestPropsRef.current.onPlaybackChange(false);
            },
          },
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPlayerError(error instanceof Error ? error.message : 'No se pudo iniciar YouTube.');
        }
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    setPlayerError(null);
    if (isPlaying) playerRef.current.loadVideoById(activeVideoId);
    else playerRef.current.cueVideoById(activeVideoId);
    onTimeUpdate(0);
  }, [activeVideoId, currentSong.id, isReady]);

  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    if (isPlaying) playerRef.current.playVideo();
    else playerRef.current.pauseVideo();
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (isReady) playerRef.current?.setVolume(volume);
  }, [isReady, volume]);

  useEffect(() => {
    const player = playerRef.current;
    if (!seekRequest || !player) return;
    const wasEnded = player.getPlayerState() === 0;
    player.seekTo(seekRequest.seconds, true);
    if (wasEnded) player.playVideo();
  }, [seekRequest]);

  useEffect(() => {
    if (!isPlaying || !isReady) return;
    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (player?.getPlayerState() === 1) {
        const time = player.getCurrentTime();
        if (Number.isFinite(time)) onTimeUpdate(time);
      }
    }, 500);
    return () => window.clearInterval(interval);
  }, [isPlaying, isReady, onTimeUpdate]);

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md"
          onClick={onCloseModal}
        />
      )}
      <div
        className={`fixed transition-all duration-300 ${
          isModalOpen
            ? 'z-50 inset-3 sm:inset-8 lg:inset-14 m-auto max-w-5xl max-h-[calc(100vh-1.5rem)] rounded-3xl overflow-hidden border-2 border-[#D4AF37]/80 shadow-[0_0_40px_rgba(212,175,55,0.4)] bg-[#15151A]'
            : `z-40 bottom-24 right-4 sm:right-8 ${
                isDockedVideoOpen
                  ? 'w-80 sm:w-96 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_10px_45px_rgba(0,0,0,0.95)] bg-[#15151A]'
                  : 'w-72 rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-[0_8px_30px_rgba(0,0,0,0.85)] bg-[#15151A]'
              }`
        }`}
      >
        {/* Header Bar */}
        <div className="p-2.5 bg-[#0F0F12] border-b border-[#2A2720] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-['Cinzel'] font-bold text-[#F5D77F] truncate">
              {currentSong.artist} - {currentSong.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isModalOpen ? (
              <button
                onClick={onCloseModal}
                className="text-zinc-400 hover:text-white p-1"
                title="Cerrar reproductor"
                aria-label="Cerrar reproductor"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onToggleDockedVideo}
                className="text-xs text-[#D4AF37] hover:text-white px-2 py-0.5 rounded-full bg-[#1A1813] border border-[#D4AF37]/40 flex items-center gap-1 transition"
                title={isDockedVideoOpen ? 'Minimizar a reproductor de audio' : 'Expandir video'}
              >
                {isDockedVideoOpen ? 'Minimizar ⤓' : 'Expandir 📺'}
              </button>
            )}
            <a
              href={`https://www.youtube.com/watch?v=${activeVideoId}`}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-[#F5D77F] p-1"
              title="Abrir en YouTube directamente"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Video Iframe Container - kept alive and active in both states to preserve pure YouTube audio */}
        <div className={isDockedVideoOpen || isModalOpen ? 'aspect-video w-full bg-black relative' : 'w-full h-28 bg-black relative'}>
          <div
            ref={playerElementRef}
            className={`w-full h-full [&>iframe]:!w-full [&>iframe]:!h-full ${playerError ? 'invisible' : ''}`}
          />
          {playerError && (
            <div id="menu-error-youtube" role="alert" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/95 p-4 text-center text-xs text-zinc-200">
              <span>{playerError}</span>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#F5D77F] underline"
              >
                Probar esta versión en YouTube
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${currentSong.artist} ${currentSong.title} official`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#F5D77F] underline"
              >
                Buscar otra versión oficial
              </a>
              <a
                href={`https://soundcloud.com/search/sounds?q=${encodeURIComponent(`${currentSong.artist} ${currentSong.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#F5D77F] underline"
              >
                Buscar en SoundCloud
              </a>
            </div>
          )}
        </div>

        {/* Control Footer */}
        <div className="p-2.5 bg-[#09090B] flex flex-col gap-1.5 text-[11px] text-zinc-400">
          {/* Version status and switch button */}
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1.5 text-[#F5D77F] font-semibold text-[10px] sm:text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[170px]">
                {activeVideoId === currentSong.youtubeId ? 'Reproductor oficial de YouTube' : 'Video alternativo insertable'}
              </span>
            </span>

          </div>
        </div>
      </div>
    </>
  );
};
