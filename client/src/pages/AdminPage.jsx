import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Users, Briefcase, MessageSquare, TrendingUp,
  Eye, Edit, Trash2, Send, CheckCircle, Clock, X, Plus, Shield,
  ChevronDown, Search, AlertTriangle, Save, UserCheck, UserX
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { QUALIFICATIONS, STREAMS } from '../utils/helpers';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#84cc16'];

// ─── Reusable Modal Wrapper ───────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Dialog ─────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Are you sure?</h3>
        <p className="text-slate-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-secondary py-2.5">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Career Form (Create / Edit) ───────────────────────────────────────────────
const EMPTY_CAREER = {
  title: '', category: 'technology', icon: '💼', color: '#6366f1',
  shortDescription: '', description: '',
  eligibility: { minQualification: 'graduation', requiredStreams: [] },
  requiredSkills: '', recommendedCourses: '', certifications: '',
  salaryInsights: { entry: '', mid: '', senior: '' },
  workCulture: { type: '', environment: '', workHours: '', remote: false },
  futureScope: '', jobRoles: '', topCompanies: '', higherStudies: '',
  growthRate: '', demandLevel: 'high', difficulty: 'moderate', streams: ''
};

const CATEGORIES = ['technology','medical','business','arts','engineering','law','education','science','design','finance','government','agriculture','other'];
const DEMAND_LEVELS = ['low','medium','high','very-high'];
const DIFFICULTIES = ['easy','moderate','hard'];
const ICONS = ['💻','🩺','💼','🎨','⚙️','⚖️','📚','🔬','🖥️','📈','🏛️','🌾','🎯','📊','🏗️','📱'];

function CareerForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_CAREER;
    return {
      ...EMPTY_CAREER, ...initial,
      requiredSkills: (initial.requiredSkills || []).join(', '),
      recommendedCourses: (initial.recommendedCourses || []).join(', '),
      certifications: (initial.certifications || []).join(', '),
      jobRoles: (initial.jobRoles || []).join(', '),
      topCompanies: (initial.topCompanies || []).join(', '),
      higherStudies: (initial.higherStudies || []).join(', '),
      streams: (initial.streams || []).join(', '),
      eligibility: initial.eligibility || { minQualification: 'graduation', requiredStreams: [] },
      salaryInsights: initial.salaryInsights || { entry: '', mid: '', senior: '' },
      workCulture: initial.workCulture || { type: '', environment: '', workHours: '', remote: false }
    };
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setNested = (parent, key, val) => setForm(f => ({ ...f, [parent]: { ...f[parent], [key]: val } }));
  const csv = (str) => str.split(',').map(s => s.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Title and description are required.'); return; }
    setLoading(true);
    const payload = {
      ...form,
      requiredSkills: csv(form.requiredSkills),
      recommendedCourses: csv(form.recommendedCourses),
      certifications: csv(form.certifications),
      jobRoles: csv(form.jobRoles),
      topCompanies: csv(form.topCompanies),
      higherStudies: csv(form.higherStudies),
      streams: csv(form.streams),
      isActive: true
    };
    await onSave(payload);
    setLoading(false);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Basic Info</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Career Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="e.g. Software Engineer" required />
          </div>
          <div>
            <label className="label">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Icon</label>
            <select value={form.icon} onChange={e => set('icon', e.target.value)} className={inputCls}>
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Demand Level</label>
            <select value={form.demandLevel} onChange={e => set('demandLevel', e.target.value)} className={inputCls}>
              {DEMAND_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Short Description</label>
            <input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className={inputCls} placeholder="One-line summary" />
          </div>
          <div className="col-span-2">
            <label className="label">Full Description *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} className={inputCls + ' resize-none'} rows={3} required />
          </div>
        </div>
      </div>

      {/* Skills & Courses (CSV) */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills & Courses (comma-separated)</p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'Required Skills', key: 'requiredSkills', placeholder: 'Python, SQL, Machine Learning' },
            { label: 'Recommended Courses', key: 'recommendedCourses', placeholder: 'B.Tech CSE, BCA' },
            { label: 'Certifications', key: 'certifications', placeholder: 'AWS Certified, Google Analytics' },
            { label: 'Job Roles', key: 'jobRoles', placeholder: 'Frontend Developer, Backend Developer' },
            { label: 'Top Companies', key: 'topCompanies', placeholder: 'Google, Microsoft, TCS' },
            { label: 'Higher Studies', key: 'higherStudies', placeholder: 'M.Tech CSE, MBA' },
            { label: 'Eligible Streams', key: 'streams', placeholder: 'science, engineering' },
          ].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} className={inputCls} placeholder={f.placeholder} />
            </div>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Salary Insights</p>
        <div className="grid grid-cols-3 gap-3">
          {['entry', 'mid', 'senior'].map(level => (
            <div key={level}>
              <label className="label capitalize">{level} Level</label>
              <input value={form.salaryInsights[level]} onChange={e => setNested('salaryInsights', level, e.target.value)} className={inputCls} placeholder="₹4–8 LPA" />
            </div>
          ))}
        </div>
      </div>

      {/* Work Culture */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Work Culture</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Work Type</label>
            <input value={form.workCulture.type} onChange={e => setNested('workCulture', 'type', e.target.value)} className={inputCls} placeholder="Corporate/Startup" />
          </div>
          <div>
            <label className="label">Environment</label>
            <input value={form.workCulture.environment} onChange={e => setNested('workCulture', 'environment', e.target.value)} className={inputCls} placeholder="Office/Remote" />
          </div>
          <div>
            <label className="label">Work Hours</label>
            <input value={form.workCulture.workHours} onChange={e => setNested('workCulture', 'workHours', e.target.value)} className={inputCls} placeholder="8–9 hrs/day" />
          </div>
          <div className="flex items-center gap-3 mt-5">
            <input type="checkbox" id="remote" checked={form.workCulture.remote} onChange={e => setNested('workCulture', 'remote', e.target.checked)} className="w-4 h-4 accent-brand-500" />
            <label htmlFor="remote" className="text-sm font-medium text-slate-700 dark:text-slate-300">Remote Available</label>
          </div>
        </div>
      </div>

      {/* Other */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Other</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Growth Rate</label>
            <input value={form.growthRate} onChange={e => set('growthRate', e.target.value)} className={inputCls} placeholder="25% (2024–2034)" />
          </div>
          <div>
            <label className="label">Min. Qualification</label>
            <select value={form.eligibility.minQualification} onChange={e => setNested('eligibility', 'minQualification', e.target.value)} className={inputCls}>
              {QUALIFICATIONS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="label">Future Scope</label>
            <textarea value={form.futureScope} onChange={e => set('futureScope', e.target.value)} className={inputCls + ' resize-none'} rows={2} />
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {initial ? 'Update Career' : 'Create Career'}</>}
      </button>
    </form>
  );
}

