import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu, X, Sun, Moon, GraduationCap, ChevronDown,
  User, LayoutDashboard, BookmarkCheck, LogOut, Shield, MessageSquare
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setUserMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/careers',  label: 'Explore Careers' },
    { to: '/guidance', label: 'Career Guidance' },
    { to: '/contact',  label: 'Contact' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-gradient hidden sm:block">CareerCampus</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`nav-link px-4 py-2 rounded-lg ${
                isActive(link.to) ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30' : ''
              }`}>{link.label}</Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl" aria-label="Toggle theme">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>

                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/30 text-slate-700 dark:text-slate-300 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/30 text-slate-700 dark:text-slate-300 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/saved" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/30 text-slate-700 dark:text-slate-300 transition-colors">
                      <BookmarkCheck className="w-4 h-4" /> Saved Careers
                    </Link>

                    {/* ── My Queries ── */}
                    <Link to="/my-queries" className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors ${
                      isActive('/my-queries')
                        ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      <MessageSquare className="w-4 h-4" /> My Queries
                    </Link>

                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 transition-colors">
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden btn-ghost p-2">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass rounded-2xl mt-2 mb-4 p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className={`nav-link px-4 py-3 rounded-xl ${
                  isActive(link.to) ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30' : ''
                }`}>{link.label}</Link>
              ))}

              {/* My Queries in mobile menu (only when logged in) */}
              {isAuthenticated && (
                <Link to="/my-queries" className={`flex items-center gap-3 nav-link px-4 py-3 rounded-xl ${
                  isActive('/my-queries') ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30' : ''
                }`}>
                  <MessageSquare className="w-4 h-4" /> My Queries
                </Link>
              )}

              {!isAuthenticated && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Link to="/login" className="btn-secondary flex-1 text-center text-sm py-2">Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}