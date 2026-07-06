import { themes, applyEcoInk } from '../utils/themes';

export default function BingoCard({ card, gridSize, themeId, ecoInk }) {
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
    </div>
  );
}
