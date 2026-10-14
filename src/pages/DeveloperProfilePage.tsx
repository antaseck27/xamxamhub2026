import React, { useState } from 'react';
import { 
  User as UserIcon, MapPin, Github, Globe, ArrowLeft, Trophy, 
  HelpCircle, MessageSquare, FolderGit2, CheckCircle2, Sparkles, ExternalLink 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { BadgeIcon } from '../components/common/BadgeIcon';
import { User } from '../types';

interface DeveloperProfilePageProps {
  userId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const DeveloperProfilePage: React.FC<DeveloperProfilePageProps> = ({ 
  userId, onNavigate 
}) => {
  const users = StorageService.getUsers();
  const user = users.find(u => u.id === userId);
  const [activeTab, setActiveTab] = useState<'questions' | 'answers' | 'challenges' | 'badges'>('questions');

  const questions = StorageService.getQuestions();
  const challenges = StorageService.getChallenges();
  const projects = StorageService.getProjects();

  if (!user) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Profil introuvable</h2>
        <button
          onClick={() => onNavigate('developers')}
          className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs cursor-pointer"
        >
          Retour à l'annuaire
        </button>
      </div>
    );
  }

  const userQuestions = questions.filter(q => q.authorId === user.id);
  const userAnswers: { question: any; answer: any }[] = [];
  questions.forEach(q => {
    q.answers.forEach(a => {
      if (a.authorId === user.id) {
        userAnswers.push({ question: q, answer: a });
      }
    });
  });

  const userChallenges = challenges.flatMap(c => 
    c.entries.filter(e => e.authorId === user.id).map(e => ({ challenge: c, entry: e }))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('developers')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'annuaire</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-start gap-4 sm:gap-6">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-sky-400/40 shadow-xl"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white">{user.displayName}</h1>
              <p className="text-xs font-mono text-slate-400">@{user.username}</p>
              
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{user.city}, {user.country}</span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Réputation</span>
              <span className="text-xl font-bold font-mono text-sky-400">{user.reputation} pts</span>
            </div>

            <div className="flex items-center gap-2">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            À propos du développeur
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {user.bio}
          </p>
        </div>

        {/* Availability */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {user.availability.map(av => (
            <span
              key={av}
              className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20"
            >
              ● {av.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'questions' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Questions ({userQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('answers')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'answers' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Réponses ({userAnswers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'challenges' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Défis ({userChallenges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'badges' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Badges ({user.badges.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'questions' && (
          <div className="space-y-3">
            {userQuestions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Aucune question posée pour le moment.</p>
            ) : (
              userQuestions.map(q => (
                <div
                  key={q.id}
                  onClick={() => onNavigate('question-detail', { id: q.id })}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-200 text-sm hover:text-sky-400 transition">
                      {q.title}
                    </h4>
                    <div className="flex gap-1.5 text-[10px] font-mono text-sky-400">
                      {q.tags.map(t => <span key={t}>#{t}</span>)}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 shrink-0 ml-3">
                    {q.score} votes · {q.answers.length} rép.
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'answers' && (
          <div className="space-y-3">
            {userAnswers.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Aucune réponse apportée pour le moment.</p>
            ) : (
              userAnswers.map(({ question: q, answer: a }) => (
                <div
                  key={a.id}
                  onClick={() => onNavigate('question-detail', { id: q.id })}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-slate-300 font-semibold truncate">Sur : {q.title}</span>
                    {a.isAccepted && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0 ml-2">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solution Retenue
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {a.body}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-3">
            {userChallenges.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Aucune participation à un défi pour le moment.</p>
            ) : (
              userChallenges.map(({ challenge: ch, entry: e }) => (
                <div
                  key={e.id}
                  onClick={() => onNavigate('challenge-detail', { id: ch.id })}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-amber-400">{ch.title}</span>
                    <span className="text-slate-400">{e.score} votes</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{e.body}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.badges.map(bId => (
              <div key={bId} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <BadgeIcon badgeId={bId} size="lg" />
                <div>
                  <BadgeIcon badgeId={bId} showLabel />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
