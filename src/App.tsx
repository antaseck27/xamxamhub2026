/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { QuestionDetailPage } from './pages/QuestionDetailPage';
import { AskQuestionPage } from './pages/AskQuestionPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { DeveloperProfilePage } from './pages/DeveloperProfilePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminPage } from './pages/AdminPage';
import { PlusCircle, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Initialize storage & theme
  useEffect(() => {
    StorageService.init();
    const theme = StorageService.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Parse URL on load
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      setCurrentPage(pageParam);
      const allParams: Record<string, string> = {};
      params.forEach((val, key) => {
        if (key !== 'page') allParams[key] = val;
      });
      setRouteParams(allParams);
    } else {
      // If user already logged in, go to dashboard
      const user = StorageService.getCurrentUser();
      if (user) {
        setCurrentPage('dashboard');
      }
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const pg = p.get('page') || 'landing';
      setCurrentPage(pg);
      const prs: Record<string, string> = {};
      p.forEach((val, key) => {
        if (key !== 'page') prs[key] = val;
      });
      setRouteParams(prs);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page);
    setRouteParams(params || {});
    
    // Update browser URL query without reload
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        url.searchParams.set(k, v);
      });
    } else {
      // Clean previous non-page params
      Array.from(url.searchParams.keys()).forEach(k => {
        if (k !== 'page') url.searchParams.delete(k);
      });
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStandalonePage = ['landing', 'login', 'register', 'forgot-password'].includes(currentPage);

  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'questions':
        return (
          <QuestionsPage 
            onNavigate={navigate} 
            initialFilter={routeParams.filter} 
            initialSearch={routeParams.search} 
          />
        );
      case 'question-detail':
        return <QuestionDetailPage questionId={routeParams.id || 'q-1'} onNavigate={navigate} />;
      case 'ask-question':
        return <AskQuestionPage onNavigate={navigate} />;
      case 'challenges':
        return <ChallengesPage onNavigate={navigate} />;
      case 'challenge-detail':
        return <ChallengeDetailPage challengeId={routeParams.id || 'ch-active'} onNavigate={navigate} />;
      case 'projects':
        return <ProjectsPage onNavigate={navigate} />;
      case 'project-detail':
        return <ProjectDetailPage projectId={routeParams.id || 'prj-1'} onNavigate={navigate} />;
      case 'create-project':
        return <CreateProjectPage onNavigate={navigate} />;
      case 'my-requests':
        return <MyRequestsPage onNavigate={navigate} />;
      case 'developers':
        return <DevelopersPage onNavigate={navigate} />;
      case 'developer-profile':
        return <DeveloperProfilePage userId={routeParams.id || 'user-demo'} onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      case 'settings':
        return <SettingsPage onNavigate={navigate} />;
      case 'notifications':
        return <NotificationsPage onNavigate={navigate} />;
      case 'admin':
        return <AdminPage onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
      
      {/* Top Navbar */}
      <Navbar currentPage={currentPage} onNavigate={navigate} />

      {/* Main Body Layout */}
      {isStandalonePage ? (
        <main className="flex-1 w-full">
          {renderContent()}
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Collapsible Developer Sidebar */}
          <Sidebar currentPage={currentPage} onNavigate={navigate} />

          {/* Core Content Area */}
          <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6">
            {renderContent()}
          </main>
        </div>
      )}

      {/* Mobile Floating Action Button (US-TRV-01: Poser une question sur mobile) */}
      {!isStandalonePage && currentPage !== 'ask-question' && (
        <button
          onClick={() => navigate('ask-question')}
          className="md:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-2xl shadow-sky-500/40 flex items-center justify-center transition active:scale-90 cursor-pointer"
          aria-label="Poser une question"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
