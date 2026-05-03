import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'career-guidance', label: '🎯 Career Guidance' },
  { value: 'technical-support', label: '🔧 Technical Support' },
  { value: 'admission', label: '🎓 Admission Info' },
  { value: 'scholarship', label: '💰 Scholarship' },
  { value: 'general', label: '💬 General Query' },
  { value: 'other', label: '📋 Other' }
];

export default function ContactPage() {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    subject: '', message: '', category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/queries', form);
      setSubmitted(true);
      toast.success('Query submitted successfully! We\'ll reply soon.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit. Please try again.');
    }
    setLoading(false);
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hello@careercampus.in', color: 'text-brand-500' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 98765 43210', color: 'text-emerald-500' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'New Delhi, India', color: 'text-rose-500' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Response Time', value: 'Within 24 hours', color: 'text-amber-500' }
  ];

  if (submitted) return (
    <div className="pt-20 min-h-screen flex items-center justify-center mesh-gradient">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Query Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Thank you for reaching out. Our team will get back to you within 24 hours at <strong>{form.email}</strong>.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary">Send Another Query</button>
      </div>
    </div>
  );

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Get In Touch</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Have questions about your career path? Our advisors are here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center ${info.color}`}>{info.icon}</div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{info.label}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-gradient p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">🕐 Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Mon – Fri</span><span className="font-medium text-slate-900 dark:text-white">9AM – 6PM IST</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Saturday</span><span className="font-medium text-slate-900 dark:text-white">10AM – 4PM IST</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Sunday</span><span className="font-medium text-slate-900 dark:text-white">Closed</span></div>
              </div>
            </div>

            {isAuthenticated && (
              <div className="card p-6 border-l-4 border-brand-500">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  💡 Logged in as <strong>{user?.name}</strong>. Your queries are automatically linked to your account.
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card p-6 sm:p-8">
            <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input-field" required />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" required />
                </div>
              </div>

              <div>
                <label className="label">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Subject *</label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Brief subject of your query" className="input-field" required />
              </div>

              <div>
                <label className="label">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Describe your question or concern in detail..."
                  className="input-field resize-none" rows={6} required />
                <p className="text-xs text-slate-400 mt-1">{form.message.length} / 1000 characters</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-5 h-5" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
