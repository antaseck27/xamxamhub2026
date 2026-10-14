import React, { useState, useMemo } from 'react';
import { 
  Users, Search, MapPin, ExternalLink, Sparkles, GraduationCap, 
  CheckCircle2, Briefcase, Filter, ArrowRight, Github 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { BadgeIcon } from '../components/common/BadgeIcon';
import { User, Availability } from '../types';

interface DevelopersPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const DevelopersPage: React.FC<DevelopersPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');

  const users = StorageService.getUsers().filter(u => !u.isBlocked);

  const availabilityLabels: Record<Availability, { label: string; color: string }> = {
    mentor: { label: 'Mentor Tech', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    open_to_collaborate: { label: 'Ouvert à collaborer', color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
    seeking_team: { label: 'Cherche équipe', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    freelance: { label: 'Missions freelance', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search ||
        u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.bio.toLowerCase().includes(search.toLowerCase());

      const matchCity = filterCity === 'all' || u.city.toLowerCase() === filterCity.toLowerCase();
      const matchAvail = filterAvailability === 'all' || u.availability.includes(filterAvailability as any);

      return matchSearch && matchCity && matchAvail;
    }).sort((a, b) => b.reputation - a.reputation);
  }, [users, search, filterCity, filterAvailability]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Annuaire des Développeurs Africains
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Découvrez des mentors, des coéquipiers et des experts techniques basés à Dakar, Abidjan, Lomé, Douala, Kigali et au-delà.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, username, bio..."
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
          </select>

          <select
            value={filterAvailability}
            onChange={e => setFilterAvailability(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Toutes les disponibilités</option>
            <option value="mentor">Mentors disponibles</option>
            <option value="seeking_team">En recherche d'équipe</option>
            <option value="open_to_collaborate">Ouverts à collaborer</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(dev => (
          <div
            key={dev.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/30 transition shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              
              {/* Header profile info */}
              <div className="flex items-start gap-3.5">
                <img
                  src={dev.avatarUrl}
                  alt={dev.displayName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shrink-0 shadow-md"
                />
                <div className="space-y-1">
                  <h3 
                    onClick={() => onNavigate('developer-profile', { id: dev.id })}
                    className="font-bold text-white text-base hover:text-sky-400 cursor-pointer transition leading-tight"
                  >
                    {dev.displayName}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">@{dev.username}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{dev.city}, {dev.country}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {dev.bio}
              </p>

              {/* Availability Badges */}
              <div className="flex flex-wrap gap-1.5">
                {dev.availability.map(av => {
                  const info = availabilityLabels[av];
                  if (!info) return null;
                  return (
                    <span
                      key={av}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${info.color}`}
                    >
                      {info.label}
                    </span>
                  );
                })}
              </div>

              {/* Badges preview */}
              <div className="flex flex-wrap gap-1 pt-1">
                {dev.badges.slice(0, 3).map(bId => (
                  <BadgeIcon key={bId} badgeId={bId} size="sm" />
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sky-400">{dev.reputation} points</span>

              <div className="flex items-center gap-2">
                {dev.githubUrl && (
                  <a
                    href={dev.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                    title="Contacter via GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => onNavigate('developer-profile', { id: dev.id })}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 font-semibold transition cursor-pointer text-xs"
                >
                  Profil →
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
