
import React from 'react';
import { Restaurant } from '../types';
import { ExternalLink, Utensils, MapPin, Euro, Plus, Minus, HelpCircle } from 'lucide-react';
import { getEmojiForCuisine } from '../helpers';

interface Props {
  data: Restaurant;
  userVotes: number;
  canVote: boolean;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  isLeading: boolean;
  hasAlreadyVotedToday: boolean;
}

export const RestaurantCard: React.FC<Props> = ({ 
  data, 
  userVotes, 
  canVote, 
  onIncrement, 
  onDecrement,
  isLeading,
  hasAlreadyVotedToday
}) => {
  
  // Zeige Gewinner-Status NUR an, wenn der User bereits abgestimmt hat
  const isWinner = hasAlreadyVotedToday && isLeading && data.currentVotes > 0;
  const emoji = getEmojiForCuisine(data.cuisine, data.name);

  return (
    <div className={`
      relative flex flex-col justify-between
      bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 
      border-2 overflow-hidden
      ${isWinner ? 'border-secondary shadow-lg shadow-orange-100' : 'border-transparent'}
    `}>
      {/* Winner Badge - Nur sichtbar NACH Abstimmung */}
      {isWinner && (
        <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 animate-in fade-in zoom-in">
          Top Favorit
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl filter drop-shadow-sm select-none" role="img" aria-label="cuisine-emoji">
              {emoji}
            </span>
            <h3 className="text-xl font-bold text-slate-800 leading-tight pt-1">
              {data.name}
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600 mb-2 pl-1">
          {/* Cuisine */}
          <div className="flex items-center gap-3">
            <Utensils size={16} className="text-primary/70" />
            <span className="font-medium">{data.cuisine}</span>
          </div>
          
          {/* Price (Euro) */}
          <div className="flex items-center gap-3">
            <Euro size={16} className="text-primary/70" />
            <span>{data.price || 'N/A'}</span>
          </div>

          {/* Distance / Link Integration */}
          {data.link ? (
            <a 
              href={data.link} 
              target="_blank" 
              rel="noreferrer"
              title="Zur Speisekarte / Website öffnen"
              className="group flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors w-fit p-1 -ml-1 rounded hover:bg-blue-50"
            >
              <MapPin size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="underline decoration-dotted font-medium">{data.distance || 'Karte öffnen'}</span>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
            </a>
          ) : (
            <div className="flex items-center gap-3 p-1 -ml-1">
              <MapPin size={16} className="text-primary/70" />
              <span>{data.distance || 'N/A'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
        
        {/* Total Public Votes - BLIND VOTING LOGIC */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Gesamt</span>
          
          {hasAlreadyVotedToday ? (
            <span className={`text-xl font-bold animate-in fade-in ${isLeading && data.currentVotes > 0 ? 'text-secondary' : 'text-slate-700'}`}>
              {data.currentVotes}
            </span>
          ) : (
            <div className="flex items-center gap-1 text-slate-400" title="Ergebnisse sichtbar nach Abstimmung">
              <HelpCircle size={18} />
              <span className="text-sm font-medium italic">?</span>
            </div>
          )}
        </div>

        {/* Voting Controls */}
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200">
          <button 
            onClick={() => onDecrement(data.id)}
            disabled={userVotes === 0 || hasAlreadyVotedToday}
            className="p-3 text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 rounded-l-lg transition-colors"
          >
            <Minus size={18} />
          </button>
          
          <div className="w-8 text-center font-bold text-slate-800 select-none">
            {userVotes}
          </div>
          
          <button 
            onClick={() => onIncrement(data.id)}
            disabled={!canVote || hasAlreadyVotedToday}
            className="p-3 text-slate-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 rounded-r-lg transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
