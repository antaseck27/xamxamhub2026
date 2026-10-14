import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, Sparkles, 
  Bot, Share2, Flag, ArrowLeft, Send, Check, Trash2, Shield, User, Clock, AlertCircle, Edit3
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { CodeBlock } from '../components/common/CodeBlock';
import { ReportModal } from '../components/common/ReportModal';
import { Question, Answer } from '../types';

interface QuestionDetailPageProps {
  questionId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const QuestionDetailPage: React.FC<QuestionDetailPageProps> = ({ 
  questionId, onNavigate 
}) => {
  const [question, setQuestion] = useState<Question | undefined>(() => StorageService.getQuestionById(questionId));
  const [newAnswerText, setNewAnswerText] = useState('');
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({}); // targetId -> text
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: any; id: string; title: string } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const currentUser = StorageService.getCurrentUser();

  const reloadQuestion = () => {
    setQuestion(StorageService.getQuestionById(questionId));
  };

  if (!question) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Question introuvable</h2>
        <p className="text-xs text-slate-400">Cette question a peut-être été supprimée ou le lien est invalide.</p>
        <button
          onClick={() => onNavigate('questions')}
          className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs cursor-pointer"
        >
          Retour aux questions
        </button>
      </div>
    );
  }

  // Handle Question Vote
  const handleVoteQuestion = (val: 1 | -1) => {
    const res = StorageService.voteQuestion(question.id, val);
    if (!res.success) {
      setFeedbackMsg({ text: res.message || 'Vote impossible.', error: true });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      reloadQuestion();
    }
  };

  // Handle Answer Vote
  const handleVoteAnswer = (answerId: string, val: 1 | -1) => {
    const res = StorageService.voteAnswer(question.id, answerId, val);
    if (!res.success) {
      setFeedbackMsg({ text: res.message || 'Vote impossible.', error: true });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      reloadQuestion();
    }
  };

  // Handle Accept Answer (US-R-03)
  const handleAccept = (answerId: string) => {
    const res = StorageService.acceptAnswer(question.id, answerId);
    if (!res.success) {
      setFeedbackMsg({ text: res.message || 'Action impossible.', error: true });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      setFeedbackMsg({ text: 'Solution validée ! +15 pts attribués à l’auteur.', error: false });
      setTimeout(() => setFeedbackMsg(null), 3000);
      reloadQuestion();
    }
  };

  // Submit Answer (US-R-01)
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerText.trim() || newAnswerText.trim().length < 20) {
      setFeedbackMsg({ text: 'Votre réponse doit comporter au moins 20 caractères explicatifs.', error: true });
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    StorageService.addAnswer(question.id, newAnswerText.trim(), false);
    setNewAnswerText('');
    setFeedbackMsg({ text: 'Réponse publiée avec succès (+10 pts de réputation) !', error: false });
    setTimeout(() => setFeedbackMsg(null), 3000);
    reloadQuestion();
  };

  // AI Answer Suggestion (US-AI-05)
  const handleAiSuggestAnswer = async () => {
    setIsAiAnswering(true);
    const res = await AIService.suggestAnswer(question);
    StorageService.addAnswer(question.id, res.answer, true);
    setIsAiAnswering(false);
    reloadQuestion();
  };

  // Submit Comment (US-R-04)
  const handleAddComment = (answerId: string | null) => {
    const targetKey = answerId || 'question';
    const text = newCommentText[targetKey];
    if (!text || text.trim().length < 5) return;

    StorageService.addComment(question.id, answerId, text.trim());
    setNewCommentText(prev => ({ ...prev, [targetKey]: '' }));
    setActiveCommentBox(null);
    reloadQuestion();
  };

  // Delete question (US-Q-04)
  const handleDeleteQuestion = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      const res = StorageService.deleteQuestion(question.id);
      if (res.success) {
        onNavigate('questions');
      } else {
        alert(res.message);
      }
    }
  };

  // Helper to render Markdown blocks (text + code blocks)
  const renderMarkdownContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : 'code';
        const codeLines = lang === lines[0] ? lines.slice(1).join('\n') : lines.join('\n');
        return <CodeBlock key={index} code={codeLines} language={lang} />;
      }
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed space-y-2">
          {part}
        </div>
      );
    });
  };

  // Sort answers: accepted answer first, then sorted by score descending
  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return b.score - a.score;
  });

  const userVote = currentUser ? question.votes[currentUser.id] : undefined;
  const isAuthor = currentUser?.id === question.authorId;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
          feedbackMsg.error 
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }`}>
          {feedbackMsg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('questions')}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à toutes les questions</span>
        </button>

        <div className="flex items-center gap-2">
          {isAuthor && question.answers.length === 0 && (
            <button
              onClick={handleDeleteQuestion}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer ma question</span>
            </button>
          )}

          <button
            onClick={() => setReportTarget({ type: 'question', id: question.id, title: question.title })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs transition cursor-pointer"
            title="Signaler cette question"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Signaler</span>
          </button>
        </div>
      </div>

      {/* QUESTION MAIN CONTAINER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        {/* Title and metadata */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <img
                src={question.authorAvatar}
                alt={question.authorName}
                className="w-5 h-5 rounded-md object-cover border border-slate-700"
              />
              @{question.authorName} ({question.authorReputation} pts)
            </span>
            <span>·</span>
            <span>{new Date(question.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {question.viewCount} vues
            </span>
            {question.status === 'resolved' && (
              <span className="flex items-center gap-1 text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] ml-auto">
                <CheckCircle2 className="w-3 h-3" /> Solution Validée
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {question.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {question.tags.map(t => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-md bg-slate-800 text-sky-300 text-xs font-mono"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* AI SUMMARY BOX (US-AI-02) */}
        {question.aiSummary && (
          <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-sky-400 font-mono text-[10px] uppercase font-bold">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Résumé automatique XamXam IA
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Généré par IA</span>
            </div>
            <p className="text-slate-300 leading-relaxed italic">
              {question.aiSummary}
            </p>
          </div>
        )}

        {/* Body with code snippets */}
        <div className="text-sm text-slate-200 leading-relaxed">
          {renderMarkdownContent(question.body)}
        </div>

        {/* Voting & Actions footer on question */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVoteQuestion(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
                userVote === 1
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-sky-500 hover:text-white'
              }`}
              title="Voter pour (+1) — Requiert 5 pts réputation"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{question.score}</span>
            </button>
            <button
              onClick={() => handleVoteQuestion(-1)}
              className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                userVote === -1
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-300'
              }`}
              title="Voter contre (-1) — Requiert 15 pts réputation"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveCommentBox(activeCommentBox === 'question' ? null : 'question')}
              className="text-xs text-slate-400 hover:text-sky-400 transition cursor-pointer"
            >
              Commenter la question ({question.comments.length})
            </button>
          </div>
        </div>

        {/* Comments on Question */}
        {question.comments.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            {question.comments.map(c => (
              <div key={c.id} className="pb-2 border-b border-slate-800/60 last:border-0 last:pb-0">
                <span className="font-semibold text-sky-400">@{c.authorName}</span> :{' '}
                <span className="text-slate-300">{c.body}</span>
                <span className="text-[10px] text-slate-500 font-mono ml-2">
                  {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add comment box on question */}
        {activeCommentBox === 'question' && (
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCommentText['question'] || ''}
              onChange={e => setNewCommentText({ ...newCommentText, question: e.target.value })}
              placeholder="Ajouter une précision courte (≤ 500 car.)..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => handleAddComment(null)}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Envoyer
            </button>
          </div>
        )}
      </div>

      {/* ANSWERS SECTION HEADER */}
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-sky-400" />
          <span>{question.answers.length} Réponse{question.answers.length > 1 ? 's' : ''}</span>
        </h3>

        {/* Button to request AI answer (US-AI-05) */}
        <button
          onClick={handleAiSuggestAnswer}
          disabled={isAiAnswering}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{isAiAnswering ? 'Génération...' : 'Suggérer réponse IA'}</span>
        </button>
      </div>

      {/* ANSWERS LIST */}
      <div className="space-y-6">
        {sortedAnswers.map(ans => {
          const ansUserVote = currentUser ? ans.votes[currentUser.id] : undefined;
          return (
            <div
              key={ans.id}
              className={`p-6 sm:p-7 rounded-3xl transition shadow-xl space-y-4 ${
                ans.isAccepted
                  ? 'bg-slate-900 border-2 border-emerald-500/70 shadow-emerald-950/20'
                  : ans.isAiGenerated
                  ? 'bg-slate-900/90 border border-sky-500/40'
                  : 'bg-slate-900 border border-slate-800'
              }`}
            >
              {/* Accepted / AI banner */}
              {ans.isAccepted && (
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold pb-2 border-b border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SOLUTION RETENUE PAR L’AUTEUR (+15 PTS)</span>
                </div>
              )}

              {ans.isAiGenerated && (
                <div className="flex items-center justify-between text-sky-400 font-mono text-xs font-bold pb-2 border-b border-sky-500/20">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4" /> Réponse générée par IA — À vérifier (Non votable)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px]">
                    Orientation technique
                  </span>
                </div>
              )}

              {/* Author & date */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={ans.authorAvatar}
                    alt={ans.authorName}
                    className="w-6 h-6 rounded-md object-cover border border-slate-700"
                  />
                  <span className="font-semibold text-slate-200">@{ans.authorName}</span>
                  {!ans.isAiGenerated && <span>({ans.authorReputation} pts)</span>}
                </div>
                <span>{new Date(ans.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Body */}
              <div className="text-sm text-slate-200 leading-relaxed">
                {renderMarkdownContent(ans.body)}
              </div>

              {/* Actions footer */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                
                {/* Voting */}
                {!ans.isAiGenerated ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVoteAnswer(ans.id, 1)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono transition cursor-pointer ${
                        ansUserVote === 1
                          ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-sky-500'
                      }`}
                      title="Voter pour (+1)"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{ans.score}</span>
                    </button>
                    <button
                      onClick={() => handleVoteAnswer(ans.id, -1)}
                      className={`p-1.5 rounded-xl border text-xs transition cursor-pointer ${
                        ansUserVote === -1
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-rose-500'
                      }`}
                      title="Voter contre (-1)"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Piste IA indicative</span>
                )}

                <div className="flex items-center gap-3">
                  {/* Mark as Accepted Solution button (visible only to question author) */}
                  {isAuthor && !ans.isAiGenerated && (
                    <button
                      onClick={() => handleAccept(ans.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        ans.isAccepted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{ans.isAccepted ? 'Solution validée' : 'Accepter comme solution'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveCommentBox(activeCommentBox === ans.id ? null : ans.id)}
                    className="text-xs text-slate-400 hover:text-sky-400 transition cursor-pointer"
                  >
                    Commenter ({ans.comments.length})
                  </button>

                  <button
                    onClick={() => setReportTarget({ type: 'answer', id: ans.id, title: `Réponse de ${ans.authorName}` })}
                    className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    title="Signaler cette réponse"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Comments under answer */}
              {ans.comments.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  {ans.comments.map(c => (
                    <div key={c.id} className="pb-1.5 border-b border-slate-800/60 last:border-0 last:pb-0">
                      <span className="font-semibold text-sky-400">@{c.authorName}</span> :{' '}
                      <span className="text-slate-300">{c.body}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment under answer */}
              {activeCommentBox === ans.id && (
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newCommentText[ans.id] || ''}
                    onChange={e => setNewCommentText({ ...newCommentText, [ans.id]: e.target.value })}
                    placeholder="Commentaire constructif (≤ 500 car.)..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={() => handleAddComment(ans.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Envoyer
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* FORM TO ADD AN ANSWER (US-R-01) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-sky-400" />
          <span>Votre réponse technique</span>
        </h3>
        <p className="text-xs text-slate-400">
          Fournissez une explication claire avec des blocs de code si possible. Gagnez +10 pts lors de la publication et +15 pts si l'auteur accepte votre solution.
        </p>

        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <textarea
            value={newAnswerText}
            onChange={e => setNewAnswerText(e.target.value)}
            rows={6}
            placeholder="Écrivez votre solution avec Markdown et blocs de code (```javascript ... ```)..."
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              {newAnswerText.length} caractères (min 20)
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publier ma réponse (+10 pts)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          targetTitle={reportTarget.title}
        />
      )}

    </div>
  );
};
