import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import CareerCard from '../components/career/CareerCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BookmarkCheck, Sparkles } from 'lucide-react';

export default function SavedCareersPage() {
  const { user } = useAuth();
  const [savedCareers, setSavedCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setSavedCareers(data.user.savedCareers || []);
      } catch {}
      setLoading(false);
    };
    fetchSaved();
  }, []);

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <BookmarkCheck className="w-10 h-10" /> Saved Careers
          </h1>
          <p className="text-white/70">Your bookmarked career paths for quick access.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading saved careers..." />
        ) : savedCareers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookmarkCheck className="w-12 h-12 text-brand-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">No saved careers yet</h3>
            <p className="text-slate-500 mb-6">Browse careers and click the bookmark icon to save them here.</p>
            <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Explore Careers
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              {savedCareers.length} career{savedCareers.length > 1 ? 's' : ''} saved
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCareers.map(career => <CareerCard key={career._id} career={career} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
