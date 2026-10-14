import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Bot, Eye, Edit3, Code2, Bold, Italic, Link, List, 
  Tag as TagIcon, ArrowRight, AlertCircle, CheckCircle2, ExternalLink 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService, AISuggestionResult } from '../services/ai';
import { CodeBlock } from '../components/common/CodeBlock';
import { Question } from '../types';

interface AskQuestionPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const AskQuestionPage: React.FC<AskQuestionPageProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['React']);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // AI & duplicate state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestionResult | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<Question[]>([]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allAvailableTags = StorageService.getTags();

  // Real-time duplicate detection as user types title (US-Q-10)
  useEffect(() => {
    if (title.trim().length >= 10) {
      const dups = AIService.detectDuplicates(title);
      setSimilarQuestions(dups);
    } else {
      setSimilarQuestions([]);
    }
  }, [title]);

  // AI Title Improvement (US-AI-01)
  const handleImproveTitle = async () => {
    if (!title.trim()) {
      setErrors({ title: 'Veuillez saisir un premier brouillon de titre avant de demander l’aide de l’IA.' });
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await AIService.improveTitle(title);
      setAiSuggestion(res);
      setErrors(prev => ({ ...prev, title: '' }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiTitle = () => {
    if (aiSuggestion) {
      setTitle(aiSuggestion.improvedTitle);
      setAiSuggestion(null);
    }
  };

  // AI Summary generation (US-AI-02)
  const handleGenerateSummary = async () => {
    if (body.length < 50) {
      alert('Veuillez rédiger au moins quelques lignes de description avant de résumer.');
      return;
    }
    setIsSummaryLoading(true);
    const res = await AIService.summarizeQuestion(title || 'Question technique', body);
    setAiSummary(res.summary);
    setIsSummaryLoading(false);
  };

  // Markdown formatting helpers
  const insertText = (prefix: string, suffix: string = '') => {
    setBody(prev => prev + `${prefix}texte${suffix}`);
  };

  const insertCodeBlock = () => {
    setBody(prev => prev + '\n```javascript\n// Votre extrait de code ici\nconsole.log("XamXam");\n```\n');
  };

  // Tag helpers
  const handleAddTag = (tagName: string) => {
    const clean = tagName.trim().replace(/^#/, '');
    if (clean && !selectedTags.includes(clean) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title || title.trim().length < 15) {
      newErrors.title = 'Le titre doit comporter au moins 15 caractères (ex: problème précis + technologie).';
    } else if (title.trim().length > 150) {
      newErrors.title = 'Le titre ne peut pas dépasser 150 caractères.';
    }

    if (!body || body.trim().length < 30) {
      newErrors.body = 'La description doit comporter au moins 30 caractères pour permettre une réponse claire.';
    }

    if (selectedTags.length === 0) {
      newErrors.tags = 'Veuillez sélectionner au moins 1 tag (et jusqu’à 5 maximum).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const created = StorageService.createQuestion({
      title: title.trim(),
      body: body.trim(),
      tags: selectedTags,
      aiSummary: aiSummary || undefined
    });

    onNavigate('question-detail', { id: created.id });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Page Title */}
      <div className="space-y-1 pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Poser une question technique
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Formatez votre problème, obtenez l'assistance IA et profitez des retours de la communauté.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* TITRE WITH AI ASSISTANT & DUPLICATE DETECTION */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-sm font-bold text-slate-100">
                Titre de la question
              </label>
              <p className="text-xs text-slate-400">
                Soyez précis. Mentionnez la technologie et l'erreur ou l'objectif concret.
              </p>
            </div>
            <button
              type="button"
              onClick={handleImproveTitle}
              disabled={isAiLoading}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/40 hover:bg-sky-500/25 text-sky-400 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiLoading ? 'Analyse...' : 'Améliorer le titre (IA)'}</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={150}
              placeholder="Ex : Comment gérer les transactions hors-ligne avec IndexedDB et SQLite sous React ?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <span className="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">
              {title.length}/150
            </span>
          </div>
          {errors.title && <p className="text-rose-400 text-xs">{errors.title}</p>}

          {/* AI Improvement Result Box (US-AI-01) */}
          {aiSuggestion && (
            <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/40 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-sky-300">
                  <Bot className="w-4 h-4" /> Suggestion XamXam IA :
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300">
                  Généré par IA
                </span>
              </div>
              <p className="text-slate-100 font-semibold text-sm">« {aiSuggestion.improvedTitle} »</p>
              <p className="text-slate-400 text-[11px]">{aiSuggestion.explanation}</p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={applyAiTitle}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Appliquer cette suggestion
                </button>
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
                >
                  Ignorer
                </button>
              </div>
            </div>
          )}

          {/* Real-time Duplicate Detection (US-Q-10) */}
          {similarQuestions.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4" />
                <span>Questions similaires déjà existantes :</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Une solution a peut-être déjà été apportée. Consultez ces questions avant de publier :
              </p>
              <div className="space-y-1.5 pt-1">
                {similarQuestions.map(sq => (
                  <button
                    key={sq.id}
                    type="button"
                    onClick={() => onNavigate('question-detail', { id: sq.id })}
                    className="w-full text-left p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 flex items-center justify-between text-slate-200 hover:text-sky-400 transition"
                  >
                    <span className="line-clamp-1">{sq.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESCRIPTION WITH MARKDOWN TOOLBAR & LIVE PREVIEW (US-Q-02) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-bold text-slate-100">
                Description du problème & code
              </label>
              <p className="text-xs text-slate-400">
                Expliquez ce que vous tentez de réaliser et collez les blocs de code pertinents.
              </p>
            </div>

            {/* Toggle write / preview */}
            <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'write' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Écrire</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu</span>
              </button>
            </div>
          </div>

          {/* Markdown Toolbar */}
          {activeTab === 'write' && (
            <div className="flex items-center flex-wrap gap-1 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => insertText('**', '**')}
                className="p-1.5 rounded hover:bg-slate-700 cursor-pointer"
                title="Gras"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('*', '*')}
                className="p-1.5 rounded hover:bg-slate-700 cursor-pointer"
                title="Italique"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('`', '`')}
                className="p-1.5 rounded hover:bg-slate-700 font-mono text-xs cursor-pointer"
                title="Code inline"
              >
                {'</>'}
              </button>
              <button
                type="button"
                onClick={insertCodeBlock}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 font-mono text-[11px] text-sky-400 cursor-pointer"
                title="Insérer un bloc de code"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Bloc de code</span>
              </button>
              <button
                type="button"
                onClick={() => insertText('- ')}
                className="p-1.5 rounded hover:bg-slate-700 cursor-pointer"
                title="Liste"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('[Titre](', ')')}
                className="p-1.5 rounded hover:bg-slate-700 cursor-pointer"
                title="Lien"
              >
                <Link className="w-3.5 h-3.5" />
              </button>

              <div className="ml-auto">
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={isSummaryLoading}
                  className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[11px] text-sky-300 flex items-center gap-1 cursor-pointer"
                  title="Générer un résumé avec l'IA"
                >
                  <Bot className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isSummaryLoading ? 'Résumé...' : 'Générer résumé IA'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'write' ? (
            <div>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={10}
                placeholder="Décrivez précisément votre problème, vos essais préalables et le résultat attendu..."
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>{body.length} caractères (minimum 30)</span>
                <span>Markdown & blocs de code supportés</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 min-h-[200px] text-xs sm:text-sm text-slate-200 space-y-4">
              {aiSummary && (
                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-300">
                  <strong>Résumé IA :</strong> {aiSummary}
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed font-sans">
                {body || <span className="text-slate-500 italic">Aucun contenu à prévisualiser.</span>}
              </div>
            </div>
          )}

          {errors.body && <p className="text-rose-400 text-xs">{errors.body}</p>}
        </div>

        {/* TAGS SELECTION (US-Q-08) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
          <div>
            <label className="block text-sm font-bold text-slate-100">
              Tags technologiques (1 à 5 tags)
            </label>
            <p className="text-xs text-slate-400">
              Associez les technologies exactes pour que les développeurs concernés vous répondent rapidement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-400 cursor-pointer font-bold ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(tagInput);
                }
              }}
              placeholder="Ex : Docker, Django, Python..."
              className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={() => handleAddTag(tagInput)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
            >
              Ajouter
            </button>
          </div>

          {/* Suggestions from popular tags */}
          <div className="flex flex-wrap gap-1.5 pt-1 text-xs font-mono">
            <span className="text-slate-400 text-[11px] self-center mr-1">Populaires :</span>
            {allAvailableTags.slice(0, 7).map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleAddTag(t.name)}
                className="px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] cursor-pointer"
              >
                +{t.name}
              </button>
            ))}
          </div>

          {errors.tags && <p className="text-rose-400 text-xs">{errors.tags}</p>}
        </div>

        {/* SUBMISSION BUTTON */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => onNavigate('questions')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center gap-2"
          >
            <span>Publier la question (+5 pts)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
