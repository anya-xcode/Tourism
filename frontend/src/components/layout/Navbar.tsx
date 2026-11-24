import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BlockMark, FringeBand } from '../print/Print';

const LINKS = [
  { name: 'Discover', path: '/', end: true },
  { name: 'All places', path: '/uploads', end: false },
  { name: 'Map', path: '/map', end: false },
];

/** Pages whose first band is indigo, so the masthead flows straight into it. */
const DYED_TOPS = ['/', '/uploads', '/add-place', '/profile'];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  const flowsIntoDye = DYED_TOPS.includes(pathname);

  // Close the menu when the route changes (state adjusted during render, not in an effect)
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <header className="on-dye sticky top-0 z-40">
      <div className="bg-dye text-resist">
        <div className="page-wrap flex h-[var(--masthead-h)] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 rounded-[3px] text-resist no-underline">
            <BlockMark size={30} />
            <span className="font-display text-[1.45rem] leading-none tracking-[-0.01em]">Travel Explorer</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `relative rounded-[3px] px-3 py-2 text-[0.98rem] font-semibold no-underline transition-colors ${
                    isActive ? 'text-resist' : 'text-resist-dim hover:text-resist'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-turmeric transition-transform duration-200 ease-[var(--ease-press)] ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link to="/add-place" className="btn-ink min-h-[40px] px-4 py-2 text-[0.92rem]">
                  <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
                  Share a place
                </Link>
                <Link
                  to="/profile"
                  className="ml-1 flex items-center gap-2 rounded-[3px] px-2 py-1.5 text-resist no-underline hover:bg-dye-raised"
                >
                  <Avatar name={user.name} src={user.avatar} />
                  <span className="text-[0.95rem] font-semibold">{firstName}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] text-resist-dim transition-colors hover:bg-dye-raised hover:text-resist"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={18} aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-[3px] px-3 py-2 text-[0.98rem] font-semibold text-resist no-underline hover:underline">
                  Sign in
                </Link>
                <Link to="/register" className="btn-ink min-h-[40px] px-4 py-2 text-[0.92rem]">
                  Join
                </Link>
              </>
            )}
          </div>

          <button
            ref={menuButton}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] text-resist hover:bg-dye-raised md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="border-t border-resist/15 md:hidden">
            <nav aria-label="Main" className="page-wrap flex flex-col py-3">
              {[...LINKS, ...(user ? [{ name: 'Your profile', path: '/profile', end: false }] : [])].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex min-h-[48px] items-center justify-between rounded-[3px] px-2 text-lg font-semibold no-underline ${
                      isActive ? 'text-resist' : 'text-resist-dim'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-turmeric" />}
                    </>
                  )}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-resist/15 pt-4">
                {user ? (
                  <>
                    <Link to="/add-place" className="btn-ink w-full">
                      <Plus size={16} strokeWidth={2.5} aria-hidden="true" /> Share a place
                    </Link>
                    <button type="button" onClick={handleLogout} className="btn-line-dye w-full">
                      <LogOut size={16} aria-hidden="true" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn-ink w-full">
                      Join Travel Explorer
                    </Link>
                    <Link to="/login" className="btn-line-dye w-full">
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      {/* Backed in cotton so content scrolling under the sticky masthead never shows through the teeth */}
      {!flowsIntoDye && <FringeBand edge="bottom" backing="var(--color-cotton)" className="pointer-events-none -mb-5" />}
    </header>
  );
};

export function Avatar({ name, src, size = 30 }: { name: string; src?: string; size?: number }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-resist/60 bg-madder font-display text-resist"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initial}
    </span>
  );
}

export default Navbar;
