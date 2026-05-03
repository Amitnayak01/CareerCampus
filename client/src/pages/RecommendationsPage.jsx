import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Briefcase, Award, GraduationCap, Map, ArrowRight, RotateCcw } from 'lucide-react';
import CareerCard from '../components/career/CareerCard';

export default function RecommendationsPage() {
  const [rec, setRec] = useState(null);
  const [activeTab, setActiveTab] = useState('careers');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('cc_recommendation');
    if (!stored) { navigate('/guidance'); return; }
    setRec(JSON.parse(stored));
  }, [navigate]);

  if (!rec) return null;

  const tabs = [
    { id: 'careers', label: 'Careers', icon: <Sparkles className="w-4 h-4" />, count: rec.careers?.length },
    { id: 'jobs', label: 'Job Opportunities', icon: <Briefcase className="w-4 h-4" />, count: rec.jobOpportunities?.length },
    { id: 'certs', label: 'Certifications', icon: <Award className="w-4 h-4" />, count: rec.certificationSuggestions?.length },
    { id: 'studies', label: 'Higher Studies', icon: <GraduationCap className="w-4 h-4" />, count: rec.higherStudiesOptions?.length },
    { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-4 h-4" />, count: rec.roadmap?.length }
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> AI Recommendations Ready!
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Your Personalized Career Matches</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Based on your profile, we found <strong>{rec.careers?.length}</strong> matching career paths.
          </p>
          <Link to="/guidance" className="inline-flex items-center gap-2 mt-4 text-white/80 hover:text-white text-sm">
            <RotateCcw className="w-4 h-4" /> Try with different profile
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-brand-300'
              }`}>
              {tab.icon} {tab.label}
              {tab.count > 0 && <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {/* Careers Tab */}
        {activeTab === 'careers' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rec.careers?.map((item, i) => (
                <div key={i} className="relative">
                  {i < 3 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                        i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-700'
                      }`}>
                        #{i + 1} Match
                      </span>
                    </div>
                  )}
                  <CareerCard career={item.career} />
                  {/* Match Score */}
                  <div className="mt-2 px-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Match Score</span>
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{item.matchScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all"
                        style={{ width: `${item.matchScore}%` }} />
                    </div>
                    {item.reasons?.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1">
                        <TrendingUp className="w-3 h-3 text-brand-500 flex-shrink-0 mt-0.5" />
                        {item.reasons[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Opportunities Tab */}
        {activeTab === 'jobs' && (
          <div className="card p-6 sm:p-8">
            <h2 className="font-bold text-slate-900 dark:text-white text-xl mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-500" /> Job Opportunities For You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rec.jobOpportunities?.map((job, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{job}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-700">
              <p className="text-sm text-brand-700 dark:text-brand-300">💡 <strong>Pro Tip:</strong> Start applying for internships in these roles to build experience. Platforms like LinkedIn, Naukri, and Internshala are great starting points.</p>
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certs' && (
          <div className="card p-6 sm:p-8">
            <h2 className="font-bold text-slate-900 dark:text-white text-xl mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" /> Recommended Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rec.certificationSuggestions?.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{cert}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
              <p className="text-sm text-amber-700 dark:text-amber-300">🏆 Certifications significantly boost your profile. Start with free courses on Coursera, edX, or Google Career Certificates.</p>
            </div>
          </div>
        )}

        {/* Higher Studies Tab */}
        {activeTab === 'studies' && (
          <div className="card p-6 sm:p-8">
            <h2 className="font-bold text-slate-900 dark:text-white text-xl mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-500" /> Higher Studies Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rec.higherStudiesOptions?.map((study, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <GraduationCap className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{study}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <div className="card p-6 sm:p-8">
            <h2 className="font-bold text-slate-900 dark:text-white text-xl mb-6 flex items-center gap-2">
              <Map className="w-6 h-6 text-brand-500" /> Your Career Roadmap
            </h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 to-accent-500 opacity-30" />
              <div className="space-y-4 pl-4">
                {rec.roadmap?.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 z-10 shadow-glow">
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-800 dark:text-slate-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 card p-6 sm:p-8 bg-gradient-to-r from-brand-600 to-accent-700 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h3>
          <p className="text-white/70 mb-6">Explore detailed career pages, bookmark favorites, and track your progress.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/careers" className="flex items-center justify-center gap-2 bg-white text-brand-600 font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-all">
              Explore All Careers <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="flex items-center justify-center gap-2 bg-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/30 transition-all">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
