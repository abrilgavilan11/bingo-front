import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { getCard } from '../services/api';
import { themes, applyEcoInk } from '../utils/themes';

const WINNING_LINES = {
  9: [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]           
  ],
  16: [
    [0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15],
    [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15],
    [0,5,10,15], [3,6,9,12]                           
  ]
};

export default function MobilePlayer() {
  const { gameId, cardId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const themeParam = queryParams.get('theme') || 'minimal';
  const ecoParam = queryParams.get('eco') === '1';

  let activeTheme = themes[themeParam] || themes['minimal'];
  if (ecoParam) {
    activeTheme = applyEcoInk(activeTheme);
  }

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playerName, setPlayerName] = useState('');
  
  const [markedTracks, setMarkedTracks] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);
  const [wonLines, setWonLines] = useState(new Set());
  const [hasBingo, setHasBingo] = useState(false);
  
  const socketRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem(`bingo-name-${gameId}`);
    if (savedName) setPlayerName(savedName);
  }, [gameId]);

  useEffect(() => {
    if (!playerName) return;

    const loadCard = async () => {
      try {
        const data = await getCard(gameId, cardId);
        setCard(data.card);
      } catch (err) {
        setError(err.message || 'Error al cargar el cartón');
      } finally {
        setLoading(false);
      }
    };
    loadCard();
  }, [gameId, cardId, playerName]);

  useEffect(() => {
    if (!playerName || !card) return;

    let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    if (apiUrl && !apiUrl.startsWith('http')) {
      apiUrl = 'https://' + apiUrl;
    }
    const socket = io(apiUrl, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-room', gameId);
    });

    socket.on('restarted-game', () => {
      showToast('¡Nueva partida comenzada! Actualizando cartón...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });

    return () => socket.disconnect();
  }, [gameId, cardId, playerName, card]);

  const toggleTrack = (idx) => {
    setMarkedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
        if (navigator.vibrate) navigator.vibrate(50);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (!card || markedTracks.size === 0) return;

    const size = card.tracks.length;
    const lines = WINNING_LINES[size];
    
    let isFullCard = true;
    for (let i = 0; i < size; i++) {
      if (!markedTracks.has(i)) {
        isFullCard = false;
        break;
      }
    }

    if (isFullCard && !hasBingo) {
      setHasBingo(true);
      showToast('¡BINGO! 🎉');
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
      if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
      if (socketRef.current) {
        socketRef.current.emit('full-bingo', { gameId, cardId, playerName });
      }
      return; 
    }

    if (hasBingo) return;

    const currentWonLines = new Set(wonLines);
    let newWin = false;
    let wonLineType = '';

    lines.forEach((line, index) => {
      if (!currentWonLines.has(index)) {
        const isLineComplete = line.every(idx => markedTracks.has(idx));
        if (isLineComplete) {
          currentWonLines.add(index);
          newWin = true;
          wonLineType = getLineType(index, size);
        }
      }
    });

    if (newWin) {
      setWonLines(currentWonLines);
      showToast('¡LÍNEA! 🚀');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      if (socketRef.current) {
        socketRef.current.emit('line-bingo', { gameId, cardId, playerName, lineType: wonLineType });
      }
    }
  }, [markedTracks, card, hasBingo, wonLines, gameId, cardId, playerName]);

  const getLineType = (index, size) => {
    const is4x4 = size === 16;
    if (is4x4) {
      if (index < 4) return 'Horizontal';
      if (index < 8) return 'Vertical';
      return 'Diagonal';
    } else {
      if (index < 3) return 'Horizontal';
      if (index < 6) return 'Vertical';
      return 'Diagonal';
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = e.target.playerName.value.trim();
    if (name) {
      localStorage.setItem(`bingo-name-${gameId}`, name);
      setPlayerName(name);
    }
  };

  if (!playerName) {
    return (
      <div className="p-4 flex items-center justify-center text-slate-800 dark:text-white mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md"
        >
          <h2 className="text-2xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
            ¿Cómo te llamás?
          </h2>
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <input 
              type="text" 
              name="playerName" 
              placeholder="Tu nombre o apodo" 
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg font-bold text-center shadow-inner"
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-black py-4 rounded-xl shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] uppercase tracking-wider"
            >
              Entrar al Juego
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (loading) return <div className="text-center mt-20 text-slate-500 font-bold animate-pulse">Cargando cartón...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-bold bg-red-100 p-4 mx-4 rounded-xl">{error}</div>;
  if (!card) return <div className="text-center mt-20">Cartón no encontrado.</div>;

  const is4x4 = card.tracks.length === 16;
  const colsClass = is4x4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
      <motion.div 
        className={`w-full max-w-sm mx-auto shadow-2xl overflow-hidden rounded-3xl ${activeTheme.container}`}
      >
        <div className={`p-4 flex justify-between items-center ${activeTheme.header}`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Jugador</p>
            <p className="font-black text-lg leading-tight">{playerName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Cartón</p>
            <p className="font-black text-lg leading-tight">{cardId}</p>
          </div>
        </div>

        <div className={`grid ${colsClass} ${activeTheme.grid}`}>
          {card.tracks.map((track, idx) => {
            const isMarked = markedTracks.has(idx);
            return (
              <motion.div 
                key={idx}
                initial={false}
                animate={{ 
                  scale: isMarked ? [1, 1.05, 1] : 1,
                  opacity: isMarked ? 0.75 : 1
                }}
                transition={{ duration: 0.3 }}
                className={`relative cursor-pointer transition-all ${activeTheme.cell} ${isMarked ? 'brightness-90 saturate-50' : ''}`}
                onClick={() => toggleTrack(idx)}
              >
                <div className="line-clamp-3 relative z-10">
                  <span className={`block ${activeTheme.title} ${isMarked ? 'line-through decoration-2' : ''}`}>
                    {track.title}
                  </span>
                  <span className={`block ${activeTheme.artist}`}>
                    {track.artist}
                  </span>
                </div>
                {isMarked && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40" 
                  >
                    <span className="text-5xl filter drop-shadow-md">🎵</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl font-black text-lg border-2 border-slate-700 z-50 flex items-center gap-3 whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
