import React, { useState } from 'react';
import { 
  FolderGit2, Users, MapPin, ArrowLeft, Send, CheckCircle2, 
  ExternalLink, Mail, Phone, Github, Shield, AlertCircle, X, Sparkles 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Project } from '../types';

interface ProjectDetailPageProps {
  projectId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ 
  projectId, onNavigate 
}) => {
  const [project, setProject] = useState<Project | undefined>(() => StorageService.getProjectById(projectId));
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [motivationMsg, setMotivationMsg] = useState('');
  const [shareContacts, setShareContacts] = useState({ email: true, github: true, phone: false });
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  const currentUser = StorageService.getCurrentUser();
  const allRequests = StorageService.getRequests();

  const reload = () => {
    setProject(StorageService.getProjectById(projectId));
  };

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Projet introuvable</h2>
        <button
          onClick={() => onNavigate('projects')}
          className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs cursor-pointer"
        >
          Retour aux projets
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.id === project.ownerId;
  const isMember = project.team.some(m => m.userId === currentUser?.id);
  const userRequest = currentUser 
    ? allRequests.find(r => r.projectId === project.id && r.applicantId === currentUser.id)
    : null;

  const handleSendJoinRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivationMsg.trim() || motivationMsg.trim().length < 15) {
      alert('Veuillez saisir un message de motivation d’au moins 15 caractères.');
      return;
    }

    const res = StorageService.sendProjectRequest(project.id, motivationMsg.trim(), shareContacts);
    if (res.success) {
      setFeedback({ text: res.message || 'Demande envoyée !' });
      setIsJoinModalOpen(false);
      setMotivationMsg('');
      setTimeout(() => setFeedback(null), 4000);
      reload();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Back button & Owner CTA */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('projects')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tous les projets</span>
        </button>

        {isOwner && (
          <button
            onClick={() => onNavigate('my-requests')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition cursor-pointer"
          >
            Gérer les candidatures reçues →
          </button>
        )}
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
          feedback.error 
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }`}>
          {feedback.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* PROJECT HEADER CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> {project.city}
              </span>
              <span>·</span>
              <span>Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              project.status === 'open' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {project.status === 'open' 
                ? `${project.seatsAvailable} place${project.seatsAvailable > 1 ? 's' : ''} libre${project.seatsAvailable > 1 ? 's' : ''}` 
                : 'Équipe complète'}
            </span>

            {/* Application button / status */}
            {!isOwner && !isMember && (
              <>
                {userRequest ? (
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                    Candidature : {userRequest.status === 'pending' ? '⏳ En attente d’examen' : userRequest.status === 'accepted' ? '✓ Acceptée !' : '✕ Refusée'}
                  </span>
                ) : project.status === 'open' ? (
                  <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Je veux rejoindre (+motivation)</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">Ce projet est complet.</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Description & Objective */}
        <div className="space-y-4 text-sm text-slate-200 leading-relaxed">
          <div>
            <h3 className="font-bold text-white text-base mb-1">À propos du projet</h3>
            <p className="text-slate-300">{project.description}</p>
          </div>

          {project.objective && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <span className="text-sky-400 font-mono font-bold uppercase tracking-wider block">
                Objectif visé :
              </span>
              <p className="text-slate-300">{project.objective}</p>
            </div>
          )}

          {/* Stack & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide block">
                Technologies utilisées :
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {project.technologies.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-slate-800 text-sky-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide block">
                Profils recherchés :
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {project.skillsNeeded.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-md bg-slate-800 text-amber-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM MEMBERS SECTION (US-PRJ-03 & US-PRJ-07) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            <span>Équipe du projet ({project.team.length} / {project.seatsTotal})</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {project.seatsAvailable} place{project.seatsAvailable > 1 ? 's' : ''} restante{project.seatsAvailable > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.team.map(member => (
            <div
              key={member.userId}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">{member.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{member.role}</p>
                </div>
              </div>

              {/* Private contacts revealed ONLY to team members or project owner (US-PRJ-07) */}
              {(isOwner || isMember) ? (
                <div className="flex items-center gap-1.5 text-slate-400">
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:text-sky-400 hover:bg-slate-800 transition"
                      title="GitHub partagé"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-lg hover:text-sky-400 hover:bg-slate-800 transition"
                      title="Email direct"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 italic">
                  Contacts masqués
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* APPLICATION MODAL (US-PRJ-04) */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <span>Rejoindre « {project.title.slice(0, 30)}... »</span>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendJoinRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Message de motivation pour le porteur (≤ 500 caractères)
                </label>
                <textarea
                  value={motivationMsg}
                  onChange={e => setMotivationMsg(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Présentez brièvement vos compétences, vos disponibilités et ce que vous souhaitez apporter au projet..."
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <span className="text-[11px] font-mono text-slate-400 float-right mt-1">
                  {motivationMsg.length}/500 car.
                </span>
              </div>

              {/* Contact sharing choices (US-PRJ-07) */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-slate-300">
                  Coordonnées à révéler au porteur de projet en cas d'acceptation :
                </label>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareContacts.email}
                      onChange={e => setShareContacts({ ...shareContacts, email: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-800 text-sky-500"
                    />
                    <span>Partager mon adresse email ({currentUser?.email})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareContacts.github}
                      onChange={e => setShareContacts({ ...shareContacts, github: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-800 text-sky-500"
                    />
                    <span>Partager mon profil GitHub ({currentUser?.githubUrl})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareContacts.phone}
                      onChange={e => setShareContacts({ ...shareContacts, phone: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-800 text-sky-500"
                    />
                    <span>Partager mon numéro WhatsApp / Téléphone ({currentUser?.phone || '+221 77 ...'})</span>
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  🔒 Ces informations ne seront jamais publiques et restent strictement confidentielles jusqu’à l'acceptation de votre candidature.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer ma candidature</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
