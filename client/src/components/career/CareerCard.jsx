import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, TrendingUp, Briefcase, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDemandColor, truncate } from '../../utils/helpers';

export default function CareerCard({ career, compact = false }) {
  const { isAuthenticated, user, toggleSaveCareer } = useAuth();
  const isSaved = user?.savedCareers?.includes(career._id);

  return (
    <div className="card group overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
              style={{ backgroundColor: career.color + '20', border: `1px solid ${career.color}30` }}>
              {career.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                {career.title}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{career.category}</span>
            </div>
          </div>
          {isAuthenticated && (
            <button onClick={(e) => { e.preventDefault(); toggleSaveCareer(career._id); }}
              className="p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
              {isSaved
                ? <BookmarkCheck className="w-5 h-5 text-brand-500" />
                : <Bookmark className="w-5 h-5 text-slate-400 hover:text-brand-500" />}
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          {truncate(career.shortDescription || career.description, compact ? 80 : 120)}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`badge text-xs ${getDemandColor(career.demandLevel)}`}>
            <TrendingUp className="w-3 h-3" />
            {career.demandLevel?.replace('-', ' ')} demand
          </span>
          {career.salaryInsights?.entry && (
            <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
              <Briefcase className="w-3 h-3" />
              {career.salaryInsights.entry}
            </span>
          )}
        </div>

        {/* Skills Preview */}
        {!compact && career.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {career.requiredSkills.slice(0, 3).map(skill => (
              <span key={skill} className="badge-primary text-xs">{skill}</span>
            ))}
            {career.requiredSkills.length > 3 && (
              <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">
                +{career.requiredSkills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link to={`/careers/${career._id}`}
          className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-sm font-semibold hover:gap-3 transition-all duration-200">
          View Details <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
