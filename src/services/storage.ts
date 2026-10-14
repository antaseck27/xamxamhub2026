import { 
  User, Question, Challenge, Project, ProjectRequest, Notification, Report, Tag, Badge, Answer, Comment, ChallengeEntry 
} from '../types';
import { 
  SEED_USERS, SEED_QUESTIONS, SEED_CHALLENGES, SEED_PROJECTS, 
  SEED_REQUESTS, SEED_NOTIFICATIONS, SEED_REPORTS, SEED_TAGS, SEED_BADGES 
} from '../data/seed';

const STORAGE_KEYS = {
  USERS: 'xamxam_users_v1',
  CURRENT_USER_ID: 'xamxam_current_user_id_v1',
  QUESTIONS: 'xamxam_questions_v1',
  CHALLENGES: 'xamxam_challenges_v1',
  PROJECTS: 'xamxam_projects_v1',
  REQUESTS: 'xamxam_requests_v1',
  NOTIFICATIONS: 'xamxam_notifications_v1',
  REPORTS: 'xamxam_reports_v1',
  TAGS: 'xamxam_tags_v1',
  THEME: 'xamxam_theme_v1',
  INITIALIZED: 'xamxam_seeded_v1'
};

function notifyChange() {
  window.dispatchEvent(new Event('xamxam-storage-updated'));
}

