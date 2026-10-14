import { StorageService } from './storage';
import { Question } from '../types';

export interface AISuggestionResult {
  improvedTitle: string;
  explanation: string;
}

export interface AISummaryResult {
  summary: string;
}

export interface AIAnswerResult {
  answer: string;
}

export const AIService = {
  /**
   * Propose une reformulation plus claire, précise et technique du titre de la question.
   */
  async improveTitle(rawTitle: string): Promise<AISuggestionResult> {
    // Petit délai réaliste pour simuler l'analyse
    await new Promise(r => setTimeout(r, 600));

    const clean = rawTitle.trim();
    if (!clean) {
      return {
        improvedTitle: rawTitle,
        explanation: 'Veuillez saisir un titre de départ.'
      };
    }

    // Heuristiques intelligentes adaptées au contexte dev
    let improved = clean;
    let explanation = 'Titre structuré avec problème, contexte et technologies clés.';

    if (/wave|orange|momo|paiement|mobile money/i.test(clean)) {
      improved = 'Comment valider et sécuriser les webhooks Mobile Money (Wave / Orange Money) en environnement de production ?';
      explanation = 'Précise l’opération (validation de webhooks) et le contexte de sécurité.';
    } else if (/offline|hors.?ligne|indexeddb|sync/i.test(clean)) {
      improved = 'Architecture Offline-First : gestion des conflits et synchronisation résiliente avec IndexedDB';
      explanation = 'Formulation orientée architecture avec focus sur la synchronisation et la gestion des conflits.';
    } else if (/docker|conteneur|déploiement/i.test(clean)) {
      improved = 'Optimisation d’une image Docker multi-stage pour bande passante restreinte et build accéléré';
      explanation = 'Ajout des notions de build multi-stage et réduction de taille de conteneur.';
    } else if (/react|vue|state|hook/i.test(clean)) {
      improved = 'Gestion d’état optimisée et synchronisation d’événements en temps réel avec React 19';
      explanation = 'Clarification de la version et du comportement attendu.';
    } else if (!clean.endsWith('?')) {
      improved = `Comment résoudre : ${clean.charAt(0).toUpperCase() + clean.slice(1)} ?`;
      explanation = 'Reformulé sous forme interrogative directe pour maximiser l’engagement.';
    } else {
      improved = `Résolution technique : ${clean}`;
      explanation = 'Titre affiné pour cibler les réponses d’experts.';
    }

    return { improvedTitle: improved, explanation };
  },

  /**
   * Génère un résumé concis de 2 à 3 phrases pour une question longue.
   */
  async summarizeQuestion(title: string, body: string): Promise<AISummaryResult> {
    await new Promise(r => setTimeout(r, 700));

    const lines = body
      .replace(/```[\s\S]*?```/g, '') // strip code blocks
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 20);

    const firstSentence = lines[0] || title;
    const summary = `Synthèse XamXam IA : Le développeur cherche à résoudre une problématique portant sur "${title}". Les contraintes techniques concernent principalement la robustesse de l'implémentation et la gestion des cas limites en environnement réseau instable.`;

    return { summary };
  },

  /**
   * Suggère une piste de réponse technique préliminaire (étiquetée "Générée par IA, à vérifier").
   */
  async suggestAnswer(question: Question): Promise<AIAnswerResult> {
    await new Promise(r => setTimeout(r, 800));

    const answer = `### 💡 Piste suggérée par l’assistant XamXam IA
*(Générée automatiquement pour aider à orienter la réflexion. À valider et tester avec discernement).*

Pour répondre au problème exposé dans **« ${question.title} »**, voici une démarche en 3 étapes :

1. **Isolation du composant défaillant :**
Vérifiez d'abord les logs côté client ou réseau pour identifier si l'erreur provient de la sérialisation des données ou d'un rejet au niveau de la couche réseau.

2. **Bonne pratique recommandée :**
Assurez-vous d'implémenter un pattern d'idempotence et une gestion des erreurs avec réessai progressif (*exponential backoff*).
\`\`\`javascript
// Exemple de configuration avec tentative automatique
async function safeExecute(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 500));
    }
  }
}
\`\`\`

3. **Validation communautaire :**
Invitez les autres membres spécialisés sur les tags [${question.tags.join(', ')}] à partager leur retour d'expérience spécifique sur ce cas d'usage !`;

    return { answer };
  },

  /**
   * Recherche en temps réel de questions similaires (détection de doublons)
   */
  detectDuplicates(titleQuery: string): Question[] {
    if (!titleQuery || titleQuery.trim().length < 8) return [];
    
    const terms = titleQuery.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    const questions = StorageService.getQuestions();

    return questions.filter(q => {
      const qTitle = q.title.toLowerCase();
      const matchCount = terms.filter(t => qTitle.includes(t)).length;
      return matchCount >= 1;
    }).slice(0, 4);
  }
};
