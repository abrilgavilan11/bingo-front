import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { generateUniqueCards } from '../utils/bingo';

export default function HostPanel({ allTracks, cards: initialCards, gameId, onExit }) {
  const [cards, setCards] = useState(initialCards);
  const [availableTracks, setAvailableTracks] = useState([...allTracks]);
  const [playedTracks, setPlayedTracks] = useState([]);
  const [winners, setWinners] = useState([]);
  const socketRef = useRef(null);
  
  const [auditInput, setAuditInput] = useState('');
  const [auditedCard, setAuditedCard] = useState(null);

  useEffect(() => {
    let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    if (apiUrl && !apiUrl.startsWith('http')) {
      apiUrl = 'https://' + apiUrl;
    }
    const socketUrl = apiUrl.replace(/\/api\/?$/, '');
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] });
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

    socket.on('debug-log', (msg) => {
      console.log('📡 [BACKEND]:', msg);
    });

    socket.on('winner-alert', (winner) => {
      setWinners(prev => {
        const existingIdx = prev.findIndex(w => w.cardId === winner.cardId && w.type === winner.type);
        if (existingIdx >= 0) {
          if (prev[existingIdx].playerName === 'Desconocido' && winner.playerName !== 'Desconocido') {
            const updated = [...prev];
            updated[existingIdx] = winner;
            return updated;
          }
          return prev;
        }
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

  const restartGame = () => {
    if (window.confirm('¿Seguro que quieres reiniciar la partida actual? Se generarán cartones nuevos para los jugadores y todo el progreso se borrará.')) {
      setPlayedTracks([]);
      setWinners([]);
      setAvailableTracks([...allTracks]);
      setAuditedCard(null);
      setAuditInput('');

      let newCards = null;
      if (cards && cards.length > 0 && allTracks && allTracks.length > 0) {
        try {
          const gridSize = cards[0].tracks.length;
          const result = generateUniqueCards({
            tracks: allTracks,
            gridSize: gridSize,
            numberOfCards: cards.length
          });
          newCards = result.cards;
        } catch (e) {
          console.error("Error regenerando cartones:", e);
        }
      }

      if (socketRef.current) {
        socketRef.current.emit('restart-game', { gameId, newCards });
        if (newCards) {
          setCards(newCards);
        }
      }
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
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
              className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-sm"
            >
              Volver a jugar
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExit}
              className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-white transition-colors shadow-sm"
            >
              Cerrar Panel
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
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

              <AnimatePresence mode="wait">
                {currentTrack && (
                  <motion.div 
                    key={currentTrack.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                  className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-pink-500 text-sm font-bold shadow-inner uppercase"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="shrink-0 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 sm:px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-md"
                >
                  Buscar
                </motion.button>
              </form>

              <AnimatePresence mode="wait">
                {auditedCard === 'NOT_FOUND' && (
                  <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-200 rounded-xl text-sm text-center font-bold">
                    No encontrado.
                  </motion.div>
                )}

                {auditedCard && auditedCard !== 'NOT_FOUND' && (
                  <motion.div key="found-card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 overflow-hidden">
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
                    {playedTracks.map((track, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={`${track.id}-${i}`} 
                        className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                      >
                        {i === 0 && (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 to-cyan-500 shadow-[0_0_12px_#ec4899]"></div>
                        )}
                        {track.cover_url ? (
                          <img src={track.cover_url} alt="cover" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl">🎵</div>
                        )}
                        <div className="flex-1 min-w-0 py-1">
                          <p className={`font-black text-sm sm:text-base truncate ${i === 0 ? 'text-pink-600 dark:text-pink-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-semibold mt-0.5">{track.artist}</p>
                        </div>
                        <div className="text-3xl font-black text-slate-200 dark:text-white opacity-[0.15] dark:opacity-10 absolute -right-2 -bottom-2 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity">
                          #{playedTracks.length - i}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl h-full flex flex-col relative overflow-hidden">
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
                  <>
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-2 uppercase tracking-wider">Ganadores de Línea</h3>
                      <AnimatePresence>
                        {winners.filter(w => w.type === 'LÍNEA').length === 0 ? (
                          <motion.p key="no-line-winners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-400 text-xs italic">Aún no hay ganadores de línea.</motion.p>
                        ) : (
                          winners.filter(w => w.type === 'LÍNEA').map((winner, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              key={`line-${winner.cardId}-${idx}`} 
                              className="p-4 mb-2 rounded-2xl border-2 bg-slate-50 dark:bg-slate-900 border-cyan-300 dark:border-cyan-500/50 relative shadow-sm"
                            >
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black mb-1 bg-cyan-400 text-cyan-950 shadow-sm">
                                {idx === 0 ? '1º LÍNEA' : '2º LÍNEA'} ({winner.lineType})
                              </span>
                              <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight">{winner.playerName || 'Jugador Anónimo'}</h3>
                              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">Cartón: {winner.cardId}</p>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-2 uppercase tracking-wider">Ganador Bingo</h3>
                      <AnimatePresence>
                        {winners.filter(w => w.type === 'BINGO').length === 0 ? (
                          <motion.p key="no-bingo-winners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-400 text-xs italic">Aún no hay ganador de bingo completo.</motion.p>
                        ) : (
                          winners.filter(w => w.type === 'BINGO').map((winner, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              key={`bingo-${winner.cardId}-${idx}`} 
                              className="p-5 rounded-2xl border-2 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/40 dark:to-yellow-600/20 border-yellow-400 dark:border-yellow-500 relative shadow-md"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-black mb-3 tracking-widest uppercase shadow-sm bg-yellow-400 text-yellow-950">
                                    CARTÓN LLENO 👑
                                  </span>
                                  <h3 className="font-black text-slate-900 dark:text-white text-xl leading-tight">{winner.playerName || 'Jugador Anónimo'}</h3>
                                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-bold">Cartón: {winner.cardId}</p>
                                </div>
                                <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-bounce">🏆</div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
