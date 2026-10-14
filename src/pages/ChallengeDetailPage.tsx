import React, { useState } from 'react';
import { 
  Trophy, ThumbsUp, ArrowLeft, Send, ExternalLink, Sparkles, 
  CheckCircle2, Clock, Shield, AlertCircle, Code2, Link as LinkIcon 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Challenge } from '../types';

interface ChallengeDetailPageProps {
  challengeId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ChallengeDetailPage: React.FC<ChallengeDetailPageProps> = ({ 
  challengeId, onNavigate 
}) => {
  const [challenge, setChallenge] = useState<Challenge | undefined>(() => StorageService.getChallengeById(challengeId));
  const [entryBody, setEntryBody] = useState('');
  const [entryLink, setEntryLink] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentUser = StorageService.getCurrentUser();

  const reload = () => {
    setChallenge(StorageService.getChallengeById(challengeId));
  };

  if (!challenge) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Défi introuvable</h2>
        <button
          onClick={() => onNavigate('challenges')}
          className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs cursor-pointer"
        >
          Retour aux défis
        </button>
      </div>
    );
  }

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryBody.trim() || entryBody.trim().length < 30) {
      alert('Veuillez détailler votre solution ou démarche en au moins 30 caractères.');
      return;
    }

    const res = StorageService.addChallengeEntry(challenge.id, entryBody.trim(), entryLink.trim() || undefined);
    if (res.success) {
      setFeedback(res.message || 'Participation enregistrée !');
      setEntryBody('');
      setEntryLink('');
      setTimeout(() => setFeedback(null), 4000);
      reload();
    } else {
      alert(res.message);
    }
  };

  const handleVoteEntry = (entryId: string) => {
    const res = StorageService.voteChallengeEntry(challenge.id, entryId);
    if (!res.success) {
      alert(res.message);
    } else {
      reload();
    }
  };

  // Sort entries by score descending
  const sortedEntries = [...challenge.entries].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('challenges')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tous les défis</span>
        </button>

        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
          challenge.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
        }`}>
          {challenge.status === 'active' ? '● Défi en cours' : 'Défi archivé'}
        </span>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* CHALLENGE HERO DETAILS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase">
            <Trophy className="w-4 h-4" />
            <span>Défi Hebdomadaire · {challenge.type === 'mini-project' ? 'Mini-Défi Technique' : 'Débat d’idées'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {challenge.title}
          </h1>

          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-400">
              Difficulté : {challenge.difficulty}
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-400">
              +20 pts à la première contribution
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400">
              +50 pts pour le vainqueur
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-200 leading-relaxed">
          <p>{challenge.description}</p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <span className="text-sky-400 font-bold font-mono uppercase tracking-wider block">
              Contexte local :
            </span>
            <p className="text-slate-300">{challenge.localContext}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 block">Technologies recommandées :</span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {challenge.technologies.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LIVE LEADERBOARD / CONTRIBUTIONS (US-CH-05) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Classement en direct ({sortedEntries.length} participations)</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Votes communautaires</span>
        </div>

        {sortedEntries.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
            Aucune solution soumise pour l'instant. Soyez le premier à relever ce défi !
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry, idx) => {
              const userVoted = currentUser && entry.votes[currentUser.id];
              return (
                <div
                  key={entry.id}
                  className={`p-6 rounded-2xl border transition shadow-lg space-y-4 ${
                    idx === 0 
                      ? 'bg-slate-900 border-amber-500/40 shadow-amber-950/20' 
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded font-black ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{idx + 1}
                      </span>
                      <img
                        src={entry.authorAvatar}
                        alt={entry.authorName}
                        className="w-5 h-5 rounded-md object-cover border border-slate-700"
                      />
                      <span className="font-semibold text-slate-200">@{entry.authorName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVoteEntry(entry.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition cursor-pointer text-xs font-mono ${
                          userVoted 
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold' 
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-400'
                        }`}
                        title="Voter pour cette solution"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{entry.score} votes</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {entry.body}
                  </p>

                  {entry.linkUrl && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href={entry.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:underline font-mono"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Voir le dépôt / démo : {entry.linkUrl}</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUBMISSION FORM (US-CH-03) */}
      {challenge.status === 'active' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Soumettre ma solution pour ce défi</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              +20 pts de réputation
            </span>
          </div>

          <form onSubmit={handleSubmitEntry} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description de votre architecture ou argument (≥ 30 caractères)
              </label>
              <textarea
                value={entryBody}
                onChange={e => setEntryBody(e.target.value)}
                rows={4}
                placeholder="Expliquez comment votre solution répond aux contraintes (ex: idempotence, synchronisation en tâche de fond, compression)..."
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lien vers le dépôt GitHub ou la démo en ligne (optionnel)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={entryLink}
                  onChange={e => setEntryLink(e.target.value)}
                  placeholder="https://github.com/mon-username/mon-projet-offline"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enregistrer ma participation (+20 pts)</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
