import React, { useState } from 'react';
import { Terminal, Shield, Heart, ExternalLink, BookOpen, Scale } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [isCodeOfConductOpen, setIsCodeOfConductOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-800 bg-slate-950/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-mono font-black text-slate-950 text-sm">
                X²
              </div>
              <span className="font-bold text-white text-base">
                XamXam <span className="text-sky-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              « Là où la logique rencontre l’audace, naît l’innovation. »
            </p>
            <p className="text-[11px] text-slate-400">
              Conçu pour et par la communauté des développeurs africains · Systalink Challenge 2026.
            </p>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono">
              Plateforme
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('questions')} className="hover:text-sky-400 transition cursor-pointer">
                  Questions & Entraide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('challenges')} className="hover:text-sky-400 transition cursor-pointer">
                  Défis & Débats hebdomadaires
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="hover:text-sky-400 transition cursor-pointer">
                  Recherche de coéquipiers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('developers')} className="hover:text-sky-400 transition cursor-pointer">
                  Annuaire des développeurs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ressources & Règles */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono">
              Communauté & Règles
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => setIsCodeOfConductOpen(true)}
                  className="flex items-center gap-1.5 hover:text-sky-400 transition cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>Code de conduite (Règles)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsLegalOpen(true)}
                  className="flex items-center gap-1.5 hover:text-sky-400 transition cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mentions Légales & Confidentialité</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('settings')}
                  className="hover:text-sky-400 transition cursor-pointer"
                >
                  Données de démo & Réinitialisation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Systalink Tech 2026 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono">
              Projet de Hackathon
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Équipe XamXam Tech : Anta (Frontend & Design) et Saliou (Backend & DevOps). Prototype fonctionnel testable par le jury avec comptes pré-chargés.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
                v1.1 MVP Démo
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Dakar · Octobre 2026
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 XamXam Hub — Fait avec logique et audace pour la tech africaine.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Système opérationnel (4G & Offline ready)
            </span>
          </div>
        </div>
      </footer>

      {/* Code of Conduct Modal */}
      {isCodeOfConductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <BookOpen className="w-5 h-5" />
                <span>Code de conduite de XamXam Hub</span>
              </div>
              <button onClick={() => setIsCodeOfConductOpen(false)} className="text-slate-400 hover:text-white cursor-pointer font-bold">
                ✕
              </button>
            </div>
            <div className="text-xs space-y-3 leading-relaxed text-slate-300">
              <p>
                <strong>Notre engagement :</strong> XamXam Hub est dédié à fournir un environnement bienveillant, respectueux et sans harcèlement pour tous les développeurs, quel que soit leur niveau d'expérience, leur pays ou leur technologie.
              </p>
              <h5 className="font-semibold text-slate-100 text-sm">1. Respect et entraide constructive</h5>
              <p>Chaque question est légitime. Évitez les réponses méprisantes comme "RTFM" ou "Google est ton ami". Donnez des explications pédagogiques avec des exemples de code clairs.</p>
              <h5 className="font-semibold text-slate-100 text-sm">2. Contenu technique de qualité</h5>
              <p>Formatez vos extraits de code avec la syntaxe appropriée. Décrivez votre contexte (connexion, framework, environnement). Le spam et la promotion non sollicitée sont strictement interdits.</p>
              <h5 className="font-semibold text-slate-100 text-sm">3. Collaboration saine sur les projets</h5>
              <p>Lorsque vous candidatez pour un projet, engagez-vous avec sincérité et respectez la charge de travail convenue avec le porteur du projet.</p>
              <h5 className="font-semibold text-slate-100 text-sm">4. Modération et signalement</h5>
              <p>Tout membre peut signaler un contenu inapproprié. Les modérateurs examinent chaque signalement dans la console dédiée.</p>
            </div>
            <div className="pt-3 text-right">
              <button 
                onClick={() => setIsCodeOfConductOpen(false)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs cursor-pointer"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {isLegalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Scale className="w-5 h-5" />
                <span>Mentions Légales & Confidentialité</span>
              </div>
              <button onClick={() => setIsLegalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer font-bold">
                ✕
              </button>
            </div>
            <div className="text-xs space-y-3 leading-relaxed text-slate-300">
              <p><strong>Éditeur du prototype :</strong> Projet étudiant développé dans le cadre du Systalink Challenge 2026 par l'équipe XamXam Tech.</p>
              <p><strong>Protection de la vie privée :</strong> Les coordonnées personnelles (téléphone, email direct) ne sont jamais affichées publiquement dans l'annuaire. Elles sont uniquement transmises au porteur d'un projet après acceptation explicite de la candidature.</p>
              <p><strong>Données locales :</strong> Dans ce prototype de démonstration, les données créées pendant votre session sont conservées dans le stockage local du navigateur (localStorage) sans transmission non sollicitée.</p>
            </div>
            <div className="pt-3 text-right">
              <button 
                onClick={() => setIsLegalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
