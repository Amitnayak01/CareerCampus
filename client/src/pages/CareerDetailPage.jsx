import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Bookmark, BookmarkCheck, ArrowLeft, TrendingUp, DollarSign, Briefcase, GraduationCap, Star, Building2, BookOpen, Award, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getDemandColor, getDifficultyColor } from '../utils/helpers';

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, toggleSaveCareer } = useAuth();
  const navigate = useNavigate();
  const isSaved = user?.savedCareers?.includes(id);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const { data } = await api.get(`/careers/${id}`);
        setCareer(data.career);
      } catch { navigate('/careers'); }
      setLoading(false);
    };
    fetchCareer();
  }, [id, navigate]);

  if (loading) return <div className="pt-20"><LoadingSpinner size="lg" text="Loading career details..." /></div>;
  if (!career) return null;

  const sections = [
    {
      title: 'Required Skills', icon: <Star className="w-5 h-5" />, color: 'text-brand-500',
      content: career.requiredSkills?.map(skill => (
        <span key={skill} className="badge-primary">{skill}</span>
      ))
    },
    {
      title: 'Job Roles', icon: <Briefcase className="w-5 h-5" />, color: 'text-emerald-500',
      content: career.jobRoles?.map(role => (
        <span key={role} className="badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">{role}</span>
      ))
    },
    {
      title: 'Recommended Courses', icon: <GraduationCap className="w-5 h-5" />, color: 'text-blue-500',
      content: career.recommendedCourses?.map(course => (
        <span key={course} className="badge bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{course}</span>
      ))
    },
    {
      title: 'Certifications', icon: <Award className="w-5 h-5" />, color: 'text-amber-500',
      content: career.certifications?.map(cert => (
        <span key={cert} className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">{cert}</span>
      ))
    },
    {
      title: 'Top Companies', icon: <Building2 className="w-5 h-5" />, color: 'text-purple-500',
      content: career.topCompanies?.map(co => (
        <span key={co} className="badge bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">{co}</span>
      ))
    },
    {
      title: 'Higher Studies', icon: <BookOpen className="w-5 h-5" />, color: 'text-rose-500',
      content: career.higherStudies?.map(s => (
        <span key={s} className="badge bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">{s}</span>
      ))
    }
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero Banner */}
      <div className="page-header relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/careers" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Careers
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0 bg-white/20">{career.icon}</div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge ${getDemandColor(career.demandLevel)}`}><TrendingUp className="w-3 h-3" />{career.demandLevel?.replace('-', ' ')} demand</span>
                <span className={`badge ${getDifficultyColor(career.difficulty)}`}>{career.difficulty}</span>
                <span className="badge bg-white/20 text-white capitalize">{career.category}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{career.title}</h1>
              <p className="text-white/70 max-w-2xl">{career.shortDescription}</p>
            </div>
            {isAuthenticated && (
              <button onClick={() => toggleSaveCareer(career._id)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all">
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                {isSaved ? 'Saved' : 'Save'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">About This Career</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{career.description}</p>
            </div>

            {/* Skill Sections */}
            {sections.map(section => section.content?.length > 0 && (
              <div key={section.title} className="card p-6">
                <h2 className={`font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2 ${section.color}`}>
                  {section.icon} {section.title}
                </h2>
                <div className="flex flex-wrap gap-2">{section.content}</div>
              </div>
            ))}

            {/* Future Scope */}
            {career.futureScope && (
              <div className="card p-6 border-l-4 border-brand-500">
                <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-500" /> Future Scope
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{career.futureScope}</p>
                {career.growthRate && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-4 py-2 rounded-xl text-sm font-semibold">
                    📈 Growth Rate: {career.growthRate}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary Insights */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" /> Salary Insights
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Entry Level', value: career.salaryInsights?.entry, color: 'bg-slate-100 dark:bg-slate-800' },
                  { label: 'Mid Level', value: career.salaryInsights?.mid, color: 'bg-brand-50 dark:bg-brand-900/30' },
                  { label: 'Senior Level', value: career.salaryInsights?.senior, color: 'bg-emerald-50 dark:bg-emerald-900/30' }
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-xl p-3`}>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{s.value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            {career.eligibility && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" /> Eligibility
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min. Qualification</span>
                    <span className="font-semibold capitalize text-slate-900 dark:text-white">{career.eligibility.minQualification}</span>
                  </div>
                  {career.eligibility.requiredStreams?.length > 0 && (
                    <div>
                      <span className="text-slate-500">Eligible Streams</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {career.eligibility.requiredStreams.map(s => (
                          <span key={s} className="badge-primary capitalize">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Culture */}
            {career.workCulture && (
              <div className="card p-6">
                <h2 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Work Culture</h2>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Type', value: career.workCulture.type },
                    { label: 'Environment', value: career.workCulture.environment },
                    { label: 'Work Hours', value: career.workCulture.workHours },
                    { label: 'Remote Work', value: career.workCulture.remote ? 'Available' : 'On-site only' }
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="card-gradient p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Is this your career?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Get a personalized roadmap and recommendations.</p>
              <Link to="/guidance" className="btn-primary w-full text-center text-sm flex items-center justify-center gap-2">
                Get My Roadmap <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
