import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Globe, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const AUTH_ROUTES = ['/login', '/register'];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const onAuthPage = AUTH_ROUTES.includes(location.pathname);
  const transparentHero = onAuthPage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 20);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navShell = transparentHero
    ? 'h-[var(--header-height)] border-b border-white/15 bg-white/5 shadow-none backdrop-blur-md'
    : scrolled
      ? 'h-[70px] glass shadow-lg border-b border-white/30'
      : 'h-[var(--header-height)] glass border-b border-white/20';

  const linkBase = transparentHero
    ? 'text-sm font-600 transition-all relative group py-2 text-white/90 hover:text-cyan-100'
    : 'text-sm font-600 transition-all relative group py-2';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navShell}`}>
      <div className="container-custom h-full flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div
            className={`rounded-2xl p-2.5 text-white shadow-lg transition-transform group-hover:scale-110 ${
              transparentHero
                ? 'bg-teal-500/90 shadow-[0_0_28px_rgba(45,212,212,0.55),0_8px_24px_-8px_rgba(15,118,110,0.5)]'
                : 'bg-[var(--primary)] shadow-teal-500/20'
            }`}
          >
            <Globe size={22} />
          </div>
          <span
            className={`font-poppins text-xl font-bold tracking-tight ${
              transparentHero ? 'text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]' : ''
            }`}
          >
            Travel
            <span className={transparentHero ? 'text-cyan-200' : 'text-[var(--primary)]'}>Explorer</span>
            {!transparentHero && (
              <span className="ml-2 align-top text-[10px] font-black tracking-widest bg-[var(--primary)] text-white px-2 py-0.5 rounded-full">
                PRO-UI
              </span>
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {[
            { name: 'Explore', path: '/' },
            { name: 'Experiences', path: '/reels' },
            { name: 'Global Map', path: '/map' }
          ].map((link) => (
            <NavLink 
              key={link.path}
              to={link.path} 
              className={({ isActive }) =>
                `${linkBase} ${
                  transparentHero
                    ? isActive
                      ? 'font-bold text-cyan-50'
                      : ''
                    : isActive
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary)]'
                }`
              }
            >
              {link.name}
              <span
                className={`absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-opacity ${
                  transparentHero ? 'bg-cyan-200' : 'bg-[var(--primary)]'
                } opacity-0 group-hover:opacity-100`}
              />
            </NavLink>
          ))}
        </div>

        {/* Action Buttons & Profile */}
        <div className="hidden lg:flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className={`flex items-center gap-3 rounded-full border py-1.5 pl-1 pr-4 transition-all ${
                  transparentHero
                    ? 'border-white/25 bg-white/15 hover:border-white/40'
                    : 'bg-[var(--background-subtle)] border-[var(--border)] hover:border-[var(--primary)]'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ${
                    transparentHero ? 'bg-white/20 text-white' : 'bg-[var(--primary-soft)] text-[var(--primary)]'
                  }`}
                >
                  {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <User size={16} />}
                </div>
                <span
                  className={`text-xs font-bold ${transparentHero ? 'text-white/95' : 'text-[var(--text-secondary)]'}`}
                >
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className={`p-2 transition-colors ${
                  transparentHero
                    ? 'text-white/75 hover:text-cyan-100'
                    : 'text-[var(--text-light)] hover:text-[var(--primary)]'
                }`}
                title="Log Out"
                type="button"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`btn px-5 font-bold text-sm ${
                  transparentHero
                    ? 'btn-ghost border-0 bg-white/10 text-white hover:bg-white/20 hover:text-white'
                    : 'btn-ghost'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`btn px-7 py-2.5 text-sm font-bold shadow-teal ${
                  transparentHero
                    ? 'border border-white/25 bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:brightness-110'
                    : 'btn-primary'
                }`}
              >
                Join Community
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`rounded-xl p-2.5 transition-all lg:hidden ${
            transparentHero
              ? 'text-white hover:bg-white/15'
              : 'text-[var(--text)] hover:bg-[var(--primary-soft)]'
          }`}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar - Redesigned with Glassmorphism */}
      <div className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        <div className="absolute inset-0 bg-[var(--text)]/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-500 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-8 pb-10 border-b border-[var(--border-light)] mb-6">
            <div className="flex items-center gap-3 mb-10">
               <div className="p-2 bg-[var(--primary)] rounded-xl text-white">
                 <Globe size={18} />
               </div>
               <span className="font-poppins font-bold text-lg">Travel Explorer</span>
            </div>
            
            <div className="space-y-6">
              {[
                { name: 'Explore', path: '/' },
                { name: 'Experiences Feed', path: '/reels' },
                { name: 'Interactive Map', path: '/map' }
              ].map((link) => (
                <NavLink 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={({isActive}) => `flex items-center justify-between font-bold text-sm transition-all ${
                    isActive ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--primary)]'
                  }`}
                >
                  {link.name}
                  <div className={`w-1.5 h-1.5 rounded-full bg-[var(--primary)] transition-opacity opacity-0`} />
                </NavLink>
              ))}
            </div>
          </div>

          <div className="p-8 mt-auto border-t border-[var(--border-light)] gap-4 flex flex-col">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-outline w-full justify-center">Sign In</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary w-full justify-center">Get Started</Link>
              </>
            ) : (
              <button 
                onClick={handleLogout} 
                className="btn btn-ghost w-full justify-center text-[var(--primary)] font-bold gap-3"
              >
                <LogOut size={18} /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
