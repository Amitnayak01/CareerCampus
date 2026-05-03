import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, BookOpen, Tag, Save } from 'lucide-react';
import { QUALIFICATIONS, STREAMS, INTERESTS } from '../utils/helpers';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    profile: {
      qualification: user?.profile?.qualification || '',
      stream: user?.profile?.stream || '',
      interests: user?.profile?.interests || [],
      bio: user?.profile?.bio || '',
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || ''
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const key = name.split('.')[1];
      setForm(f => ({ ...f, profile: { ...f.profile, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const toggleInterest = (interest) => {
    setForm(f => ({
      ...f,
      profile: {
        ...f.profile,
        interests: f.profile.interests.includes(interest)
          ? f.profile.interests.filter(i => i !== interest)
          : [...f.profile.interests, interest]
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile.'); }
    setLoading(false);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Keep your profile updated for better career recommendations.</p>
        </div>

        {/* Avatar Card */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-glow flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className={`badge mt-2 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'badge-primary'}`}>
              {user?.role === 'admin' ? '👑 Admin' : '🎓 Student'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Info */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="label"><Mail className="w-3 h-3 inline mr-1" />Email (read-only)</label>
                <input value={user?.email || ''} readOnly className="input-field opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="label"><Phone className="w-3 h-3 inline mr-1" />Phone</label>
                <input name="profile.phone" value={form.profile.phone} onChange={handleChange} className="input-field" placeholder="+91 00000 00000" />
              </div>
              <div>
                <label className="label"><MapPin className="w-3 h-3 inline mr-1" />Location</label>
                <input name="profile.location" value={form.profile.location} onChange={handleChange} className="input-field" placeholder="City, State" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Bio</label>
                <textarea name="profile.bio" value={form.profile.bio} onChange={handleChange}
                  className="input-field resize-none" rows={3} placeholder="Tell us about yourself..." maxLength={500} />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-500" /> Academic Background
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Highest Qualification</label>
                <select name="profile.qualification" value={form.profile.qualification} onChange={handleChange} className="input-field">
                  <option value="">Select qualification</option>
                  {QUALIFICATIONS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Stream / Field</label>
                <select name="profile.stream" value={form.profile.stream} onChange={handleChange} className="input-field">
                  <option value="">Select stream</option>
                  {STREAMS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand-500" /> Interests
            </h3>
            <p className="text-slate-500 text-sm mb-5">Select areas that interest you for better career matches.</p>
            <div className="flex flex-wrap gap-3">
              {INTERESTS.map(interest => (
                <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.profile.interests.includes(interest)
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                  }`}>
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center py-4 text-base">
            {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save className="w-5 h-5" /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
}
