import React from 'react';
import { Trophy, Clock, Flame, ArrowRight, CheckCircle2, Award, Sparkles, Code2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Challenge } from '../types';

interface ChallengesPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({ onNavigate }) => {
  const challenges = StorageService.getChallenges();
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const archivedChallenges = challenges.filter(c => c.status === 'archived');

  return (
    <div className="space-y-10 pb-16">
      
      {/* Page Header */}
      <div className="space-y-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>Systalink Challenge 2026 · Défis Hebdomadaires</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Défis Techniques & Débats d'Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Chaque semaine, un défi concret inspiré des réalités du continent (connexion instable, solar micro-grid, mobile money). Proposez votre solution, votez pour vos pairs et grimpez au classement.
        </p>
      </div>

      {/* ACTIVE CHALLENGE SECTION (Spotlight) */}
      {activeChallenges.map(challenge => (
        <div
          key={challenge.id}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#102A43] border-2 border-sky-500/40 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Défi Actif de la Semaine
              </span>
              <span className="text-xs font-mono text-slate-400">· Clôture dans 6 jours</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                Difficulté : {challenge.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                +20 pts participation / +50 pts victoire
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              {challenge.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {challenge.description}
            </p>
          </div>

          {/* Local context callout */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-sky-400 uppercase tracking-wide text-[10px] block font-mono">
              🌍 Signature locale & Enjeu africain :
            </span>
            <p>{challenge.localContext}</p>
          </div>

          {/* Technologies and CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {challenge.technologies.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-slate-800 text-sky-300">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {challenge.entries.length} contributions soumises
              </span>
              <button
                onClick={() => onNavigate('challenge-detail', { id: challenge.id })}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center gap-2"
              >
                <span>Participer au défi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ARCHIVED CHALLENGES */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Archives des Défis Passés</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archivedChallenges.map(arch => (
            <div
              key={arch.id}
              onClick={() => onNavigate('challenge-detail', { id: arch.id })}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Clôturé le {new Date(arch.endsAt).toLocaleDateString('fr-FR')}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Archivé</span>
              </div>

              <h4 className="font-bold text-slate-100 text-sm">
                {arch.title}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-2">
                {arch.description}
              </p>

              {arch.winnerName && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 flex items-center gap-1 font-medium">
                    <Trophy className="w-3.5 h-3.5" /> Vainqueur : {arch.winnerName}
                  </span>
                  <span className="text-sky-400 font-semibold">Voir solutions →</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
