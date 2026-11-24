import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedPlaces } from '../context/SavedPlacesContext';
import { BookmarkService } from '../services/BookmarkService';
import { StatsService } from '../services/StatsService';
import PlaceCard, { PlaceCardSkeleton } from '../components/places/PlaceCard';
import { FringeBand, LatticeBand, LatticeField } from '../components/print/Print';
import type { IPlace, IUserStats } from '../types';
import { formatDate, plural } from '../lib/format';

/**
 * Profile — who you are here, what you've contributed, and your saved places.
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const { count: savedCount } = useSavedPlaces();
  const [saved, setSaved] = useState<IPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState<IUserStats | null>(null);

  useEffect(() => {
    BookmarkService.getAll('place')
      .then((list) => {
        const places = list
          .map((bm: { placeId?: IPlace | null }) => bm.placeId)
          .filter((p): p is IPlace => Boolean(p && p._id));
        setSaved(places);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    StatsService.getMine().then(setStats).catch(() => setStats(null));
  }, []);

  if (!user) return null;

  const memberSince = formatDate(user.createdAt, { month: 'long', year: 'numeric' });

  return (
    <>
      <section className="on-dye relative bg-dye text-resist" aria-labelledby="profile-title">
        <LatticeField opacity={0.1} />
        {/* The ornate end-band the cloth opens with */}
        <LatticeBand className="relative" />
        <div className="page-wrap relative flex flex-col gap-6 pb-12 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-5">
            <span
              className="inline-flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-resist bg-madder font-display text-[2.4rem] text-resist outline outline-1 outline-offset-4 outline-resist/40"
              aria-hidden="true"
            >
              {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <h1 id="profile-title" className="font-display text-[2.4rem] leading-none md:text-[3rem]">
                {user.name}
              </h1>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[1rem] text-resist-dim">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={15} aria-hidden="true" /> {user.email}
                </span>
                {user.city && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} aria-hidden="true" /> {user.city}
                  </span>
                )}
                {memberSince && <span>Member since {memberSince}</span>}
              </p>
            </div>
          </div>
          <Link to="/add-place" className="btn-ink self-start md:hidden">
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" /> Share a place
          </Link>
        </div>
        <FringeBand edge="bottom" className="absolute inset-x-0 top-full" />
      </section>

      <div className="page-wrap pb-24 pt-14">
        {stats && (
          <p className="tabular text-[1.1rem] text-iron-2">
            You've shared <strong className="text-iron">{plural(stats.placesAdded, 'place')}</strong>, written{' '}
            <strong className="text-iron">{plural(stats.reviews, 'review')}</strong> and saved{' '}
            <strong className="text-iron">{plural(savedCount || stats.bookmarks, 'place')}</strong>.
          </p>
        )}

        <h2 className="mt-10 font-display text-[2.2rem] leading-none text-iron">Saved places</h2>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="text-iron-2">Your saved places couldn't be loaded. Refresh to try again.</p>
          ) : saved.length === 0 ? (
            <div className="rounded-[3px] border-[1.5px] border-dashed border-rule-strong p-8 md:p-10">
              <p className="font-display text-[1.6rem] leading-tight text-iron">Nothing saved yet.</p>
              <p className="mt-2 max-w-[48ch] text-[1.05rem] text-iron-2">
                Tap the bookmark on any place and it lands here, ready for when you plan the trip.
              </p>
              <Link to="/uploads" className="btn-ink mt-5">
                Browse places
              </Link>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((p) => (
                <li key={p._id}>
                  <PlaceCard place={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
