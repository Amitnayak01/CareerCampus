import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../utils/api';
import CareerCard from '../components/career/CareerCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CATEGORIES, capitalizeFirst } from '../utils/helpers';

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort });
      if (category !== 'all') params.append('category', category);
      if (search.trim()) params.append('search', search.trim());
      const { data } = await api.get(`/careers?${params}`);
      setCareers(data.careers);
      setPagination(data.pagination);
    } catch { setCareers([]); }
    setLoading(false);
  }, [page, sort, category, search]);

  useEffect(() => {
    const timer = setTimeout(fetchCareers, 400);
    return () => clearTimeout(timer);
  }, [fetchCareers]);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCategory = (cat) => { setCategory(cat); setPage(1); };
  const clearSearch = () => { setSearch(''); setPage(1); };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Page Header */}
      <div className="page-header mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Explore Career Paths</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover {pagination.total || '100+'} career options with detailed insights, salary data, and roadmaps.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={search} onChange={handleSearch} placeholder="Search careers..." className="input-field pl-12 pr-12" />
            {search && (
              <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-auto">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600'
              }`}>
              {cat === 'all' ? '🌐 All' : capitalizeFirst(cat)}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Showing <strong>{careers.length}</strong> of <strong>{pagination.total}</strong> careers
            {search && ` for "${search}"`}
            {category !== 'all' && ` in ${category}`}
          </p>
        )}

        {/* Career Grid */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading careers..." />
        ) : careers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No careers found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or filters.</p>
            <button onClick={() => { setSearch(''); setCategory('all'); }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map(career => <CareerCard key={career._id} career={career} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Previous</button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold ${page === p ? 'btn-primary' : 'btn-ghost'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
