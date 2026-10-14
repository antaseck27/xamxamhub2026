import { User, Badge, Tag, Question, Challenge, Project, ProjectRequest, Notification, Report } from '../types';

export const SEED_BADGES: Badge[] = [
  {
    id: 'badge-1',
    code: 'premier-pas',
    name: 'Premier pas',
    description: 'A posé sa première question technique sur la plateforme.',
    icon: 'Sparkles',
    criteria: '1 question posée'
  },
  {
    id: 'badge-2',
    code: 'premiere-reponse',
    name: 'Première réponse',
    description: 'A apporté sa première contribution d’entraide.',
    icon: 'MessageSquare',
    criteria: '1 réponse publiée'
  },
  {
    id: 'badge-3',
    code: 'bien-vu',
    name: 'Bien vu',
    description: 'Une de ses réponses a récolté au moins 5 votes positifs.',
    icon: 'ThumbsUp',
    criteria: 'Réponse avec ≥ 5 votes'
  },
  {
    id: 'badge-4',
    code: 'resolveur',
    name: 'Résolveur',
    description: 'A obtenu 10 réponses acceptées comme solution officielle.',
    icon: 'CheckCircle2',
    criteria: '10 solutions acceptées'
  },
  {
    id: 'badge-5',
    code: 'debatteur',
    name: 'Débatteur',
    description: 'A participé activement à au moins 3 défis communautaires.',
    icon: 'Flame',
    criteria: 'Participation à 3 défis'
  },
  {
    id: 'badge-6',
    code: 'champion',
    name: 'Champion',
    description: 'A remporté la première place d’un défi hebdomadaire.',
    icon: 'Trophy',
    criteria: 'Victoire d’un défi'
  },
  {
    id: 'badge-7',
    code: 'mentor',
    name: 'Mentor Tech',
    description: 'Profil disponible pour le mentorat et auteur de plus de 20 réponses utiles.',
    icon: 'GraduationCap',
    criteria: 'Disponible mentor + 20 réponses'
  },
  {
    id: 'badge-8',
    code: 'fondateur',
    name: 'Pionnier Fondateur',
    description: 'Membre actif parmi les 100 premiers développeurs inscrits.',
    icon: 'Award',
    criteria: 'Parmi les 100 premiers'
  }
];

export const SEED_TAGS: Tag[] = [
  { id: 'tag-react', name: 'React', slug: 'react', description: 'Bibliothèque JavaScript pour créer des interfaces utilisateur modernes.', usageCount: 42 },
  { id: 'tag-typescript', name: 'TypeScript', slug: 'typescript', description: 'JavaScript typé pour des applications robustes et maintenables.', usageCount: 38 },
  { id: 'tag-node', name: 'Node.js', slug: 'nodejs', description: 'Environnement d’exécution JavaScript côté serveur.', usageCount: 31 },
  { id: 'tag-python', name: 'Python', slug: 'python', description: 'Langage polyvalent pour le backend, l’IA et la science des données.', usageCount: 29 },
  { id: 'tag-django', name: 'Django', slug: 'django', description: 'Framework web Python de haut niveau pour du développement rapide.', usageCount: 21 },
  { id: 'tag-offline', name: 'Offline-First', slug: 'offline-first', description: 'Conception d’applications fonctionnant parfaitement sans connexion Internet permanente.', usageCount: 27 },
  { id: 'tag-mobilemoney', name: 'Mobile Money', slug: 'mobile-money', description: 'Intégration d’APIs de paiement : Wave, Orange Money, MTN MoMo, Free Money.', usageCount: 34 },
  { id: 'tag-docker', name: 'Docker', slug: 'docker', description: 'Conteneurisation d’applications et simplification des déploiements.', usageCount: 19 },
  { id: 'tag-postgresql', name: 'PostgreSQL', slug: 'postgresql', description: 'Système de gestion de base de données relationnelle avancé.', usageCount: 24 },
  { id: 'tag-tailwind', name: 'Tailwind CSS', slug: 'tailwindcss', description: 'Framework CSS utilitaire pour des interfaces personnalisées et rapides.', usageCount: 36 },
  { id: 'tag-flutter', name: 'Flutter', slug: 'flutter', description: 'Framework multiplateforme de Google pour applications mobiles Android & iOS.', usageCount: 23 },
  { id: 'tag-security', name: 'Sécurité & Auth', slug: 'security', description: 'Pratiques d’authentification, tokens JWT, OAuth2 et chiffrement.', usageCount: 18 }
];

