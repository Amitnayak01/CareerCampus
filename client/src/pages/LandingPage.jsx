import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, BookOpen, Users, Star, ChevronRight, Zap, Shield, Globe } from 'lucide-react';

const stats = [
  { label: 'Career Paths', value: '100+', icon: '🎯' },
  { label: 'Students Guided', value: '50K+', icon: '👨‍🎓' },
  { label: 'Success Rate', value: '94%', icon: '⭐' },
  { label: 'Industries', value: '15+', icon: '🌐' }
];

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI-Powered Guidance',
    desc: 'Smart recommendation engine analyzes your profile and suggests the best career paths tailored just for you.',
    color: 'from-brand-500 to-brand-600'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Market Insights',
    desc: 'Real salary data, demand trends, and job market analytics to make informed career decisions.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Learning Roadmaps',
    desc: 'Step-by-step learning paths, certifications, and courses curated for your chosen career.',
    color: 'from-accent-500 to-pink-600'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Expert Community',
    desc: 'Connect with career advisors and get personalized answers to your career questions.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Results',
    desc: 'Get comprehensive career recommendations instantly after filling out your profile.',
    color: 'from-sky-500 to-blue-600'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Trusted Platform',
    desc: 'Verified career data from industry professionals and leading educational institutions.',
    color: 'from-violet-500 to-purple-600'
  }
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at Google', avatar: '👩‍💻', text: 'CareerCampus helped me realize my potential in tech. The career roadmap was exactly what I needed after my 12th!', rating: 5 },
  { name: 'Arjun Mehta', role: 'CA at Deloitte', avatar: '👨‍💼', text: 'The salary insights and eligibility info were super accurate. I made my CA decision with full confidence.', rating: 5 },
  { name: 'Sneha Patel', role: 'UX Designer at Flipkart', avatar: '👩‍🎨', text: 'I didn\'t know design could be a serious career until CareerCampus showed me the roadmap. Life-changing!', rating: 5 },
  { name: 'Rahul Singh', role: 'IAS Officer', avatar: '🏛️', text: 'The UPSC career path section was incredibly detailed. Helped me structure my 3-year preparation plan.', rating: 5 }
];

const careerHighlights = [
  { title: 'Software Engineer', salary: '₹4–80 LPA', demand: '🔥 Very High', icon: '💻', color: '#6366f1' },
  { title: 'Data Scientist', salary: '₹6–100 LPA', demand: '🔥 Very High', icon: '📊', color: '#8b5cf6' },
  { title: 'Doctor (MBBS)', salary: '₹6–200 LPA', demand: '⚡ High', icon: '🩺', color: '#ef4444' },
  { title: 'CA / Finance', salary: '₹5–150 LPA', demand: '⚡ High', icon: '📈', color: '#f59e0b' },
  { title: 'Civil Engineer', salary: '₹3–70 LPA', demand: '📈 Medium', icon: '🏗️', color: '#10b981' },
  { title: 'UX Designer', salary: '₹4–70 LPA', demand: '🔥 Very High', icon: '🖥️', color: '#06b6d4' }
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center mesh-gradient pattern-dots pt-20">
        {/* Blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-brand-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700 rounded-full text-brand-600 dark:text-brand-400 text-sm font-semibold mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Guidance Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover Your{' '}
            <span className="text-gradient">Perfect Career</span>
            <br />Path Today
          </h1>

          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Get personalized career recommendations based on your qualifications, interests, and goals.
            Explore 100+ career paths with salary insights, roadmaps, and opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/guidance" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              <Sparkles className="w-5 h-5" />
              Explore My Career
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/careers" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              <Globe className="w-5 h-5" />
              Browse All Careers
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="card p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER HIGHLIGHTS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Top Career Paths</h2>
            <p className="section-subtitle">Discover high-demand careers with excellent growth prospects</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerHighlights.map((career, i) => (
              <Link key={i} to="/careers"
                className="card p-6 group flex items-center gap-4 hover:scale-105">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ backgroundColor: career.color + '20' }}>{career.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{career.title}</h3>
                  <div className="text-xs text-brand-600 dark:text-brand-400 font-semibold mb-1">{career.salary}</div>
                  <div className="text-xs text-slate-500">{career.demand}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
              View All Careers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">A complete platform to plan your entire career journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 group hover:scale-105">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto">Three simple steps to discover your ideal career path</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Fill Your Profile', desc: 'Enter your qualification, stream, and interests in our simple form.', icon: '📝' },
              { step: '02', title: 'Get Recommendations', desc: 'Our engine analyzes your profile and suggests the best career matches.', icon: '🤖' },
              { step: '03', title: 'Plan Your Journey', desc: 'Explore detailed roadmaps, certifications, and job opportunities.', icon: '🚀' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">{step.icon}</div>
                <div className="text-white/50 font-mono text-sm mb-2">{step.step}</div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/guidance" className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-all hover:scale-105">
              Start Now – It's Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Student Success Stories</h2>
            <p className="section-subtitle">Thousands of students found their path with CareerCampus</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Career?</h2>
          <p className="text-slate-400 text-lg mb-8">Join 50,000+ students who've already discovered their perfect career path.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/guidance" className="flex items-center justify-center gap-2 text-lg px-8 py-4 border-2 border-slate-700 text-slate-300 rounded-xl hover:border-brand-500 hover:text-brand-400 transition-all">
              Try Without Signup
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
