import React, { useState } from 'react';
import { 
  Trophy, HelpCircle, FolderGit2, Users, ArrowRight, CheckCircle2, 
  Flame, Sparkles, PlusCircle, Clock, Zap, Star, MessageSquare, Terminal, Eye
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { BadgeIcon } from '../components/common/BadgeIcon';

interface DashboardPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const currentUser = StorageService.getCurrentUser() || {
    id: 'user-demo',
    displayName: 'Anta Diop',
    username: 'anta_dev',
    reputation: 145,
    badges: ['badge-1', 'badge-2', 'badge-8']
  };

  const questions = StorageService.getQuestions();
  const challenges = StorageService.getChallenges();
  const projects = StorageService.getProjects();
  const developers = StorageService.getUsers().filter(u => u.id !== currentUser.id);

  const activeChallenge = challenges.find(c => c.status === 'active') || challenges[0];
  const unresolvedQuestions = questions.filter(q => q.status === 'unresolved');
  const openProjects = projects.filter(p => p.status === 'open');

  // Filter for Flux technique
  const [filterTech, setFilterTech] = useState<'all' | 'unresolved' | 'resolved'>('all');

  const filteredQuestions = questions.filter(q => {
    if (filterTech === 'unresolved') return q.status === 'unresolved';
    if (filterTech === 'resolved') return q.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* WELCOME BANNER (Hero Command Center) */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-[#102A43] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                DEVELOPER COMMAND CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">Dakar GMT+0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Salut, {currentUser.displayName.split(' ')[0]}. Prête à construire quelque chose ?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Voici ce qui mérite ton attention aujourd'hui sur le réseau tech africain.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Réputation</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-mono font-bold text-sky-400">{currentUser.reputation}</span>
                <span className="text-[10px] text-slate-400">pts</span>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Rang communauté</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-mono font-bold text-amber-400">#4</span>
                <span className="text-[10px] text-slate-400">du mois</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('ask-question')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Poser une question</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODULE 1 — DEVELOPER PULSE (Live Community Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigate('questions')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between text-sky-400">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px] font-mono bg-sky-500/10 px-2 py-0.5 rounded text-sky-300">Entraide</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{questions.length}</div>
          <p className="text-xs text-slate-400">Questions & discussions actives</p>
        </div>

        <div 
          onClick={() => onNavigate('questions', { filter: 'unresolved' })}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between text-amber-400">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-mono bg-amber-500/10 px-2 py-0.5 rounded text-amber-300">À aider</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{unresolvedQuestions.length}</div>
          <p className="text-xs text-slate-400">Questions sans solution (+10 pts)</p>
        </div>

        <div 
          onClick={() => onNavigate('challenges')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">Actif</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">1 Défi</div>
          <p className="text-xs text-slate-400">Challenge hebdo en cours (+50 pts)</p>
        </div>

        <div 
          onClick={() => onNavigate('projects')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between text-blue-400">
            <FolderGit2 className="w-4 h-4" />
            <span className="text-[10px] font-mono bg-blue-500/10 px-2 py-0.5 rounded text-blue-300">Équipes</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{openProjects.length}</div>
          <p className="text-xs text-slate-400">Projets cherchant des coéquipiers</p>
        </div>

      </div>

      {/* ASYMMETRIC GRID: MAIN COLUMN & SECONDARY COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT / MAIN COLUMN (Modules 2, 3, 4) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* MODULE 2 — FOCUS DU JOUR (Weekly Challenge Spotlight) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-[#102A43] border border-sky-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Focus du jour · Défi Hebdomadaire</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold">
                Fin dans 6 jours
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white leading-snug">
                {activeChallenge.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {activeChallenge.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {activeChallenge.technologies.map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px]">
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-mono">
                {activeChallenge.entries.length} contributions soumises
              </span>
              <button
                onClick={() => onNavigate('challenge-detail', { id: activeChallenge.id })}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Relever le défi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MODULE 3 — FLUX TECHNIQUE (Questions Feed with Filters) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-bold text-white">Flux Technique Récent</h3>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterTech('all')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterTech === 'all' ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilterTech('unresolved')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterTech === 'unresolved' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sans réponse
                </button>
                <button
                  onClick={() => setFilterTech('resolved')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterTech === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Résolues
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredQuestions.slice(0, 4).map(q => (
                <div
                  key={q.id}
                  onClick={() => onNavigate('question-detail', { id: q.id })}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>@{q.authorName}</span>
                      <span>·</span>
                      <span>{new Date(q.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                      {q.status === 'resolved' && (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Résolue
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors text-sm">
                      {q.title}
                    </h4>
                    <div className="flex gap-1.5 text-[10px] font-mono text-sky-400">
                      {q.tags.map(t => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs text-slate-400 font-mono shrink-0 gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <span className="font-bold text-slate-200">{q.score} votes</span>
                    <span className="text-[11px] text-sky-400">{q.answers.length} réponse{q.answers.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigate('questions')}
                className="text-xs text-sky-400 hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <span>Accéder à toutes les questions techniques</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MODULE 4 — RADAR DE COLLABORATION (Projects Seeking Teammates) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Radar de Collaboration</h3>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-sky-400 hover:underline font-medium cursor-pointer"
              >
                Explorer ({projects.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {openProjects.slice(0, 2).map(p => (
                <div
                  key={p.id}
                  onClick={() => onNavigate('project-detail', { id: p.id })}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{p.city}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 font-semibold">
                        {p.seatsAvailable} place{p.seatsAvailable > 1 ? 's' : ''}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px]">Par {p.ownerName}</span>
                    <span className="text-sky-400 font-semibold">Rejoindre →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT / SECONDARY COLUMN (Modules 5, 6, 7) */}
        <div className="space-y-8">
          
          {/* MODULE 6 — RÉPUTATION & BADGES */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Niveau & Réputation</span>
              </h3>
              <span className="text-xs font-mono font-bold text-sky-400">{currentUser.reputation} pts</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Progression vers Palier Mentor</span>
                <span className="font-mono text-slate-200 font-semibold">{currentUser.reputation} / 200 pts</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-blue-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (currentUser.reputation / 200) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                À 200 pts, débloquez le badge "Résolveur Certifié" et modérez les questions techniques.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Badges débloqués :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.badges?.map(bId => (
                  <BadgeIcon key={bId} badgeId={bId} size="sm" showLabel />
                ))}
              </div>
            </div>
          </div>

          {/* MODULE 5 — ACTIVITÉ PERSONNELLE (Timeline) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>Activité Récente</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Live</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-slate-200 font-medium">Réponse validée sur Wave Webhook</p>
                  <p className="text-[10px] text-slate-400 font-mono">+15 pts · Il y a 2 jours</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-slate-200 font-medium">Participation au défi Offline-First (Bokk-Sync)</p>
                  <p className="text-[10px] text-slate-400 font-mono">+20 pts · Il y a 3 jours</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-slate-200 font-medium">Projet Suxali Santé publié</p>
                  <p className="text-[10px] text-slate-400 font-mono">1 candidature reçue</p>
                </div>
              </div>
            </div>
          </div>

          {/* MODULE 7 — DÉVELOPPEURS À DÉCOUVRIR */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Développeurs à Découvrir</span>
              </h3>
              <button
                onClick={() => onNavigate('developers')}
                className="text-xs text-sky-400 hover:underline cursor-pointer"
              >
                Annuaire
              </button>
            </div>

            <div className="space-y-3">
              {developers.slice(0, 3).map(dev => (
                <div
                  key={dev.id}
                  onClick={() => onNavigate('developer-profile', { id: dev.id })}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/60 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dev.avatarUrl}
                      alt={dev.displayName}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-200 text-xs">{dev.displayName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{dev.city} · {dev.reputation} pts</p>
                    </div>
                  </div>
                  <span className="text-sky-400 text-xs font-semibold">Profil →</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
