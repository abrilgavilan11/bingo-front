import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCard } from '../services/api';

export default function MobilePlayer() {
  const { gameId, cardId } = useParams();
  const [card, setCard] = useState(null);
  const [gridSize, setGridSize] = useState(16);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markedTracks, setMarkedTracks] = useState(new Set());

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const data = await getCard(gameId, cardId);
        setCard(data.card);
        setGridSize(data.gridSize);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCardData();
  }, [gameId, cardId]);

  const toggleMark = (trackId) => {
    const newMarked = new Set(markedTracks);
    if (newMarked.has(trackId)) {
      newMarked.delete(trackId);
    } else {
      newMarked.add(trackId);
    }
    setMarkedTracks(newMarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-cyan-400 font-bold text-xl">
        Cargando tu cartón...
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-6 rounded-2xl max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-2">Oops!</h1>
          <p>{error || 'Cartón no encontrado'}</p>
        </div>
      </div>
    );
  }

  const is4x4 = gridSize === 16;
  const colsClass = is4x4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 uppercase tracking-wider">
            Bingo Musical
          </h1>
          <div className="inline-block mt-2 bg-slate-800 border border-slate-700 text-cyan-300 px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/20">
            {card.id}
          </div>
        </div>

        {/* Interactive Grid */}
        <div className={`grid ${colsClass} gap-2 mb-8`}>
          {card.tracks.map((track, idx) => {
            const isMarked = markedTracks.has(track.id);
            return (
              <button
                key={idx}
                onClick={() => toggleMark(track.id)}
                className={`
                  relative overflow-hidden aspect-square rounded-xl p-2 flex flex-col justify-center items-center text-center transition-all transform active:scale-95 shadow-sm
                  ${isMarked 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-700 border-2 border-green-300 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                    : 'bg-slate-800 border-2 border-slate-600 text-slate-300 hover:border-slate-500'
                  }
                `}
              >
                <span className={`font-bold text-xs sm:text-sm leading-tight line-clamp-3 ${isMarked ? 'text-white' : 'text-cyan-100'}`}>
                  {track.title}
                </span>
                
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                    <span className="text-6xl">🎵</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="bg-slate-800 rounded-2xl p-4 text-center border border-slate-700 shadow-xl mb-4">
          <p className="text-slate-400 text-sm mb-2">Progreso del Cartón</p>
          <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-pink-500 to-cyan-400 h-4 transition-all duration-500" 
              style={{ width: `${(markedTracks.size / gridSize) * 100}%` }}
            ></div>
          </div>
          <p className="mt-2 font-bold text-cyan-400">
            {markedTracks.size} / {gridSize}
          </p>
          
          {markedTracks.size === gridSize && (
            <div className="mt-4 bg-green-500 text-white font-black py-2 px-4 rounded-lg animate-pulse text-xl">
              ¡CANTÁ BINGO! 🎉
            </div>
          )}
        </div>
        
        <p className="text-xs text-center text-slate-500">
          Toca cada recuadro cuando el DJ pase la canción correspondiente.
        </p>

      </div>
    </div>
  );
}
