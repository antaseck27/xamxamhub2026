import React, { useState } from 'react';
import { 
  Send, FolderGit2, CheckCircle2, XCircle, Clock, Mail, Github, 
  Phone, ArrowRight, UserCheck, Shield, ExternalLink, AlertCircle 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { ProjectRequest } from '../types';

interface MyRequestsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const MyRequestsPage: React.FC<MyRequestsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentUser = StorageService.getCurrentUser();
  const allRequests = StorageService.getRequests();
  const allProjects = StorageService.getProjects();

  // Candidatures reçues pour les projets dont l'utilisateur connecté est porteur (US-PRJ-05)
  const myProjects = allProjects.filter(p => p.ownerId === currentUser?.id);
  const myProjectIds = myProjects.map(p => p.id);
  const receivedRequests = allRequests.filter(r => myProjectIds.includes(r.projectId));

  // Candidatures envoyées par l'utilisateur connecté (US-PRJ-09)
  const sentRequests = allRequests.filter(r => r.applicantId === currentUser?.id);

  const handleDecision = (requestId: string, action: 'accept' | 'reject') => {
    const res = StorageService.handleProjectRequest(requestId, action);
    if (res.success) {
      setFeedback(res.message || 'Décision enregistrée avec succès.');
      setTimeout(() => setFeedback(null), 4000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Gestion des Candidatures & Coéquipiers
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Suivez vos demandes d'intégration et sélectionnez les coéquipiers pour vos projets.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'received'
              ? 'text-sky-400 border-b-2 border-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Candidatures reçues ({receivedRequests.length})</span>
          {receivedRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'sent'
              ? 'text-sky-400 border-b-2 border-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Mes candidatures envoyées ({sentRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: RECEIVED REQUESTS (For Project Owners) */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <FolderGit2 className="w-10 h-10 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-200">Aucune candidature reçue</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Lorsque des développeurs postuleront à vos projets, leurs lettres de motivation et profils s'afficheront ici.
              </p>
            </div>
          ) : (
            receivedRequests.map(req => {
              const project = StorageService.getProjectById(req.projectId);
              return (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-mono text-slate-400 uppercase">
                        Projet concerné :
                      </span>
                      <h4 
                        onClick={() => onNavigate('project-detail', { id: req.projectId })}
                        className="font-bold text-sky-400 text-sm hover:underline cursor-pointer"
                      >
                        {req.projectTitle}
                      </h4>
                    </div>

                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                        req.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : req.status === 'accepted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {req.status === 'pending' ? '⏳ En attente de votre décision' : req.status === 'accepted' ? '✓ Membre accepté' : '✕ Refusée'}
                      </span>
                    </div>
                  </div>

                  {/* Applicant Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={req.applicantAvatar}
                      alt={req.applicantName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{req.applicantName}</h4>
                        <span className="text-xs font-mono text-sky-400 font-semibold">
                          ({req.applicantReputation} pts)
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 font-mono text-[11px] text-slate-400">
                        {req.applicantSkills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Motivation Message */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1 leading-relaxed">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
                      Motivation du candidat :
                    </span>
                    <p className="italic">« {req.message} »</p>
                  </div>

                  {/* Shared Contacts (US-PRJ-07: Revealed upon acceptance) */}
                  {req.status === 'accepted' && (
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
                      <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block">
                        Coordonnées partagées du candidat :
                      </span>
                      <div className="flex flex-wrap gap-4 text-slate-200 font-mono text-xs">
                        {req.shareContacts.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-sky-400" />
                            <span>{req.applicantEmail}</span>
                          </div>
                        )}
                        {req.shareContacts.github && (
                          <div className="flex items-center gap-1.5">
                            <Github className="w-3.5 h-3.5 text-slate-400" />
                            <a href={req.applicantGithub} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                              {req.applicantGithub}
                            </a>
                          </div>
                        )}
                        {req.shareContacts.phone && req.applicantPhone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{req.applicantPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Accept / Reject actions (US-PRJ-06) */}
                  {req.status === 'pending' && (
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleDecision(req.id, 'reject')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                      >
                        Refuser
                      </button>
                      <button
                        onClick={() => handleDecision(req.id, 'accept')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accepter dans l’équipe</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: SENT REQUESTS */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Send className="w-10 h-10 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-200">Aucune candidature envoyée</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explorez les projets collaboratifs et proposez votre aide aux fondateurs.
              </p>
              <button
                onClick={() => onNavigate('projects')}
                className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
              >
                Explorer les projets
              </button>
            </div>
          ) : (
            sentRequests.map(req => {
              const project = StorageService.getProjectById(req.projectId);
              return (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <h4 
                        onClick={() => onNavigate('project-detail', { id: req.projectId })}
                        className="font-bold text-white text-base hover:text-sky-400 transition cursor-pointer"
                      >
                        {req.projectTitle}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Candidature transmise le {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                      req.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : req.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {req.status === 'pending' ? '⏳ En attente' : req.status === 'accepted' ? '✓ Candidature acceptée !' : '✕ Non retenue'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 leading-relaxed italic">
                    « {req.message} »
                  </div>

                  {/* Revealed Project Owner Contacts if accepted (US-PRJ-07) */}
                  {req.status === 'accepted' && project && (
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
                      <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block">
                        Félicitations ! Coordonnées du porteur de projet ({project.ownerName}) :
                      </span>
                      <div className="flex flex-wrap gap-4 text-slate-200 font-mono text-xs">
                        {project.ownerEmail && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-sky-400" />
                            <a href={`mailto:${project.ownerEmail}`} className="hover:underline">
                              {project.ownerEmail}
                            </a>
                          </div>
                        )}
                        {project.ownerGithub && (
                          <div className="flex items-center gap-1.5">
                            <Github className="w-3.5 h-3.5 text-slate-400" />
                            <a href={project.ownerGithub} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                              {project.ownerGithub}
                            </a>
                          </div>
                        )}
                        {project.ownerPhone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{project.ownerPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
