import React, { useState } from 'react';
import { Disc, Search, Heart, User, Menu, X, Mail, ListMusic, Play, Instagram } from 'lucide-react';
import { NavTab, Song } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
  userName: string;
  songs: Song[];
  onPlaySong: (song: Song) => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  userName,
  songs,
  onPlaySong,
  onOpenMobileMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredSongs = searchQuery.trim()
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.album.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-[#2A2720] px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden text-zinc-400 hover:text-[#F5D77F] p-1.5 focus:outline-none transition"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div
          onClick={() => onSelectTab('inicio')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/80 bg-zinc-900 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform">
            <Disc className="w-6 h-6 text-[#F5D77F] animate-[spin_10s_linear_infinite]" />
          </div>
          <div className="leading-none">
            <span className="font-['Cinzel'] font-bold text-lg md:text-xl tracking-wider gold-gradient-text block">
              LEYENDAS DEL ROCK
            </span>
            <span className="text-[10px] tracking-widest text-[#F5D77F]/70 uppercase font-medium">
              Next Track Stream
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Bar with instant search dropdown */}
      <div className="flex-1 max-w-xl mx-2 hidden sm:block relative">
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#D4AF37] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Busca tu canción o artista aquí... (ej. Bohemian, Nirvana, Tren al Sur)"
            className="w-full bg-[#15151A] border border-[#2A2720] hover:border-[#8C701B] focus:border-[#D4AF37] rounded-full pl-11 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#15151A] border border-[#D4AF37]/60 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden z-50 max-h-80 overflow-y-auto">
            <div className="p-2 border-b border-[#2A2720] flex items-center justify-between text-xs text-zinc-400">
              <span>Resultados para "{searchQuery}" ({filteredSongs.length})</span>
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-zinc-500 hover:text-zinc-200"
              >
                Cerrar
              </button>
            </div>
            {filteredSongs.length > 0 ? (
              <div className="divide-y divide-[#2A2720]/60">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => {
                      onPlaySong(song);
                      setShowSearchResults(false);
                    }}
                    className="p-3 flex items-center justify-between hover:bg-[#1E1E26] cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-9 h-9 rounded-lg object-cover border border-[#2A2720]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-100 group-hover:text-[#F5D77F] truncate">
                          {song.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {song.artist} • {song.album}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-500">{song.duration}</span>
                      <button
                        className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center opacity-80 group-hover:opacity-100 transition shadow"
                        title="Reproducir ahora"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-zinc-400">
                No se encontraron canciones con ese nombre. Prueba con "Queen", "AC/DC", "Feid" o "Tren al Sur".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Playlists Shortcut */}
        <button
          onClick={() => onSelectTab('playlists')}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
            currentTab === 'playlists'
              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5D77F]'
              : 'bg-[#15151A] border-[#2A2720] text-zinc-300 hover:border-[#D4AF37]/50 hover:text-[#F5D77F]'
          }`}
          title="Playlists por Artista"
        >
          <ListMusic className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Playlists</span>
        </button>

        {/* Instagram Contacto Directo */}
        <button
          onClick={() => onSelectTab('instagram')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
            currentTab === 'instagram'
              ? 'bg-gradient-to-r from-[#B8972E] to-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'bg-[#15151A] border-[#2A2720] text-zinc-300 hover:border-[#D4AF37]/50 hover:text-[#F5D77F]'
          }`}
          title="Instagram Oficial & Contacto DM"
        >
          <Instagram className="w-3.5 h-3.5 text-[#F5D77F]" />
          <span className="hidden sm:inline">Instagram</span>
        </button>

        {/* Contacto Button (Solicitado explícitamente en el prompt) */}
        <button
          onClick={() => onSelectTab('contacto')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
            currentTab === 'contacto'
              ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'bg-[#15151A] border-[#2A2720] text-zinc-300 hover:border-[#D4AF37]/50 hover:text-[#F5D77F]'
          }`}
          title="Formulario de Contacto"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Contacto</span>
        </button>

        {/* Favoritos Shortcut */}
        <button
          onClick={() => onSelectTab('favoritos')}
          className={`relative p-2 rounded-full border transition ${
            currentTab === 'favoritos'
              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
              : 'bg-[#15151A] border-[#2A2720] text-zinc-300 hover:border-[#D4AF37]/50 hover:text-[#F5D77F]'
          }`}
          title="Ver Favoritos"
        >
          <Heart className="w-4 h-4 fill-current" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Perfil Button */}
        <button
          onClick={() => onSelectTab('perfil')}
          className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition group ${
            currentTab === 'perfil'
              ? 'bg-[#D4AF37]/15 border-[#D4AF37]'
              : 'bg-[#15151A] border-[#2A2720] hover:border-[#D4AF37]/50'
          }`}
          title="Mi Biblioteca / Perfil"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8C701B] to-[#F5D77F] flex items-center justify-center text-black font-bold text-xs ring-1 ring-zinc-900">
            <User className="w-4 h-4 text-black" />
          </div>
          <span className="text-xs font-medium text-zinc-300 group-hover:text-[#F5D77F] hidden md:inline truncate max-w-[80px]">
            {userName}
          </span>
        </button>
      </div>
    </header>
  );
};