export const SEED_USERS: User[] = [
  {
    id: 'user-demo',
    email: 'demo@xamxamhub.dev',
    username: 'anta_dev',
    displayName: 'Anta Diop',
    bio: 'Développeuse Frontend & Mobile passionnée par les applications légères et résilientes. Basée à Dakar. Toujours prête à prototyper de nouveaux concepts !',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    city: 'Dakar',
    country: 'Sénégal',
    githubUrl: 'https://github.com/anta-diop-tech',
    portfolioUrl: 'https://anta-diop.dev',
    phone: '+221 77 123 45 67',
    availability: ['open_to_collaborate', 'seeking_team'],
    role: 'member',
    reputation: 145,
    createdAt: '2026-09-29T10:00:00Z',
    isBlocked: false,
    badges: ['badge-1', 'badge-2', 'badge-8']
  },
  {
    id: 'user-admin',
    email: 'admin@xamxamhub.dev',
    username: 'saliou_sys',
    displayName: 'Saliou Diallo',
    bio: 'Architecte Cloud & DevOps. Co-fondateur de XamXam Hub. Promouvant l’open source et les infrastructures résilientes pour l’Afrique.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    city: 'Dakar',
    country: 'Sénégal',
    githubUrl: 'https://github.com/saliou-diallo',
    portfolioUrl: 'https://saliou.dev',
    phone: '+221 78 987 65 43',
    availability: ['mentor', 'open_to_collaborate'],
    role: 'admin',
    reputation: 420,
    createdAt: '2026-09-28T08:00:00Z',
    isBlocked: false,
    badges: ['badge-1', 'badge-2', 'badge-3', 'badge-4', 'badge-7', 'badge-8']
  },
  {
    id: 'user-3',
    email: 'moussa@freelance.sn',
    username: 'moussa_kone',
    displayName: 'Moussa Koné',
    bio: 'Développeur Full-Stack Junior spécialisé React & Django. Recherche des coéquipiers pour des projets d’impact local.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    city: 'Abidjan',
    country: 'Côte d’Ivoire',
    githubUrl: 'https://github.com/moussakone',
    portfolioUrl: 'https://moussa.tech',
    availability: ['seeking_team', 'freelance'],
    role: 'member',
    reputation: 85,
    createdAt: '2026-10-01T14:30:00Z',
    isBlocked: false,
    badges: ['badge-1', 'badge-2', 'badge-8']
  },
  {
    id: 'user-4',
    email: 'fatou.mentor@tech.sn',
    username: 'fatou_senior',
    displayName: 'Fatou Ndiaye',
    bio: 'Tech Lead chez SenTech (10 ans d’expérience). Mentor active pour les jeunes talents de l’écosystème tech ouest-africain.',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80',
    city: 'Dakar',
    country: 'Sénégal',
    githubUrl: 'https://github.com/fatoundiaye',
    portfolioUrl: 'https://fatou-codes.com',
    availability: ['mentor'],
    role: 'moderator',
    reputation: 510,
    createdAt: '2026-09-29T11:15:00Z',
    isBlocked: false,
    badges: ['badge-1', 'badge-2', 'badge-3', 'badge-4', 'badge-6', 'badge-7', 'badge-8']
  },
  {
    id: 'user-5',
    email: 'koffi.mensah@dev.tg',
    username: 'koffi_dev',
    displayName: 'Koffi Mensah',
    bio: 'Ingénieur systèmes & spécialiste des protocoles de paiement Mobile Money et USSD en Afrique francophone.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    city: 'Lomé',
    country: 'Togo',
    githubUrl: 'https://github.com/koffimensah',
    portfolioUrl: 'https://koffi.tg',
    availability: ['open_to_collaborate', 'freelance'],
    role: 'member',
    reputation: 215,
    createdAt: '2026-10-02T09:20:00Z',
    isBlocked: false,
    badges: ['badge-1', 'badge-2', 'badge-3', 'badge-5']
  },
  {
    id: 'user-6',
    email: 'grace.h@kigali.tech',
    username: 'grace_habimana',
    displayName: 'Grace Habimana',
    bio: 'Data Scientist & Développeuse Python. Bâtisseuse d’outils d’analyse agricole et météorologique pour la région des Grands Lacs.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    city: 'Kigali',
    country: 'Rwanda',
    githubUrl: 'https://github.com/gracehabimana',
    portfolioUrl: 'https://grace.rw',
    availability: ['seeking_team', 'open_to_collaborate'],
    role: 'member',
    reputation: 175,
    createdAt: '2026-10-03T16:00:00Z',
    isBlocked: false,
    badges: ['badge-1', 'badge-2', 'badge-8']
  },
  {
    id: 'user-7',
    email: 'yannick.noah@cameroon.dev',
    username: 'yannick_dev',
    displayName: 'Yannick Noah',
    bio: 'Développeur Flutter & PWA. Passionné par l’accessibilité mobile et la performance sur réseaux 3G.',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    city: 'Douala',
    country: 'Cameroun',
    githubUrl: 'https://github.com/yannickn',
    portfolioUrl: 'https://yannick.cm',
    availability: ['open_to_collaborate'],
    role: 'member',
    reputation: 130,
    createdAt: '2026-10-04T12:00:00Z',
    isBlocked: false,
    badges: ['badge-1', 'badge-2']
  }
];

