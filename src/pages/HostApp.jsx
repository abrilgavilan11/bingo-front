import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Settings, LayoutGrid, Play, ArrowRight, ArrowLeft, Printer, PartyPopper } from 'lucide-react';
import { fetchPlaylist, createGame } from '../services/api';
import { generateUniqueCards } from '../utils/bingo';
import BingoCard from '../components/BingoCard';
import HostPanel from '../components/HostPanel';
import { themes } from '../utils/themes';

const STEPS = [
  { id: 'PLAYLIST', label: 'Playlist', icon: Music },
  { id: 'CONFIG', label: 'Configuración', icon: Settings },
  { id: 'PREVIEW', label: 'Cartones', icon: LayoutGrid },
  { id: 'HOST', label: 'Jugar', icon: Play },
];

export default function HostApp() {
  const [step, setStep] = useState('PLAYLIST');
  
  const [url, setUrl] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [cards, setCards] = useState([]);
  const [gameId, setGameId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [gridSize, setGridSize] = useState(16);
  const [numCards, setNumCards] = useState(10);

  const [themeId, setThemeId] = useState('retro-80s');
  const [ecoInk, setEcoInk] = useState(false);

  const currentStepIndex = STEPS.findIndex(s => s.id === step);

  const handleFetchPlaylist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await fetchPlaylist(url);
      setPlaylistData(result);
      setStep('CONFIG');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCards = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = generateUniqueCards({
        tracks: playlistData.tracks,
        gridSize,
        numberOfCards: numCards
      });
      
      setCards(result.cards);
      
      if (result.cards.length < numCards) {
        alert(`Nota: Sólo se pudieron generar ${result.cards.length} cartones únicos debido a la cantidad limitada de canciones en la playlist.`);
      }

      try {
        const sessionRes = await createGame(result.cards, gridSize);
        setGameId(sessionRes.gameId);
      } catch (saveErr) {
        console.error('No se pudo guardar la sesión en el servidor:', saveErr);
        alert('No se pudo guardar la sesión para juego por celular, pero puedes imprimir los cartones.');
      }
      
      setStep('PREVIEW');
    } catch (err) {
      setError(err.message);
    }
  };

  // Variantes de animación
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <div className="p-4 sm:p-8 text-slate-800 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* STEPPER COMPONENT */}
        <div className="no-print mb-8">
          <div className="flex items-center justify-between relative">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full z-0"></div>
            
            {/* Active Line Progress */}
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full z-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {STEPS.map((s, idx) => {
              const isActive = step === s.id;
              const isPast = currentStepIndex >= idx;
              const StepIcon = s.icon;
              
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    initial={false}
                    animate={{
                      backgroundColor: isPast ? 'rgb(236, 72, 153)' : 'rgb(226, 232, 240)',
                      borderColor: isPast ? 'rgb(236, 72, 153)' : 'rgb(203, 213, 225)',
                      color: isPast ? 'white' : 'rgb(148, 163, 184)'
                    }}
                    className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-colors duration-300 dark:border-slate-800 shadow-md`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </motion.div>
                  <span className={`mt-2 text-xs font-bold uppercase tracking-wider absolute top-12 whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-pink-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA WITH ANIMATIONS */}
        <div className="mt-16">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: PLAYLIST INPUT */}
            {step === 'PLAYLIST' && (
              <motion.div
                key="step-1"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-cyan-400 text-center">Elegí tu Playlist de Spotify</h2>
                <form onSubmit={handleFetchPlaylist} className="space-y-6">
                  <div>
                    <label htmlFor="url" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                      URL de la Playlist
                    </label>
                    <input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://open.spotify.com/playlist/..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-inner"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Cargando...
                      </span>
                    ) : (
                      <>Siguiente <ArrowRight className="w-5 h-5" /></>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: CONFIGURATION */}
            {step === 'CONFIG' && playlistData && (
              <motion.div
                key="step-2"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6 gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-cyan-400">Configurar Cartones</h2>
                    <span className="bg-slate-100 dark:bg-slate-900 text-pink-500 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-bold border border-pink-200 dark:border-slate-600 shadow-sm">
                      {playlistData.totalTracks} canciones listas
                    </span>
                  </div>
                  
                  <form onSubmit={handleGenerateCards} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 text-center sm:text-left">
                          Formato de Cuadrícula
                        </label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setGridSize(9)}
                            className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${gridSize === 9 ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-cyan-300'}`}
                          >
                            3x3 <span className="block text-xs font-normal opacity-70 mt-1">(9 temas)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setGridSize(16)}
                            className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${gridSize === 16 ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-500 text-pink-600 dark:text-pink-400 shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-pink-300'}`}
                          >
                            4x4 <span className="block text-xs font-normal opacity-70 mt-1">(16 temas)</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="numCards" className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4 text-center sm:text-left">
                          Cantidad a Generar
                        </label>
                        <input
                          id="numCards"
                          type="number"
                          min="1"
                          max="1000"
                          value={numCards}
                          onChange={(e) => setNumCards(parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 text-slate-900 dark:text-white text-xl focus:outline-none focus:border-pink-500 transition-all text-center font-black shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setStep('PLAYLIST')}
                        className="w-full sm:w-1/3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold py-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex justify-center items-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" /> Atrás
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full sm:w-2/3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] transition-all flex justify-center items-center gap-2"
                      >
                        Generar Cartones <LayoutGrid className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PREVIEW */}
            {step === 'PREVIEW' && (
              <motion.div
                key="step-3"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl no-print">
                   <div className="flex flex-col xl:flex-row justify-between items-center gap-6 border-b border-slate-200 dark:border-slate-700 pb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-cyan-400">Previsualización de Cartones</h2>
                    
                    <div className="flex flex-wrap justify-center items-center gap-3 w-full xl:w-auto">
                      <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setStep('CONFIG')}
                          className="text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" /> Volver
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" /> Imprimir
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStep('HOST')}
                        className="text-sm bg-gradient-to-r from-pink-500 to-cyan-500 hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] flex items-center gap-2"
                      >
                        <PartyPopper className="w-4 h-4" /> Iniciar Juego
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Settings className="w-4 h-4"/> Personalización Visual
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Object.values(themes).map(t => (
                        <button
                          key={t.id}
                          onClick={() => setThemeId(t.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            themeId === t.id 
                            ? 'bg-cyan-500 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setEcoInk(!ecoInk)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner ${ecoInk ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${ecoInk ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Modo Eco-Ink <span className="font-normal opacity-70">(Ahorro de Tinta)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2-Columns grid for desktop preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 max-w-full">
                  {cards.map((card) => (
                    <BingoCard 
                      key={card.id} 
                      card={card} 
                      gridSize={gridSize} 
                      themeId={themeId} 
                      ecoInk={ecoInk} 
                      gameId={gameId}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: HOST PANEL */}
            {step === 'HOST' && (
              <motion.div
                key="step-4"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ duration: 0.3 }}
              >
                <HostPanel 
                  allTracks={playlistData.tracks} 
                  cards={cards} 
                  gameId={gameId}
                  onExit={() => setStep('PREVIEW')} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500 text-red-600 dark:text-red-200 p-4 rounded-xl no-print shadow-sm text-center font-bold"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}
