export type Role = 'admin' | 'moderator' | 'member';

export type Availability = 
  | 'mentor' 
  | 'seeking_team' 
  | 'open_to_collaborate' 
  | 'freelance';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  city: string;
  country: string;
  githubUrl: string;
  portfolioUrl: string;
  phone?: string;
  availability: Availability[];
  role: Role;
  reputation: number;
  createdAt: string;
  isBlocked: boolean;
  badges: string[]; // badge IDs
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  usageCount: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorReputation: number;
  body: string;
  score: number;
  isAccepted: boolean;
  isAiGenerated?: boolean;
  createdAt: string;
  votes: Record<string, 1 | -1>;
  comments: Comment[];
}

export interface Question {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorReputation: number;
  title: string;
  body: string;
  viewCount: number;
  score: number;
  tags: string[];
  status: 'resolved' | 'unresolved';
  acceptedAnswerId?: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt?: string;
  votes: Record<string, 1 | -1>;
  answers: Answer[];
  comments: Comment[];
}

export type ChallengeType = 'debate' | 'mini-project';
export type ChallengeStatus = 'active' | 'archived' | 'planned';

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorReputation: number;
  body: string;
  linkUrl?: string; // demo or repo
  score: number;
  votes: Record<string, 1 | -1>;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  localContext: string;
  type: ChallengeType;
  technologies: string[];
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  startsAt: string;
  endsAt: string;
  status: ChallengeStatus;
  entriesCount: number;
  entries: ChallengeEntry[];
  winnerId?: string;
  winnerName?: string;
}

export type ProjectStatus = 'open' | 'completed' | 'closed';

export interface TeamMember {
  userId: string;
  name: string;
  avatar: string;
  role: string;
  email?: string;
  githubUrl?: string;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerEmail?: string;
  ownerGithub?: string;
  ownerPhone?: string;
  title: string;
  description: string;
  objective: string;
  technologies: string[];
  skillsNeeded: string[];
  seatsTotal: number;
  seatsAvailable: number;
  city: string;
  status: ProjectStatus;
  createdAt: string;
  team: TeamMember[];
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface ProjectRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantSkills: string[];
  applicantReputation: number;
  applicantEmail: string;
  applicantGithub: string;
  applicantPhone?: string;
  shareContacts: {
    email: boolean;
    github: boolean;
    phone: boolean;
  };
  message: string;
  status: RequestStatus;
  createdAt: string;
  decidedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 
    | 'answer' 
    | 'accepted_answer' 
    | 'comment' 
    | 'vote' 
    | 'badge' 
    | 'project_request' 
    | 'project_accepted' 
    | 'project_rejected' 
    | 'challenge';
  title: string;
  message: string;
  linkPage: string;
  linkId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'question' | 'answer' | 'comment' | 'entry';
  targetId: string;
  targetTitle: string;
  reason: 'spam' | 'off_topic' | 'disrespectful' | 'other';
  details: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
}
