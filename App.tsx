
import React, { useEffect, useState, useMemo } from 'react';
import { fetchRestaurantsAndVotes, getTodayDate, submitVotesToAirtable } from './services/airtableService';
import { Restaurant, VoteSelection } from './types';
import { MAX_VOTES, LOCAL_STORAGE_KEY } from './constants';
import { RestaurantCard } from './components/RestaurantCard';
import { StickyFooter } from './components/StickyFooter';
import { Leaderboard } from './components/Leaderboard';
import { Loader2, AlertCircle, Vote } from 'lucide-react';

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<VoteSelection>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVotedToday, setHasVotedToday] = useState(false);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchRestaurantsAndVotes();
      setRestaurants(data);
      
      const storedDate = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDate === getTodayDate()) {
        setHasVotedToday(true);
      }
    } catch (err) {
      console.error(err);
      setError('Daten konnten nicht geladen werden. Bitte prüfen Sie den API Key oder die Verbindung.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Derived State
  const totalVotesUsed = useMemo(() => {
    return Object.values(userVotes).reduce((sum: number, count: number) => sum + count, 0);
  }, [userVotes]);

  // Handlers
  const handleIncrement = (id: string) => {
    if (totalVotesUsed >= MAX_VOTES) return;
    setUserVotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecrement = (id: string) => {
    setUserVotes(prev => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      const copy = { ...prev, [id]: current - 1 };
      if (copy[id] === 0) delete copy[id];
      return copy;
    });
  };

  const handleSubmit = async () => {
    if (totalVotesUsed === 0) return;
    
    try {
      setIsSubmitting(true);
      await submitVotesToAirtable(userVotes);
      
      localStorage.setItem(LOCAL_STORAGE_KEY, getTodayDate());
      setHasVotedToday(true);
      setUserVotes({});
      
      // Refresh data to show new totals
      await loadData();
      
    } catch (err) {
      alert('Fehler beim Senden der Stimmen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find the highest vote count to highlight leaders
  const highestVoteCount = Math.max(...restaurants.map(r => r.currentVotes), 0);

  if (loading && restaurants.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-4">
        <Loader2 className="animate-spin" size={48} />
        <p>Lade Lokale...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-red-500 gap-4 p-4 text-center">
        <AlertCircle size={48} />
        <p className="max-w-md">{error}</p>
        <button onClick={loadData} className="text-primary underline hover:text-purple-800">Erneut versuchen</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Modern Header Section */}
      <header className="relative bg-white pt-12 pb-12 px-4 border-b border-slate-200 overflow-hidden transition-all duration-500">
        {/* Background Decorative Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-slate-50 to-slate-50 opacity-70"></div>
        
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
             <Vote className="text-primary mr-2" /> 
             <span className="text-slate-600 font-medium text-sm">Team Lunch Vote</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 mb-4 tracking-tight drop-shadow-sm">
            {hasVotedToday ? 'Ergebnisse Live' : 'Wo essen wir heute?'}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            {hasVotedToday 
              ? `Hier ist der aktuelle Stand für den ${getTodayDate()}.` 
              : `Verteile deine Stimmen für den ${getTodayDate()}. Die Ergebnisse siehst du nach der Abgabe.`
            }
          </p>

          {/* Top 3 Leaderboard - NUR SICHTBAR WENN BEREITS ABGESTIMMT */}
          {hasVotedToday && <Leaderboard restaurants={restaurants} />}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
              {hasVotedToday ? 'Alle Ergebnisse' : 'Zur Auswahl'}
            </span>
            <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id}
              data={restaurant}
              userVotes={userVotes[restaurant.id] || 0}
              canVote={totalVotesUsed < MAX_VOTES}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              isLeading={restaurant.currentVotes === highestVoteCount}
              hasAlreadyVotedToday={hasVotedToday}
            />
          ))}
        </div>
      </main>

      {/* Footer Controls */}
      <StickyFooter 
        votesUsed={totalVotesUsed}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        hasVotedToday={hasVotedToday}
      />
    </div>
  );
};

export default App;