export const StorageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetAll();
    }
  },

  resetAll() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-demo'); // Anta Diop by default
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(SEED_QUESTIONS));
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(SEED_CHALLENGES));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(SEED_TAGS));
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    notifyChange();
  },

  // ----------------- Theme -----------------
  getTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  },

  setTheme(theme: 'dark' | 'light') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    notifyChange();
  },

  // ----------------- Users & Session -----------------
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  },

  getCurrentUser(): User | null {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!currentId) return null;
    const users = this.getUsers();
    return users.find(u => u.id === currentId) || null;
  },

  setCurrentUser(userId: string | null) {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
    notifyChange();
  },

  updateUserProfile(updated: Partial<User>) {
    const current = this.getCurrentUser();
    if (!current) return;
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updated };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      notifyChange();
    }
  },

  registerUser(userData: { email: string; username: string; displayName: string }): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      bio: 'Nouveau membre sur XamXam Hub.',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
      city: 'Dakar',
      country: 'Sénégal',
      githubUrl: `https://github.com/${userData.username}`,
      portfolioUrl: '',
      availability: ['open_to_collaborate'],
      role: 'member',
      reputation: 10,
      createdAt: new Date().toISOString(),
      isBlocked: false,
      badges: ['badge-8'] // Fondateur
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser.id);
    notifyChange();
    return newUser;
  },

  addReputation(userId: string, points: number, reason: string) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.reputation = Math.max(0, user.reputation + points);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Auto badge evaluation
      if (user.reputation >= 200 && !user.badges.includes('badge-4')) {
        user.badges.push('badge-4');
      }

      this.addNotification({
        userId,
        type: 'vote',
        title: `Points de réputation : ${points > 0 ? '+' : ''}${points}`,
        message: `${reason}. Réputation actuelle : ${user.reputation} pts.`,
        linkPage: 'profile',
        isRead: false
      });
      notifyChange();
    }
  },

  // ----------------- Questions -----------------
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return data ? JSON.parse(data) : SEED_QUESTIONS;
    } catch {
      return SEED_QUESTIONS;
    }
  },

  getQuestionById(id: string): Question | undefined {
    return this.getQuestions().find(q => q.id === id);
  },

  createQuestion(data: { title: string; body: string; tags: string[]; aiSummary?: string }): Question {
    const user = this.getCurrentUser();
    const questions = this.getQuestions();
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      authorId: user ? user.id : 'anon',
      authorName: user ? user.displayName : 'Visiteur anonyme',
      authorAvatar: user ? user.avatarUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      authorReputation: user ? user.reputation : 0,
      title: data.title,
      body: data.body,
      viewCount: 1,
      score: 1,
      tags: data.tags,
      status: 'unresolved',
      aiSummary: data.aiSummary,
      createdAt: new Date().toISOString(),
      votes: user ? { [user.id]: 1 } : {},
      answers: [],
      comments: []
    };
    questions.unshift(newQuestion);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));

    if (user) {
      this.addReputation(user.id, 5, 'Question publiée');
      // Badge premier pas
      if (!user.badges.includes('badge-1')) {
        user.badges.push('badge-1');
        this.updateUserProfile({ badges: user.badges });
      }
    }

    notifyChange();
    return newQuestion;
  },

  voteQuestion(questionId: string, value: 1 | -1): { success: boolean; message?: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Veuillez vous connecter pour voter.' };

    const questions = this.getQuestions();
    const q = questions.find(item => item.id === questionId);
    if (!q) return { success: false, message: 'Question introuvable.' };

    if (q.authorId === user.id) {
      return { success: false, message: 'Impossible de voter pour votre propre question.' };
    }

    if (value === 1 && user.reputation < 5) {
      return { success: false, message: 'Il faut au moins 5 points de réputation pour voter pour (+1).' };
    }

    if (value === -1 && user.reputation < 15) {
      return { success: false, message: 'Il faut au moins 15 points de réputation pour voter contre (-1).' };
    }

    const currentVote = q.votes[user.id];
    if (currentVote === value) {
      // Toggle off
      delete q.votes[user.id];
      q.score -= value;
      this.addReputation(q.authorId, value === 1 ? -5 : 2, 'Vote retiré sur votre question');
    } else {
      if (currentVote) {
        q.score -= currentVote;
      }
      q.votes[user.id] = value;
      q.score += value;
      this.addReputation(q.authorId, value === 1 ? 5 : -2, 'Nouveau vote reçu sur votre question');
    }

    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    notifyChange();
    return { success: true };
  },

  addAnswer(questionId: string, body: string, isAiGenerated: boolean = false): Answer | null {
    const user = this.getCurrentUser();
    const questions = this.getQuestions();
    const q = questions.find(item => item.id === questionId);
    if (!q) return null;

    const newAnswer: Answer = {
      id: `ans-${Date.now()}`,
      questionId,
      authorId: isAiGenerated ? 'ai-assistant' : (user ? user.id : 'anon'),
      authorName: isAiGenerated ? 'Assistant IA XamXam' : (user ? user.displayName : 'Développeur invité'),
      authorAvatar: isAiGenerated 
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80' 
        : (user ? user.avatarUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'),
      authorReputation: isAiGenerated ? 999 : (user ? user.reputation : 0),
      body,
      score: 0,
      isAccepted: false,
      isAiGenerated,
      createdAt: new Date().toISOString(),
      votes: {},
      comments: []
    };

    q.answers.push(newAnswer);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));

    if (!isAiGenerated && user) {
      this.addReputation(user.id, 10, 'Réponse apportée');
      if (!user.badges.includes('badge-2')) {
        user.badges.push('badge-2');
        this.updateUserProfile({ badges: user.badges });
      }

      // Notify question author
      if (q.authorId !== user.id) {
        this.addNotification({
          userId: q.authorId,
          type: 'answer',
          title: 'Nouvelle réponse à votre question',
          message: `${user.displayName} a répondu à votre question : "${q.title.slice(0, 40)}..."`,
          linkPage: 'question-detail',
          linkId: q.id,
          isRead: false
        });
      }
    }

    notifyChange();
    return newAnswer;
  },

  voteAnswer(questionId: string, answerId: string, value: 1 | -1): { success: boolean; message?: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Veuillez vous connecter pour voter.' };

    const questions = this.getQuestions();
    const q = questions.find(item => item.id === questionId);
    if (!q) return { success: false, message: 'Question introuvable.' };

    const ans = q.answers.find(a => a.id === answerId);
    if (!ans) return { success: false, message: 'Réponse introuvable.' };

    if (ans.isAiGenerated) {
      return { success: false, message: 'Les suggestions IA sont purement indicatives et non votables.' };
    }

    if (ans.authorId === user.id) {
      return { success: false, message: 'Impossible de voter pour votre propre réponse.' };
    }

    if (value === 1 && user.reputation < 5) {
      return { success: false, message: 'Il faut au moins 5 points de réputation pour voter pour.' };
    }

    if (value === -1 && user.reputation < 15) {
      return { success: false, message: 'Il faut au moins 15 points de réputation pour voter contre.' };
    }

    const currentVote = ans.votes[user.id];
    if (currentVote === value) {
      delete ans.votes[user.id];
      ans.score -= value;
      this.addReputation(ans.authorId, value === 1 ? -10 : 2, 'Vote retiré sur votre réponse');
    } else {
      if (currentVote) {
        ans.score -= currentVote;
      }
      ans.votes[user.id] = value;
      ans.score += value;
      this.addReputation(ans.authorId, value === 1 ? 10 : -2, 'Vote reçu sur votre réponse');
    }

    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    notifyChange();
    return { success: true };
  },

  acceptAnswer(questionId: string, answerId: string): { success: boolean; message?: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Veuillez vous connecter.' };

    const questions = this.getQuestions();
    const q = questions.find(item => item.id === questionId);
    if (!q) return { success: false, message: 'Question introuvable.' };

    if (q.authorId !== user.id && user.role !== 'admin') {
      return { success: false, message: 'Seul l’auteur de la question peut accepter une réponse.' };
    }

    // Toggle or change accepted
    q.answers.forEach(a => {
      a.isAccepted = (a.id === answerId);
    });
    q.acceptedAnswerId = answerId;
    q.status = 'resolved';

    const acceptedAns = q.answers.find(a => a.id === answerId);
    if (acceptedAns && acceptedAns.authorId !== user.id) {
      this.addReputation(acceptedAns.authorId, 15, 'Votre réponse a été acceptée comme solution !');
      this.addNotification({
        userId: acceptedAns.authorId,
        type: 'accepted_answer',
        title: 'Solution acceptée ! 🎉',
        message: `${user.displayName} a validé votre réponse comme solution (+15 pts de réputation).`,
        linkPage: 'question-detail',
        linkId: q.id,
        isRead: false
      });
    }

    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    notifyChange();
    return { success: true };
  },

  addComment(questionId: string, answerId: string | null, body: string): Comment | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const questions = this.getQuestions();
    const q = questions.find(item => item.id === questionId);
    if (!q) return null;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      body,
      createdAt: new Date().toISOString()
    };

    if (answerId) {
      const ans = q.answers.find(a => a.id === answerId);
      if (ans) ans.comments.push(newComment);
    } else {
      q.comments.push(newComment);
    }

    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    notifyChange();
    return newComment;
  },

  deleteQuestion(questionId: string): { success: boolean; message?: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Non autorisé.' };

    const questions = this.getQuestions();
    const q = questions.find(item => item.id === questionId);
    if (!q) return { success: false, message: 'Question introuvable.' };

    if (q.authorId !== user.id && user.role !== 'admin') {
      return { success: false, message: 'Seul l’auteur ou un administrateur peut supprimer cette question.' };
    }

    if (q.answers.length > 0 && user.role !== 'admin') {
      return { success: false, message: 'Impossible de supprimer une question qui a déjà des réponses.' };
    }

    const filtered = questions.filter(item => item.id !== questionId);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(filtered));
    notifyChange();
    return { success: true };
  },

  // ----------------- Challenges -----------------
  getChallenges(): Challenge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      return data ? JSON.parse(data) : SEED_CHALLENGES;
    } catch {
      return SEED_CHALLENGES;
    }
  },

  getChallengeById(id: string): Challenge | undefined {
    return this.getChallenges().find(c => c.id === id);
  },

  addChallengeEntry(challengeId: string, body: string, linkUrl?: string): { success: boolean; message?: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Veuillez vous connecter pour participer.' };

    const challenges = this.getChallenges();
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch) return { success: false, message: 'Défi introuvable.' };

    if (ch.status !== 'active') {
      return { success: false, message: 'Ce défi est clôturé ou archivé.' };
    }

    const existing = ch.entries.find(e => e.authorId === user.id);
    if (existing) {
      existing.body = body;
      if (linkUrl) existing.linkUrl = linkUrl;
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
      notifyChange();
      return { success: true, message: 'Votre participation a été mise à jour !' };
    }

    const newEntry: ChallengeEntry = {
      id: `entry-${Date.now()}`,
      challengeId,
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      authorReputation: user.reputation,
      body,
      linkUrl,
      score: 1,
      votes: { [user.id]: 1 },
      createdAt: new Date().toISOString()
    };

    ch.entries.push(newEntry);
    ch.entriesCount = ch.entries.length;

    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    this.addReputation(user.id, 20, 'Participation au défi hebdomadaire');
    notifyChange();
    return { success: true, message: 'Participation enregistrée avec succès (+20 pts de réputation) !' };
  },

  voteChallengeEntry(challengeId: string, entryId: string): { success: boolean; message?: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Veuillez vous connecter.' };

    const challenges = this.getChallenges();
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch) return { success: false, message: 'Défi introuvable.' };

    const entry = ch.entries.find(e => e.id === entryId);
    if (!entry) return { success: false, message: 'Contribution introuvable.' };

    if (entry.authorId === user.id) {
      return { success: false, message: 'Vous ne pouvez pas voter pour votre propre contribution.' };
    }

    if (entry.votes[user.id]) {
      delete entry.votes[user.id];
      entry.score -= 1;
    } else {
      entry.votes[user.id] = 1;
      entry.score += 1;
      this.addReputation(entry.authorId, 5, 'Vote reçu sur votre solution de défi');
    }

    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    notifyChange();
    return { success: true };
  },

  createChallenge(data: Partial<Challenge>): Challenge {
    const challenges = this.getChallenges();
    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      title: data.title || 'Nouveau Défi',
      description: data.description || '',
      localContext: data.localContext || '',
      type: data.type || 'mini-project',
      technologies: data.technologies || ['Full-Stack'],
      difficulty: data.difficulty || 'Intermédiaire',
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: 'active',
      entriesCount: 0,
      entries: []
    };
    challenges.unshift(newChallenge);
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
    notifyChange();
    return newChallenge;
  },

  // ----------------- Projects & Teammates -----------------
  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : SEED_PROJECTS;
    } catch {
      return SEED_PROJECTS;
    }
  },

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find(p => p.id === id);
  },

  createProject(data: {
    title: string;
    description: string;
    objective: string;
    technologies: string[];
    skillsNeeded: string[];
    seatsTotal: number;
    city: string;
  }): Project | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const projects = this.getProjects();
    const newProject: Project = {
      id: `prj-${Date.now()}`,
      ownerId: user.id,
      ownerName: user.displayName,
      ownerAvatar: user.avatarUrl,
      ownerEmail: user.email,
      ownerGithub: user.githubUrl,
      ownerPhone: user.phone,
      title: data.title,
      description: data.description,
      objective: data.objective,
      technologies: data.technologies,
      skillsNeeded: data.skillsNeeded,
      seatsTotal: data.seatsTotal,
      seatsAvailable: data.seatsTotal - 1,
      city: data.city,
      status: 'open',
      createdAt: new Date().toISOString(),
      team: [
        {
          userId: user.id,
          name: user.displayName,
          avatar: user.avatarUrl,
          role: 'Porteur du projet',
          email: user.email,
          githubUrl: user.githubUrl
        }
      ]
    };

    projects.unshift(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.addReputation(user.id, 15, 'Projet collaboratif publié');
    notifyChange();
    return newProject;
  },

  getRequests(): ProjectRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return data ? JSON.parse(data) : SEED_REQUESTS;
    } catch {
      return SEED_REQUESTS;
    }
  },

  sendProjectRequest(projectId: string, message: string, shareContacts: { email: boolean; github: boolean; phone: boolean }): { success: boolean; message?: string } {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Veuillez vous connecter pour postuler.' };

    const project = this.getProjectById(projectId);
    if (!project) return { success: false, message: 'Projet introuvable.' };

    if (project.ownerId === user.id) {
      return { success: false, message: 'Vous êtes déjà le porteur de ce projet !' };
    }

    if (project.status === 'completed' || project.seatsAvailable <= 0) {
      return { success: false, message: 'Ce projet est complet.' };
    }

    const requests = this.getRequests();
    const existing = requests.find(r => r.projectId === projectId && r.applicantId === user.id);
    if (existing) {
      return { success: false, message: 'Vous avez déjà soumis une demande pour ce projet.' };
    }

    const newRequest: ProjectRequest = {
      id: `req-${Date.now()}`,
      projectId,
      projectTitle: project.title,
      applicantId: user.id,
      applicantName: user.displayName,
      applicantAvatar: user.avatarUrl,
      applicantSkills: ['React', 'TypeScript', 'Tailwind CSS'],
      applicantReputation: user.reputation,
      applicantEmail: user.email,
      applicantGithub: user.githubUrl,
      applicantPhone: user.phone,
      shareContacts,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    // Notify project owner
    this.addNotification({
      userId: project.ownerId,
      type: 'project_request',
      title: 'Nouvelle candidature pour votre projet !',
      message: `${user.displayName} souhaite rejoindre "${project.title.slice(0, 35)}..."`,
      linkPage: 'my-requests',
      isRead: false
    });

    notifyChange();
    return { success: true, message: 'Votre demande a été envoyée au porteur du projet.' };
  },

  handleProjectRequest(requestId: string, action: 'accept' | 'reject'): { success: boolean; message?: string } {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Demande introuvable.' };

    const projects = this.getProjects();
    const project = projects.find(p => p.id === req.projectId);
    if (!project) return { success: false, message: 'Projet introuvable.' };

    const currentUser = this.getCurrentUser();
    if (!currentUser || (currentUser.id !== project.ownerId && currentUser.role !== 'admin')) {
      return { success: false, message: 'Seul le porteur du projet peut prendre cette décision.' };
    }

    req.status = action === 'accept' ? 'accepted' : 'rejected';
    req.decidedAt = new Date().toISOString();

    if (action === 'accept') {
      if (project.seatsAvailable > 0) {
        project.seatsAvailable -= 1;
        project.team.push({
          userId: req.applicantId,
          name: req.applicantName,
          avatar: req.applicantAvatar,
          role: 'Membre équipe',
          email: req.shareContacts.email ? req.applicantEmail : undefined,
          githubUrl: req.shareContacts.github ? req.applicantGithub : undefined
        });

        if (project.seatsAvailable === 0) {
          project.status = 'completed';
        }
      }

      this.addNotification({
        userId: req.applicantId,
        type: 'project_accepted',
        title: 'Candidature acceptée ! 🎉',
        message: `Félicitations, vous rejoignez l'équipe du projet "${project.title}". Les coordonnées ont été partagées.`,
        linkPage: 'project-detail',
        linkId: project.id,
        isRead: false
      });
    } else {
      this.addNotification({
        userId: req.applicantId,
        type: 'project_rejected',
        title: 'Candidature non retenue',
        message: `Votre demande pour rejoindre "${project.title}" n'a pas été retenue pour cette session.`,
        linkPage: 'projects',
        isRead: false
      });
    }

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyChange();
    return { success: true, message: action === 'accept' ? 'Candidat accepté dans l\'équipe !' : 'Demande refusée.' };
  },

  // ----------------- Notifications -----------------
  getNotifications(): Notification[] {
    const current = this.getCurrentUser();
    if (!current) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: Notification[] = data ? JSON.parse(data) : SEED_NOTIFICATIONS;
      return all.filter(n => n.userId === current.id);
    } catch {
      return [];
    }
  },

  addNotification(notif: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: Notification[] = data ? JSON.parse(data) : SEED_NOTIFICATIONS;
      all.unshift({
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      notifyChange();
    } catch (e) {
      console.error(e);
    }
  },

  markNotificationAsRead(id: string) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: Notification[] = data ? JSON.parse(data) : SEED_NOTIFICATIONS;
      const notif = all.find(n => n.id === id);
      if (notif) notif.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      notifyChange();
    } catch (e) {
      console.error(e);
    }
  },

  markAllNotificationsAsRead() {
    const current = this.getCurrentUser();
    if (!current) return;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: Notification[] = data ? JSON.parse(data) : SEED_NOTIFICATIONS;
      all.forEach(n => {
        if (n.userId === current.id) n.isRead = true;
      });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      notifyChange();
    } catch (e) {
      console.error(e);
    }
  },

  // ----------------- Reports & Moderation -----------------
  getReports(): Report[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : SEED_REPORTS;
    } catch {
      return SEED_REPORTS;
    }
  },

  submitReport(report: Omit<Report, 'id' | 'createdAt' | 'status'>): { success: boolean; message: string } {
    const reports = this.getReports();
    const newReport: Report = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    notifyChange();
    return { success: true, message: 'Signalement envoyé aux modérateurs avec succès.' };
  },

  handleReport(reportId: string, action: 'resolved' | 'dismissed'): void {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = action;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      notifyChange();
    }
  },

  // ----------------- Badges & Tags -----------------
  getBadges(): Badge[] {
    return SEED_BADGES;
  },

  getTags(): Tag[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TAGS);
      return data ? JSON.parse(data) : SEED_TAGS;
    } catch {
      return SEED_TAGS;
    }
  }
};
