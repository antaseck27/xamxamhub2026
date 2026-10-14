import React, { useState } from 'react';
import { FolderGit2, ArrowRight, ArrowLeft, Plus, X, Sparkles, MapPin } from 'lucide-react';
import { StorageService } from '../services/storage';

interface CreateProjectPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [city, setCity] = useState('Dakar');
  const [seatsTotal, setSeatsTotal] = useState(3);
  const [technologies, setTechnologies] = useState<string[]>(['React', 'TypeScript']);
  const [skillsNeeded, setSkillsNeeded] = useState<string[]>(['Backend Python', 'UX Mobile']);
  const [techInput, setTechInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentUser = StorageService.getCurrentUser();

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skillsNeeded.includes(skillInput.trim())) {
      setSkillsNeeded([...skillsNeeded, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title || title.trim().length < 10) {
      newErrors.title = 'Le titre doit comporter au moins 10 caractères.';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères.';
    }

    if (!description || description.trim().length < 30) {
      newErrors.description = 'La description doit comporter au moins 30 caractères.';
    }

    if (skillsNeeded.length === 0) {
      newErrors.skills = 'Indiquez au moins une compétence recherchée.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const created = StorageService.createProject({
      title: title.trim(),
      description: description.trim(),
      objective: objective.trim(),
      technologies,
      skillsNeeded,
      seatsTotal,
      city
    });

    if (created) {
      onNavigate('project-detail', { id: created.id });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Publier un projet collaboratif
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Décrivez votre vision, fixez le nombre de places et recrutez des coéquipiers africains.
          </p>
        </div>

        <button
          onClick={() => onNavigate('projects')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Annuler</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Nom du projet (10 à 100 caractères)
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Ex : Suxali Santé — Carnet de santé numérique décentralisé"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Description détaillée du projet (≤ 1000 caractères)
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="À quel besoin répond ce projet ? Qui sont les utilisateurs cibles ? Quel est l'état d'avancement actuel ?"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
            required
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
            <span>{description.length}/1000 car.</span>
            <span>Clarté et transparence recommandées</span>
          </div>
          {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Objective */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Objectif court terme / Jalons à atteindre
          </label>
          <input
            type="text"
            value={objective}
            onChange={e => setObjective(e.target.value)}
            placeholder="Ex : Déployer un MVP dans 3 dispensaires d'ici décembre 2026"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* City & Seats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Localisation ou Mode de travail
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Dakar">Dakar (Sénégal)</option>
              <option value="Abidjan">Abidjan (Côte d’Ivoire)</option>
              <option value="Lomé">Lomé (Togo)</option>
              <option value="Cotonou">Cotonou (Bénin)</option>
              <option value="Bamako">Bamako (Mali)</option>
              <option value="Kigali">Kigali (Rwanda)</option>
              <option value="Douala">Douala (Cameroun)</option>
              <option value="À distance">100% À distance (Remote)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Nombre total de membres visé (1 à 10 places)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={seatsTotal}
              onChange={e => setSeatsTotal(parseInt(e.target.value) || 2)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>
        </div>

        {/* Skills needed */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Compétences & Profils recherchés
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skillsNeeded.map(s => (
              <span key={s} className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5">
                {s}
                <button type="button" onClick={() => setSkillsNeeded(skillsNeeded.filter(x => x !== s))} className="hover:text-rose-400 cursor-pointer">
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
              placeholder="Ex : FastAPI, UI/UX, Flutter..."
              className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
            >
              Ajouter
            </button>
          </div>
          {errors.skills && <p className="text-rose-400 text-xs mt-1">{errors.skills}</p>}
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Technologies principales du projet
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {technologies.map(t => (
              <span key={t} className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono flex items-center gap-1.5">
                #{t}
                <button type="button" onClick={() => setTechnologies(technologies.filter(x => x !== t))} className="hover:text-rose-400 cursor-pointer">
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
              placeholder="Ex : PostgreSQL, Docker, Vue..."
              className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 cursor-pointer"
            >
              Ajouter
            </button>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center gap-2"
          >
            <span>Publier le projet (+15 pts)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