export const SEED_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    authorId: 'user-3',
    authorName: 'Moussa Koné',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    authorReputation: 85,
    title: 'Comment synchroniser des transactions hors-ligne avec IndexedDB et TanStack Query ?',
    body: `Bonjour la commu XamXam !

Je travaille sur une application de gestion de stock pour des commerçants du marché Sandaga à Dakar. La connexion 4G y est souvent instable ou coupée par moment.

Je souhaite enregistrer les transactions en local dans **IndexedDB** quand l'utilisateur est déconnecté, puis synchroniser automatiquement avec mon API FastAPI dès le retour du réseau, sans perdre l'ordre des transactions ni créer de doublons.

Voici mon schéma de synchronisation actuel :

\`\`\`javascript
// Détection du réseau et écoute de l'événement online
window.addEventListener('online', async () => {
  const pendingTransactions = await getPendingFromIndexedDB();
  for (const item of pendingTransactions) {
    try {
      await api.post('/transactions/sync', item);
      await markAsSyncedInLocal(item.id);
    } catch (err) {
      console.error("Échec de synchronisation temporaire:", err);
      break;
    }
  }
});
\`\`\`

Le problème : si deux requêtes partent en même temps ou si la connexion rechute au milieu du batch, j'ai parfois des doublons côté serveur. 

Quelle est la meilleure approche (Idempotency-Key, file d'attente atomique ou CRDT) pour fiabiliser ce flux ?`,
    aiSummary: 'Moussa cherche à fiabiliser la synchronisation de transactions de caisse enregistrées hors-ligne dans IndexedDB vers un serveur FastAPI, en évitant les doublons et les incohérences lors de coupures réseau intempestives.',
    viewCount: 168,
    score: 18,
    tags: ['Offline-First', 'React', 'TypeScript'],
    status: 'resolved',
    acceptedAnswerId: 'ans-1-1',
    createdAt: '2026-10-08T14:20:00Z',
    votes: { 'user-demo': 1, 'user-admin': 1, 'user-4': 1 },
    comments: [
      {
        id: 'c-1',
        authorId: 'user-demo',
        authorName: 'Anta Diop',
        body: 'Superbe cas d’usage très concret pour nos marchés locaux ! L’idempotence est clairement la clé ici.',
        createdAt: '2026-10-08T15:05:00Z'
      }
    ],
    answers: [
      {
        id: 'ans-1-1',
        questionId: 'q-1',
        authorId: 'user-4',
        authorName: 'Fatou Ndiaye',
        authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80',
        authorReputation: 510,
        body: `Excellente question Moussa ! C'est exactement le type de contrainte propre au terrain africain que nous devons maîtriser.

Voici les 3 piliers indispensables pour une synchronisation sans faille :

### 1. Utiliser une clé d'idempotence unique (UUIDv4) générée côté client
Côté frontend, chaque transaction créée hors-ligne reçoit un \`client_tx_uuid\` avant même de toucher le réseau :

\`\`\`typescript
const newTx = {
  idempotency_key: crypto.randomUUID(),
  amount: 15000,
  currency: 'XOF',
  created_at_local: new Date().toISOString(),
  status: 'PENDING_SYNC'
};
\`\`\`

### 2. Contrainte d'unicité côté PostgreSQL
Dans ta table serveur :
\`\`\`sql
ALTER TABLE transactions 
ADD CONSTRAINT unique_idempotency_key UNIQUE (idempotency_key);
\`\`\`
Si le client renvoie la même transaction après un timeout réseau, le backend renvoie le résultat déjà enregistré avec un code \`200 OK\` au lieu de recréer une ligne.

### 3. File d'attente séquentielle (Queue)
Ne boucle pas avec un simple \`for\` dans l'événement \`online\`. Utilise une queue séquentielle avec promesses en chaîne ou TanStack Query mutation persistée pour garantir que l'ordre chronologique des transactions est strictement respecté.`,
        score: 24,
        isAccepted: true,
        createdAt: '2026-10-08T16:15:00Z',
        votes: { 'user-demo': 1, 'user-admin': 1, 'user-3': 1, 'user-5': 1 },
        comments: [
          {
            id: 'c-ans-1',
            authorId: 'user-3',
            authorName: 'Moussa Koné',
            body: 'Merci infiniment Fatou ! La contrainte d\'idempotence avec UUIDv4 a réglé 100% de mes doublons ! Solution adoptée.',
            createdAt: '2026-10-08T17:00:00Z'
          }
        ]
      },
      {
        id: 'ans-1-2',
        questionId: 'q-1',
        authorId: 'user-5',
        authorName: 'Koffi Mensah',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        authorReputation: 215,
        body: `En complément de l'excellente réponse de Fatou, si tu souhaites gérer les cas où plusieurs caissiers modifient le même article hors-ligne, regarde aussi la bibliothèque **RxDB** ou l'approche **CRDT** (Yjs). Mais pour un journal de caisse comptable, la clé d'idempotence UUID reste la référence absolue.`,
        score: 6,
        isAccepted: false,
        createdAt: '2026-10-08T18:30:00Z',
        votes: { 'user-demo': 1 },
        comments: []
      }
    ]
  },
  {
    id: 'q-2',
    authorId: 'user-demo',
    authorName: 'Anta Diop',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    authorReputation: 145,
    title: 'Comment sécuriser un webhook de paiement Wave / Orange Money en Node.js ?',
    body: `Salut les devs !

J'intègre actuellement le webhook de notification de paiement Wave Sénégal sur une application e-commerce. Je reçois bien les événements \`checkout.session.completed\`.

Cependant, je veux m'assurer à 100% que la requête provient bien des serveurs de Wave et qu'un tiers malveillant ne peut pas forger une fausse notification de paiement réussi.

\`\`\`javascript
app.post('/api/wave-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['wave-signature'];
  // Comment vérifier la signature HMAC de façon étanche contre les timing attacks ?
});
\`\`\`

Existe-t-il une bonne pratique recommandée en Node.js pour valider le timestamp et le hash HMAC SHA256 sans risque ?`,
    aiSummary: 'Anta recherche la méthode la plus sécurisée en Node.js pour valider la signature cryptographique HMAC SHA256 des webhooks Wave / Orange Money en se protégeant contre les attaques par rejeu et par canal auxiliaire (timing attacks).',
    viewCount: 214,
    score: 14,
    tags: ['Mobile Money', 'Node.js', 'Sécurité & Auth'],
    status: 'resolved',
    acceptedAnswerId: 'ans-2-1',
    createdAt: '2026-10-09T11:00:00Z',
    votes: { 'user-admin': 1, 'user-5': 1 },
    comments: [],
    answers: [
      {
        id: 'ans-2-1',
        questionId: 'q-2',
        authorId: 'user-5',
        authorName: 'Koffi Mensah',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        authorReputation: 215,
        body: `Salut Anta ! Très bon réflexe de sécurité. Voici le code standard de validation :

\`\`\`javascript
import crypto from 'crypto';

export function verifyWaveSignature(rawBody, headerSignature, webhookSecret) {
  // Wave envoie le format: t=1697000000,v1=abc123...
  const parts = Object.fromEntries(
    headerSignature.split(',').map(item => item.split('='))
  );

  const timestamp = parts['t'];
  const expectedHash = parts['v1'];

  // 1. Éviter les attaques par rejeu (tolérance de 5 minutes max)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) {
    throw new Error('Timestamp expiré ou décalé');
  }

  // 2. Calculer le HMAC sur timestamp + raw payload
  const payloadToSign = timestamp + rawBody.toString('utf-8');
  const computedHash = crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadToSign)
    .digest('hex');

  // 3. Comparaison à temps constant contre les timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedHash, 'utf-8'),
    Buffer.from(expectedHash, 'utf-8')
  );

  return isValid;
}
\`\`\`

⚠️ **Point crucial :** Assure-toi d'utiliser le \`rawBody\` (Buffer brut) et non le JSON déjà parsé par Express, sinon un simple espace ou ordre de clés invalidera le hash.`,
        score: 19,
        isAccepted: true,
        createdAt: '2026-10-09T13:45:00Z',
        votes: { 'user-demo': 1, 'user-admin': 1 },
        comments: []
      }
    ]
  },
  {
    id: 'q-3',
    authorId: 'user-6',
    authorName: 'Grace Habimana',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    authorReputation: 175,
    title: 'Optimisation de requêtes PostgreSQL Full-Text Search pour des noms propres en langues locales',
    body: `Bonjour tout le monde !

Dans notre plateforme d'annuaire et d'agronomie, nous avons des champs de recherche contenant des termes en wolof, kinyarwanda et français (ex: "XamXam", "Ndeye", "Mugabo", "Amashaza").

Actuellement avec la configuration française par défaut de PostgreSQL (\`to_tsvector('french', ...)\`), le stemmer français supprime ou altère parfois les racines de mots non-français.

Est-il préférable d'utiliser le dictionnaire \`simple\` combiné à l'extension \`pg_trgm\` (trigrammes) avec un index GIN ? Avez-vous des retours d'expérience sur ce type d'indexation hybride ?`,
    viewCount: 95,
    score: 9,
    tags: ['PostgreSQL', 'Python'],
    status: 'unresolved',
    createdAt: '2026-10-11T09:30:00Z',
    votes: { 'user-admin': 1 },
    comments: [],
    answers: [
      {
        id: 'ans-3-1',
        questionId: 'q-3',
        authorId: 'user-admin',
        authorName: 'Saliou Diallo',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        authorReputation: 420,
        body: `Salut Grace ! Oui, c'est un problème classique quand on applique la racinisation (stemming) d'une langue latine à des termes d'autres familles linguistiques.

La solution la plus élégante et performante est le **double index GIN** :

1. Pour la recherche exacte ou préfixe sur mots locaux : utilise \`to_tsvector('simple', title || ' ' || body)\`. Le dictionnaire \`simple\` met juste en minuscules sans découper les suffixes.
2. Pour la tolérance aux fautes de frappe et variations phonétiques : active \`CREATE EXTENSION pg_trgm;\` et crée un index trigramme :
\`\`\`sql
CREATE INDEX idx_trgm_search ON items USING gin (title gin_trgm_ops);
\`\`\`

Tu obtiendras une recherche instantanée et respectueuse des nuances orthographiques !`,
        score: 7,
        isAccepted: false,
        createdAt: '2026-10-11T11:10:00Z',
        votes: { 'user-demo': 1 },
        comments: []
      }
    ]
  },
  {
    id: 'q-4',
    authorId: 'user-7',
    authorName: 'Yannick Noah',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    authorReputation: 130,
    title: 'Comment réduire la taille du bundle initial React / Tailwind sur connexion 3G (sous 150 Ko) ?',
    body: `Salut les dev de la commu !
Nos utilisateurs à Douala et Yaoundé ont souvent des forfaits data limités avec des débits 3G fluctuants. Je souhaite optimiser une application React pour que le bundle JS initial fasse moins de 150 Ko gzippé.

Quels sont les leviers les plus efficaces : dynamic import avec lazy loading, élimination des dépendances lourdes (date-fns vs dayjs, lucide tree-shaking), ou passage à des composants vanille pour les zones statiques ?`,
    viewCount: 142,
    score: 11,
    tags: ['React', 'Tailwind CSS'],
    status: 'unresolved',
    createdAt: '2026-10-12T16:00:00Z',
    votes: { 'user-demo': 1, 'user-3': 1 },
    comments: [],
    answers: []
  }
];

