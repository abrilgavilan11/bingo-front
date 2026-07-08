export const themes = {
  'retro-80s': {
    id: 'retro-80s',
    name: 'Synthwave Neón',
    container: 'bg-black border-4 border-pink-500 shadow-[0_0_20px_#ec4899] text-white rounded-3xl overflow-hidden',
    header: 'bg-gradient-to-r from-pink-600 to-purple-600 text-yellow-300 font-black text-xl py-3 tracking-widest uppercase border-b-4 border-yellow-400',
    grid: 'bg-zinc-900 gap-[2px] p-2',
    cell: 'bg-black border-2 border-purple-500 hover:bg-zinc-900 text-center flex flex-col justify-center p-2 min-h-[100px] transition-colors rounded-xl',
    title: 'text-cyan-400 font-bold text-sm leading-tight uppercase',
    artist: 'text-pink-400 text-xs mt-1',
  },
  'tropical': {
    id: 'tropical',
    name: 'Fiesta Tropical',
    container: 'bg-orange-50 border-4 border-orange-400 rounded-3xl text-orange-900 overflow-hidden shadow-xl',
    header: 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-black text-xl py-3 border-b-4 border-orange-500',
    grid: 'bg-orange-100 gap-2 p-3',
    cell: 'bg-white border-2 border-orange-200 rounded-xl text-center flex flex-col justify-center p-2 min-h-[100px] shadow-sm',
    title: 'text-orange-600 font-black text-sm leading-tight uppercase',
    artist: 'text-orange-800 text-xs mt-1 font-medium',
  },
  'galaxy': {
    id: 'galaxy',
    name: 'Galaxia Mágica',
    container: 'bg-indigo-950 border-2 border-indigo-500 rounded-3xl shadow-[0_0_25px_rgba(99,102,241,0.5)] text-indigo-100 overflow-hidden',
    header: 'bg-indigo-900 text-fuchsia-400 font-black text-xl py-3 border-b-2 border-indigo-500 tracking-widest',
    grid: 'bg-indigo-900/50 gap-2 p-3',
    cell: 'bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-center flex flex-col justify-center p-2 min-h-[100px] hover:bg-indigo-800 transition-colors',
    title: 'text-cyan-300 font-bold text-sm leading-tight',
    artist: 'text-indigo-300 text-xs mt-1',
  },
  'pop-art': {
    id: 'pop-art',
    name: 'Pop Art Cómico',
    container: 'bg-yellow-400 border-4 border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden',
    header: 'bg-pink-500 text-white font-black text-2xl py-3 border-b-4 border-black tracking-tighter uppercase',
    grid: 'bg-transparent gap-2 p-3',
    cell: 'bg-white border-2 border-black rounded-xl text-center flex flex-col justify-center p-2 min-h-[100px] hover:bg-cyan-100 transition-colors',
    title: 'text-black font-black text-sm leading-none uppercase',
    artist: 'text-pink-600 text-xs mt-2 font-bold',
  }
};

export const applyEcoInk = (baseTheme) => {
  return {
    ...baseTheme,
    container: 'bg-white border-2 border-black text-black rounded-3xl overflow-hidden',
    header: 'bg-white text-black font-bold uppercase border-b-2 border-black py-2',
    grid: 'bg-black gap-px p-px',
    cell: 'bg-white text-center flex flex-col justify-center p-2 min-h-[100px] rounded-xl',
    title: 'text-black font-bold text-sm leading-tight',
    artist: 'text-gray-600 text-xs mt-1',
  };
};
