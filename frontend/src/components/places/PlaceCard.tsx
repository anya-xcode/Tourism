import { Link } from 'react-router-dom';
import { Bookmark, MapPin } from 'lucide-react';
import type { IPlace } from '../../types';
import { FactBlock } from '../print/FactBlock';
import { PlaceArt, Stamp } from '../print/Print';
import { plainText, sizedPhoto } from '../../lib/format';
import { useSavedPlaces } from '../../context/SavedPlacesContext';

type CardPlace = Pick<
  IPlace,
  | '_id'
  | 'name'
  | 'city'
  | 'category'
  | 'photos'
  | 'budgetRange'
  | 'operatingHours'
  | 'suggestedDurationMinutes'
  | 'averageRating'
  | 'totalReviews'
>;

/**
 * A printed swatch: the place's photo, its name, and the same fact block
 * every other place carries.
 */
const PlaceCard = ({ place, priority = false }: { place: CardPlace; priority?: boolean }) => {
  const { isSaved, toggle } = useSavedPlaces();
  const saved = isSaved(place._id);
  const photo = sizedPhoto(place.photos?.[0], 720);
  const name = plainText(place.name);

  return (
    <article className="group relative flex h-full flex-col rounded-[3px] border border-rule bg-paper has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-madder transition-colors duration-200 hover:border-iron">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[2px] bg-dye">
        {photo ? (
          <img
            src={photo}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-press)] group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceArt name={name} />
        )}
        <span className="absolute left-3 top-3 rounded-[2px] bg-dye px-2 py-0.5 text-xs font-bold uppercase tracking-[0.08em] text-resist">
          {place.category}
        </span>
        {saved && (
          <Stamp className="absolute bottom-3 right-3" rotate={-8}>
            Saved
          </Stamp>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-[1.45rem] leading-[1.15] text-iron">
              <Link
                to={`/place/${place._id}`}
                className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
              >
                {name}
              </Link>
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[0.95rem] text-iron-2">
              <MapPin size={14} aria-hidden="true" className="shrink-0" />
              {place.city}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle(place._id)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${name} from saved places` : `Save ${name}`}
            className={`relative z-10 -mr-1 -mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] transition-colors ${
              saved
                ? 'border-madder bg-madder text-resist'
                : 'border-transparent text-iron-2 hover:border-iron hover:text-iron'
            }`}
          >
            <Bookmark size={18} className={saved ? 'fill-current' : ''} aria-hidden="true" />
          </button>
        </div>
        <FactBlock place={place} className="mt-auto" />
      </div>
    </article>
  );
};

export default PlaceCard;

/** Loading placeholder with the swatch's proportions. */
export const PlaceCardSkeleton = () => (
  <div className="flex flex-col rounded-[3px] border border-rule bg-paper" aria-hidden="true">
    <div className="skeleton aspect-[4/3] rounded-t-[2px]" />
    <div className="flex flex-col gap-3 p-4">
      <div className="skeleton h-6 w-3/4 rounded-[2px]" />
      <div className="skeleton h-4 w-1/3 rounded-[2px]" />
      <div className="skeleton mt-2 h-[74px] rounded-[3px]" />
    </div>
  </div>
);
