import type { ButtonHTMLAttributes, ReactNode } from 'react';

type InkChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
  tone?: 'cotton' | 'dye';
  children: ReactNode;
};

/**
 * A filter printed as a carved outline. Every option stays visible;
 * choosing one inks it madder in a single press.
 */
export function InkChip({ active, tone = 'cotton', children, className = '', ...rest }: InkChipProps) {
  const idle =
    tone === 'dye'
      ? 'border-resist/45 text-resist/90 hover:border-resist hover:text-resist'
      : 'border-rule-strong text-iron-2 hover:border-iron hover:text-iron';
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`ink-chip inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[3px] border-[1.5px] px-3.5 text-[0.95rem] font-semibold transition-[background-color,border-color,color] duration-150 ${
        active ? 'border-madder bg-madder text-resist' : `bg-transparent ${idle}`
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
