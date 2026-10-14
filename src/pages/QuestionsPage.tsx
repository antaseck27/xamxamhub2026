import React, { useState, useMemo } from 'react';
import { 
  Search, PlusCircle, Filter, CheckCircle2, MessageSquare, 
  ThumbsUp, Clock, Tag as TagIcon, ArrowRight, Code2, AlertCircle 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Question } from '../types';

interface QuestionsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  initialFilter?: string;
  initialSearch?: string;
}

export const QuestionsPage: React.FC<QuestionsPageProps> = ({ 
  onNavigate, initialFilter = 'all', initialSearch = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'popular' | 'unresolved' | 'resolved'>(
    (initialFilter as any) || 'all'
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const questions = StorageService.getQuestions();
  const allTags = StorageService.getTags();

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Search text in title, body, or tags
      const matchSearch = !searchQuery.trim() || 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tag filter
      const matchTag = !selectedTag || q.tags.includes(selectedTag);

      // Status filter
      let matchFilter = true;
      if (activeFilter === 'unresolved') matchFilter = q.status === 'unresolved';
      if (activeFilter === 'resolved') matchFilter = q.status === 'resolved';

      return matchSearch && matchTag && matchFilter;
    }).sort((a, b) => {
      if (activeFilter === 'popular') return b.score - a.score;
      if (activeFilter === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [questions, searchQuery, activeFilter, selectedTag]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = filteredQuestions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Entraide & Questions Techniques
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Posez vos questions, trouvez des solutions vérifiées et gagnez de la réputation.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ask-question')}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Poser une question</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Full Text Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Rechercher par mot-clé, libellé d'erreur, technologie..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'recent', label: 'Récents' },
              { id: 'popular', label: 'Populaires' },
              { id: 'unresolved', label: 'Sans réponse' },
              { id: 'resolved', label: 'Résolues' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveFilter(tab.id as any); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-400 text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <TagIcon className="w-3 h-3" /> Filtrer par tag :
          </span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] cursor-pointer"
            >
              Effacer tag ✕
            </button>
          )}
          {allTags.slice(0, 8).map(tag => (
            <button
              key={tag.id}
              onClick={() => { setSelectedTag(selectedTag === tag.name ? null : tag.name); setPage(1); }}
              className={`px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer shrink-0 ${
                selectedTag === tag.name
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-400 font-mono">
        Affichage de <span className="font-bold text-slate-200">{filteredQuestions.length}</span> question{filteredQuestions.length > 1 ? 's' : ''}
      </div>

      {/* Question Cards List */}
      {paginatedQuestions.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Aucune question ne correspond à votre recherche</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Soyez le premier à poser cette question et permettez à la communauté de vous apporter une solution !
          </p>
          <button
            onClick={() => onNavigate('ask-question')}
            className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
          >
            Poser une nouvelle question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedQuestions.map(q => (
            <div
              key={q.id}
              onClick={() => onNavigate('question-detail', { id: q.id })}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-900/90 transition-all cursor-pointer shadow-lg space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                
                {/* Main Content */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <img
                      src={q.authorAvatar}
                      alt={q.authorName}
                      className="w-5 h-5 rounded-md object-cover border border-slate-700"
                    />
                    <span className="font-semibold text-slate-300">@{q.authorName}</span>
                    <span>·</span>
                    <span>{new Date(q.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    {q.status === 'resolved' && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Résolue
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors leading-snug">
                    {q.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {q.body.slice(0, 180)}...
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {q.tags.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 text-[11px] font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score & Answers Counts */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs font-mono text-slate-400 shrink-0 gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <ThumbsUp className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-bold text-slate-200">{q.score}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    q.status === 'resolved' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold' 
                      : 'bg-slate-950/70 border-slate-800 text-slate-400'
                  }`}>
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{q.answers.length} réponse{q.answers.length > 1 ? 's' : ''}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white cursor-pointer font-medium"
          >
            Page précédente
          </button>
          <span className="font-mono text-slate-400">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white cursor-pointer font-medium"
          >
            Page suivante
          </button>
        </div>
      )}

    </div>
  );
};
