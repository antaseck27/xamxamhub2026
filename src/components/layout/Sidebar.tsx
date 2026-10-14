import React from 'react';
import { 
  LayoutDashboard, HelpCircle, Trophy, FolderGit2, Users, 
  Send, User, Bell, Settings, Shield, PlusCircle, Sparkles, ChevronRight
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, collapsed = false }) => {
  const currentUser = StorageService.getCurrentUser();
  const requests = StorageService.getRequests();
  const notifications = StorageService.getNotifications();
  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  // Demandes en attente pour les projets du user connecté
  const pendingRequestsForMyProjects = currentUser 
    ? requests.filter(r => {
        const p = StorageService.getProjectById(r.projectId);
        return p && p.ownerId === currentUser.id && r.status === 'pending';
      }).length 
    : 0;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'questions',
      label: 'Questions & Code',
      icon: HelpCircle,
      badge: null
    },
    {
      id: 'challenges',
      label: 'Défis Hebdomadaires',
      icon: Trophy,
      badge: 'En cours',
      badgeColor: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      id: 'projects',
      label: 'Projets & Coéquipiers',
      icon: FolderGit2,
      badge: null
    },
    {
      id: 'my-requests',
      label: 'Mes Demandes',
      icon: Send,
      badge: pendingRequestsForMyProjects > 0 ? `${pendingRequestsForMyProjects} reçue${pendingRequestsForMyProjects > 1 ? 's' : ''}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400'
    },
    {
      id: 'developers',
      label: 'Annuaire Tech',
      icon: Users,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      badgeColor: 'bg-sky-500 text-slate-950 font-bold'
    },
    {
      id: 'profile',
      label: 'Mon Profil',
      icon: User,
      badge: null
    },
    {
      id: 'settings',
      label: 'Paramètres & Démo',
      icon: Settings,
      badge: null
    }
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Administration',
      icon: Shield,
      badge: 'Admin',
      badgeColor: 'bg-purple-500/20 text-purple-400'
    });
  }

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-800 bg-slate-900/60 p-4 space-y-6">
      
      {/* Quick Action Button */}
      <div className="space-y-2">
        <button
          onClick={() => onNavigate('ask-question')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-sky-500/15 transition-all transform active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Poser une question</span>
        </button>

        <button
          onClick={() => onNavigate('create-project')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-medium transition cursor-pointer"
        >
          <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Lancer un projet</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-3 pb-2 block">
          Espace Développeur
        </span>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Systalink Challenge 2026 Badge in Sidebar footer */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1.5">
        <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Systalink Challenge</span>
        </div>
        <p className="text-slate-400 text-[10px] leading-relaxed">
          « Là où la logique rencontre l’audace, naît l’innovation. »
        </p>
      </div>
    </aside>
  );
};
