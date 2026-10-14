import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, CheckCircle2, Trophy, FolderGit2, Users, 
  HelpCircle, Code2, Flame, Bot, ShieldCheck, Zap, Globe, MessageSquare 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';

interface LandingPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const currentUser = StorageService.getCurrentUser();
  const questions = StorageService.getQuestions();
  const challenges = StorageService.getChallenges();
  const projects = StorageService.getProjects();
  const users = StorageService.getUsers();

  const activeChallenge = challenges.find(c => c.status === 'active') || challenges[0];
  const topQuestions = questions.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  // IA Interactive Preview demo in landing
  const [aiInput, setAiInput] = useState('erreur token wave expirée webhook node');
  const [aiOutput, setAiOutput] = useState<{ title: string; exp: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const testAiImprovement = async () => {
    setAiLoading(true);
    const res = await AIService.improveTitle(aiInput);
    setAiOutput({ title: res.improvedTitle, exp: res.explanation });
    setAiLoading(false);
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle geometric pattern in background */}
        <div className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-400 text-xs font-mono font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            Built by African Developers · Systalink Challenge 2026
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Le savoir se partage. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500">
              L’innovation se construit
            </span> ensemble.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            La communauté où les développeurs africains partagent leurs solutions techniques, relèvent des défis hebdomadaires et trouvent les talents avec qui bâtir les applications de demain.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate(currentUser ? 'dashboard' : 'register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-sky-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{currentUser ? 'Ouvrir mon Command Center' : 'Rejoindre la communauté'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('questions')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              Explorer les solutions
            </button>
          </div>

          {/* MINI-DASHBOARD REALISTIC PREVIEW (Command Center Snapshot) */}
          <div className="pt-8">
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden p-4 sm:p-6 text-left">
              
              {/* Window header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-2 text-slate-300 font-semibold">xamxam-hub.dev/command-center</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sky-400">● 18 dev en ligne à Dakar & Abidjan</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                    v1.1 Live
                  </span>
                </div>
              </div>

              {/* Grid inside window */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Panel 1: Top Question resolved */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solution Validée
                    </span>
                    <span className="text-slate-400 font-bold">+15 pts</span>
                  </div>
                  <h4 className="font-semibold text-slate-100 text-sm line-clamp-2">
                    Synchronisation hors-ligne avec IndexedDB et idempotence UUID
                  </h4>
                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    Par Fatou Ndiaye (Lead Tech Dakar) : contrainte d’unicité SQL + queue séquentielle.
                  </p>
                  <div className="flex gap-1 pt-1 font-mono text-[10px] text-sky-400">
                    <span>#Offline-First</span> · <span>#React</span> · <span>#PostgreSQL</span>
                  </div>
                </div>

                {/* Panel 2: Active Challenge */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/40 to-slate-950/80 border border-sky-500/30 space-y-2">
                  <div className="flex items-center justify-between text-sky-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Trophy className="w-3.5 h-3.5" /> Défi Hebdomadaire
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">Actif</span>
                  </div>
                  <h4 className="font-semibold text-slate-100 text-sm line-clamp-2">
                    Architecture résiliente aux coupures 4G de 48h
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    3 solutions soumises · Clôture dans 6 jours · Leader : Bokk-Sync
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Difficulté : Intermédiaire</span>
                    <span className="text-amber-400 font-bold">+50 pts</span>
                  </div>
                </div>

                {/* Panel 3: Open Project */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-amber-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1 font-semibold">
                      <FolderGit2 className="w-3.5 h-3.5" /> Recrutement Coéquipiers
                    </span>
                    <span className="text-emerald-400 font-bold">2 places dispo</span>
                  </div>
                  <h4 className="font-semibold text-slate-100 text-sm line-clamp-2">
                    Suxali Santé — Carnet de santé numérique décentralisé
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    Porté par Anta Diop · Recherche : FastAPI & Sécurité des données
                  </p>
                  <div className="flex gap-1 pt-1 font-mono text-[10px] text-slate-400">
                    <span>Dakar / À distance</span> · <span className="text-sky-400 font-semibold">Candidater</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. LE PROBLÈME & LA SOLUTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Problème */}
          <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-4">
            <div className="inline-flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Le Constat Actuel
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Les bonnes réponses se perdent dans des boucles éphémères.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              En Afrique, l'entraide technique s'est réfugiée dans des groupes WhatsApp, Telegram ou Discord. Conséquence directe : les mêmes questions reviennent sans cesse, les solutions précieuses restent invisibles pour les moteurs de recherche, et trouver un coéquipier fiable relève du parcours du combattant.
            </p>
            <div className="space-y-2 pt-2 text-xs text-rose-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-rose-400">✕</span> Pas de capitalisation des connaissances locales (APIs locales, coupures réseau)
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-rose-400">✕</span> Pas de validation technique structurée par les pairs
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-rose-400">✕</span> Isolement des développeurs solos ou juniors
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="p-8 rounded-2xl bg-sky-950/20 border border-sky-800/40 space-y-4">
            <div className="inline-flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              La Réponse XamXam Hub
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Un écosystème centralisé, transparent et axé sur l’action.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              XamXam (« le savoir » en wolof) crée la passerelle manquante : les questions sont formatées proprement, résolues collectivement, enrichies par une assistance IA mesurée, et les membres unissent leurs forces sur de vrais projets.
            </p>
            <div className="space-y-2 pt-2 text-xs text-sky-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sky-400">✓</span> Questions techniques de qualité avec réponses acceptées et votes
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sky-400">✓</span> Défis et débats hebdomadaires pour tester ses compétences
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sky-400">✓</span> Mise en relation directe sécurisée (partage de contacts après validation)
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. DÉFI HEBDOMADAIRE EN VEDETTE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider mb-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Défi Hebdomadaire · Contexte Continental</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeChallenge.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Niveau</span>
                <span className="text-xs font-bold text-sky-400">{activeChallenge.difficulty}</span>
              </div>
              <button
                onClick={() => onNavigate('challenge-detail', { id: activeChallenge.id })}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                Relever le défi (+20 pts)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-slate-300">
            <div className="md:col-span-2 space-y-3">
              <p className="leading-relaxed text-sm text-slate-300">
                {activeChallenge.description}
              </p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-slate-200">Signature locale :</strong> {activeChallenge.localContext}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {activeChallenge.technologies.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-slate-800 text-sky-300 font-mono text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="font-semibold text-slate-200 text-sm flex items-center justify-between">
                <span>Podium actuel</span>
                <span className="font-mono text-xs text-slate-400">{activeChallenge.entries.length} solutions</span>
              </div>
              <div className="space-y-2">
                {activeChallenge.entries.map((e, idx) => (
                  <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-400 text-xs">#{idx + 1}</span>
                      <span className="font-medium text-slate-200 text-xs">{e.authorName}</span>
                    </div>
                    <span className="font-mono text-xs text-amber-400 font-bold">{e.score} votes</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('challenges')}
                className="w-full text-center text-xs text-sky-400 hover:underline pt-1 cursor-pointer font-medium"
              >
                Consulter les archives et critères →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUESTIONS TECHNIQUES & ENTRAIDE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400 mb-1">
              Entraide Développeur
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Questions concrètes. Réponses d’experts.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Des cas d'usage réels rencontrés dans les projets en Afrique francophone.
            </p>
          </div>
          <button
            onClick={() => onNavigate('questions')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Toutes les questions ({questions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topQuestions.map(q => (
            <div
              key={q.id}
              onClick={() => onNavigate('question-detail', { id: q.id })}
              className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">@{q.authorName}</span>
                  {q.status === 'resolved' ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Résolue
                    </span>
                  ) : (
                    <span className="text-amber-400">En attente</span>
                  )}
                </div>

                <h3 className="font-bold text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-2 text-sm">
                  {q.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {q.body.slice(0, 120)}...
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span>{q.score} votes</span>
                  <span>·</span>
                  <span>{q.answers.length} réponse{q.answers.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex gap-1 text-sky-400 text-[10px]">
                  {q.tags.slice(0, 2).map(t => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RADAR DE PROJETS & COÉQUIPIERS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              Matchmaking de Talents
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trouve ton équipe. Bâtis un projet qui compte.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Rejoins des projets ouverts ou recrute des compétences complémentaires.
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Explorer tous les projets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map(p => (
            <div
              key={p.id}
              onClick={() => onNavigate('project-detail', { id: p.id })}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 cursor-pointer shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">{p.city}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    p.status === 'open' 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.status === 'open' ? `${p.seatsAvailable} place${p.seatsAvailable > 1 ? 's' : ''} libre${p.seatsAvailable > 1 ? 's' : ''}` : 'Équipe complète'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-1">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {p.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
                    Compétences recherchées :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skillsNeeded.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Par {p.ownerName}</span>
                <span className="text-sky-400 font-semibold group-hover:underline">Voir le projet →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DÉMONSTRATEUR ASSISTANCE IA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900 border border-sky-500/40 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>Assistance IA XamXam (US-AI-01 & US-AI-02)</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Une IA dédiée à la clarté technique, pas un simple chatbot.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Avant de publier une question, l'assistant reformule le titre pour attirer les experts et synthétise les points clés. Testez-le en direct :
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Ex : comment faire un token wave en node js"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={testAiImprovement}
                disabled={aiLoading}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiLoading ? 'Optimisation...' : 'Améliorer le titre'}</span>
              </button>
            </div>

            {aiOutput && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-sky-300 font-mono text-[10px]">
                  <span>PROPOSITION OPTIMISÉE POUR LA COMMUNAUTÉ :</span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Généré par IA</span>
                </div>
                <p className="font-semibold text-slate-100 text-sm">{aiOutput.title}</p>
                <p className="text-slate-400 text-[11px] italic">{aiOutput.exp}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. APPEL À L'ACTION FINAL */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ta prochaine grande idée commence ici.
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Rejoins Anta, Saliou, Fatou, Moussa et des centaines de développeurs africains pour faire rayonner le code produit sur le continent.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'register')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-sky-500/25 transition transform active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <span>{currentUser ? 'Accéder à mon tableau de bord' : 'Créer mon compte gratuit'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
