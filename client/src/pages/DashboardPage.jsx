import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Sparkles, BookmarkCheck, MessageSquare, TrendingUp, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [myQueries, setMyQueries] = useState([]);
  const [recentRecs, setRecentRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, rRes] = await Promise.all([
          api.get('/queries/mine'),
          api.get('/recommendations/history')
        ]);
        setMyQueries(qRes.data.queries || []);
        setRecentRecs(rRes.data.recommendations || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Saved Careers', value: user?.savedCareers?.length || 0,
      icon: <BookmarkCheck className="w-6 h-6" />, color: 'from-brand-500 to-brand-600',
      link: '/saved', linkLabel: 'View saved'
    },
    {
      label: 'My Queries', value: myQueries.length,
      icon: <MessageSquare className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600',
      link: '/contact', linkLabel: 'Ask question'
    },
    {
      label: 'Recommendations', value: recentRecs.length,
      icon: <Sparkles className="w-6 h-6" />, color: 'from-accent-500 to-pink-600',
      link: '/guidance', linkLabel: 'Get new'
    }
  ];

  if (loading) return <LoadingSpinner size="lg" text="Loading your dashboard..." />;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-glow">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>
          {!user?.profile?.qualification && (
            <div className="mt-4 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-brand-700 dark:text-brand-300">Complete your profile</p>
                <p className="text-sm text-brand-600 dark:text-brand-400">Add your qualification to get better career recommendations.</p>
              </div>
              <Link to="/profile" className="btn-primary text-sm py-2 whitespace-nowrap">Update Profile</Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {statCards.map((s, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white`}>{s.icon}</div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{s.value}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{s.label}</p>
              <Link to={s.link} className="text-brand-600 dark:text-brand-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                {s.linkLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" /> Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Get Career Recommendations', desc: 'Fill profile & get matched careers', to: '/guidance', icon: '🎯', color: 'bg-brand-50 dark:bg-brand-900/30' },
                { label: 'Explore All Careers', desc: 'Browse 100+ career paths', to: '/careers', icon: '🔍', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'View Saved Careers', desc: `${user?.savedCareers?.length || 0} careers bookmarked`, to: '/saved', icon: '🔖', color: 'bg-accent-50 dark:bg-accent-900/20' },
                { label: 'Ask Career Question', desc: 'Get expert guidance', to: '/contact', icon: '💬', color: 'bg-amber-50 dark:bg-amber-900/20' }
              ].map((action, i) => (
                <Link key={i} to={action.to} className={`flex items-center gap-4 p-3 rounded-xl ${action.color} hover:opacity-80 transition-opacity group`}>
                  <span className="text-2xl">{action.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Queries */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-500" /> My Queries
              </h2>
              <Link to="/contact" className="text-brand-600 dark:text-brand-400 text-sm font-semibold hover:underline">New query</Link>
            </div>
            {myQueries.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No queries yet.</p>
                <Link to="/contact" className="text-brand-500 text-sm hover:underline mt-1 block">Ask your first question →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myQueries.slice(0, 4).map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      q.status === 'resolved' ? 'bg-emerald-500' : q.status === 'in-progress' ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{q.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                        <span className={`text-xs font-medium capitalize ${
                          q.status === 'resolved' ? 'text-emerald-600' : q.status === 'in-progress' ? 'text-blue-600' : 'text-amber-600'
                        }`}>{q.status}</span>
                      </div>
                      {q.replies?.length > 0 && (
                        <p className="text-xs text-brand-500 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {q.replies.length} reply
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Career Profile Summary */}
        {user?.profile?.qualification && (
          <div className="card p-6 mt-6">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-500" /> Your Career Profile
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Qualification', value: user.profile.qualification },
                { label: 'Stream', value: user.profile.stream || 'Not set' },
                { label: 'Interests', value: user.profile.interests?.slice(0, 2).join(', ') || 'Not set' },
                { label: 'Location', value: user.profile.location || 'Not set' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            <Link to="/guidance" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> Get New Recommendations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
