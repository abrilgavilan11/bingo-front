import { useState, useEffect } from 'react';
import { Moon, Sun, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/bingo-musical_logo.svg';

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme !== 'light';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center py-1">
            <Link to="/">
              <img 
                src={logo} 
                alt="Bingo Musical" 
                className="h-16 sm:h-24 w-auto object-contain hover:scale-105 transition-transform duration-300" 
              />
            </Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {location.pathname !== '/how-to-play' && (
              <Link to="/how-to-play">
                <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full font-bold text-sm transition-colors shadow-sm">
                  <HelpCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Cómo Jugar</span>
                </button>
              </Link>
            )}
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors relative z-10 shadow-sm"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 no-print transition-colors duration-300 mt-auto text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
            Diseñado y desarrollado por <a href="https://github.com/abrilgavilan11" target="_blank" rel="noopener noreferrer" className="text-pink-500 dark:text-cyan-400 font-black hover:underline hover:opacity-80 transition-opacity">Abril Gavilan</a>
          </p>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 opacity-75">
            © {new Date().getFullYear()} Bingo Musical. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
