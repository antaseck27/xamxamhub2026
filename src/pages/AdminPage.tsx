import React, { useState } from 'react';
import { 
  Shield, Users, Flag, Trophy, HelpCircle, FolderGit2, CheckCircle2, 
  XCircle, AlertTriangle, Eye, Lock, Check, Sparkles, Scale 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Report } from '../types';

interface AdminPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'reports' | 'users' | 'rules'>('stats');
  const [reports, setReports] = useState<Report[]>(() => StorageService.getReports());

  const users = StorageService.getUsers();
  const questions = StorageService.getQuestions();
  const challenges = StorageService.getChallenges();
  const projects = StorageService.getProjects();
  const requests = StorageService.getRequests();

  const handleReportAction = (reportId: string, action: 'resolved' | 'dismissed') => {
    StorageService.handleReport(reportId, action);
    setReports(StorageService.getReports());
  };

  const handleToggleBlockUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (user.role === 'admin') {
      alert('Impossible de bloquer le compte administrateur.');
      return;
    }
    user.isBlocked = !user.isBlocked;
    localStorage.setItem('xamxam_users_v1', JSON.stringify(users));
    window.dispatchEvent(new Event('xamxam-storage-updated'));
  };

  const openReports = reports.filter(r => r.status === 'open');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400 font-bold mb-1">
            <Shield className="w-4 h-4" />
            <span>Console Administration · Systalink 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Supervision & Modération
          </h1>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 self-start sm:self-auto">
          Rôle : Administrateur Système
        </span>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800 gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'stats' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Statistiques plateforme</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap relative ${
            activeTab === 'reports' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>File de Modération ({openReports.length})</span>
          {openReports.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'users' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Comptes utilisateurs ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'rules' ? 'text-sky-400 border-b-2 border-sky-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Barème de Réputation</span>
        </button>
      </div>

      {/* TAB 1: STATS (US-ADM-01) */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Utilisateurs inscrits</span>
              <div className="text-3xl font-extrabold font-mono text-white">{users.length}</div>
              <p className="text-[11px] text-emerald-400">● 100% profils vérifiés</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Questions posées</span>
              <div className="text-3xl font-extrabold font-mono text-sky-400">{questions.length}</div>
              <p className="text-[11px] text-slate-400">
                {questions.filter(q => q.status === 'resolved').length} solutions validées
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Défis hebdomadaires</span>
              <div className="text-3xl font-extrabold font-mono text-amber-400">{challenges.length}</div>
              <p className="text-[11px] text-slate-400">
                {challenges.reduce((acc, c) => acc + c.entries.length, 0)} solutions soumises
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Projets lancés</span>
              <div className="text-3xl font-extrabold font-mono text-blue-400">{projects.length}</div>
              <p className="text-[11px] text-slate-400">
                {projects.filter(p => p.status === 'open').length} ouverts au recrutement
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Candidatures équipes</span>
              <div className="text-3xl font-extrabold font-mono text-purple-400">{requests.length}</div>
              <p className="text-[11px] text-slate-400">
                {requests.filter(r => r.status === 'accepted').length} acceptations réussies
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Signalements en cours</span>
              <div className="text-3xl font-extrabold font-mono text-rose-400">{openReports.length}</div>
              <p className="text-[11px] text-slate-400">File de modération active</p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: MODERATION QUEUE (US-MOD-02 & MOD-03) */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              Aucun signalement enregistré. La communauté se comporte bien !
            </div>
          ) : (
            reports.map(rep => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                      Motif : {rep.reason}
                    </span>
                    <span className="text-slate-400">Cible : {rep.targetType}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    rep.status === 'open' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Statut : {rep.status === 'open' ? 'Ouvert' : 'Traité'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">« {rep.targetTitle} »</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Détails du signalement : {rep.details || 'Aucun détail fourni.'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Signalé par @{rep.reporterName} le {new Date(rep.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                {rep.status === 'open' && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleReportAction(rep.id, 'dismissed')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                    >
                      Rejeter le signalement
                    </button>
                    <button
                      onClick={() => handleReportAction(rep.id, 'resolved')}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Traiter & Masquer le contenu
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: USERS MANAGEMENT (US-ADM-02) */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <div
              key={u.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatarUrl}
                  alt={u.displayName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{u.displayName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">@{u.username} · {u.city} · {u.reputation} pts</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300">
                  {u.role}
                </span>

                {u.role !== 'admin' && (
                  <button
                    onClick={() => handleToggleBlockUser(u.id)}
                    className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition ${
                      u.isBlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20'
                    }`}
                  >
                    {u.isBlocked ? 'Débloquer' : 'Bloquer le compte'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: REPUTATION SCALE (US-REP-06) */}
      {activeTab === 'rules' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-400" />
            <span>Barème Officiel de Réputation XamXam Hub</span>
          </h3>

          <div className="divide-y divide-slate-800">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-300">Réponse acceptée comme solution officielle</span>
              <span className="font-mono font-bold text-emerald-400">+15 points</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-300">Vote positif reçu sur une réponse</span>
              <span className="font-mono font-bold text-emerald-400">+10 points</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-300">Vote positif reçu sur une question posée</span>
              <span className="font-mono font-bold text-sky-400">+5 points</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-300">Première contribution à un défi hebdomadaire</span>
              <span className="font-mono font-bold text-amber-400">+20 points</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-300">Victoire d'un défi hebdomadaire (clôture)</span>
              <span className="font-mono font-bold text-yellow-400">+50 points</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-300">Vote négatif reçu sur un contenu</span>
              <span className="font-mono font-bold text-rose-400">-2 points</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
