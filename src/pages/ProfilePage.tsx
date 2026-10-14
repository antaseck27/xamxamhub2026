import React, { useState } from 'react';
import { 
  User as UserIcon, MapPin, Github, Globe, Save, CheckCircle2, 
  Sparkles, Camera, Phone 
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { BadgeIcon } from '../components/common/BadgeIcon';
import { Availability } from '../types';

interface ProfilePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const currentUser = StorageService.getCurrentUser();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [city, setCity] = useState(currentUser?.city || 'Dakar');
  const [country, setCountry] = useState(currentUser?.country || 'Sénégal');
  const [githubUrl, setGithubUrl] = useState(currentUser?.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolioUrl || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [availability, setAvailability] = useState<Availability[]>(currentUser?.availability || ['open_to_collaborate']);
  const [savedToast, setSavedToast] = useState(false);

  if (!currentUser) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Veuillez vous connecter</h2>
        <button
          onClick={() => onNavigate('login')}
          className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs cursor-pointer"
        >
          Connexion
        </button>
      </div>
    );
  }

  const toggleAvailability = (item: Availability) => {
    if (availability.includes(item)) {
      setAvailability(availability.filter(a => a !== item));
    } else {
      setAvailability([...availability, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateUserProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      city: city.trim(),
      country: country.trim(),
      githubUrl: githubUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
      phone: phone.trim(),
      availability
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mon Profil Développeur
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gérez vos informations publiques, compétences et options de disponibilité.
          </p>
        </div>

        <button
          onClick={() => onNavigate('developer-profile', { id: currentUser.id })}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer self-start sm:self-auto"
        >
          Voir mon profil public →
        </button>
      </div>

      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profil mis à jour avec succès (enregistré localement).</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        {/* Avatar & General */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/40"
            />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{currentUser.displayName}</h3>
            <p className="text-xs font-mono text-slate-400">@{currentUser.username}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-mono font-bold text-sky-400">{currentUser.reputation} pts de réputation</span>
            </div>
          </div>
        </div>

        {/* Display name */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Nom affiché
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        {/* Bio (≤ 500 car. - US-PRO-01) */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Biographie (≤ 500 caractères)
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
          />
          <span className="text-[11px] font-mono text-slate-400 float-right mt-1">
            {bio.length}/500 caractères
          </span>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Ville
            </label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Pays
            </label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Lien GitHub
            </label>
            <div className="relative">
              <Github className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/votre-compte"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Portfolio / Site personnel
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="url"
                value={portfolioUrl}
                onChange={e => setPortfolioUrl(e.target.value)}
                placeholder="https://votre-domaine.dev"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp / Phone (used only for project team sharing) */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            Numéro de téléphone / WhatsApp (optionnel)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+221 77 123 45 67"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 italic">
            🔒 Ce numéro ne sera jamais affiché publiquement. Il sera partagé uniquement si vous acceptez ou rejoignez un projet.
          </p>
        </div>

        {/* Availability (US-PRO-05) */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-200">
            Disponibilité affichée dans l'annuaire :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {[
              { id: 'open_to_collaborate', label: 'Ouvert à collaborer sur des projets' },
              { id: 'seeking_team', label: 'En recherche active d’une équipe' },
              { id: 'mentor', label: 'Disponible pour mentorer des juniors' },
              { id: 'freelance', label: 'Disponible pour des missions freelance' }
            ].map(item => (
              <label key={item.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.includes(item.id as any)}
                  onChange={() => toggleAvailability(item.id as any)}
                  className="rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>

      </form>

    </div>
  );
};
