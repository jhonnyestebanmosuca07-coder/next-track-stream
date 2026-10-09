import React, { useState } from 'react';
import {
  User,
  Camera,
  ShieldCheck,
  Sliders,
  Bell,
  LogOut,
  CheckCircle,
  Sparkles,
  Flame,
  Palette
} from 'lucide-react';

interface PerfilViewProps {
  userName: string;
  onUpdateUserName: (name: string) => void;
  favoritesCount: number;
  onShowToast: (msg: string) => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  userName,
  onUpdateUserName,
  favoritesCount,
  onShowToast,
}) => {
  const [profileName, setProfileName] = useState(userName);
  const [profileUser, setProfileUser] = useState('juancho_rock');
  const [selectedColor, setSelectedColor] = useState('#D4AF37');
  const [privateSession, setPrivateSession] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [soundNorm, setSoundNorm] = useState(85);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );

  const colors = [
    { name: 'Oro Imperial', hex: '#D4AF37' },
    { name: 'Oro Champán', hex: '#F5D77F' },
    { name: 'Bronce Antiguo', hex: '#B8972E' },
    { name: 'Plata Titán', hex: '#E5E7EB' },
    { name: 'Rojo Fuego', hex: '#EF4444' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserName(profileName);
    onShowToast('Ajustes de perfil y cuenta guardados correctamente');
  };

  const handleChangeAvatar = () => {
    const urls = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    ];
    const nextIdx = (urls.indexOf(avatarUrl) + 1) % urls.length;
    setAvatarUrl(urls[nextIdx]);
    onShowToast('Avatar actualizado');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-[#2A2720] flex items-center justify-between">
        <div>
          <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold gold-gradient-text">
            Mi Biblioteca / Perfil
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configuración esquematizada en el Boceto 5: Cuenta, Privacidad, Reproducción y Notificaciones.
          </p>
        </div>
        <span className="px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D77F] rounded-full text-xs font-bold">
          VIP Master
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Tarjeta de Identidad (Boceto 5: "Nombre: Juancho") */}
        <div className="bg-[#15151A] border border-[#D4AF37]/40 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full border-2 border-[#D4AF37] p-1 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <img
                src={avatarUrl}
                alt={profileName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button
              onClick={handleChangeAvatar}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-[#D4AF37] text-black hover:bg-[#F5D77F] transition shadow-md"
              title="Cambiar Foto"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-['Cinzel'] font-bold text-xl text-zinc-100">
            {profileName}
          </h3>
          <p className="text-xs text-[#F5D77F] font-mono mt-0.5">
            @{profileUser}
          </p>
          <p className="text-xs text-zinc-400 mt-2 px-4 font-light">
            Amante del rock clásico y las leyendas de los años 80 y 90.
          </p>

          <div className="w-full border-t border-[#2A2720] mt-6 pt-5 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Canciones favoritas:</span>
              <span className="font-bold text-[#F5D77F]">{favoritesCount} temas</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Playlists creadas:</span>
              <span className="font-bold text-[#F5D77F]">12 listas</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Calidad de audio:</span>
              <span className="font-bold text-emerald-400">Master 24-bit / 96kHz</span>
            </div>
          </div>

          <button
            onClick={() => onShowToast('Sesión de usuario activa. No se requiere desconexión.')}
            className="mt-8 w-full py-2.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Columna Derecha: Configuración (Boceto 5) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Cuenta (Nombre, Usuario, Color de fondo/tema) */}
            <div className="bg-[#15151A] border border-[#2A2720] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A2720]">
                <User className="w-4 h-4 text-[#F5D77F]" />
                <h4 className="font-['Cinzel'] font-bold text-sm sm:text-base text-zinc-100">
                  1. Cuenta &amp; Identidad (Boceto 5)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    value={profileUser}
                    onChange={(e) => setProfileUser(e.target.value)}
                    className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Color para fondo / tema
                  </label>
                  <div className="flex items-center gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => {
                          setSelectedColor(c.hex);
                          onShowToast(`Tema acentuado con ${c.name}`);
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor === c.hex
                            ? 'scale-110 border-white ring-2 ring-[#D4AF37]'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <span className="text-xs text-zinc-400 font-mono ml-2">
                      {colors.find((c) => c.hex === selectedColor)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Privacidad (Sesión privada, Perfil público) */}
            <div className="bg-[#15151A] border border-[#2A2720] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A2720]">
                <ShieldCheck className="w-4 h-4 text-[#F5D77F]" />
                <h4 className="font-['Cinzel'] font-bold text-sm sm:text-base text-zinc-100">
                  2. Privacidad
                </h4>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720] cursor-pointer hover:border-[#D4AF37]/50 transition">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      Sesión Privada
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Ocultar lo que estás escuchando en tu red de amigos
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={privateSession}
                    onChange={(e) => setPrivateSession(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720] cursor-pointer hover:border-[#D4AF37]/50 transition">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      Perfil Público
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Permitir que otros vean tus listas y bandas favoritas
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 3. Reproducción (Autoplay, Sonido) */}
            <div className="bg-[#15151A] border border-[#2A2720] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A2720]">
                <Sliders className="w-4 h-4 text-[#F5D77F]" />
                <h4 className="font-['Cinzel'] font-bold text-sm sm:text-base text-zinc-100">
                  3. Reproducción
                </h4>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720] cursor-pointer hover:border-[#D4AF37]/50 transition">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      Autoplay Continuo
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Reproducir automáticamente el siguiente tema de la banda
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                </label>

                <div className="p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720]">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-1.5">
                    <span>Normalización de Sonido Hi-Fi</span>
                    <span className="text-[#F5D77F] font-mono">{soundNorm}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundNorm}
                    onChange={(e) => setSoundNorm(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 4. Notificaciones (Push, Correos) */}
            <div className="bg-[#15151A] border border-[#2A2720] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A2720]">
                <Bell className="w-4 h-4 text-[#F5D77F]" />
                <h4 className="font-['Cinzel'] font-bold text-sm sm:text-base text-zinc-100">
                  4. Notificaciones
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720] cursor-pointer hover:border-[#D4AF37]/50 transition">
                  <span className="text-xs font-semibold text-zinc-300">
                    Notificaciones Push
                  </span>
                  <input
                    type="checkbox"
                    checked={pushNotif}
                    onChange={(e) => setPushNotif(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720] cursor-pointer hover:border-[#D4AF37]/50 transition">
                  <span className="text-xs font-semibold text-zinc-300">
                    Boletín de Rock por Correo
                  </span>
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="gold-button text-black font-extrabold text-xs sm:text-sm px-8 py-3 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                Guardar Ajustes de Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
