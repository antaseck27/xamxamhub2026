import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, MessageSquare, Trophy, FolderGit2, 
  ThumbsUp, Sparkles, Check, ArrowRight 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Notification } from '../types';

interface NotificationsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => StorageService.getNotifications());

  const sync = () => {
    setNotifications(StorageService.getNotifications());
  };

  useEffect(() => {
    window.addEventListener('xamxam-storage-updated', sync);
    return () => window.removeEventListener('xamxam-storage-updated', sync);
  }, []);

  const handleMarkAll = () => {
    StorageService.markAllNotificationsAsRead();
    sync();
  };

  const handleItemClick = (notif: Notification) => {
    StorageService.markNotificationAsRead(notif.id);
    onNavigate(notif.linkPage, notif.linkId ? { id: notif.linkId } : undefined);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'accepted_answer': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'answer': return <MessageSquare className="w-5 h-5 text-sky-400" />;
      case 'badge': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'challenge': return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'project_request':
      case 'project_accepted': return <FolderGit2 className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-sky-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Bell className="w-7 h-7 text-sky-400" />
            <span>Centre de Notifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Restez informé de l'activité sur vos questions, réponses et candidatures.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold transition cursor-pointer"
          >
            Tout marquer comme lu ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Bell className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">Aucune notification pour le moment</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Vous recevrez des alertes quand des développeurs répondront à vos questions ou postuleront à vos projets.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? 'bg-slate-900 border-sky-500/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{n.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {n.message}
                </p>
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
