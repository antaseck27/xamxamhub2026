import React from 'react';
import { 
  Sparkles, MessageSquare, ThumbsUp, CheckCircle2, Flame, Trophy, GraduationCap, Award 
} from 'lucide-react';
import { SEED_BADGES } from '../../data/seed';

interface BadgeIconProps {
  badgeId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ badgeId, size = 'md', showLabel = false }) => {
  const badge = SEED_BADGES.find(b => b.id === badgeId);
  if (!badge) return null;

  const getIcon = () => {
    const iconProps = {
      className: size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
    };
    switch (badge.icon) {
      case 'Sparkles': return <Sparkles {...iconProps} className={`${iconProps.className} text-amber-400`} />;
      case 'MessageSquare': return <MessageSquare {...iconProps} className={`${iconProps.className} text-sky-400`} />;
      case 'ThumbsUp': return <ThumbsUp {...iconProps} className={`${iconProps.className} text-emerald-400`} />;
      case 'CheckCircle2': return <CheckCircle2 {...iconProps} className={`${iconProps.className} text-green-400`} />;
      case 'Flame': return <Flame {...iconProps} className={`${iconProps.className} text-rose-400`} />;
      case 'Trophy': return <Trophy {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
      case 'GraduationCap': return <GraduationCap {...iconProps} className={`${iconProps.className} text-purple-400`} />;
      default: return <Award {...iconProps} className={`${iconProps.className} text-sky-400`} />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  return (
    <div 
      className={`inline-flex items-center rounded-md border border-slate-700 bg-slate-800/80 text-slate-200 font-medium ${sizeClasses[size]}`}
      title={`${badge.name} : ${badge.criteria}`}
    >
      {getIcon()}
      {showLabel && <span>{badge.name}</span>}
    </div>
  );
};
