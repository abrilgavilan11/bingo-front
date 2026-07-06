export const fisherYatesShuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateUniqueCards = ({ tracks, gridSize, numberOfCards }) => {
  if (tracks.length < gridSize) {
    throw new Error(`La playlist necesita al menos ${gridSize} canciones para llenar un cartón.`);
  }

  const generatedCards = [];
  const generatedHashes = new Set();
  const maxAttempts = numberOfCards * 50;
  let attempts = 0;

  while (generatedCards.length < numberOfCards && attempts < maxAttempts) {
    attempts++;
    
    const shuffled = fisherYatesShuffle(tracks);
    
    const cardTracks = shuffled.slice(0, gridSize);
    
    const cardHash = cardTracks.map(t => t.id).sort().join(',');

    if (!generatedHashes.has(cardHash)) {
      generatedHashes.add(cardHash);
      
      generatedCards.push({
        id: `CARTON-${String(generatedCards.length + 1).padStart(3, '0')}`,
        tracks: cardTracks,
      });
    }
  }

  if (generatedCards.length < numberOfCards) {
    console.warn(`Sólo se pudieron generar ${generatedCards.length} cartones únicos (posible límite matemático de la playlist).`);
  }

  return {
    success: true,
    cards: generatedCards,
    requested: numberOfCards,
    generated: generatedCards.length
  };
};
