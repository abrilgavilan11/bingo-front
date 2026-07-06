import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function HostPanel({ allTracks, cards, gameId, onExit }) {
  const [availableTracks, setAvailableTracks] = useState([...allTracks]);
  const [playedTracks, setPlayedTracks] = useState([]);
  const [winners, setWinners] = useState([]);
  const socketRef = useRef(null);
  
  const [auditInput, setAuditInput] = useState('');
  const [auditedCard, setAuditedCard] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-room', gameId);
    });

    socket.on('sync-state', (state) => {
      setPlayedTracks(state.playedTracks || []);
      setWinners(state.winners || []);
      
      if (state.playedTracks && state.playedTracks.length > 0) {
        const playedIds = new Set(state.playedTracks.map(t => t.id));
        setAvailableTracks(allTracks.filter(t => !playedIds.has(t.id)));
      }
    });

    socket.on('winner-alert', (winner) => {
      setWinners(prev => {
        if (prev.some(w => w.cardId === winner.cardId && w.type === winner.type)) return prev;
        return [...prev, winner];
      });
      
      if (winner.type === 'BINGO') {
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 }, zIndex: 9999 });
      } else {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#22d3ee', '#ec4899'], zIndex: 9999 });
      }
    });

    return () => socket.disconnect();
  }, [gameId, allTracks]);

  const drawNextTrack = () => {
    if (availableTracks.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    const selectedTrack = availableTracks[randomIndex];
    
    const newAvailable = [...availableTracks];
    newAvailable.splice(randomIndex, 1);
    
    setAvailableTracks(newAvailable);
    setPlayedTracks([selectedTrack, ...playedTracks]); 
    
    if (socketRef.current) {
      socketRef.current.emit('draw-song', { gameId, track: selectedTrack });
    }
  };

  const handleAudit = (e) => {
    e.preventDefault();
    const query = auditInput.trim().toUpperCase();
    const card = cards.find(c => c.id.toUpperCase() === query || c.id.endsWith(`-${query}`));
    setAuditedCard(card || 'NOT_FOUND');
  };
  
  const isTrackPlayed = (trackId) => playedTracks.some(t => t.id === trackId);
  const currentTrack = playedTracks[0];

  return (
    <div className="no-print">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-4 gap-4">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center gap-3 tracking-wide">
            🎤 Panel de Animador 
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-black">
              SALA: <span className="text-cyan-600 dark:text-cyan-400">{gameId}</span>
            </span>
          </h1>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExit}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-white transition-colors shadow-sm"
          >
            Cerrar Panel
          </motion.button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQ: BOLILLERO Y REPRODUCTOR */}
          <div className="xl:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-cyan-500"></div>
              <h2 className="text-2xl font-black mb-6 text-slate-800 dark:text-pink-400">Bolillero Virtual</h2>
              
              <motion.button 
                whileHover={{ scale: availableTracks.length > 0 ? 1.02 : 1 }}
                whileTap={{ scale: availableTracks.length > 0 ? 0.95 : 1 }}
                onClick={drawNextTrack}
                disabled={availableTracks.length === 0}
                className="w-full h-28 rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white font-black text-2xl shadow-[0_4px_20px_rgba(236,72,153,0.4)] flex flex-col items-center justify-center gap-1 uppercase tracking-widest"
              >
                {availableTracks.length === 0 ? '¡Todas Jugadas!' : (
                  <>
                    <span className="text-3xl">🎲</span> 
                    <span className="text-lg">Sortear Tema</span>
                  </>
                )}
              </motion.button>
              
              <div className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                Quedan <strong className="text-slate-800 dark:text-white text-lg">{availableTracks.length}</strong> temas
              </div>

              {/* REPRODUCTOR INTEGRADO */}
              <AnimatePresence>
                {currentTrack && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left shadow-inner"
                  >
                    <h3 className="text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span> Sonando Ahora
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      {currentTrack.cover_url ? (
                        <img src={currentTrack.cover_url} alt="cover" className="w-16 h-16 rounded-xl shadow-md object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl">🎵</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-900 dark:text-white truncate text-lg leading-tight">{currentTrack.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-semibold mt-1">{currentTrack.artist}</p>
                      </div>
                    </div>
                    
                    {currentTrack.preview_url ? (
                      <audio src={currentTrack.preview_url} controls autoPlay className="w-full h-10 rounded outline-none" />
                    ) : (
                      <iframe src={`https://open.spotify.com/embed/track/${currentTrack.id}`} width="100%" height="80" frameBorder="0" allow="encrypted-media" className="rounded-xl"></iframe>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AUDITOR */}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
              <h2 className="text-xl font-black mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                🕵️‍♂️ Verificar Cartón
              </h2>
              <form onSubmit={handleAudit} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Ej: CARTON-015"
                  value={auditInput}
                  onChange={(e) => setAuditInput(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 text-sm font-bold shadow-inner uppercase"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-md"
                >
                  Buscar
                </motion.button>
              </form>

              <AnimatePresence>
                {auditedCard === 'NOT_FOUND' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-200 rounded-xl text-sm text-center font-bold">
                    No encontrado.
                  </motion.div>
                )}

                {auditedCard && auditedCard !== 'NOT_FOUND' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-black text-sm text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-3 py-1 rounded-md">{auditedCard.id}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {auditedCard.tracks.map((track, idx) => {
                        const played = isTrackPlayed(track.id);
                        return (
                          <div key={idx} className={`p-1.5 rounded-lg text-[10px] sm:text-xs text-center flex flex-col justify-center min-h-[48px] border transition-colors ${played ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-500/50 text-green-900 dark:text-white font-bold shadow-sm' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500'}`}>
                            <span className="font-semibold line-clamp-2 leading-tight">{track.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* COLUMNA CENTRAL: HISTORIAL */}
          <div className="xl:col-span-4">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl h-full flex flex-col relative overflow-hidden">
              <h2 className="text-2xl font-black mb-6 text-slate-800 dark:text-white flex justify-between items-center">
                Historial
                <span className="text-xs font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                  Total: {playedTracks.length}
                </span>
              </h2>
              
              {playedTracks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-semibold italic p-6 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  El historial está vacío. ¡Sortéa la primera canción!
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[70vh]">
                  <AnimatePresence>
                    {playedTracks.map((track, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={track.id} 
                        className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                      >
                        {idx === 0 && (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 to-cyan-500 shadow-[0_0_12px_#ec4899]"></div>
                        )}
                        {track.cover_url ? (
                          <img src={track.cover_url} alt="cover" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl">🎵</div>
                        )}
                        <div className="flex-1 min-w-0 py-1">
                          <p className={`font-black text-sm sm:text-base truncate ${idx === 0 ? 'text-pink-600 dark:text-pink-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-semibold mt-0.5">{track.artist}</p>
                        </div>
                        <div className="text-3xl font-black text-slate-200 dark:text-white opacity-[0.15] dark:opacity-10 absolute -right-2 -bottom-2 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity">
                          #{playedTracks.length - idx}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DER: PODIO DE GANADORES */}
          <div className="xl:col-span-4">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl h-full flex flex-col relative overflow-hidden">
              {/* Decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <h2 className="text-2xl font-black mb-6 text-yellow-600 dark:text-yellow-400 flex items-center gap-3">
                <span className="text-3xl">🏆</span> Podio en Vivo
              </h2>

              <div className="flex-1 space-y-4">
                {winners.length === 0 ? (
                  <div className="text-center text-slate-400 dark:text-slate-500 font-semibold text-sm italic py-12 px-4 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
                    Esperando a los primeros ganadores...
                  </div>
                ) : (
                  <AnimatePresence>
                    {winners.map((winner, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={idx} 
                        className={`p-5 rounded-2xl border-2 relative shadow-md ${winner.type === 'BINGO' ? 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/40 dark:to-yellow-600/20 border-yellow-400 dark:border-yellow-500' : 'bg-slate-50 dark:bg-slate-900 border-cyan-300 dark:border-cyan-500/50'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black mb-3 tracking-widest uppercase shadow-sm ${winner.type === 'BINGO' ? 'bg-yellow-400 text-yellow-950' : 'bg-cyan-400 text-cyan-950'}`}>
                              {winner.type === 'BINGO' ? 'CARTÓN LLENO 👑' : `LÍNEA 🥈 (${winner.lineType})`}
                            </span>
                            <h3 className="font-black text-slate-900 dark:text-white text-xl leading-tight">{winner.playerName || 'Jugador Anónimo'}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-bold">Cartón: {winner.cardId}</p>
                          </div>
                          {winner.type === 'BINGO' && (
                            <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-bounce">🏆</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
