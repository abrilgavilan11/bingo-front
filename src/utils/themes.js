export const themes = {
  'retro-80s': {
    id: 'retro-80s',
    name: 'Synthwave Neón',
    container: 'bg-slate-900 border-4 border-fuchsia-500 shadow-[0_0_15px_#d946ef] text-white',
    header: 'bg-fuchsia-600 text-cyan-300 font-bold tracking-widest uppercase border-b-4 border-cyan-400',
    grid: 'bg-slate-800 gap-1 p-2',
    cell: 'bg-slate-900 border-2 border-cyan-400 hover:bg-slate-800 text-center flex flex-col justify-center p-2 min-h-[100px]',
    title: 'text-fuchsia-400 font-bold text-sm leading-tight',
    artist: 'text-cyan-200 text-xs mt-1',
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
  'minimal': {
    id: 'minimal',
    name: 'Aesthetic Limpio',
    container: 'bg-white border border-neutral-300 text-neutral-900 shadow-sm',
    header: 'bg-neutral-50 text-neutral-800 font-serif font-bold text-xl py-3 border-b border-neutral-300 tracking-wide',
    grid: 'bg-neutral-100 gap-px p-px',
    cell: 'bg-white text-center flex flex-col justify-center p-3 min-h-[100px]',
    title: 'text-neutral-900 font-serif font-bold text-sm leading-tight',
    artist: 'text-neutral-500 text-xs mt-2 italic',
  },
  'rock-fest': {
    id: 'rock-fest',
    name: 'Ticket de Festival',
    container: 'bg-zinc-100 border-y-4 border-zinc-900 border-x-8 border-x-zinc-900 text-zinc-900',
    header: 'bg-zinc-900 text-zinc-100 font-black uppercase text-2xl py-2 tracking-tighter',
    grid: 'bg-zinc-900 gap-[2px] p-[2px]',
    cell: 'bg-zinc-100 text-center flex flex-col justify-center p-2 min-h-[100px]',
    title: 'text-zinc-900 font-black text-sm leading-none uppercase',
    artist: 'text-zinc-700 text-xs mt-1 font-bold',
  }
};

export const applyEcoInk = (baseTheme) => {
  return {
    ...baseTheme,
    container: 'bg-white border-2 border-black text-black',
    header: 'bg-white text-black font-bold uppercase border-b-2 border-black py-2',
    grid: 'bg-black gap-px p-px',
    cell: 'bg-white text-center flex flex-col justify-center p-2 min-h-[100px]',
    title: 'text-black font-bold text-sm leading-tight',
    artist: 'text-gray-600 text-xs mt-1',
  };
};
