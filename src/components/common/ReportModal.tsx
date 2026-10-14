import React, { useState } from 'react';
import { Flag, X, AlertTriangle } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'question' | 'answer' | 'comment' | 'entry';
  targetId: string;
  targetTitle: string;
  onSuccess?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen, onClose, targetType, targetId, targetTitle, onSuccess
}) => {
  const [reason, setReason] = useState<'spam' | 'off_topic' | 'disrespectful' | 'other'>('spam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = StorageService.getCurrentUser();
    if (!currentUser) return;

    StorageService.submitReport({
      reporterId: currentUser.id,
      reporterName: currentUser.displayName,
      targetType,
      targetId,
      targetTitle,
      reason,
      details
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 font-semibold">
            <Flag className="w-5 h-5" />
            <span>Signaler un contenu</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              ✓
            </div>
            <p className="text-emerald-400 font-medium">Signalement transmis à l'équipe de modération.</p>
            <p className="text-xs text-slate-400">Merci de contribuer à la sécurité de XamXam Hub.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-slate-400">
              Élément signalé : <span className="font-semibold text-slate-200">{targetTitle}</span>
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Motif principal</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="spam">Spam ou publicité abusive</option>
                <option value="off_topic">Hors sujet / Sans rapport technique</option>
                <option value="disrespectful">Propos irrespectueux ou agressifs</option>
                <option value="other">Autre problème de contenu</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Précisions supplémentaires (max 300 car.)
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                maxLength={300}
                rows={3}
                placeholder="Expliquez brièvement pourquoi ce contenu enfreint les règles..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Les abus de signalement peuvent entraîner des sanctions sur votre compte.</span>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 font-medium transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-sm text-white font-medium transition cursor-pointer"
              >
                Envoyer le signalement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
