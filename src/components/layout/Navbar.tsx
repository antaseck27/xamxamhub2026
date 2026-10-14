import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Search, Sun, Moon, Bell, Menu, X, User as UserIcon, 
  LogOut, Shield, FolderGit2, Check, ExternalLink, ChevronDown, Sparkles
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { User, Notification } from '../../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const syncState = () => {
    setCurrentUser(StorageService.getCurrentUser());
    setNotifications(StorageService.getNotifications());
    setTheme(StorageService.getTheme());
  };

  useEffect(() => {
    syncState();
    window.addEventListener('xamxam-storage-updated', syncState);
    return () => window.removeEventListener('xamxam-storage-updated', syncState);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    StorageService.setTheme(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('questions', { search: searchQuery.trim() });
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setIsProfileOpen(false);
    onNavigate('landing');
  };

  const handleDemoSwitch = (targetId: string) => {
    StorageService.setCurrentUser(targetId);
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-700/60 bg-slate-900/90 dark:bg-[#0A1624]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <span className="font-mono font-black text-xl text-white tracking-tighter">X²</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white dark:text-slate-100">
                    XamXam <span className="text-sky-400 font-black">Hub</span>
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400 group-hover:text-sky-400 transition-colors">
                  Systalink · 2026
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 font-medium text-sm">
              <button
                onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPage === 'dashboard'
                    ? 'bg-sky-500/15 text-sky-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {currentUser ? 'Command Center' : 'Accueil'}
              </button>
              <button
                onClick={() => onNavigate('questions')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPage === 'questions' || currentPage === 'question-detail' || currentPage === 'ask-question'
                    ? 'bg-sky-500/15 text-sky-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Entraide
              </button>
              <button
                onClick={() => onNavigate('challenges')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPage === 'challenges' || currentPage === 'challenge-detail'
                    ? 'bg-sky-500/15 text-sky-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Défis Hebdo
              </button>
              <button
                onClick={() => onNavigate('projects')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPage === 'projects' || currentPage === 'project-detail' || currentPage === 'create-project' || currentPage === 'my-requests'
                    ? 'bg-sky-500/15 text-sky-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Projets & Équipes
              </button>
              <button
                onClick={() => onNavigate('developers')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPage === 'developers' || currentPage === 'developer-profile'
                    ? 'bg-sky-500/15 text-sky-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Annuaire
              </button>
            </div>
          </div>

          {/* Search bar desktop */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher code, sujet, tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-slate-800 transition"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Basculer le thème"
              title={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-sky-400" />
              )}
            </button>

            {/* Notification Bell */}
            {currentUser && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-sky-500 text-slate-950 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 text-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-sky-400" />
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono">
                            {unreadCount} non lues
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => StorageService.markAllNotificationsAsRead()}
                          className="text-xs text-slate-400 hover:text-sky-400 transition cursor-pointer"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800 py-2">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          Aucune notification pour le moment.
                        </div>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              StorageService.markNotificationAsRead(n.id);
                              setIsNotifOpen(false);
                              onNavigate(n.linkPage, n.linkId ? { id: n.linkId } : undefined);
                            }}
                            className={`p-2.5 rounded-xl transition cursor-pointer flex flex-col gap-1 ${
                              !n.isRead ? 'bg-sky-500/10 hover:bg-sky-500/15' : 'hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-center">
                      <button
                        onClick={() => {
                          setIsNotifOpen(false);
                          onNavigate('notifications');
                        }}
                        className="text-xs text-sky-400 hover:underline font-medium cursor-pointer"
                      >
                        Voir tout le centre de notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login CTA */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer focus:outline-none"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-lg object-cover border border-sky-400/30"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">
                      {currentUser.displayName}
                    </span>
                    <span className="text-[10px] font-mono text-sky-400 font-semibold">
                      {currentUser.reputation} pts
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 text-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{currentUser.displayName}</p>
                      <p className="text-[11px] text-slate-400">@{currentUser.username}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Réputation</span>
                        <span className="font-mono font-bold text-sky-400">{currentUser.reputation} points</span>
                      </div>
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer text-left"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Mon profil public</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('my-requests');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer text-left"
                      >
                        <FolderGit2 className="w-4 h-4 text-slate-400" />
                        <span>Mes candidatures & projets</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-400 hover:bg-slate-800 transition cursor-pointer text-left font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Console Administration</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('settings');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer text-left"
                      >
                        <Terminal className="w-4 h-4 text-slate-400" />
                        <span>Paramètres & Démo</span>
                      </button>
                    </div>

                    {/* Quick Demo Switch for Hackathon Jury */}
                    <div className="p-2 border-t border-slate-800 bg-slate-950/40 rounded-xl mt-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5">
                        Changer de persona (Démo) :
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleDemoSwitch('user-demo')}
                          className={`flex-1 px-2 py-1 text-[11px] rounded font-medium transition cursor-pointer ${
                            currentUser.id === 'user-demo'
                              ? 'bg-sky-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Anta (Membre)
                        </button>
                        <button
                          onClick={() => handleDemoSwitch('user-admin')}
                          className={`flex-1 px-2 py-1 text-[11px] rounded font-medium transition cursor-pointer ${
                            currentUser.id === 'user-admin'
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Saliou (Admin)
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-800 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition cursor-pointer text-left text-xs font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl shadow-md shadow-sky-500/20 transition cursor-pointer"
                >
                  Créer un compte
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher questions, défis, projets..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </form>

          <div className="space-y-1 font-medium text-sm">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate(currentUser ? 'dashboard' : 'landing'); }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              {currentUser ? 'Developer Command Center' : 'Accueil'}
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('questions'); }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              Questions & Entraide
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('challenges'); }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              Défis Hebdomadaires
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('projects'); }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              Projets & Coéquipiers
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('developers'); }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              Annuaire Développeurs
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
