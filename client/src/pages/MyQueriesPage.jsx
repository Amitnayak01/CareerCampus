import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  MessageSquare, Trash2, Clock, CheckCircle2, ChevronDown,
  ChevronUp, Plus, ShieldCheck, AlertCircle, Loader2
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_CONFIG = {
  open:        { label: 'Open',        dot: 'bg-amber-400',  text: 'text-amber-500',  badge: 'bg-amber-500/10 text-amber-500 border border-amber-500/20' },
  'in-progress':{ label: 'In Progress', dot: 'bg-blue-400',  text: 'text-blue-500',   badge: 'bg-blue-500/10 text-blue-500 border border-blue-500/20' },
  resolved:    { label: 'Resolved',    dot: 'bg-emerald-400', text: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' }
};

const CATEGORY_LABELS = {
  career_advice: 'Career Advice',
  technical:     'Technical',
  admission:     'Admission',
  scholarship:   'Scholarship',
  other:         'Other'
};

function QueryCard({ query, onDelete }) {
  const [expanded, setExpanded]   = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [confirming, setConfirming] = useState(false);

  const status = STATUS_CONFIG[query.status] || STATUS_CONFIG.open;
  const hasReplies = query.replies?.length > 0;

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    try {
      await api.delete(`/queries/mine/${query._id}`);
      toast.success('Query deleted.');
      onDelete(query._id);
    } catch {
      toast.error('Failed to delete query.');
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className={`card overflow-hidden transition-all duration-200 ${expanded ? 'ring-1 ring-brand-500/30' : ''}`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Status dot */}
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${status.dot}`} />

          <div className="flex-1 min-w-0">
            {/* Subject + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
                {query.subject}
              </h3>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${status.badge}`}>
                {status.label}
              </span>
              {query.category && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {CATEGORY_LABELS[query.category] || query.category}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(query.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              {hasReplies && (
                <span className="flex items-center gap-1 text-brand-500 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {query.replies.length} {query.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              )}
              {!hasReplies && (
                <span className="flex items-center gap-1 text-slate-400">
                  <AlertCircle className="w-3 h-3" />
                  Awaiting reply
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Delete */}
            {confirming ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-500 font-medium">Sure?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                >
                  {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg hover:opacity-80 transition-opacity"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={handleDelete}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete query"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded thread */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800">
          {/* Original message */}
          <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your message</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {query.message}
            </p>
          </div>

          {/* Replies */}
          {hasReplies && (
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Admin Replies
              </p>
              {query.replies.map((reply, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/40"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                        {reply.adminName || 'Admin'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(reply.createdAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {reply.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No reply yet */}
          {!hasReplies && (
            <div className="px-5 py-4 flex items-center gap-2 text-slate-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>No reply yet — our team will respond within 24 hours.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyQueriesPage() {
  const { user } = useAuth();
  const [queries, setQueries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await api.get('/queries/mine');
        setQueries(res.data.queries || []);
      } catch {
        toast.error('Could not load your queries.');
      }
      setLoading(false);
    };
    fetchQueries();
  }, []);

  const handleDelete = (id) => setQueries(prev => prev.filter(q => q._id !== id));

  const filtered = filter === 'all'
    ? queries
    : queries.filter(q => q.status === filter);

  const counts = {
    all:          queries.length,
    open:         queries.filter(q => q.status === 'open').length,
    'in-progress':queries.filter(q => q.status === 'in-progress').length,
    resolved:     queries.filter(q => q.status === 'resolved').length,
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading your queries..." />;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-brand-500" />
              My Queries
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your questions and admin replies in one place.
            </p>
          </div>
          <Link
            to="/contact"
            className="btn-primary inline-flex items-center gap-2 text-sm py-2.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New Query
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'all',          label: 'All' },
            { key: 'open',         label: 'Open' },
            { key: 'in-progress',  label: 'In Progress' },
            { key: 'resolved',     label: 'Resolved' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                filter === tab.key
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Query list */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageSquare className="w-14 h-14 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {filter === 'all' ? 'No queries yet' : `No ${filter} queries`}
            </p>
            <p className="text-sm text-slate-400 mb-5">
              {filter === 'all'
                ? 'Have a question? Ask our career experts.'
                : 'No queries with this status right now.'}
            </p>
            {filter === 'all' && (
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Ask a Question
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(query => (
              <QueryCard key={query._id} query={query} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Summary footer */}
        {queries.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> {counts.open} open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> {counts['in-progress']} in progress
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> {counts.resolved} resolved
            </span>
          </div>
        )}
      </div>
    </div>
  );
}