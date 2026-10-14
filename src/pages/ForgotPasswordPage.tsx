import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <span className="font-mono font-black text-2xl text-white">X²</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Récupération de compte
          </h1>
          <p className="text-xs text-slate-400">
            Recevez un lien temporaire pour réinitialiser votre mot de passe.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Lien de réinitialisation généré</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Si un compte est associé à <strong className="text-sky-400">{email}</strong>, un jeton sécurisé valide pendant 1 heure a été simulé.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-left">
                ℹ️ <strong>Note prototype :</strong> En l'absence de serveur SMTP de production, vous pouvez directement utiliser les identifiants démo fournis sur la page de connexion.
              </div>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition cursor-pointer"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Votre adresse email enregistrée
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="demo@xamxamhub.dev"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Un jeton unique expirant dans 60 minutes sera simulé.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition cursor-pointer"
              >
                Envoyer le lien de réinitialisation
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition cursor-pointer pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour à la page de connexion</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
