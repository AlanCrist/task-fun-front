import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en',    label: 'English',   flag: '🇺🇸' },
  { code: 'es',    label: 'Español',   flag: '🇪🇸' },
  { code: 'fr',    label: 'Français',  flag: '🇫🇷' },
];

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function changeLanguage(code) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 rounded-xl transition text-sm font-medium
          ${compact
            ? 'px-2 py-1.5 text-violet-300 hover:bg-white/10 hover:text-white'
            : 'px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white'
          }`}
        title="Idioma / Language"
      >
        <Globe size={15} />
        <span>{current.flag}</span>
        {!compact && <span className="hidden sm:inline">{current.label}</span>}
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[150px]">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-violet-50
                ${lang.code === i18n.language ? 'text-violet-700 font-semibold bg-violet-50' : 'text-gray-700'}`}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