// ─── User Edit Form ────────────────────────────────────────────────────────────
function UserEditForm({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'student',
    isActive: user.isActive !== false,
    profile: {
      qualification: user.profile?.qualification || '',
      stream: user.profile?.stream || '',
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} required />
        </div>
        <div>
          <label className="label">Role</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputCls}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'active' }))} className={inputCls}>
            <option value="active">Active</option>
            <option value="inactive">Blocked</option>
          </select>
        </div>
        <div>
          <label className="label">Qualification</label>
          <select value={form.profile.qualification} onChange={e => setForm(f => ({ ...f, profile: { ...f.profile, qualification: e.target.value } }))} className={inputCls}>
            <option value="">Not set</option>
            {QUALIFICATIONS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Stream</label>
          <select value={form.profile.stream} onChange={e => setForm(f => ({ ...f, profile: { ...f.profile, stream: e.target.value } }))} className={inputCls}>
            <option value="">Not set</option>
            {STREAMS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
    </form>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [queryFilter, setQueryFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [careerSearch, setCareerSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState({});

  // Modals
  const [careerModal, setCareerModal] = useState(null); // null | 'create' | career object
  const [userModal, setUserModal] = useState(null);     // null | user object
  const [confirmDelete, setConfirmDelete] = useState(null); // null | { type, id, label }

  useEffect(() => { fetchDashboard(); }, []);

  useEffect(() => {
    if (activeTab === 'queries') fetchQueries();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'careers') fetchCareers();
  }, [activeTab, queryFilter]);

  // ── Fetch Helpers ────────────────────────────────────────────────────────────
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [cs, qs, us] = await Promise.all([
        api.get('/careers/stats'),
        api.get('/queries/stats'),
        api.get('/auth/users')
      ]);
      setStats({ careers: cs.data.stats, queries: qs.data, users: us.data });
    } catch {}
    setLoading(false);
  };

  const fetchQueries = async () => {
    try {
      const { data } = await api.get(`/queries?status=${queryFilter}&limit=50`);
      setQueries(data.queries || []);
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data.users || []);
    } catch {}
  };

  const fetchCareers = async () => {
    try {
      const { data } = await api.get('/careers?limit=100');
      setCareers(data.careers || []);
    } catch {}
  };

  // ── Career CRUD ──────────────────────────────────────────────────────────────
  const saveCareer = async (payload) => {
    try {
      if (careerModal === 'create') {
        await api.post('/careers', payload);
        toast.success('Career created!');
      } else {
        await api.put(`/careers/${careerModal._id}`, payload);
        toast.success('Career updated!');
      }
      setCareerModal(null);
      fetchCareers();
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save career.');
    }
  };

  const deleteCareer = async (id) => {
    try {
      await api.delete(`/careers/${id}`);
      toast.success('Career deleted!');
      fetchCareers();
      fetchDashboard();
    } catch {
      toast.error('Failed to delete career.');
    }
    setConfirmDelete(null);
  };

  // ── User CRUD ────────────────────────────────────────────────────────────────
  const saveUser = async (payload) => {
    try {
      await api.put(`/auth/users/${userModal._id}`, payload);
      toast.success('User updated!');
      setUserModal(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user.');
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/auth/users/${id}`);
      toast.success('User deleted!');
      fetchUsers();
      fetchDashboard();
    } catch {
      toast.error('Failed to delete user.');
    }
    setConfirmDelete(null);
  };

  // ── Query Actions ────────────────────────────────────────────────────────────
  const sendReply = async (queryId) => {
    if (!replyText[queryId]?.trim()) { toast.error('Enter a reply first.'); return; }
    try {
      await api.post(`/queries/${queryId}/reply`, { message: replyText[queryId] });
      toast.success('Reply sent!');
      setReplyText(r => ({ ...r, [queryId]: '' }));
      fetchQueries();
    } catch { toast.error('Failed to send reply.'); }
  };

  const updateQueryStatus = async (id, status) => {
    try {
      await api.put(`/queries/${id}/status`, { status });
      toast.success('Status updated!');
      fetchQueries();
    } catch { toast.error('Failed to update status.'); }
  };

  const deleteQuery = async (id) => {
    try {
      await api.delete(`/queries/${id}`);
      toast.success('Query deleted!');
      fetchQueries();
    } catch { toast.error('Failed to delete query.'); }
    setConfirmDelete(null);
  };

  // ── Confirm Dispatch ─────────────────────────────────────────────────────────
  const handleConfirm = () => {
    const { type, id } = confirmDelete;
    if (type === 'career') deleteCareer(id);
    else if (type === 'user') deleteUser(id);
    else if (type === 'query') deleteQuery(id);
  };

  // ── Filtered Lists ───────────────────────────────────────────────────────────
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCareers = careers.filter(c =>
    c.title?.toLowerCase().includes(careerSearch.toLowerCase()) ||
    c.category?.toLowerCase().includes(careerSearch.toLowerCase())
  );

  // ── Status Badge Helper ──────────────────────────────────────────────────────
  const statusBadge = (s) => ({
    'open': 'badge-warning',
    'in-progress': 'badge-primary',
    'resolved': 'badge-success',
    'closed': 'bg-slate-100 dark:bg-slate-800 text-slate-500'
  }[s] || 'badge-warning');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'careers',   label: 'Careers',   icon: <Briefcase className="w-4 h-4" /> },
    { id: 'users',     label: 'Students',  icon: <Users className="w-4 h-4" /> },
    { id: 'queries',   label: 'Queries',   icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="pt-16 min-h-screen bg-slate-100 dark:bg-slate-950 flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 gap-1 fixed top-16 bottom-0 z-40">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-600 rounded-xl flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Admin Panel</p>
            <p className="text-xs text-slate-500 truncate w-32">{user?.name}</p>
          </div>
        </div>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'sidebar-link-active' : 'sidebar-link'}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${activeTab === tab.id ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 overflow-auto p-4 sm:p-6 pb-24 md:pb-6">

        {/* ════ DASHBOARD TAB ════ */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard Overview</h1>
            {loading ? <LoadingSpinner /> : (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">


{[
  { label: 'Total Students', value: stats?.users?.total || 0,        icon: <Users className="w-6 h-6" />,        color: 'from-brand-500 to-brand-600',    tab: 'users'   },
  { label: 'Total Careers',  value: stats?.careers?.total || 0,      icon: <Briefcase className="w-6 h-6" />,    color: 'from-emerald-500 to-teal-600',   tab: 'careers' },
  { label: 'Total Queries',  value: stats?.queries?.total || 0,      icon: <MessageSquare className="w-6 h-6" />,color: 'from-accent-500 to-pink-600',    tab: 'queries' },
  { label: 'Open Queries',   value: stats?.queries?.stats?.find(s => s._id === 'open')?.count || 0, icon: <Clock className="w-6 h-6" />, color: 'from-amber-500 to-orange-600', tab: 'queries' },
].map((s, i) => (
  <button
    key={i}
    onClick={() => setActiveTab(s.tab)}
    className="card p-5 text-left hover:ring-2 hover:ring-brand-400/50 hover:shadow-lg transition-all duration-200 group w-full"
  >
    <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
      {s.icon}
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
    <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
  </button>
))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {stats?.careers?.byCategory?.length > 0 && (
                    <div className="card p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-500" /> Careers by Category
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.careers.byCategory.map(c => ({ name: c._id, count: c.count }))}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {stats?.queries?.stats?.length > 0 && (
                    <div className="card p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-brand-500" /> Query Status
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={stats.queries.stats.map(s => ({ name: s._id, value: s.count }))}
                            cx="50%" cy="50%" outerRadius={75} dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}>
                            {stats.queries.stats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Top Viewed Careers */}
                {stats?.careers?.topViewed?.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-brand-500" /> Most Viewed Careers
                    </h3>
                    <div className="space-y-3">
                      {stats.careers.topViewed.map((c, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-slate-400 w-5 text-sm">#{i+1}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-sm text-slate-900 dark:text-white">{c.title}</span>
                              <span className="text-xs text-slate-500">{c.views} views</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                              <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                                style={{ width: `${(c.views / (stats.careers.topViewed[0]?.views || 1)) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════ CAREERS TAB ════ */}
        {activeTab === 'careers' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Manage Careers <span className="text-slate-400 text-base font-normal">({filteredCareers.length})</span>
              </h1>
              <button onClick={() => setCareerModal('create')} className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add Career
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={careerSearch} onChange={e => setCareerSearch(e.target.value)}
                placeholder="Search careers by title or category..."
                className="input-field pl-10 text-sm" />
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="px-4 py-3 text-left">Career</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Category</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Demand</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Salary (Entry)</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Views</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCareers.map(c => (
                      <tr key={c._id} className="table-row">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{c.icon}</span>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{c.title}</p>
                              <p className="text-xs text-slate-500 hidden sm:block">{c.shortDescription?.slice(0, 40)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-slate-500 hidden sm:table-cell">{c.category}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`badge text-xs ${c.demandLevel === 'very-high' || c.demandLevel === 'high' ? 'badge-success' : 'badge-warning'}`}>
                            {c.demandLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{c.salaryInsights?.entry || '—'}</td>
                        <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{c.views}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setCareerModal(c)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setConfirmDelete({ type: 'career', id: c._id, label: c.title })}
                              className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCareers.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No careers found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════ USERS TAB ════ */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Students <span className="text-slate-400 text-base font-normal">({filteredUsers.length})</span>
              </h1>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="input-field pl-10 text-sm" />
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Email</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Qualification</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Joined</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id} className="table-row">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{u.email}</td>
                        <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-400 hidden md:table-cell">
                          {u.profile?.qualification || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {u.isActive ? <><UserCheck className="w-3 h-3" /> Active</> : <><UserX className="w-3 h-3" /> Blocked</>}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setUserModal(u)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setConfirmDelete({ type: 'user', id: u._id, label: u.name })}
                              className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No students found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════ QUERIES TAB ════ */}
        {activeTab === 'queries' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Queries</h1>
              <select value={queryFilter} onChange={e => setQueryFilter(e.target.value)} className="input-field w-auto text-sm">
                <option value="all">All Queries</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="space-y-4">
              {queries.length === 0 ? (
                <div className="card p-12 text-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No queries found.</p>
                </div>
              ) : queries.map(q => (
                <div key={q._id} className="card p-5">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{q.subject}</h3>
                      <p className="text-sm text-slate-500">
                        {q.name} · {q.email} · {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${statusBadge(q.status)}`}>{q.status}</span>
                      <select value={q.status} onChange={e => updateQueryStatus(q._id, e.target.value)}
                        className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button onClick={() => setConfirmDelete({ type: 'query', id: q._id, label: `"${q.subject}"` })}
                        className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-3">
                    {q.message}
                  </p>

                  {/* Existing Replies */}
                  {q.replies?.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {q.replies.map((r, i) => (
                        <div key={i} className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-3">
                          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
                            👤 {r.adminName} · {new Date(r.createdAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{r.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="flex gap-2">
                    <input value={replyText[q._id] || ''} onChange={e => setReplyText(r => ({ ...r, [q._id]: e.target.value }))}
                      placeholder="Type your reply..." className="input-field flex-1 py-2 text-sm"
                      onKeyDown={e => e.key === 'Enter' && sendReply(q._id)} />
                    <button onClick={() => sendReply(q._id)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                      <Send className="w-4 h-4" /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ════ MODALS ════ */}

      {/* Career Create/Edit Modal */}
      {careerModal && (
        <Modal
          title={careerModal === 'create' ? '➕ Add New Career' : `✏️ Edit: ${careerModal.title}`}
          onClose={() => setCareerModal(null)}>
          <CareerForm
            initial={careerModal === 'create' ? null : careerModal}
            onSave={saveCareer}
            onClose={() => setCareerModal(null)}
          />
        </Modal>
      )}

      {/* User Edit Modal */}
      {userModal && (
        <Modal title={`✏️ Edit User: ${userModal.name}`} onClose={() => setUserModal(null)}>
          <UserEditForm user={userModal} onSave={saveUser} onClose={() => setUserModal(null)} />
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          message={`This will permanently delete ${confirmDelete.label}. This action cannot be undone.`}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}