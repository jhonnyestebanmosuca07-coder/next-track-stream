import React from 'react';
import {
  Home,
  Compass,
  Users,
  ListMusic,
  Disc3,
  Library,
  Mail,
  ChevronRight,
  Guitar,
  X,
  Volume2,
  Instagram
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isPlaying: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  isPlaying,
}) => {
  const navItems = [
    { id: 'inicio' as NavTab, label: 'Inicio', icon: Home },
    { id: 'explorar' as NavTab, label: 'Explorar', icon: Compass },
    { id: 'artistas' as NavTab, label: 'Artistas', icon: Users },
    { id: 'playlists' as NavTab, label: 'Playlists por Artista', icon: ListMusic },
    { id: 'listas' as NavTab, label: 'Listas / Álbumes', icon: Disc3 },
    { id: 'perfil' as NavTab, label: 'Mi Biblioteca / Perfil', icon: Library },
    { id: 'instagram' as NavTab, label: 'Instagram Oficial', icon: Instagram },
    { id: 'contacto' as NavTab, label: 'Contacto', icon: Mail },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0F0F12] border-r border-[#2A2720] flex flex-col justify-between p-4 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Mobile Header with close button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-[#2A2720]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5D77F]">
              Menú Principal
            </span>
            <button
              onClick={onCloseMobile}
              className="text-zinc-400 hover:text-white p-1"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition text-left ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.35)]'
                      : 'text-zinc-400 hover:text-[#F5D77F] hover:bg-[#15151A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Gold Filter Pill Buttons (Bocetos 1 al 6: Artistas, Géneros, Playlist) */}
          <div className="pt-4 border-t border-[#2A2720]/60">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-2 mb-3">
              Filtros Rápidos
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onSelectTab('artistas');
                  onCloseMobile();
                }}
                className="gold-button text-black font-bold text-xs py-2 px-4 rounded-full flex items-center justify-between cursor-pointer"
              >
                <span>Artistas</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onSelectTab('explorar');
                  onCloseMobile();
                }}
                className="gold-button text-black font-bold text-xs py-2 px-4 rounded-full flex items-center justify-between cursor-pointer"
              >
                <span>Géneros</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onSelectTab('playlists');
                  onCloseMobile();
                }}
                className="gold-button text-black font-bold text-xs py-2 px-4 rounded-full flex items-center justify-between cursor-pointer"
              >
                <span>Playlists</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slogan Card: "tu música tu camino" con ecualizador animado */}
          <div className="p-3.5 rounded-2xl bg-[#15151A] border border-[#B8972E]/40 relative overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Guitar className="w-4 h-4 text-[#F5D77F]" />
                <span className="text-xs font-['Cinzel'] font-bold text-[#FDE68A]">
                  Next Sound
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-[#D4AF37] font-mono">
                <Volume2 className="w-3 h-3" />
                {isPlaying ? 'ON' : 'PAUSA'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 h-10 my-1 bg-[#09090B]/80 rounded-lg p-2 border border-[#2A2720]">
              <div
                className={`w-1 bg-[#F5D77F] rounded-full ${
                  isPlaying ? 'audio-bar' : 'h-1'
                }`}
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className={`w-1 bg-[#F5D77F] rounded-full ${
                  isPlaying ? 'audio-bar' : 'h-2'
                }`}
                style={{ animationDelay: '0.3s' }}
              />
              <div
                className={`w-1 bg-[#D4AF37] rounded-full ${
                  isPlaying ? 'audio-bar' : 'h-3'
                }`}
                style={{ animationDelay: '0.5s' }}
              />
              <div
                className={`w-1 bg-[#B8972E] rounded-full ${
                  isPlaying ? 'audio-bar' : 'h-1.5'
                }`}
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className={`w-1 bg-[#F5D77F] rounded-full ${
                  isPlaying ? 'audio-bar' : 'h-4'
                }`}
                style={{ animationDelay: '0.4s' }}
              />
              <div
                className={`w-1 bg-[#FDE68A] rounded-full ${
                  isPlaying ? 'audio-bar' : 'h-2'
                }`}
                style={{ animationDelay: '0.6s' }}
              />
              <div
                className={`w-1 bg-[#D4AF37] rounded-full ${
                  isPlaying ? 'audio-bar' : 'h-3.5'
                }`}
                style={{ animationDelay: '0.25s' }}
              />
            </div>

            <p className="font-['Cinzel'] text-center text-xs text-[#F5D77F] font-semibold tracking-wide mt-2">
              "tu música tu camino"
            </p>
          </div>
        </div>

        {/* Footer Quick Info */}
        <div className="pt-4 border-t border-[#2A2720]/60 text-[11px] text-zinc-500 text-center">
          <p className="text-zinc-400 font-medium">Leyendas del Rock • Next Track</p>
          <span className="text-[10px] text-zinc-600">Audio High-Res • YouTube API</span>
        </div>
      </aside>
    </>
  );
};
