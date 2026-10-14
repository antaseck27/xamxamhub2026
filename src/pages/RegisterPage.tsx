import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storage';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', percent: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Faible', color: 'bg-rose-500', percent: 25 };
    if (score === 2) return { label: 'Moyen', color: 'bg-amber-500', percent: 50 };
    if (score === 3) return { label: 'Bon', color: 'bg-sky-500', percent: 75 };
    return { label: 'Robuste', color: 'bg-emerald-500', percent: 100 };
  };

  const strength = getPasswordStrength();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!username || username.trim().length < 3) {
      newErrors.username = 'Le nom d’utilisateur doit comporter au moins 3 caractères.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      newErrors.username = 'Lettres, chiffres, tirets et underscores uniquement.';
    }

    if (!displayName || displayName.trim().length < 2) {
      newErrors.displayName = 'Veuillez saisir votre nom complet.';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Veuillez saisir une adresse email valide.';
    }

    if (!password || password.length < 8) {
      newErrors.password = 'Le mot de passe doit comporter au moins 8 caractères.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Vous devez accepter les conditions et le code de conduite.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSuccess(true);

    setTimeout(() => {
      StorageService.registerUser({
        email,
        username: username.toLowerCase().trim(),
        displayName: displayName.trim()
      });
      onNavigate('dashboard');
    }, 800);
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
            Créer un compte XamXam
          </h1>
          <p className="text-xs text-slate-400">
            Rejoignez la plus grande communauté de codeurs d'Afrique de l'Ouest et au-delà.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Bienvenue sur XamXam Hub !</h3>
            <p className="text-xs text-slate-300">
              Votre compte a été initialisé. Redirection automatique vers votre Developer Command Center...
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nom d'utilisateur unique (@username)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-sm">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="anta_code"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                {errors.username && <p className="text-rose-400 text-[11px] mt-1">{errors.username}</p>}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nom affiché complet
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Anta Diop"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                {errors.displayName && <p className="text-rose-400 text-[11px] mt-1">{errors.displayName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="anta@tech.sn"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mot de passe (≥ 8 caractères)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Sécurité : {strength.label}</span>
                      <span>8+ car., Maj., Chiffre</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-rose-400 text-[11px] mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                {errors.confirmPassword && <p className="text-rose-400 text-[11px] mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Consent Terms Checkbox (US-AUTH-02) */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-sky-500"
                  />
                  <span>
                    J'accepte les conditions d'utilisation, le code de conduite de la communauté et la politique de confidentialité de XamXam Hub.
                  </span>
                </label>
                {errors.terms && <p className="text-rose-400 text-[11px] mt-1">{errors.terms}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Créer mon compte</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              Déjà inscrit ?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-sky-400 font-semibold hover:underline cursor-pointer"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
