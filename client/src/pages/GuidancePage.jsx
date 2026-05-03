import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Sparkles, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { QUALIFICATIONS, STREAMS, INTERESTS } from '../utils/helpers';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, title: 'Qualification', desc: 'Your education level' },
  { id: 2, title: 'Stream', desc: 'Your field of study' },
  { id: 3, title: 'Interests', desc: 'What excites you' },
  { id: 4, title: 'Goals', desc: 'Your aspirations' }
];

export default function GuidancePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ qualification: '', stream: '', interests: [], skills: '', goals: '' });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleInterest = (interest) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest]
    }));
  };

  const canProceed = () => {
    if (step === 1) return !!form.qualification;
    if (step === 2) return !!form.stream;
    if (step === 3) return form.interests.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        qualification: form.qualification,
        stream: form.stream,
        interests: form.interests.map(i => i.toLowerCase()),
        skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
        goals: form.goals
      };
      const { data } = await api.post('/recommendations', payload);
      // Store in sessionStorage for RecommendationsPage
      sessionStorage.setItem('cc_recommendation', JSON.stringify(data.recommendation));
      toast.success('🎯 Recommendations ready!');
      navigate('/recommendations');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate recommendations.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen mesh-gradient">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700 rounded-full text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> AI-Powered Career Guidance
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Find Your Perfect Career
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Answer {steps.length} quick questions and get personalized career recommendations.
          </p>
          {!isAuthenticated && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-700">
              <AlertCircle className="w-4 h-4" /> Login to save your recommendations
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                step === s.id ? 'bg-brand-500 text-white shadow-glow' :
                step > s.id ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' :
                'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {step > s.id ? <CheckCircle className="w-4 h-4" /> : <span className="w-5 h-5 flex items-center justify-center">{s.id}</span>}
                <span className="hidden sm:block">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${step > s.id ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card p-8">
          {/* Step 1: Qualification */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">What is your highest qualification?</h2>
              <p className="text-slate-500 text-sm mb-6">Select the level of education you have completed or are currently pursuing.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUALIFICATIONS.map(q => (
                  <button key={q.value} onClick={() => setForm(f => ({ ...f, qualification: q.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                      form.qualification === q.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                    }`}>
                    <div className="text-2xl mb-2">
                      {{'10th':'📖','12th':'📚','diploma':'🎓','graduation':'🏛️','post-graduation':'🎖️','other':'📝'}[q.value]}
                    </div>
                    <p className="font-semibold text-sm">{q.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Stream */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">What is your stream / field?</h2>
              <p className="text-slate-500 text-sm mb-6">Choose the academic stream or area that best describes your background.</p>
              <div className="grid grid-cols-2 gap-3">
                {STREAMS.map(s => (
                  <button key={s.value} onClick={() => setForm(f => ({ ...f, stream: s.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                      form.stream === s.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                    }`}>
                    <div className="text-2xl mb-2">
                      {{'science':'🔬','commerce':'💰','arts':'🎨','engineering':'⚙️','medical':'🩺','management':'📊','other':'🌐'}[s.value]}
                    </div>
                    <p className="font-semibold text-sm">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">What are your interests?</h2>
              <p className="text-slate-500 text-sm mb-6">Select all areas that genuinely interest you. Choose at least one.</p>
              <div className="flex flex-wrap gap-3">
                {INTERESTS.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all hover:scale-105 ${
                      form.interests.includes(interest)
                        ? 'border-brand-500 bg-brand-500 text-white shadow-glow'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                    }`}>
                    {{'Technology':'💻','Medical':'🩺','Business':'💼','Arts':'🎨','Law':'⚖️','Education':'📚',
                      'Science':'🔬','Design':'🎨','Finance':'📈','Government':'🏛️','Agriculture':'🌾','Sports':'⚽'}[interest]} {interest}
                  </button>
                ))}
              </div>
              {form.interests.length > 0 && (
                <p className="mt-4 text-sm text-brand-600 dark:text-brand-400 font-medium">
                  ✅ {form.interests.length} interest{form.interests.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tell us about your goals</h2>
              <p className="text-slate-500 text-sm mb-6">This helps us personalize your recommendations even further. (Optional)</p>
              <div className="space-y-4">
                <div>
                  <label className="label">Key Skills You Have (comma-separated)</label>
                  <input type="text" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                    placeholder="e.g. Python, Communication, Problem Solving" className="input-field" />
                </div>
                <div>
                  <label className="label">Career Goals / Aspirations</label>
                  <textarea value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
                    placeholder="e.g. I want to work in a high-growth tech company, or I want to serve the government..."
                    className="input-field resize-none" rows={4} />
                </div>
                <div className="bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700 rounded-xl p-4">
                  <p className="text-sm text-brand-700 dark:text-brand-300 font-semibold mb-2">📋 Your Profile Summary</p>
                  <div className="text-sm text-brand-600 dark:text-brand-400 space-y-1">
                    <p>🎓 Qualification: <strong>{form.qualification}</strong></p>
                    <p>📚 Stream: <strong>{form.stream}</strong></p>
                    <p>💡 Interests: <strong>{form.interests.join(', ')}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
              className="btn-secondary disabled:opacity-40">← Back</button>
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="btn-primary flex items-center gap-2 disabled:opacity-40">
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Get My Recommendations</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
