
import React from 'react';
import { Restaurant } from '../types';
import { Trophy, Medal } from 'lucide-react';

interface Props {
  restaurants: Restaurant[];
}

export const Leaderboard: React.FC<Props> = ({ restaurants }) => {
  // Filtere Restaurants ohne Stimmen und sortiere absteigend
  const topPicks = [...restaurants]
    .filter(r => r.currentVotes > 0)
    .sort((a, b) => b.currentVotes - a.currentVotes)
    .slice(0, 3);

  if (topPicks.length === 0) {
    return (
      <div className="mt-8 text-slate-400 text-sm italic animate-pulse">
        Noch keine Stimmen abgegeben. Sei der Erste!
      </div>
    );
  }

  return (
    <div className="mt-10 w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6">
        
        {/* Platz 2 (Silber) - Links, etwas kleiner */}
        {topPicks[1] && (
          <div className="order-2 sm:order-1 flex-1 w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center transform hover:-translate-y-1 transition-transform">
            <div className="bg-slate-100 p-2 rounded-full mb-2">
              <Medal className="text-slate-400" size={24} />
            </div>
            <div className="text-slate-500 font-bold text-sm mb-1">#2</div>
            <div className="font-bold text-slate-800 text-center leading-tight">{topPicks[1].name}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{topPicks[1].currentVotes} Stimmen</div>
          </div>
        )}

        {/* Platz 1 (Gold) - Mitte, Groß */}
        {topPicks[0] && (
          <div className="order-1 sm:order-2 flex-1 w-full sm:w-auto bg-gradient-to-b from-yellow-50 to-white border-2 border-yellow-200 rounded-2xl p-6 shadow-lg shadow-yellow-100 flex flex-col items-center transform hover:-translate-y-2 transition-transform z-10 relative">
            <div className="absolute -top-5 bg-yellow-400 text-white p-3 rounded-full shadow-md">
              <Trophy size={28} fill="currentColor" className="text-white" />
            </div>
            <div className="mt-4 text-yellow-600 font-bold text-sm mb-1 tracking-widest uppercase">Spitzenreiter</div>
            <div className="font-extrabold text-xl text-slate-800 text-center mb-1">{topPicks[0].name}</div>
            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
              {topPicks[0].currentVotes} Stimmen
            </div>
          </div>
        )}

        {/* Platz 3 (Bronze) - Rechts, etwas kleiner */}
        {topPicks[2] && (
          <div className="order-3 sm:order-3 flex-1 w-full sm:w-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center transform hover:-translate-y-1 transition-transform">
            <div className="bg-orange-50 p-2 rounded-full mb-2">
              <Medal className="text-orange-400" size={24} />
            </div>
            <div className="text-slate-500 font-bold text-sm mb-1">#3</div>
            <div className="font-bold text-slate-800 text-center leading-tight">{topPicks[2].name}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{topPicks[2].currentVotes} Stimmen</div>
          </div>
        )}
      </div>
    </div>
  );
};
