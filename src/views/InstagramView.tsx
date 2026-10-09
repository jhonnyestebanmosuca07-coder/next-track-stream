import React, { useState } from 'react';
import {
  Instagram,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Share2,
  Grid,
  Film,
  Sparkles,
  CheckCircle,
  Plus,
  Play,
  Volume2,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { InstagramPost, InstagramDM, Song } from '../types';

interface InstagramViewProps {
  onPlaySong: (song: Song) => void;
  songs: Song[];
  onShowToast: (msg: string) => void;
}

export const InstagramView: React.FC<InstagramViewProps> = ({
  onPlaySong,
  songs,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'dms' | 'reels'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(128450);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [postComments, setPostComments] = useState<{ [postId: string]: string[] }>({
    'post-1': ['¡Bohemian Rhapsody nunca pasa de moda!', 'El solo de guitarra es magistral 🔥'],
    'post-2': ['Kurt Cobain eterno 🖤', 'Grunge en su máxima expresión'],
    'post-3': ['El vinilo dorado se ve increíble en el reproductor ✨'],
  });

  // Direct Messages state
  const [dms, setDms] = useState<InstagramDM[]>([
    {
      id: 'dm-1',
      sender: 'leyendas',
      text: '¡Hola! Bienvenido al canal oficial de Instagram de Leyendas del Rock & Next Track 🎸. ¿Qué banda o canción te gustaría que sumemos al reproductor?',
      time: '18:20',
    },
  ]);
  const [dmInput, setDmInput] = useState('');

  // Initial Posts
  const [posts, setPosts] = useState<InstagramPost[]>([
    {
      id: 'post-1',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      caption: '👑 Freddie Mercury en su máxima gloria. Bohemian Rhapsody sigue vibrando en el reproductor como el primer día. ¿Cuál es tu estrofa favorita? #Queen #RockLegend #LeyendasDelRock',
      likes: 14230,
      commentsCount: 342,
      date: 'HACE 2 HORAS',
      isLiked: false,
    },
    {
      id: 'post-2',
      imageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80',
      caption: '⚡ Smells Like Teen Spirit: el himno de los 90s que cambió el mundo para siempre. Disponible en nuestra playlist personalizada de Nirvana. 🎸 #Nirvana #Grunge #SeattleSound',
      likes: 18940,
      commentsCount: 512,
      date: 'HACE 6 HORAS',
      isLiked: true,
    },
    {
      id: 'post-3',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      caption: '📀 El disco de vinilo dorado VIP ya está girando. Escucha Tren al Sur, Mujer Amante y los clásicos en alta definición. #VinylCommunity #Audiophile #NextTrack',
      likes: 9840,
      commentsCount: 184,
      date: 'HACE 1 DÍA',
      isLiked: false,
    },
    {
      id: 'post-4',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      caption: '🔥 Guns N Roses en vivo: el solo inmortal de Sweet Child O Mine y la potencia de Axl Rose. ¡Pide tu tema por DM! 🌹🎸 #Slash #GunsNRoses #ClassicRock',
      likes: 22100,
      commentsCount: 689,
      date: 'HACE 2 DÍAS',
      isLiked: false,
    },
    {
      id: 'post-5',
      imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80',
      caption: '🤘 AC/DC: Riffs electrizantes que atraviesan generaciones. Highway to Hell y Back in Black en rotación continua. #ACDC #HardRock #AngusYoung',
      likes: 16500,
      commentsCount: 390,
      date: 'HACE 3 DÍAS',
      isLiked: false,
    },
    {
      id: 'post-6',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      caption: '🇨🇱 Tren al Sur de Los Prisioneros: himno del rock en español sudamericano incluido en nuestro historial número 1. #RockEnEspañol #LosPrisioneros',
      likes: 13420,
      commentsCount: 295,
      date: 'HACE 4 DÍAS',
      isLiked: false,
    },
  ]);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      setFollowersCount((c) => (next ? c + 1 : c - 1));
      onShowToast(next ? '¡Ahora sigues a @leyendasdelrock_oficial!' : 'Dejaste de seguir la cuenta');
      return next;
    });
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput.trim()],
    }));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
    setCommentInput('');
    onShowToast('Comentario publicado en Instagram');
  };

  const handleSendDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInput.trim()) return;

    const userMessage: InstagramDM = {
      id: 'dm-' + Date.now(),
      sender: 'user',
      text: dmInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDms((prev) => [...prev, userMessage]);
    setDmInput('');

    // Automatic reply from the rock account
    setTimeout(() => {
      const replyMessage: InstagramDM = {
        id: 'dm-reply-' + Date.now(),
        sender: 'leyendas',
        text: '¡Muchas gracias por contactarnos vía Instagram! 🤘 Hemos anotado tu solicitud de banda/canción en nuestra lista de producción. ¡Disfruta el rock!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDms((prev) => [...prev, replyMessage]);
    }, 1200);
  };

  const stories = [
    { name: 'Rock 70s 🤘', img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=200&q=80' },
    { name: 'Vinilos 📀', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80' },
    { name: 'Conciertos ⚡', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=80' },
    { name: 'Playlists 🎶', img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=200&q=80' },
    { name: 'Bocetos 📝', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* 1. INSTAGRAM PROFILE HEADER (LUXURY BLACK & GOLD) */}
      <div className="bg-[#15151A] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          {/* Avatar with Golden Story Ring */}
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#8C701B] via-[#D4AF37] to-[#FFF1B8] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-black">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80"
                  alt="Leyendas del Rock"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center border-2 border-[#15151A]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* User Info & Bio */}
          <div className="flex-1 text-center sm:text-left space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="font-['Cinzel'] font-black text-lg sm:text-xl text-zinc-100 tracking-wide">
                  leyendasdelrock_oficial
                </h2>
                <span className="p-0.5 rounded-full bg-[#D4AF37] text-black" title="Cuenta Oficial Verificada">
                  <CheckCircle className="w-4 h-4 fill-black text-[#D4AF37]" />
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 pt-1 sm:pt-0">
                <button
                  onClick={handleToggleFollow}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                    isFollowing
                      ? 'bg-[#1E1E26] border border-[#2A2720] text-zinc-200'
                      : 'gold-button text-black font-extrabold'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Siguiendo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Seguir</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveSubTab('dms')}
                  className="px-4 py-1.5 rounded-full bg-[#0F0F12] border border-[#D4AF37]/60 hover:border-[#F5D77F] text-[#F5D77F] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar DM</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    onShowToast('Enlace de Instagram copiado al portapapeles');
                  }}
                  className="p-2 rounded-full bg-[#0F0F12] border border-[#2A2720] hover:border-[#D4AF37] text-zinc-300 transition"
                  title="Compartir perfil"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-6 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-zinc-100">{posts.length}</span>{' '}
                <span className="text-zinc-400">publicaciones</span>
              </div>
              <div>
                <span className="font-bold text-[#F5D77F]">
                  {(followersCount / 1000).toFixed(1)}k
                </span>{' '}
                <span className="text-zinc-400">seguidores</span>
              </div>
              <div>
                <span className="font-bold text-zinc-100">84</span>{' '}
                <span className="text-zinc-400">siguiendo</span>
              </div>
            </div>

            {/* Bio text */}
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light space-y-1">
              <p className="font-bold text-[#FDE68A]">
                🎸 LEYENDAS DEL ROCK &amp; NEXT TRACK
              </p>
              <p>👑 El hogar de las guitarras inmortales y los ritmos de tu camino.</p>
              <p>⚡ Queen • Nirvana • AC/DC • Guns N' Roses • Rock en Español &amp; Éxitos.</p>
              <p className="text-[#D4AF37] font-medium">
                📩 ¡Contáctanos por DM en esta pestaña para pedir bandas o colaborar!
              </p>
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pt-6 mt-6 border-t border-[#2A2720] scrollbar-none">
          {stories.map((st, i) => (
            <div
              key={i}
              onClick={() => onShowToast(`Abriendo historia: ${st.name}`)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#8C701B] to-[#F5D77F] group-hover:scale-105 transition-transform">
                <img
                  src={st.img}
                  alt={st.name}
                  className="w-full h-full object-cover rounded-full border border-black"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] text-zinc-300 font-medium truncate max-w-[70px]">
                {st.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SUB-NAV TABS: PUBLICACIONES / MENSAJES DIRECTOS (CONTACTO) / REELS */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 border-b border-[#2A2720] pb-2">
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'posts'
              ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-zinc-400 hover:text-[#F5D77F]'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Publicaciones</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dms')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'dms'
              ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-zinc-400 hover:text-[#F5D77F]'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat DM / Contacto Directo</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveSubTab('reels')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'reels'
              ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-zinc-400 hover:text-[#F5D77F]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels de Rock</span>
        </button>
      </div>

      {/* 3. VIEW: PUBLICACIONES (GRID CON MODAL DE DETALLE) */}
      {activeSubTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] group cursor-pointer shadow-md transition-all duration-300"
            >
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {/* Overlay with Likes & Comments */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  {post.commentsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. VIEW: MENSAJES DIRECTOS / CONTACTO INSTAGRAM DM (Chat Interactivo en Vivo) */}
      {activeSubTab === 'dms' && (
        <div className="bg-[#15151A] border border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.2)] flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="p-4 bg-[#0F0F12] border-b border-[#2A2720] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] p-0.5">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80"
                  alt="DM"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Cinzel'] font-bold text-xs sm:text-sm text-zinc-100">
                    leyendasdelrock_oficial
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <span className="text-[10px] text-emerald-400 block font-mono">
                  En línea • Soporte de Contacto Instantáneo
                </span>
              </div>
            </div>

            <span className="text-[11px] text-zinc-400 bg-[#15151A] px-3 py-1 rounded-full border border-[#2A2720]">
              Instagram Direct
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#09090B]">
            {dms.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#B8972E] to-[#D4AF37] text-black font-medium rounded-br-xs'
                      : 'bg-[#15151A] border border-[#2A2720] text-zinc-200 rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* DM Input Bar */}
          <form
            onSubmit={handleSendDM}
            className="p-3 bg-[#0F0F12] border-t border-[#2A2720] flex items-center gap-2"
          >
            <input
              type="text"
              value={dmInput}
              onChange={(e) => setDmInput(e.target.value)}
              placeholder="Escribe un mensaje o sugiere una canción a @leyendasdelrock_oficial..."
              className="flex-1 bg-[#15151A] border border-[#2A2720] focus:border-[#D4AF37] rounded-full px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="gold-button text-black font-extrabold px-5 py-2.5 rounded-full flex items-center gap-1.5 text-xs shadow cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

      {/* 5. VIEW: REELS DE ROCK */}
      {activeSubTab === 'reels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Solo de guitarra inolvidable - Bohemian Rhapsody',
              artist: 'Queen',
              views: '2.4M',
              img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
              songId: 'queen-bohemian',
            },
            {
              title: 'Energía pura en Seattle 1991',
              artist: 'Nirvana',
              views: '1.8M',
              img: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
              songId: 'nirvana-smells',
            },
            {
              title: 'Guitarras al límite en Buenos Aires',
              artist: 'Rata Blanca',
              views: '980K',
              img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80',
              songId: 'rata-mujer-amante',
            },
          ].map((reel, idx) => (
            <div
              key={idx}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#15151A] border border-[#2A2720] hover:border-[#D4AF37] transition group cursor-pointer shadow-lg"
              onClick={() => {
                const s = songs.find((song) => song.id === reel.songId) || songs[0];
                onPlaySong(s);
                onShowToast(`Reproduciendo reel: ${reel.title}`);
              }}
            >
              <img
                src={reel.img}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono text-[#F5D77F] mb-1">
                  🔥 {reel.views} vistas
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-zinc-100 group-hover:text-[#FDE68A]">
                  {reel.title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">{reel.artist}</p>
                <button className="mt-2 py-1.5 px-3 rounded-full bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow">
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Ver &amp; Escuchar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. MODAL DETALLE DE POST */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#15151A] border-2 border-[#D4AF37]/70 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_35px_rgba(212,175,55,0.3)] flex flex-col md:flex-row">
            {/* Left image */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-black">
              <img
                src={selectedPost.imageUrl}
                alt="Post Detail"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right comments & actions */}
            <div className="w-full md:w-1/2 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#2A2720]">
                  <div className="flex items-center gap-2">
                    <span className="font-['Cinzel'] font-bold text-xs text-zinc-100">
                      leyendasdelrock_oficial
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  {selectedPost.caption}
                </p>

                {/* Comments stream */}
                <div className="mt-4 pt-3 border-t border-[#2A2720] max-h-40 overflow-y-auto space-y-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">
                    Comentarios ({postComments[selectedPost.id]?.length || 0})
                  </span>
                  {(postComments[selectedPost.id] || []).map((comm, idx) => (
                    <div key={idx} className="text-xs text-zinc-300 bg-[#0F0F12] p-2 rounded-lg">
                      <span className="font-bold text-[#F5D77F]">fan_rockero:</span> {comm}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & Comment Input */}
              <div className="space-y-3 pt-3 border-t border-[#2A2720]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleLike(selectedPost.id)}
                      className="text-zinc-400 hover:text-red-500 transition"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          selectedPost.isLiked
                            ? 'text-red-500 fill-red-500'
                            : 'text-zinc-400'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setActiveSubTab('dms')}
                      className="text-zinc-400 hover:text-[#D4AF37]"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-xs font-bold text-zinc-200">
                    {selectedPost.likes} Me gusta
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Agrega un comentario..."
                    className="flex-1 bg-[#0F0F12] border border-[#2A2720] rounded-full px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    className="text-xs font-bold text-[#D4AF37] hover:text-[#FDE68A]"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
