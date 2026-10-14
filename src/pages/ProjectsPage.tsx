import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, PlusCircle, Search, Filter, MapPin, Users, 
  ArrowRight, CheckCircle2, Globe, Sparkles 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Project } from '../types';

interface ProjectsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'completed'>('all');
  const [filterSkill, setFilterSkill] = useState('all');

  const projects = StorageService.getProjects();

  const cities = ['all', 'Dakar', 'Abidjan', 'Lomé', 'Kigali', 'Douala', 'À distance'];
  const popularSkills = ['all', 'React', 'FastAPI', 'Python', 'Tailwind CSS', 'Django', 'Go', 'IoT'];

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !search || 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.skillsNeeded.some(s => s.toLowerCase().includes(search.toLowerCase()));

      const matchCity = filterCity === 'all' || p.city.toLowerCase() === filterCity.toLowerCase();
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchSkill = filterSkill === 'all' || p.skillsNeeded.some(s => s.toLowerCase().includes(filterSkill.toLowerCase()));

      return matchSearch && matchCity && matchStatus && matchSkill;
    });
  }, [projects, search, filterCity, filterStatus, filterSkill]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Projets & Recherche de Coéquipiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Trouvez votre future équipe ou recrutez des compétences pointues pour votre projet tech.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-project')}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publier un projet</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par titre, compétences (ex: FastAPI, React)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Toutes les villes</option>
              <option value="Dakar">Dakar</option>
              <option value="Abidjan">Abidjan</option>
              <option value="Lomé">Lomé</option>
              <option value="Kigali">Kigali</option>
              <option value="Douala">Douala</option>
              <option value="À distance">À distance</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouverts (places disponibles)</option>
              <option value="completed">Complets</option>
            </select>
          </div>
        </div>

        {/* Skill filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-400 text-[11px] shrink-0 mr-1">Compétence clé :</span>
          {popularSkills.map(sk => (
            <button
              key={sk}
              onClick={() => setFilterSkill(sk)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer shrink-0 ${
                filterSkill === sk
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sk === 'all' ? 'Toutes' : sk}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <FolderGit2 className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">Aucun projet pour l'instant avec ces filtres</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Lancez le premier projet ou élargissez vos critères de recherche.
          </p>
          <button
            onClick={() => onNavigate('create-project')}
            className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
          >
            Lancer un projet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(p => (
            <div
              key={p.id}
              onClick={() => onNavigate('project-detail', { id: p.id })}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-900/90 transition-all cursor-pointer shadow-xl flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{p.city}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    p.status === 'open'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {p.status === 'open' 
                      ? `${p.seatsAvailable} place${p.seatsAvailable > 1 ? 's' : ''} disponible${p.seatsAvailable > 1 ? 's' : ''}` 
                      : 'Équipe complète'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {p.description}
                </p>

                {/* Skills Wanted */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Profils recherchés :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skillsNeeded.map(s => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={p.ownerAvatar}
                    alt={p.ownerName}
                    className="w-6 h-6 rounded-md object-cover border border-slate-700"
                  />
                  <span className="text-slate-300 font-medium">@{p.ownerName}</span>
                </div>

                <div className="flex items-center gap-1 text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Détail du projet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
