import { useState } from 'react';
import { fetchPlaylist } from './services/api';
import { generateUniqueCards } from './utils/bingo';

export default function App() {
  const [step, setStep] = useState('PLAYLIST');
  
  const [url, setUrl] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [cards, setCards] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [gridSize, setGridSize] = useState(16);
  const [numCards, setNumCards] = useState(10);

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

  const handleGenerateCards = (e) => {
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
      
      setStep('PREVIEW');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
          Bingo Musical
        </h1>

        {/* STEP 1: PLAYLIST INPUT */}
        {step === 'PLAYLIST' && (
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Paso 1: Tu Playlist</h2>
            <form onSubmit={handleFetchPlaylist} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
                  URL de Playlist (Spotify)
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Cargando canciones...' : 'Siguiente'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: CONFIGURATION */}
        {step === 'CONFIG' && playlistData && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h2 className="text-2xl font-semibold text-cyan-400">Paso 2: Configurar Cartones</h2>
                <span className="bg-slate-900 text-slate-300 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-600">
                  {playlistData.totalTracks} canciones listas
                </span>
              </div>
              
              <form onSubmit={handleGenerateCards} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Formato de Cuadrícula
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setGridSize(9)}
                        className={`flex-1 py-4 rounded-xl border font-medium transition-all ${gridSize === 9 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-slate-900 border-slate-600 text-slate-400 hover:border-slate-500'}`}
                      >
                        3x3 <span className="block text-xs font-normal opacity-70">(9 temas)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGridSize(16)}
                        className={`flex-1 py-4 rounded-xl border font-medium transition-all ${gridSize === 16 ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.2)]' : 'bg-slate-900 border-slate-600 text-slate-400 hover:border-slate-500'}`}
                      >
                        4x4 <span className="block text-xs font-normal opacity-70">(16 temas)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="numCards" className="block text-sm font-medium text-slate-300 mb-3">
                      Cantidad de Cartones a Generar
                    </label>
                    <input
                      id="numCards"
                      type="number"
                      min="1"
                      max="1000"
                      value={numCards}
                      onChange={(e) => setNumCards(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-center font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('PLAYLIST')}
                    className="w-1/3 bg-slate-700 text-white font-bold py-4 rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 text-lg"
                  >
                    Generar Cartones 🎲
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW */}
        {step === 'PREVIEW' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
               <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-cyan-400">Paso 3: Resultado (Vista Previa)</h2>
                <button
                    type="button"
                    onClick={() => setStep('CONFIG')}
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Volver a Configurar
                </button>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl mb-6 flex justify-around items-center border border-slate-700/50">
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-1">Total Generados</p>
                  <strong className="text-white text-3xl font-bold">{cards.length}</strong>
                </div>
                <div className="h-10 w-px bg-slate-700"></div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-1">Formato Elegido</p>
                  <strong className="text-white text-3xl font-bold text-pink-400">{gridSize === 9 ? '3x3' : '4x4'}</strong>
                </div>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {cards.map((card) => (
                  <div key={card.id} className="border border-slate-700 p-5 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors">
                    <h3 className="font-bold text-cyan-400 mb-3 border-b border-slate-800 pb-2">{card.id}</h3>
                    <div className="flex flex-wrap gap-2">
                      {card.tracks.map((track, i) => (
                        <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full shadow-sm">
                          {track.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
