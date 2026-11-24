import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Search, Users } from 'lucide-react';
import PlaceCard, { PlaceCardSkeleton } from '../components/places/PlaceCard';
import { FactBlock } from '../components/print/FactBlock';
import { InkChip } from '../components/print/InkChip';
import { FringeBand, LatticeBand, LatticeField } from '../components/print/Print';
import { PlaceService } from '../services/PlaceService';
import { StatsService } from '../services/StatsService';
import { VisitService } from '../services/VisitService';
import { PlaceCategory, type ICommunityStats, type IPlace, type IVisitEvent } from '../types';
import { errorMessage, formatDate, plainText, plural } from '../lib/format';

const CATEGORIES = ['All', ...Object.values(PlaceCategory)];

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<ICommunityStats | null>(null);
  const [events, setEvents] = useState<IVisitEvent[]>([]);
  const [example, setExample] = useState<IPlace | null>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);

  const filtered = query !== '' || category !== 'All';

  // Debounce typing into the live query
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await PlaceService.getPlaces({
        search: query || undefined,
        category: category === 'All' ? undefined : (category as PlaceCategory),
        limit: filtered ? 12 : 6,
      });
      setPlaces(res.places || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(errorMessage(err, 'Places could not be loaded.'));
    } finally {
      setLoading(false);
    }
  }, [query, category, filtered]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  useEffect(() => {
    StatsService.getCommunity().then(setStats).catch(() => setStats(null));
    VisitService.getUpcoming().then((list) => setEvents(list.slice(0, 3))).catch(() => setEvents([]));
    // The best-documented place demonstrates the fact block
    PlaceService.getPlaces({ limit: 40 })
      .then((res) => {
        const list = res.places || [];
        const best = [...list].sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))[0];
        setExample(best || null);
      })
      .catch(() => setExample(null));
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(search.trim());
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearFilters = () => {
    setSearch('');
    setQuery('');
    setCategory('All');
  };

  const browseHref = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (category !== 'All') params.set('category', category);
    const qs = params.toString();
    return qs ? `/uploads?${qs}` : '/uploads';
  }, [query, category]);

  const resultsTitle = filtered
    ? loading
      ? 'Searching…'
      : `${plural(total, 'place')}${category !== 'All' ? ` in ${category}` : ''}${query ? ` matching “${query}”` : ''}`
    : 'Recently shared';

  return (
    <>
      {/* ─── The dyed end-band: hook, working search, every category ─── */}
      <section className="on-dye relative bg-dye text-resist" aria-labelledby="home-title">
        <LatticeField opacity={0.12} />
        {/* The ornate end-band the cloth opens with */}
        <LatticeBand className="relative" />
        <div className="page-wrap relative pb-[112px] pt-6 sm:pb-[150px] md:pb-[190px] md:pt-9 lg:pt-10">
          <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-14">
            <h1
              id="home-title"
              className="max-w-[16ch] font-display text-[2.6rem] leading-[1.02] tracking-[-0.015em] text-resist sm:text-[3.4rem] lg:text-[4.25rem]"
            >
              Where to go next, from people who went.
            </h1>
            <p className="max-w-[46ch] text-[1.12rem] leading-relaxed text-resist-dim md:text-[1.2rem] lg:pb-2">
              Landmarks, food lanes and backwater mornings across India — each printed with what it costs, when it's
              open and how long to stay.
            </p>
          </div>

          <form role="search" onSubmit={onSubmit} className="mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row sm:gap-0">
            <label htmlFor="home-search" className="sr-only">
              Search places
            </label>
            <div className="relative flex-1">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-iron-3"
                aria-hidden="true"
              />
              <input
                id="home-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Try “sunrise”, “Mughal” or “street food”"
                className="h-14 w-full rounded-[3px] border-2 border-resist bg-paper pl-12 pr-4 text-[1.05rem] text-iron outline-none focus:border-turmeric sm:rounded-r-none"
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn-ink h-14 px-7 text-base sm:rounded-l-none">
              Search places
            </button>
          </form>

          {stats && stats.places > 0 && (
            <p className="tabular mt-4 text-[0.98rem] text-resist-dim">
              {plural(stats.places, 'place')} in {plural(stats.cities, 'city', 'cities')} ·{' '}
              {plural(stats.reviews, 'review')} from {plural(stats.travelers, 'traveler')}
              {/* Its own line on phones, so the wrap never ends a line on a separator */}
              {stats.sample && (
                <>
                  <span className="hidden sm:inline"> · includes sample data</span>
                  <span className="block sm:hidden">Includes sample data</span>
                </>
              )}
            </p>
          )}

          <div className="mt-5 sm:mt-6" role="group" aria-label="Filter by category">
            <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,#000_calc(100%_-_2.5rem),transparent)] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:[mask-image:none]">
              {CATEGORIES.map((c) => (
                <InkChip key={c} tone="dye" active={category === c} onClick={() => setCategory(c)}>
                  {c === 'All' ? 'All places' : c}
                </InkChip>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4 md:mt-10">
            <h2
              ref={resultsRef}
              aria-live="polite"
              className="scroll-mt-24 font-display text-[1.7rem] leading-tight text-resist md:text-[2rem]"
            >
              {resultsTitle}
            </h2>
            {!loading && total > places.length && (
              <Link to={browseHref} className="shrink-0 pb-1 font-semibold text-resist no-underline hover:underline">
                See all {total}
                <ArrowRight size={16} className="ml-1 inline" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
        <FringeBand edge="bottom" className="absolute inset-x-0 top-full" />
      </section>

      {/* ─── The swatches run off the cloth onto the cotton ─── */}
      <section aria-label="Places" className="relative z-10 -mt-[112px] sm:-mt-[150px] md:-mt-[190px]">
        <div className="page-wrap">
          {error ? (
            <div className="rounded-[3px] border-2 border-iron bg-paper p-8 text-center">
              <p className="font-display text-2xl text-iron">The places didn't load.</p>
              <p className="mx-auto mt-2 max-w-md text-iron-2">{error}</p>
              <button type="button" onClick={loadPlaces} className="btn-ink mt-5">
                Try again
              </button>
            </div>
          ) : loading && places.length === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          ) : places.length === 0 ? (
            <div className="rounded-[3px] border-2 border-iron bg-paper p-8 text-center md:p-12">
              <p className="font-display text-[1.8rem] leading-tight text-iron">
                {filtered ? 'Nothing printed for that yet.' : 'No places shared yet.'}
              </p>
              <p className="mx-auto mt-2 max-w-md text-[1.05rem] text-iron-2">
                {filtered
                  ? 'Try a different word or category — or be the first to share a place like it.'
                  : 'Be the first: share a place you would send a friend to.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {filtered && (
                  <button type="button" onClick={clearFilters} className="btn-line">
                    Clear filters
                  </button>
                )}
                <Link to="/add-place" className="btn-ink">
                  Share a place
                </Link>
              </div>
            </div>
          ) : (
            <ul
              key={`${query}|${category}`}
              className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-60 transition-opacity' : ''}`}
            >
              {places.map((place, i) => (
                <motion.li
                  key={place._id}
                  initial={{ scale: 1.03, filter: 'blur(3px)' }}
                  animate={{ scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 8) * 0.05 }}
                >
                  <PlaceCard place={place} priority={i < 3} />
                </motion.li>
              ))}
            </ul>
          )}

          {!filtered && !loading && !error && total > places.length && (
            <div className="mt-8 flex justify-center">
              <Link to="/uploads" className="btn-line">
                Browse all {plural(total, 'place')}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Same block, every place ─── */}
      {example && (
        <section className="page-wrap mt-24 md:mt-32" aria-labelledby="block-title">
          <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <h2 id="block-title" className="font-display text-[2.2rem] leading-[1.05] text-iron md:text-[2.8rem]">
                Same block, every place.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[1.1rem] leading-relaxed text-iron-2">
                Whoever shares a place fills in the same facts — cost, hours, how long to stay — and the community's
                reviews set the rating. So a Mughal tomb and a food crawl line up side by side, and you can tell at a
                glance which fits your afternoon.
              </p>
              <Link to={`/place/${example._id}`} className="ink-link mt-6 inline-flex items-center gap-1.5 text-[1.05rem]">
                Open {plainText(example.name)}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div>
              <p className="mb-3 font-display text-[1.5rem] leading-tight text-iron">
                {plainText(example.name)} <span className="font-sans text-base font-semibold text-iron-3">· {example.city}</span>
              </p>
              <FactBlock place={example} size="full" />
              <dl className="mt-8 grid gap-x-8 gap-y-4 text-[0.98rem] sm:grid-cols-2">
                <div>
                  <dt className="font-bold text-iron">Cost</dt>
                  <dd className="text-iron-2">Free, ₹, ₹₹ or ₹₹₹ — a budget band, not a price list.</dd>
                </div>
                <div>
                  <dt className="font-bold text-iron">Stay</dt>
                  <dd className="text-iron-2">How long people actually spend there.</dd>
                </div>
                <div>
                  <dt className="font-bold text-iron">Rating</dt>
                  <dd className="text-iron-2">The average of community reviews. No reviews, no number.</dd>
                </div>
                <div>
                  <dt className="font-bold text-iron">Hours</dt>
                  <dd className="text-iron-2">Opening times, plus the closed days worth knowing.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* ─── Cities ledger ─── */}
      {stats && stats.topCities.length > 0 && (
        <section className="page-wrap mt-24 md:mt-32" aria-labelledby="cities-title">
          <h2 id="cities-title" className="font-display text-[2.2rem] leading-[1.05] text-iron md:text-[2.8rem]">
            Cities in the collection
          </h2>
          <ul className="mt-8 grid border-t-2 border-iron sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
            {stats.topCities.map((c) => (
              <li key={c.city} className="border-b border-rule-strong">
                <Link
                  to={`/uploads?city=${encodeURIComponent(c.city)}`}
                  className="group flex min-h-[64px] items-center justify-between gap-4 py-3 text-iron no-underline"
                >
                  <span className="font-display text-[1.65rem] leading-none transition-colors group-hover:text-madder">
                    {c.city}
                  </span>
                  <span className="tabular flex items-center gap-2 text-[0.98rem] text-iron-2">
                    {plural(c.count, 'place')}
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Group visits ─── */}
      <section className="page-wrap mb-24 mt-24 md:mb-32 md:mt-32" aria-labelledby="visits-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="visits-title" className="font-display text-[2.2rem] leading-[1.05] text-iron md:text-[2.8rem]">
            Going soon
          </h2>
          <p className="max-w-md text-iron-2">Group visits travelers have planned. Join one, or plan your own from any place.</p>
        </div>
        {events.length > 0 ? (
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {events.map((ev) => (
              <EventRow key={ev._id} event={ev} />
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-[3px] border border-dashed border-rule-strong p-6 text-iron-2">
            No group visits planned yet. Open any place and choose <strong className="text-iron">Plan a group visit</strong>.
          </p>
        )}
      </section>
    </>
  );
};

function EventRow({ event }: { event: IVisitEvent }) {
  const place = typeof event.placeId === 'string' ? null : event.placeId;
  const date = new Date(event.scheduledDate);
  const going = event.currentParticipants ?? 0;
  const inner = (
    <>
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-[3px] bg-dye py-2 text-resist">
        <span className="font-display text-[1.9rem] leading-none">{date.getDate()}</span>
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-resist-dim">
          {date.toLocaleDateString('en-IN', { month: 'short' })}
        </span>
      </div>
      <div className="min-w-0">
        <p className="font-display text-[1.3rem] leading-tight text-iron">{event.title}</p>
        {place && (
          <p className="mt-0.5 truncate text-[0.95rem] text-iron-2">
            {plainText(place.name)} · {place.city}
          </p>
        )}
        <p className="tabular mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-iron-2">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} aria-hidden="true" />
            {formatDate(event.scheduledDate, { weekday: 'short', day: 'numeric', month: 'short' })}, {event.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={14} aria-hidden="true" />
            {going} of {event.maxParticipants} going
          </span>
        </p>
      </div>
    </>
  );
  return (
    <li>
      {place ? (
        <Link
          to={`/place/${place._id}`}
          className="flex h-full gap-4 rounded-[3px] border border-rule bg-paper p-4 no-underline transition-colors hover:border-iron"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex h-full gap-4 rounded-[3px] border border-rule bg-paper p-4">{inner}</div>
      )}
    </li>
  );
}

export default HomePage;
