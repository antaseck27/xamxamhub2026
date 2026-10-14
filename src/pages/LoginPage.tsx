import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Shield, User } from 'lucide-react';
import { StorageService } from '../services/storage';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const users = StorageService.getUsers();
      // Look up user by email or username
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase());

      if (matched) {
        StorageService.setCurrentUser(matched.id);
        setIsLoading(false);
        onNavigate('dashboard');
      } else {
        // Fallback demo match
        const demoUser = users.find(u => u.id === 'user-demo');
        if (demoUser) {
          StorageService.setCurrentUser(demoUser.id);
          setIsLoading(false);
          onNavigate('dashboard');
        } else {
          setError('Identifiants invalides. Utilisez les comptes démo ci-dessous.');
          setIsLoading(false);
        }
      }
    }, 400);
  };

  const handleFillDemo = (type: 'anta' | 'admin') => {
    if (type === 'anta') {
      setEmail('demo@xamxamhub.dev');
      setPassword('XamXamDemo2026!');
    } else {
      setEmail('admin@xamxamhub.dev');
      setPassword('AdminXamXam2026!');
    }
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <span className="font-mono font-black text-2xl text-white">X²</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Connexion à XamXam Hub
          </h1>
          <p className="text-xs text-slate-400">
            Rejoignez votre espace de collaboration et de développement.
          </p>
        </div>

        {/* Demo Quick-Fill Box for Hackathon Jury */}
        <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Comptes de démonstration (Jury)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Identifiants fournis pour tester instantanément tous les parcours du cahier des charges :
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleFillDemo('anta')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>Anta (Membre)</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                demo@xamxamhub.dev
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Saliou (Admin)</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                admin@xamxamhub.dev
              </div>
            </button>
          </div>
        </div>

        {/* Form Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Adresse email ou nom d'utilisateur
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="demo@xamxamhub.dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs text-sky-400 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Pas encore de compte ?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-sky-400 font-semibold hover:underline cursor-pointer"
            >
              Créer mon profil développeur
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
