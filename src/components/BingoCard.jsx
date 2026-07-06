import { themes, applyEcoInk } from '../utils/themes';
import { QRCodeCanvas } from 'qrcode.react';

export default function BingoCard({ card, gridSize, themeId, ecoInk, gameId }) {
  const is4x4 = gridSize === 16;
  const colsClass = is4x4 ? 'grid-cols-4' : 'grid-cols-3';

  let activeTheme = themes[themeId] || themes['minimal'];
  
  if (ecoInk) {
    activeTheme = applyEcoInk(activeTheme);
  }

  return (
    <div className={`bingo-card break-inside-avoid print:break-inside-avoid mb-8 print:mb-4 w-full max-w-sm mx-auto ${activeTheme.container}`}>
      <div className={`text-center ${activeTheme.header}`}>
        Bingo Musical
        <div className="text-xs font-normal opacity-80 mt-1">
          {card.id}
        </div>
      </div>

      <div className={`grid ${colsClass} ${activeTheme.grid}`}>
        {card.tracks.map((track, idx) => (
          <div key={idx} className={activeTheme.cell}>
            <div className="line-clamp-3">
              <p className={activeTheme.title}>{track.title}</p>
              <p className={activeTheme.artist}>{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer with QR */}
      {gameId && (
        <div className={`mt-2 p-2 flex items-center justify-between border-t-2 ${activeTheme.container.includes('border-black') ? 'border-black' : 'border-current opacity-70'}`}>
          <div className="text-[10px] leading-tight font-medium max-w-[60%]">
            ¿Preferís jugar digital?<br/>
            Escaneá este código para abrir tu cartón en el celu.
          </div>
          <div className="bg-white p-1 rounded">
            <QRCodeCanvas 
              value={`${window.location.origin}/play/${gameId}/${card.id}`}
              size={50}
              level={"M"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
