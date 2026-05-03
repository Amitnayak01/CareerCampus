import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Sparkles, BookmarkCheck, MessageSquare, TrendingUp,
  ArrowRight, Clock, CheckCircle2, ShieldCheck, AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_DOT = {
  resolved:      'bg-emerald-500',
  'in-progress': 'bg-blue-500',
  open:          'bg-amber-500',
};
const STATUS_TEXT = {
  resolved:      'text-emerald-600 dark:text-emerald-400',
  'in-progress': 'text-blue-600 dark:text-blue-400',
  open:          'text-amber-600 dark:text-amber-400',
};

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
      link: '/my-queries', linkLabel: 'View all'          // ← now links to /my-queries
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
                { label: 'Get Career Recommendations', desc: 'Fill profile & get matched careers', to: '/guidance',    icon: '🎯', color: 'bg-brand-50 dark:bg-brand-900/30' },
                { label: 'Explore All Careers',        desc: 'Browse 100+ career paths',         to: '/careers',     icon: '🔍', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'View Saved Careers',         desc: `${user?.savedCareers?.length || 0} careers bookmarked`, to: '/saved', icon: '🔖', color: 'bg-accent-50 dark:bg-accent-900/20' },
                { label: 'My Queries & Replies',       desc: 'View questions & admin responses', to: '/my-queries',  icon: '💬', color: 'bg-amber-50 dark:bg-amber-900/20' }
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

          {/* Recent Queries — now shows replies preview */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-500" /> My Queries
              </h2>
              <div className="flex items-center gap-3">
                <Link to="/contact"    className="text-brand-600 dark:text-brand-400 text-sm font-semibold hover:underline">+ New</Link>
                <Link to="/my-queries" className="text-slate-500 dark:text-slate-400 text-sm hover:underline">View all →</Link>
              </div>
            </div>

            {myQueries.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No queries yet.</p>
                <Link to="/contact" className="text-brand-500 text-sm hover:underline mt-1 block">Ask your first question →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myQueries.slice(0, 3).map((q, i) => (
                  <Link
                    key={i}
                    to="/my-queries"
                    className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {/* Subject row */}
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[q.status] || 'bg-amber-500'}`} />
                      <p className="font-medium text-sm text-slate-900 dark:text-white truncate flex-1">{q.subject}</p>
                      <span className={`text-xs font-medium capitalize flex-shrink-0 ${STATUS_TEXT[q.status] || 'text-amber-600'}`}>
                        {q.status}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 pl-4">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                      {q.replies?.length > 0 ? (
                        <span className="text-xs text-brand-500 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {q.replies.length} {q.replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Awaiting reply
                        </span>
                      )}
                    </div>

                    {/* Latest reply preview */}
                    {q.replies?.length > 0 && (
                      <div className="ml-4 pl-3 border-l-2 border-brand-200 dark:border-brand-700">
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                          <ShieldCheck className="w-3 h-3 text-brand-400" />
                          <span className="font-medium text-brand-500">{q.replies[q.replies.length - 1].adminName || 'Admin'}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {q.replies[q.replies.length - 1].message}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}

                {myQueries.length > 3 && (
                  <Link
                    to="/my-queries"
                    className="flex items-center justify-center gap-1 text-sm text-brand-600 dark:text-brand-400 font-medium py-2 hover:underline"
                  >
                    View all {myQueries.length} queries <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
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
                { label: 'Stream',        value: user.profile.stream || 'Not set' },
                { label: 'Interests',     value: user.profile.interests?.slice(0, 2).join(', ') || 'Not set' },
                { label: 'Location',      value: user.profile.location || 'Not set' }
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