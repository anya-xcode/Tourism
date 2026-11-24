import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BlockMark, FringeBand, LatticeField } from '../print/Print';

type AuthTravelShellProps = {
  children: ReactNode;
};

const PHOTO = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200';

/** Split layout for sign-in pages: indigo cloth with a printed swatch, form on cotton. */
export function AuthTravelShell({ children }: AuthTravelShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="on-dye relative hidden w-[46%] max-w-[680px] flex-col justify-between overflow-hidden bg-dye p-12 text-resist lg:flex">
        <LatticeField opacity={0.09} />
        <Link to="/" className="relative inline-flex items-center gap-2.5 self-start text-resist no-underline">
          <BlockMark size={32} />
          <span className="font-display text-[1.5rem] leading-none">Travel Explorer</span>
        </Link>

        <figure className="relative mx-auto my-10 w-full max-w-[420px] rotate-[-2deg] border-[10px] border-paper bg-paper shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)]">
          <img src={PHOTO} alt="The latticed façade of Hawa Mahal in Jaipur" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="flex items-baseline justify-between gap-3 pt-2.5 text-iron">
            <span className="font-display text-[1.2rem] leading-none">Hawa Mahal</span>
            <span className="text-sm text-iron-2">Jaipur · Heritage</span>
          </figcaption>
        </figure>

        <p className="relative max-w-[30ch] font-display text-[1.9rem] leading-[1.1]">
          Cost, hours and how long to stay, printed the same way for every place.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-cotton">
        <div className="on-dye lg:hidden">
          <div className="bg-dye">
            <div className="page-wrap flex h-[var(--masthead-h)] items-center">
              <Link to="/" className="inline-flex items-center gap-2.5 text-resist no-underline">
                <BlockMark size={30} />
                <span className="font-display text-[1.4rem] leading-none">Travel Explorer</span>
              </Link>
            </div>
          </div>
          <FringeBand edge="bottom" />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
