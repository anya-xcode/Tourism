import { Star } from 'lucide-react';
import type { IPlace } from '../../types';
import { budgetMarks, formatDuration, hasRating, plural } from '../../lib/format';

type FactPlace = Pick<
  IPlace,
  'budgetRange' | 'operatingHours' | 'suggestedDurationMinutes' | 'averageRating' | 'totalReviews'
>;

/**
 * The carved block every place is printed from: cost, stay, rating and hours,
 * always in the same cells, so any two places compare at a glance.
 */
export function FactBlock({ place, size = 'compact', className = '' }: { place: FactPlace; size?: 'compact' | 'full'; className?: string }) {
  const rated = hasRating(place);
  const rating = rated ? place.averageRating.toFixed(1) : 'Unrated';
  const hours = place.operatingHours?.trim() || 'Not listed';

  if (size === 'compact') {
    return (
      <dl className={`grid grid-cols-3 overflow-hidden rounded-[3px] border-[1.5px] border-iron/80 text-sm ${className}`}>
        <Cell label="Cost" value={budgetMarks(place.budgetRange)} />
        <Cell label="Stay" value={formatDuration(place.suggestedDurationMinutes)} divider />
        <Cell
          label="Rating"
          divider
          value={
            rated ? (
              <span className="inline-flex items-center gap-1">
                {rating}
                <Star size={13} className="fill-iron text-iron" aria-hidden="true" />
                <span className="sr-only">out of 5</span>
              </span>
            ) : (
              <span className="text-iron-3">New</span>
            )
          }
        />
        <div className="col-span-3 flex items-baseline gap-2 border-t border-rule-strong/70 px-2.5 py-1.5">
          <dt className="print-label shrink-0">Hours</dt>
          {/* Two lines, so the closed day (the fact worth knowing) is not cut off */}
          <dd className="line-clamp-2 font-medium leading-snug text-iron-2">{hours}</dd>
        </div>
      </dl>
    );
  }

  return (
    <dl className={`stamp-drift relative grid grid-cols-2 rounded-[3px] border-2 border-iron bg-paper md:grid-cols-[1fr_1fr_1fr_1.6fr] ${className}`}>
      <BigCell label="Cost" value={budgetMarks(place.budgetRange)} note={place.budgetRange === 'Free' ? 'no entry cost' : place.budgetRange || 'Not set'} />
      <BigCell label="Stay" value={formatDuration(place.suggestedDurationMinutes)} note="suggested visit" divider />
      <BigCell
        label="Rating"
        divider
        className="border-t-[1.5px] md:border-t-0"
        value={
          rated ? (
            <span className="inline-flex items-center gap-1.5">
              {rating}
              <Star size={20} className="fill-iron text-iron" aria-hidden="true" />
              <span className="sr-only">out of 5</span>
            </span>
          ) : (
            'Unrated'
          )
        }
        note={rated ? `from ${plural(place.totalReviews, 'review')}` : 'no reviews yet'}
      />
      <BigCell label="Hours" value={hours} divider className="border-t-[1.5px] md:border-t-0" small />
    </dl>
  );
}

function Cell({ label, value, divider }: { label: string; value: React.ReactNode; divider?: boolean }) {
  return (
    <div className={`px-2.5 py-1.5 ${divider ? 'border-l border-rule-strong/70' : ''}`}>
      <dt className="print-label leading-tight">{label}</dt>
      <dd className="tabular font-bold leading-snug text-iron">{value}</dd>
    </div>
  );
}

function BigCell({
  label,
  value,
  note,
  divider,
  small,
  className = '',
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  divider?: boolean;
  small?: boolean;
  className?: string;
}) {
  return (
    <div className={`border-iron/25 px-4 py-3.5 ${divider ? 'border-l-[1.5px] [&:nth-child(3)]:border-l-0 md:[&:nth-child(3)]:border-l-[1.5px]' : ''} ${className}`}>
      <dt className="print-label">{label}</dt>
      <dd className={`tabular mt-1 font-extrabold leading-tight text-iron ${small ? 'text-lg' : 'text-2xl'}`}>{value}</dd>
      {note && <dd className="mt-0.5 text-sm text-iron-3">{note}</dd>}
    </div>
  );
}
