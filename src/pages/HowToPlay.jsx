import { motion } from 'framer-motion';
import { Music, Smartphone, Printer, PartyPopper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowToPlay() {
  const steps = [
    {
      icon: Music,
      title: "1. Elegí tu Playlist",
      description: "Buscá una playlist en Spotify que tenga al menos 16 canciones (para cartones de 4x4) o 9 canciones (para 3x3). Copiá el link y pegalo en la página principal.",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Printer,
      title: "2. Generá los Cartones",
      description: "El sistema creará cartones únicos mezclando las canciones. Podés imprimirlos o elegir que tus amigos jueguen directamente desde sus celulares.",
      color: "from-blue-400 to-indigo-600"
    },
    {
      icon: Smartphone,
      title: "3. Conectá a tus Amigos",
      description: "Si juegan digital, dales el código QR o el link de su cartón. Cada jugador entra con su nombre y el cartón se sincroniza en vivo con el sorteo.",
      color: "from-purple-400 to-fuchsia-600"
    },
    {
      icon: PartyPopper,
      title: "4. ¡A Jugar y Cantar!",
      description: "Iniciá el sorteo desde tu panel de Animador. A medida que salgan las canciones, escuchá, cantá y que el primero en llenar la línea o el cartón grite ¡BINGO!",
      color: "from-pink-400 to-rose-600"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 text-slate-800 dark:text-white pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 mt-8"
      >
        <h1 className="text-4xl sm:text-6xl font-black mb-4 pb-2 leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500">
          ¿Cómo jugar al Bingo Musical?
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Transformá cualquier reunión en una fiesta inolvidable. El Bingo Musical reemplaza los números aburridos por tus canciones favoritas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${step.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              
              <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                <Icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Link to="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-black text-lg px-8 py-4 rounded-full shadow-[0_4px_20px_rgba(236,72,153,0.4)] flex items-center gap-3 mx-auto uppercase tracking-wider"
          >
            ¡Crear mi Bingo Ahora! <ArrowRight className="w-6 h-6" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
