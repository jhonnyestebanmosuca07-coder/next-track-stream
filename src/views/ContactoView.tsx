import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Phone, MapPin, Sparkles, MessageSquare, Music, Instagram } from 'lucide-react';
import { ContactMessage } from '../types';

interface ContactoViewProps {
  onSendMessage: (msg: ContactMessage) => void;
  messages: ContactMessage[];
  onOpenInstagram?: () => void;
}

export const ContactoView: React.FC<ContactoViewProps> = ({
  onSendMessage,
  messages,
  onOpenInstagram,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bandRequest, setBandRequest] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newMsg: ContactMessage = {
        id: 'msg-' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        bandRequest: bandRequest.trim() || 'General',
        message: message.trim(),
        date: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      onSendMessage(newMsg);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setName('');
      setEmail('');
      setBandRequest('');
      setMessage('');
    }, 700);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-[#2A2720]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs font-bold text-[#F5D77F] uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Atención &amp; Comunidad Rockera
        </div>
        <h2 className="font-['Cinzel'] text-3xl md:text-4xl font-black gold-gradient-text">
          Sección de Contacto
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto font-light">
          ¿Tienes sugerencias de bandas legendarias, canciones para agregar a las playlists o preguntas sobre el reproductor? Escríbenos con este formulario sencillo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-[#15151A] border border-[#2A2720] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <div className="space-y-5">
            <h3 className="font-['Cinzel'] font-bold text-lg text-[#FDE68A]">
              Next Track Studio
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Plataforma dedicada a preservar el espíritu del rock clásico y la cultura musical en alta fidelidad.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720]">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-500 uppercase block">Correo directo</span>
                  <span className="text-xs font-mono text-zinc-200 truncate block">
                    contacto@leyendasdelrock.com
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720]">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-500 uppercase block">Línea de soporte</span>
                  <span className="text-xs font-mono text-zinc-200 block">
                    +1 (800) ROCK-NEXT
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720]">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-500 uppercase block">Transmisión Global</span>
                  <span className="text-xs text-zinc-200 block">
                    Red de Audio Streaming en Vivo
                  </span>
                </div>
              </div>

              {/* Instagram Direct Link */}
              {onOpenInstagram && (
                <div
                  onClick={onOpenInstagram}
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#1E1E26] to-[#15151A] border border-[#D4AF37]/50 hover:border-[#F5D77F] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#F5D77F] group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] text-[#F5D77F] font-bold uppercase block">Instagram Oficial</span>
                      <span className="text-xs font-mono text-zinc-200">@leyendasdelrock_oficial</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#D4AF37] text-black px-2 py-0.5 rounded-full">
                    Chat DM
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F0F12] to-[#15151A] border border-[#D4AF37]/30 text-center">
            <span className="text-[11px] font-bold text-[#F5D77F] uppercase tracking-wider block mb-1">
              "tu música tu camino"
            </span>
            <p className="text-[11px] text-zinc-400">
              Respondemos todas las solicitudes en menos de 24 horas.
            </p>
          </div>
        </div>

        {/* Simple Form Card */}
        <div className="lg:col-span-2 bg-[#15151A] border border-[#D4AF37]/40 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          {submittedSuccess ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#F5D77F]">
                <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="font-['Cinzel'] font-bold text-xl text-zinc-100">
                ¡Mensaje Enviado con Éxito!
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Gracias por comunicarte con nosotros. Hemos registrado tu sugerencia de banda y consulta. Te responderemos a la brevedad.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="gold-button text-black font-extrabold text-xs px-6 py-2.5 rounded-full cursor-pointer mt-4"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej. Juancho Esteban"
                    required
                    className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej. usuario@ejemplo.com"
                    required
                    className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Banda o Canción que te gustaría que agreguemos (opcional)
                </label>
                <input
                  type="text"
                  value={bandRequest}
                  onChange={(e) => setBandRequest(e.target.value)}
                  placeholder="ej. Led Zeppelin, Pink Floyd, Soda Stereo, Héroes del Silencio..."
                  className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tu Mensaje o Sugerencia *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  className="w-full bg-[#0F0F12] border border-[#2A2720] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-500">
                  * Campos obligatorios para el contacto.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-button text-black font-extrabold text-xs sm:text-sm px-7 py-3 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Mensajes Recientes Enviados en esta Sesión */}
      {messages.length > 0 && (
        <div className="bg-[#15151A] border border-[#2A2720] rounded-2xl p-5 mt-6">
          <h4 className="font-['Cinzel'] font-bold text-sm text-[#FDE68A] mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Mensajes Enviados en Esta Sesión ({messages.length})
          </h4>
          <div className="space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-[#0F0F12] border border-[#2A2720] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
              >
                <div>
                  <span className="font-bold text-zinc-200">{m.name}</span>{' '}
                  <span className="text-zinc-500">({m.email})</span>
                  {m.bandRequest && m.bandRequest !== 'General' && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5D77F] text-[10px]">
                      Sugerencia: {m.bandRequest}
                    </span>
                  )}
                  <p className="text-zinc-400 mt-1 italic">"{m.message}"</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 self-start sm:self-auto">
                  {m.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
