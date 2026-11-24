import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BlockMark, FringeBand, LatticeBand } from '../print/Print';

/** The printed border that closes every page. */
const Footer = () => {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dye mt-auto">
      <FringeBand edge="top" />
      <div className="bg-dye text-resist">
        <div className="page-wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-14">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5 text-resist no-underline">
              <BlockMark size={30} />
              <span className="font-display text-[1.45rem] leading-none">Travel Explorer</span>
            </Link>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-resist-dim">
              Places across India, shared by people who went — each with what it costs, when it's open and how
              long to stay.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="font-display text-xl text-resist">Explore</h2>
            <ul className="mt-3 space-y-1.5">
              <FooterLink to="/">Discover</FooterLink>
              <FooterLink to="/uploads">All places</FooterLink>
              <FooterLink to="/map">Map</FooterLink>
            </ul>
          </nav>

          <nav aria-label="Contribute">
            <h2 className="font-display text-xl text-resist">Contribute</h2>
            <ul className="mt-3 space-y-1.5">
              <FooterLink to="/add-place">Share a place</FooterLink>
              {user ? (
                <FooterLink to="/profile">Your saved places</FooterLink>
              ) : (
                <>
                  <FooterLink to="/register">Join</FooterLink>
                  <FooterLink to="/login">Sign in</FooterLink>
                </>
              )}
            </ul>
          </nav>
        </div>
        <LatticeBand />
        <div className="page-wrap py-5 text-sm text-resist-dim">
          © {year} Travel Explorer · No paid listings: what a place costs and how it rates comes from the people who use it.
        </div>
      </div>
    </footer>
  );
};

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-[1.02rem] text-resist-dim no-underline transition-colors hover:text-resist hover:underline">
        {children}
      </Link>
    </li>
  );
}

export default Footer;
