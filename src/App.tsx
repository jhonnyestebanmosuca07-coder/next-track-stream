/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { NavTab, Song, Artist, ArtistPlaylist, ContactMessage } from './types';
import { initialSongs, artistsList, artistPlaylists } from './data/musicData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomPlayer } from './components/BottomPlayer';
import { RightSidebarDecor } from './components/RightSidebarDecor';

// Page Views
import { InicioView } from './views/InicioView';
import { ExplorarView } from './views/ExplorarView';
import { ArtistasView } from './views/ArtistasView';
import { PlaylistsView } from './views/PlaylistsView';
import { ListasView } from './views/ListasView';
import { FavoritosView } from './views/FavoritosView';
import { PerfilView } from './views/PerfilView';
import { ContactoView } from './views/ContactoView';
import { InstagramView } from './views/InstagramView';
import { PersistentAudioPlayer } from './components/PersistentAudioPlayer';

import { CheckCircle, X, Info } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavTab>('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedArtistForPlaylist, setSelectedArtistForPlaylist] = useState<string | undefined>(undefined);

  // Music catalogue state
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(4); // Default Bohemian Rhapsody (index 4)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [seekRequest, setSeekRequest] = useState<{ seconds: number; id: number } | null>(null);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isDockedVideoOpen, setIsDockedVideoOpen] = useState<boolean>(true);

  // YouTube modal
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);

  // Profile
  const [userName, setUserName] = useState<string>('Juancho');

  // Contact messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Info modal (for footer links)
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  const currentSong = songs[currentSongIndex] || songs[0];

  // Show Toast Helper
  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Audio Handlers
  const handlePlaySong = (song: Song) => {
    const idx = songs.findIndex((s) => s.id === song.id);
    if (idx !== -1) {
      setCurrentSongIndex(idx);
      handleSeek(0);
      setIsPlaying(true);
      showToast(`Reproduciendo: ${song.title} - ${song.artist}`);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    showToast(!isPlaying ? 'Reproducción continuada' : 'Reproducción en pausa');
  };

  const handleNextSong = () => {
    let nextIndex: number;
    if (isShuffle) {
      nextIndex = songs.length > 1
        ? (currentSongIndex + 1 + Math.floor(Math.random() * (songs.length - 1))) % songs.length
        : currentSongIndex;
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }
    setCurrentSongIndex(nextIndex);
    handleSeek(0);
    setIsPlaying(true);
    const nextSong = songs[nextIndex];
    if (nextSong) {
      showToast(`Next Track: ${nextSong.title}`);
    }
  };

  const handlePrevSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    handleSeek(0);
    setIsPlaying(true);
    const prevSong = songs[prevIndex];
    if (prevSong) {
      showToast(`Anterior: ${prevSong.title}`);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTimeSec(seconds);
    setSeekRequest((previous) => ({
      seconds,
      id: (previous?.id ?? 0) + 1,
    }));
  };

  const handleSongEnded = () => {
    if (isRepeat) {
      handleSeek(0);
      setIsPlaying(true);
      return;
    }
    handleNextSong();
  };

  const handleToggleShuffle = () => {
    setIsShuffle((prev) => {
      const nextVal = !prev;
      showToast(nextVal ? 'Modo Aleatorio: Activado' : 'Modo Aleatorio: Desactivado');
      return nextVal;
    });
  };

  const handleToggleRepeat = () => {
    setIsRepeat((prev) => {
      const nextVal = !prev;
      showToast(nextVal ? 'Repetición: Activada' : 'Repetición: Desactivada');
      return nextVal;
    });
  };

  const handleToggleFavorite = (songId: string) => {
    setSongs((prev) =>
      prev.map((song) => {
        if (song.id === songId) {
          const updatedFav = !song.isFavorite;
          showToast(
            updatedFav
              ? `"${song.title}" añadida a tus Favoritos`
              : `"${song.title}" eliminada de tus Favoritos`
          );
          return { ...song, isFavorite: updatedFav };
        }
        return song;
      })
    );
  };

  const handleAddCustomSong = (newSong: Song) => {
    setSongs((prev) => [newSong, ...prev]);
    setCurrentSongIndex(0);
    handleSeek(0);
    setIsPlaying(true);
    showToast(`"${newSong.title}" agregada con éxito a tu catálogo y lista`);
  };

  const handleSendMessage = (msg: ContactMessage) => {
    setContactMessages((prev) => [msg, ...prev]);
    showToast(`¡Mensaje de ${msg.name} recibido! Revisaremos tu sugerencia.`);
  };

  const handleOpenArtistPlaylist = (artistId: string) => {
    setSelectedArtistForPlaylist(artistId);
    setCurrentTab('playlists');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArtist = (artistName: string) => {
    const matched = artistsList.find(
      (a) => a.name.toLowerCase() === artistName.toLowerCase()
    );
    if (matched) {
      handleOpenArtistPlaylist(matched.id);
    } else {
      setCurrentTab('artistas');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabSwitch = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const favoritesCount = songs.filter((s) => s.isFavorite).length;

  return (
    <div className="bg-[#09090B] text-zinc-100 font-sans min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabSwitch}
        favoritesCount={favoritesCount}
        userName={userName}
        songs={songs}
        onPlaySong={handlePlaySong}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* 2. MAIN LAYOUT: SIDEBAR + SCROLLABLE CONTENT + RIGHT VINYL DECK */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleTabSwitch}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          isPlaying={isPlaying}
        />

        {/* Center Main Content Page Views */}
        <main
          id="mainScrollArea"
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-36"
        >
          {/* VIEW: INICIO */}
          {currentTab === 'inicio' && (
            <InicioView
              songs={songs}
              artists={artistsList}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlaySong={handlePlaySong}
              onTogglePlay={handleTogglePlay}
              onSelectTab={handleTabSwitch}
              onOpenArtist={handleOpenArtist}
              onOpenYouTube={() => setIsYouTubeModalOpen(true)}
            />
          )}

          {/* VIEW: EXPLORAR */}
          {currentTab === 'explorar' && (
            <ExplorarView
              songs={songs}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onOpenYouTube={() => setIsYouTubeModalOpen(true)}
            />
          )}

          {/* VIEW: ARTISTAS */}
          {currentTab === 'artistas' && (
            <ArtistasView
              artists={artistsList}
              songs={songs}
              onPlaySong={handlePlaySong}
              onSelectArtistPlaylist={handleOpenArtistPlaylist}
              onOpenYouTube={() => setIsYouTubeModalOpen(true)}
            />
          )}

          {/* VIEW: PLAYLISTS POR ARTISTA */}
          {currentTab === 'playlists' && (
            <PlaylistsView
              playlists={artistPlaylists}
              songs={songs}
              selectedArtistId={selectedArtistForPlaylist}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onOpenYouTube={() => setIsYouTubeModalOpen(true)}
            />
          )}

          {/* VIEW: LISTAS / ÁLBUMES */}
          {currentTab === 'listas' && (
            <ListasView
              songs={songs}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onOpenYouTube={() => setIsYouTubeModalOpen(true)}
              onAddCustomSong={handleAddCustomSong}
            />
          )}

          {/* VIEW: FAVORITOS */}
          {currentTab === 'favoritos' && (
            <FavoritosView
              songs={songs}
              onPlaySong={handlePlaySong}
              onToggleFavorite={handleToggleFavorite}
              onOpenYouTube={() => setIsYouTubeModalOpen(true)}
            />
          )}

          {/* VIEW: PERFIL / AJUSTES */}
          {currentTab === 'perfil' && (
            <PerfilView
              userName={userName}
              onUpdateUserName={setUserName}
              favoritesCount={favoritesCount}
              onShowToast={showToast}
            />
          )}

          {/* VIEW: CONTACTO */}
          {currentTab === 'contacto' && (
            <ContactoView
              onSendMessage={handleSendMessage}
              messages={contactMessages}
              onOpenInstagram={() => handleTabSwitch('instagram')}
            />
          )}

          {/* VIEW: INSTAGRAM OFICIAL & CONTACTO DM */}
          {currentTab === 'instagram' && (
            <InstagramView
              onPlaySong={handlePlaySong}
              songs={songs}
              onShowToast={showToast}
            />
          )}

          {/* FOOTER GENERAL (Términos, Privacidad, Contacto rápido) */}
          <footer className="mt-16 pt-8 border-t border-[#2A2720] text-center text-xs text-zinc-400 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
              <button
                onClick={() =>
                  setInfoModal({
                    title: 'Términos de Uso',
                    content:
                      'Al utilizar Leyendas del Rock & Next Track accedes a una experiencia de audio y video en vivo impulsada por transmisiones oficiales de YouTube. Los derechos musicales pertenecen a sus respectivos autores y sellos discográficos.',
                  })
                }
                className="hover:text-[#F5D77F] transition cursor-pointer"
              >
                Términos de uso
              </button>
              <span className="text-zinc-700">•</span>
              <button
                onClick={() =>
                  setInfoModal({
                    title: 'Política de Privacidad',
                    content:
                      'Tus preferencias de reproducción, listas de artistas y mensajes de contacto se almacenan de forma local en tu sesión. No compartimos información personal con terceros.',
                  })
                }
                className="hover:text-[#F5D77F] transition cursor-pointer"
              >
                Política de uso
              </button>
              <span className="text-zinc-700">•</span>
              <button
                onClick={() =>
                  setInfoModal({
                    title: 'Diversidad Musical',
                    content:
                      'Nuestra plataforma abraza todos los caminos musicales: desde el hard rock británico y el grunge de Seattle, pasando por el rock en español sudamericano, hasta las vertientes urbanas contemporáneas.',
                  })
                }
                className="hover:text-[#F5D77F] transition cursor-pointer"
              >
                Diversidad
              </button>
              <span className="text-zinc-700">•</span>
              <button
                onClick={() => handleTabSwitch('instagram')}
                className="hover:text-[#F5D77F] transition cursor-pointer font-bold text-[#F5D77F]"
              >
                Instagram DM
              </button>
              <span className="text-zinc-700">•</span>
              <button
                onClick={() => handleTabSwitch('contacto')}
                className="hover:text-[#F5D77F] transition cursor-pointer font-bold text-[#D4AF37]"
              >
                Formulario de Contacto
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 font-light">
              © 2026 Leyendas del Rock &amp; Next Track. Diseñado en negro y dorado según los bocetos originales.
            </p>
          </footer>
        </main>

        {/* Right Vinyl & Cassette Deck for wide screens */}
        <RightSidebarDecor
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onOpenYouTube={() => setIsYouTubeModalOpen(true)}
        />
      </div>

      {/* 3. PERSISTENT LIVE AUDIO & DOCKED VIDEO PLAYER */}
      <PersistentAudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        volume={volume}
        isDockedVideoOpen={isDockedVideoOpen}
        isModalOpen={isYouTubeModalOpen}
        seekRequest={seekRequest}
        onTimeUpdate={setCurrentTimeSec}
        onPlaybackChange={setIsPlaying}
        onSongEnded={handleSongEnded}
        onCloseModal={() => setIsYouTubeModalOpen(false)}
        onToggleDockedVideo={() => setIsDockedVideoOpen((prev) => !prev)}
      />

      {/* 4. FIXED BOTTOM AUDIO & VIDEO PLAYER BAR ("NEXT TRACK") */}
      <BottomPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        currentTimeSec={currentTimeSec}
        onSeek={handleSeek}
        isShuffle={isShuffle}
        onToggleShuffle={handleToggleShuffle}
        isRepeat={isRepeat}
        onToggleRepeat={handleToggleRepeat}
        onToggleFavorite={handleToggleFavorite}
        volume={volume}
        onChangeVolume={setVolume}
        onOpenYouTubeModal={() => setIsYouTubeModalOpen(true)}
        isDockedVideoOpen={isDockedVideoOpen}
        onToggleDockedVideo={() => setIsDockedVideoOpen((prev) => !prev)}
      />

      {/* 5. GENERIC INFORMATION MODAL */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#15151A] border-2 border-[#D4AF37]/70 rounded-3xl w-full max-w-md p-6 shadow-[0_0_35px_rgba(212,175,55,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2720] pb-3">
              <h3 className="font-['Cinzel'] font-bold text-lg text-[#FDE68A] flex items-center gap-2">
                <Info className="w-5 h-5 text-[#D4AF37]" /> {infoModal.title}
              </h3>
              <button
                onClick={() => setInfoModal(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              {infoModal.content}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInfoModal(null)}
                className="gold-button text-black font-extrabold text-xs px-6 py-2 rounded-full cursor-pointer shadow"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 bg-[#15151A] border border-[#D4AF37] text-zinc-100 text-xs px-4 py-3 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center gap-2.5 animate-bounce-short">
          <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span className="font-medium text-zinc-200">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
