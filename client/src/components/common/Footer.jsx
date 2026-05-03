import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const links = {
    Platform: [
      { label: 'Explore Careers', to: '/careers' },
      { label: 'Career Guidance', to: '/guidance' },
      { label: 'Get Started', to: '/register' }
    ],
    Support: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQ', to: '/contact' },
      { label: 'Dashboard', to: '/dashboard' }
    ]
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              CareerCampus
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Empowering students to discover their ideal career paths with intelligent guidance and comprehensive resources.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { icon: <Github className="w-4 h-4" />, href: '#' },
                { icon: <Twitter className="w-4 h-4" />, href: '#' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
                { icon: <Mail className="w-4 h-4" />, href: 'mailto:hello@careercampus.in' }
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-9 h-9 bg-slate-800 hover:bg-brand-600 rounded-xl flex items-center justify-center transition-colors duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold mb-4 text-sm">{section}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm hover:text-brand-400 transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-slate-600">
            © {currentYear} CareerCampus. All rights reserved.
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
