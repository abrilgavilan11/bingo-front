import { useState } from 'react';
import { fetchPlaylist } from './services/api';

export default function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      const result = await fetchPlaylist(url);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
          Bingo Musical
        </h1>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
                URL de Playlist (Spotify)
              </label>
              <input
                id="url"
                type="text"
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
              {loading ? 'Cargando...' : 'Obtener Playlist'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl">
            {error}
          </div>
        )}

        {data && (
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400">
              ¡Playlist cargada con éxito!
            </h2>
            <p className="text-slate-300">
              Total de canciones: <span className="font-bold text-white">{data.totalTracks}</span>
            </p>
            
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {data.tracks.map((track, idx) => (
                <div key={idx} className="flex items-center space-x-4 bg-slate-900 p-3 rounded-lg border border-slate-700/50">
                  {track.cover_url && (
                    <img src={track.cover_url} alt={track.title} className="w-12 h-12 rounded object-cover shadow-sm" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.title}</p>
                    <p className="text-slate-400 text-sm truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
