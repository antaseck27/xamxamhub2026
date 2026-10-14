import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Sun, Moon, Bell, RotateCcw, 
  LogOut, Shield, CheckCircle2, User, Key, Globe 
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface SettingsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(StorageService.getTheme());
  const [resetToast, setResetToast] = useState(false);
  const currentUser = StorageService.getCurrentUser();

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    StorageService.setTheme(newTheme);
  };

  const handleResetDemoData = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données de démonstration (questions, réponses, projets, candidatures) avec le jeu de données initial ?')) {
      StorageService.resetAll();
      setResetToast(true);
      setTimeout(() => setResetToast(false), 3000);
    }
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    onNavigate('landing');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-sky-400" />
          <span>Paramètres & Préférences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Personnalisez votre expérience, gérez le thème et réinitialisez l'environnement de démo.
        </p>
      </div>

      {resetToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Données de démonstration réinitialisées avec succès pour le jury !</span>
        </div>
      )}

      {/* THEME SETTINGS (US-TRV-02) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Thème de l'interface (Clair / Sombre)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sélectionnez votre mode de visualisation. Respecte la charte Modern Developer × African Tech (#102A43 & #38BDF8).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
              theme === 'dark'
                ? 'bg-slate-950 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Mode Sombre (Recommandé)</span>
              <Moon className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Bleu nuit profond (#102A43) avec accents cyan (#38BDF8). Idéal pour coder.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
              theme === 'light'
                ? 'bg-slate-100 border-sky-600 text-slate-900 shadow-lg'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Mode Clair</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-600">
              Blanc neige (#F1F5F9) avec navigation et titres bleu nuit (#102A43).
            </p>
          </button>
        </div>
      </div>

      {/* DEMO CONTROLS (CRITICAL FOR HACKATHON JURY) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Réinitialisation Démo (Systalink Challenge)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Remet à zéro l'état local avec tous les comptes (Anta, Saliou), questions avec code, défis et candidatures prédéfinies.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-300">
            Efface les modifications et réinjecte le seed complet (20 devs, 4 projets, 1 défi actif).
          </div>
          <button
            type="button"
            onClick={handleResetDemoData}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition cursor-pointer shrink-0"
          >
            Réinitialiser les données
          </button>
        </div>
      </div>

      {/* SESSION & LOGOUT */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-rose-400" />
            <span>Session Développeur</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Connecté en tant que <strong className="text-white">{currentUser?.displayName}</strong> ({currentUser?.email}).
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter de XamXam Hub</span>
          </button>
        </div>
      </div>

    </div>
  );
};
