import { useId, type CSSProperties, type ReactNode } from 'react';

const cleanId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '');

/** The carved-block mark: a diamond cut into indigo, madder centre slightly off-register. */
export function BlockMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="24" rx="3" fill="var(--color-dye-deep)" />
      <path d="M12 3.6 20.4 12 12 20.4 3.6 12Z" fill="none" stroke="var(--color-resist)" strokeWidth="1.8" />
      <circle cx="12.7" cy="12.7" r="2.7" fill="var(--color-madder)" />
      <g fill="var(--color-resist)">
        <circle cx="4.4" cy="4.4" r="1.2" />
        <circle cx="19.6" cy="4.4" r="1.2" />
        <circle cx="4.4" cy="19.6" r="1.2" />
        <circle cx="19.6" cy="19.6" r="1.2" />
      </g>
    </svg>
  );
}

/**
 * Kangura fringe — the stepped-tooth border that finishes a block-printed
 * cloth. `edge="bottom"`: indigo above, teeth hang into the cotton below.
 * `edge="top"`: cotton above, teeth rise from the indigo below.
 */
export function FringeBand({
  edge = 'bottom',
  backing,
  className = '',
}: {
  edge?: 'top' | 'bottom';
  /** Opaque fill behind the teeth, for a fringe that content scrolls under (the sticky masthead) */
  backing?: string;
  className?: string;
}) {
  const id = cleanId(useId());
  const flip = edge === 'top';
  return (
    <svg
      className={`block w-full ${className}`}
      height="20"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <defs>
        <pattern id={`teeth-${id}`} width="16" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 5 8 13 16 5Z" fill="var(--color-dye)" />
          <circle cx="8.6" cy="17" r="1.5" fill="var(--color-madder)" />
        </pattern>
      </defs>
      {backing && <rect width="100%" height="20" fill={backing} />}
      <rect width="100%" height="6" fill="var(--color-dye)" />
      <rect width="100%" height="20" fill={`url(#teeth-${id})`} />
    </svg>
  );
}

/** Ajrakh-style diamond lattice band, printed resist-white on indigo. */
export function LatticeBand({ className = '' }: { className?: string }) {
  const id = cleanId(useId());
  return (
    <svg className={`block w-full ${className}`} height="26" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`lattice-${id}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M13 4 22 13 13 22 4 13Z" fill="none" stroke="var(--color-resist)" strokeOpacity="0.7" strokeWidth="1.3" />
          <circle cx="13.6" cy="13.6" r="2.3" fill="var(--color-madder)" />
          <circle cx="0" cy="13" r="1.4" fill="var(--color-turmeric)" />
          <circle cx="26" cy="13" r="1.4" fill="var(--color-turmeric)" />
        </pattern>
      </defs>
      <rect width="100%" height="26" fill="var(--color-dye)" />
      <rect y="0" width="100%" height="1.2" fill="var(--color-resist)" fillOpacity="0.55" />
      <rect y="24.8" width="100%" height="1.2" fill="var(--color-resist)" fillOpacity="0.55" />
      <rect width="100%" height="26" fill={`url(#lattice-${id})`} />
    </svg>
  );
}

/** Repeating lattice as a full-area ground, for cloth regions and photo placeholders. */
export function LatticeField({ opacity = 0.16, className = '' }: { opacity?: number; className?: string }) {
  const id = cleanId(useId());
  return (
    <svg className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`field-${id}`} width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M22 6 38 22 22 38 6 22Z" fill="none" stroke="var(--color-resist)" strokeWidth="1.2" />
          <path d="M22 15 29 22 22 29 15 22Z" fill="var(--color-resist)" fillOpacity="0.5" />
          <circle cx="0" cy="0" r="2" fill="var(--color-resist)" />
          <circle cx="44" cy="0" r="2" fill="var(--color-resist)" />
          <circle cx="0" cy="44" r="2" fill="var(--color-resist)" />
          <circle cx="44" cy="44" r="2" fill="var(--color-resist)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#field-${id})`} opacity={opacity} />
    </svg>
  );
}

/** Indigo swatch shown when a place has no photo yet. */
export function PlaceArt({ name, className = '' }: { name: string; className?: string }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-dye ${className}`}>
      <LatticeField opacity={0.2} />
      <span className="relative font-display text-6xl leading-none text-resist" aria-hidden="true">
        {initial}
      </span>
      <span className="sr-only">No photo yet</span>
    </div>
  );
}

/** Quiet label on contributions from the demo seed's synthetic accounts, so sample data never passes as real people. */
export function SampleTag({ inline = true, className = '' }: { inline?: boolean; className?: string }) {
  return (
    <span
      className={`${inline ? 'ml-1.5' : ''} inline-block whitespace-nowrap rounded-[2px] border border-rule-strong px-1.5 align-[0.12em] text-[0.7rem] font-bold uppercase leading-[1.5] tracking-[0.06em] text-iron-3 ${className}`}
    >
      Sample traveler
    </span>
  );
}

/** A rubber-stamp mark: state is printed, not tinted. */
export function Stamp({
  children,
  rotate = -9,
  tone = 'madder',
  className = '',
  land = true,
}: {
  children: ReactNode;
  rotate?: number;
  tone?: 'madder' | 'dye';
  className?: string;
  land?: boolean;
}) {
  const color = tone === 'dye' ? 'var(--color-dye)' : 'var(--color-madder)';
  return (
    <span
      className={`stamp ${land ? 'stamp-land' : ''} ${className}`}
      style={{ '--stamp-rotate': `${rotate}deg`, '--stamp-color': color } as CSSProperties}
    >
      {children}
    </span>
  );
}
