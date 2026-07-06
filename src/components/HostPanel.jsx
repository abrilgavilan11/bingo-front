import { useState } from 'react';

export default function HostPanel({ allTracks, cards, onExit }) {
  const [availableTracks, setAvailableTracks] = useState([...allTracks]);
  const [playedTracks, setPlayedTracks] = useState([]);
  
  const [auditInput, setAuditInput] = useState('');
  const [auditedCard, setAuditedCard] = useState(null);

  const drawNextTrack = () => {
    if (availableTracks.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    const selectedTrack = availableTracks[randomIndex];
    
    const newAvailable = [...availableTracks];
    newAvailable.splice(randomIndex, 1);
    
    setAvailableTracks(newAvailable);
    setPlayedTracks([selectedTrack, ...playedTracks]); 
  };

  const handleAudit = (e) => {
    e.preventDefault();
    const query = auditInput.trim().toUpperCase();
    
    const card = cards.find(c => c.id.toUpperCase() === query || c.id.endsWith(`-${query}`));
    setAuditedCard(card || 'NOT_FOUND');
  };
  const isTrackPlayed = (trackId) => playedTracks.some(t => t.id === trackId);

  return (
    <div className="bg-slate-900 min-h-screen text-white p-6 no-print">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
            🎤 Panel de Animador
          </h1>
          <button 
            onClick={onExit}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Volver a Cartones
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQ: BOLILLERO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-center">
              <h2 className="text-xl font-semibold mb-6 text-pink-400">Bolillero Virtual</h2>
              
              <button 
                onClick={drawNextTrack}
                disabled={availableTracks.length === 0}
                className="w-full h-32 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-black text-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all transform active:scale-95"
              >
                {availableTracks.length === 0 ? '¡Todas Jugadas!' : '🎲 Sortear Canción'}
              </button>
              
              <div className="mt-4 text-slate-400 text-sm">
                Quedan <strong className="text-white">{availableTracks.length}</strong> temas
              </div>
            </div>

            {/* AUDITOR DE CARTONES */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-pink-400">Verificar Ganador</h2>
              <form onSubmit={handleAudit} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Ej: CARTON-015 o 015"
                  value={auditInput}
                  onChange={(e) => setAuditInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 py-2 rounded-lg">
                  Auditar
                </button>
              </form>

              {auditedCard === 'NOT_FOUND' && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center">
                  Cartón no encontrado.
                </div>
              )}

              {auditedCard && auditedCard !== 'NOT_FOUND' && (
                <div className="mt-6 border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-white">{auditedCard.id}</h3>
                    {auditedCard.tracks.every(t => isTrackPlayed(t.id)) ? (
                      <span className="bg-green-500 text-green-950 font-black px-3 py-1 rounded-full text-xs animate-pulse">
                        ¡BINGO VÁLIDO! 🎉
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs border border-amber-500">
                        Incompleto
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {auditedCard.tracks.map((track, idx) => {
                      const played = isTrackPlayed(track.id);
                      return (
                        <div key={idx} className={`p-2 rounded text-xs text-center flex flex-col justify-center min-h-[60px] border ${played ? 'bg-green-900/40 border-green-500/50 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                          <span className="font-bold line-clamp-2">{track.title}</span>
                          {played && <span className="text-[10px] text-green-400 mt-1">✓ Marcada</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DER: HISTORIAL */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl h-full">
              <h2 className="text-xl font-semibold mb-6 text-cyan-400 flex justify-between items-center">
                Historial de Sorteos
                <span className="text-sm font-normal text-slate-400 bg-slate-900 px-3 py-1 rounded-full">
                  Total: {playedTracks.length}
                </span>
              </h2>
              
              {playedTracks.length === 0 ? (
                <div className="text-center text-slate-500 py-12 italic border-2 border-dashed border-slate-700 rounded-xl">
                  Aún no se ha sorteado ninguna canción. ¡Arrancá la fiesta!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {playedTracks.map((track, idx) => (
                    <div key={track.id} className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-700 relative overflow-hidden group">
                      {idx === 0 && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
                      )}
                      {track.cover_url ? (
                        <img src={track.cover_url} alt="cover" className="w-14 h-14 rounded-lg object-cover shadow-md" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center">🎵</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold truncate ${idx === 0 ? 'text-pink-400' : 'text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-sm text-slate-400 truncate">{track.artist}</p>
                      </div>
                      <div className="text-4xl font-black opacity-5 text-white absolute -right-2 -bottom-2 group-hover:opacity-10 transition-opacity">
                        #{playedTracks.length - idx}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