export const SEED_CHALLENGES: Challenge[] = [
  {
    id: 'ch-active',
    title: 'Concevoir une architecture Offline-First ultra-résiliente aux coupures réseau',
    description: `Dans beaucoup de régions du continent, les coupures de courant et les pannes de fibre perturbent le travail quotidien des commerçants, soignants et étudiants.

Le défi de cette semaine : Proposer une architecture logicielle ou un composant fonctionnel capable de faire fonctionner une application web ou mobile pendant 48 heures de déconnexion totale, avec synchronisation automatique et résolution des conflits au retour du réseau.`,
    localContext: 'Cas pratique réel : Point de vente au marché Sandaga ou dispensaire médical en zone semi-rurale au Sénégal.',
    type: 'mini-project',
    technologies: ['IndexedDB', 'Service Workers', 'CRDT / UUID', 'TanStack Query'],
    difficulty: 'Intermédiaire',
    startsAt: '2026-10-09T00:00:00Z',
    endsAt: '2026-10-20T23:59:59Z',
    status: 'active',
    entriesCount: 3,
    entries: [
      {
        id: 'entry-1',
        challengeId: 'ch-active',
        authorId: 'user-demo',
        authorName: 'Anta Diop',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
        authorReputation: 145,
        body: `J'ai développé un prototype baptisé **"Bokk-Sync"** : un store réactif basé sur IndexedDB avec un journal d'événements append-only. Chaque transaction reçoit un hash cryptographique et un timestamp logique (horloge de Lamport). Dès que le navigateur émet l'événement online, un worker en tâche de fond négocie le delta avec le serveur sans bloquer l'interface !`,
        linkUrl: 'https://github.com/anta-diop-tech/bokk-sync-offline',
        score: 15,
        votes: { 'user-admin': 1, 'user-4': 1, 'user-5': 1 },
        createdAt: '2026-10-10T14:00:00Z'
      },
      {
        id: 'entry-2',
        challengeId: 'ch-active',
        authorId: 'user-3',
        authorName: 'Moussa Koné',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        authorReputation: 85,
        body: `Ma proposition repose sur l'utilisation combinée de SQLite en WebAssembly (wa-sqlite) avec un protocole de synchronisation différentielle compressé en Brotli, réduisant de 85% la consommation de data lors de la reconnexion.`,
        linkUrl: 'https://github.com/moussakone/sqlite-wasm-sync',
        score: 8,
        votes: { 'user-demo': 1 },
        createdAt: '2026-10-11T18:20:00Z'
      },
      {
        id: 'entry-3',
        challengeId: 'ch-active',
        authorId: 'user-7',
        authorName: 'Yannick Noah',
        authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
        authorReputation: 130,
        body: `J'ai implémenté une PWA utilisant le Background Sync API du Service Worker avec reprise sur erreur exponentielle (exponential backoff) et stockage des pièces jointes dans l'Origin Private File System (OPFS).`,
        linkUrl: 'https://github.com/yannickn/pwa-resilient-sync',
        score: 11,
        votes: { 'user-demo': 1, 'user-admin': 1 },
        createdAt: '2026-10-12T09:40:00Z'
      }
    ]
  },
  {
    id: 'ch-archived',
    title: 'Intégration d’un composant universel de paiement Mobile Money multi-opérateurs',
    description: 'Concevoir un widget modal élégant qui détecte l’opérateur de l’utilisateur à partir de l’indicatif et propose le paiement fluide Wave, Orange Money ou MTN MoMo.',
    localContext: 'Problème de fragmentation des moyens de paiement en Afrique de l’Ouest et Centrale.',
    type: 'debate',
    technologies: ['JavaScript', 'API Mobile Money', 'UX Mobile'],
    difficulty: 'Débutant',
    startsAt: '2026-09-28T00:00:00Z',
    endsAt: '2026-10-05T23:59:59Z',
    status: 'archived',
    entriesCount: 5,
    winnerId: 'user-4',
    winnerName: 'Fatou Ndiaye',
    entries: [
      {
        id: 'entry-arch-1',
        challengeId: 'ch-archived',
        authorId: 'user-4',
        authorName: 'Fatou Ndiaye',
        authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80',
        authorReputation: 510,
        body: 'Présentation d’une spécification unifiée avec fallback USSD pour les acheteurs sans smartphone.',
        linkUrl: 'https://github.com/fatoundiaye/momo-universal-kit',
        score: 32,
        votes: { 'user-demo': 1, 'user-admin': 1, 'user-3': 1 },
        createdAt: '2026-09-30T10:00:00Z'
      }
    ]
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    ownerId: 'user-demo',
    ownerName: 'Anta Diop',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    ownerEmail: 'demo@xamxamhub.dev',
    ownerGithub: 'https://github.com/anta-diop-tech',
    ownerPhone: '+221 77 123 45 67',
    title: 'Suxali Santé — Carnet de santé numérique décentralisé et hors-ligne',
    description: 'Une application web et mobile pensée pour les infirmeries et postes de santé communautaires. Elle permet d’enregistrer le suivi vaccinal et prénatal même en cas de coupure Internet prolongée.',
    objective: 'Déployer un pilote dans 3 postes de santé de la région de Thiès et Kaolack d’ici décembre 2026.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB', 'FastAPI'],
    skillsNeeded: ['FastAPI / Python', 'Sécurité des données', 'UX Mobile'],
    seatsTotal: 4,
    seatsAvailable: 2,
    city: 'Dakar',
    status: 'open',
    createdAt: '2026-10-02T10:00:00Z',
    team: [
      {
        userId: 'user-demo',
        name: 'Anta Diop',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
        role: 'Porteuse du projet & Frontend lead',
        email: 'demo@xamxamhub.dev',
        githubUrl: 'https://github.com/anta-diop-tech'
      },
      {
        userId: 'user-4',
        name: 'Fatou Ndiaye',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80',
        role: 'Conseillère architecture & mentoring',
        email: 'fatou.mentor@tech.sn',
        githubUrl: 'https://github.com/fatoundiaye'
      }
    ]
  },
  {
    id: 'prj-2',
    ownerId: 'user-6',
    ownerName: 'Grace Habimana',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    ownerEmail: 'grace.h@kigali.tech',
    ownerGithub: 'https://github.com/gracehabimana',
    title: 'AgroConnect Sahel — Place de marché agricole solidaire avec alertes SMS',
    description: 'Plateforme mettant directement en relation les coopératives maraîchères avec les grossistes urbains pour réduire le gaspillage alimentaire.',
    objective: 'Connecter 500 producteurs avec des alertes prix quotidiennes par SMS et WhatsApp.',
    technologies: ['Django', 'Python', 'PostgreSQL', 'Twilio SMS'],
    skillsNeeded: ['Frontend Vue ou React', 'Intégration SMS / USSD'],
    seatsTotal: 3,
    seatsAvailable: 1,
    city: 'À distance',
    status: 'open',
    createdAt: '2026-10-05T14:30:00Z',
    team: [
      {
        userId: 'user-6',
        name: 'Grace Habimana',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
        role: 'Fondatrice & Backend Python',
        email: 'grace.h@kigali.tech',
        githubUrl: 'https://github.com/gracehabimana'
      },
      {
        userId: 'user-3',
        name: 'Moussa Koné',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        role: 'Développeur Full-Stack',
        email: 'moussa@freelance.sn',
        githubUrl: 'https://github.com/moussakone'
      }
    ]
  },
  {
    id: 'prj-3',
    ownerId: 'user-5',
    ownerName: 'Koffi Mensah',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    ownerEmail: 'koffi.mensah@dev.tg',
    ownerGithub: 'https://github.com/koffimensah',
    title: 'SunuWatt — Monitoring intelligent de mini-réseaux solaires',
    description: 'Système IoT et tableau de bord temps réel pour suivre la production, le stockage sur batteries et la distribution d’énergie propre dans les villages isolés.',
    objective: 'Équiper 10 fermes solaires expérimentales et offrir un tableau de bord accessible sur mobile.',
    technologies: ['Go', 'MQTT', 'React', 'TimescaleDB'],
    skillsNeeded: ['DevOps / Docker', 'Développement Mobile Flutter', 'IoT Firmware'],
    seatsTotal: 4,
    seatsAvailable: 2,
    city: 'Lomé',
    status: 'open',
    createdAt: '2026-10-06T18:00:00Z',
    team: [
      {
        userId: 'user-5',
        name: 'Koffi Mensah',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        role: 'Lead IoT & Backend',
        email: 'koffi.mensah@dev.tg',
        githubUrl: 'https://github.com/koffimensah'
      }
    ]
  },
  {
    id: 'prj-4',
    ownerId: 'user-admin',
    ownerName: 'Saliou Diallo',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    ownerEmail: 'admin@xamxamhub.dev',
    ownerGithub: 'https://github.com/saliou-diallo',
    title: 'AfroCode Hub — Kit UI accessible et ultra-léger pour le web africain',
    description: 'Bibliothèque de composants UI en Tailwind CSS zéro-dépendance lourde, optimisée pour un chargement rapide sur réseaux 2G/3G et faible processeur.',
    objective: 'Offrir un socle prêt à l’emploi pour tous les développeurs francophones et anglophones.',
    technologies: ['TypeScript', 'Tailwind CSS', 'Vite'],
    skillsNeeded: ['Accessibilité WCAG', 'Documentation technique', 'Design System'],
    seatsTotal: 3,
    seatsAvailable: 0,
    city: 'À distance',
    status: 'completed',
    createdAt: '2026-09-25T11:00:00Z',
    team: [
      {
        userId: 'user-admin',
        name: 'Saliou Diallo',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        role: 'Mainteneur principal',
        email: 'admin@xamxamhub.dev',
        githubUrl: 'https://github.com/saliou-diallo'
      },
      {
        userId: 'user-demo',
        name: 'Anta Diop',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
        role: 'Design System & Accessibilité',
        email: 'demo@xamxamhub.dev',
        githubUrl: 'https://github.com/anta-diop-tech'
      },
      {
        userId: 'user-7',
        name: 'Yannick Noah',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
        role: 'Revue de performance & benchmarks',
        email: 'yannick.noah@cameroon.dev',
        githubUrl: 'https://github.com/yannickn'
      }
    ]
  }
];

export const SEED_REQUESTS: ProjectRequest[] = [
  {
    id: 'req-1',
    projectId: 'prj-1',
    projectTitle: 'Suxali Santé — Carnet de santé numérique décentralisé et hors-ligne',
    applicantId: 'user-3',
    applicantName: 'Moussa Koné',
    applicantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    applicantSkills: ['React', 'Python', 'Django', 'FastAPI'],
    applicantReputation: 85,
    applicantEmail: 'moussa@freelance.sn',
    applicantGithub: 'https://github.com/moussakone',
    applicantPhone: '+221 70 555 44 33',
    shareContacts: { email: true, github: true, phone: true },
    message: 'Bonjour Anta ! Je suis très emballé par votre initiative de santé locale. J\'ai déjà travaillé sur une API FastAPI avec SQLite pour un dispensaire à Thiès. Je serais ravi de prendre en charge le backend et la synchronisation !',
    status: 'pending',
    createdAt: '2026-10-10T16:00:00Z'
  },
  {
    id: 'req-2',
    projectId: 'prj-2',
    projectTitle: 'AgroConnect Sahel — Place de marché agricole solidaire avec alertes SMS',
    applicantId: 'user-demo',
    applicantName: 'Anta Diop',
    applicantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    applicantSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Mobile'],
    applicantReputation: 145,
    applicantEmail: 'demo@xamxamhub.dev',
    applicantGithub: 'https://github.com/anta-diop-tech',
    shareContacts: { email: true, github: true, phone: false },
    message: 'Bonjour Grace ! Je peux vous aider à concevoir les écrans web responsive pour les grossistes maraîchers avec Tailwind CSS.',
    status: 'accepted',
    createdAt: '2026-10-06T10:15:00Z',
    decidedAt: '2026-10-07T08:30:00Z'
  }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-demo',
    type: 'project_request',
    title: 'Nouvelle candidature reçue',
    message: 'Moussa Koné a demandé à rejoindre votre projet "Suxali Santé". Consultez sa motivation et validez sa candidature.',
    linkPage: 'my-requests',
    isRead: false,
    createdAt: '2026-10-10T16:01:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-demo',
    type: 'accepted_answer',
    title: 'Réponse acceptée !',
    message: 'Votre réponse sur la question Wave Webhook a été acceptée comme solution officielle. +15 points de réputation !',
    linkPage: 'question-detail',
    linkId: 'q-2',
    isRead: false,
    createdAt: '2026-10-09T13:46:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-demo',
    type: 'challenge',
    title: 'Défi de la semaine en cours',
    message: '3 développeurs ont déjà soumis leur solution pour le défi "Architecture Offline-First". Découvrez le classement !',
    linkPage: 'challenges',
    linkId: 'ch-active',
    isRead: true,
    createdAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'notif-4',
    userId: 'user-demo',
    type: 'badge',
    title: 'Nouveau badge obtenu : Pionnier Fondateur !',
    message: 'Félicitations Anta, vous faites partie des 100 premiers membres inscrits sur XamXam Hub.',
    linkPage: 'profile',
    isRead: true,
    createdAt: '2026-09-29T10:05:00Z'
  }
];

export const SEED_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-3',
    reporterName: 'Moussa Koné',
    targetType: 'comment',
    targetId: 'comm-fake',
    targetTitle: 'Commentaire publicitaire non sollicité',
    reason: 'spam',
    details: 'Lien commercial vers un service de crypto-monnaies sans aucun rapport avec la question technique.',
    status: 'open',
    createdAt: '2026-10-12T14:00:00Z'
  }
];
