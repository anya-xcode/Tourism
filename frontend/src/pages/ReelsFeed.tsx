import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PlaceCard, { PlaceCardSkeleton } from '../components/places/PlaceCard';
import { InkChip } from '../components/print/InkChip';
import { FringeBand, LatticeBand, LatticeField } from '../components/print/Print';
import { PlaceService } from '../services/PlaceService';
import { StatsService } from '../services/StatsService';
import { PlaceCategory, type ICityCount, type IPlace } from '../types';
import { errorMessage, plural } from '../lib/format';

const CATEGORIES = Object.values(PlaceCategory);
const PAGE_SIZE = 12;

/**
 * All places — the full collection with city, category, search and sort,
 * kept in the URL so filtered views can be linked and shared.
 */
const ReelsFeed = () => {
  const [params, setParams] = useSearchParams();
  const city = params.get('city') || '';
  const category = params.get('category') || '';
  const query = params.get('search') || '';
  const sort = params.get('sort') === 'rating' ? 'rating' : 'newest';

  const [draft, setDraft] = useState(query);
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<ICityCount[]>([]);

  useEffect(() => setDraft(query), [query]);

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  // Debounced search into the URL
  useEffect(() => {
    if (draft.trim() === query) return;
    const t = setTimeout(() => update('search', draft.trim()), 350);
    return () => clearTimeout(t);
  }, [draft, query, update]);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      return PlaceService.getPlaces({
        city: city || undefined,
        category: (category || undefined) as PlaceCategory | undefined,
        search: query || undefined,
        sortBy: sort,
        page: pageNum,
        limit: PAGE_SIZE,
      });
    },
    [city, category, query, sort],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchPage(1);
      setPlaces(res.places || []);
      setTotal(res.total || 0);
      setPage(1);
    } catch (err) {
      setError(errorMessage(err, 'Places could not be loaded.'));
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    StatsService.getCommunity()
      .then((s) => setCities(s.topCities))
      .catch(() => setCities([]));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetchPage(page + 1);
      setPlaces((cur) => [...cur, ...(res.places || [])]);
      setPage((p) => p + 1);
    } catch (err) {
      setError(errorMessage(err, 'More places could not be loaded.'));
    } finally {
      setLoadingMore(false);
    }
  };

  const hasFilters = Boolean(city || category || query);
  const clearAll = () => {
    setDraft('');
    setParams(sort === 'rating' ? { sort: 'rating' } : {}, { replace: true });
  };

  const summary = loading
    ? 'Looking…'
    : hasFilters
      ? `${plural(total, 'place')}${category ? ` · ${category}` : ''}${city ? ` · ${city}` : ''}${query ? ` · “${query}”` : ''}`
      : `${plural(total, 'place')} shared so far`;

  return (
    <>
      <section className="on-dye relative bg-dye text-resist" aria-labelledby="browse-title">
        <LatticeField opacity={0.1} />
        {/* The ornate end-band the cloth opens with */}
        <LatticeBand className="relative" />
        <div className="page-wrap relative pb-10 pt-8 md:pb-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 id="browse-title" className="font-display text-[2.6rem] leading-none text-resist md:text-[3.4rem]">
                All places
              </h1>
              <p className="tabular mt-3 text-[1.05rem] text-resist-dim" aria-live="polite">
                {summary}
              </p>
            </div>
            <Link to="/add-place" className="btn-line-dye">
              <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
              Share a place
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 sm:max-w-xl">
              <label htmlFor="browse-search" className="sr-only">
                Search places
              </label>
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-iron-3"
                aria-hidden="true"
              />
              <input
                id="browse-search"
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search names, descriptions and tags"
                className="h-12 w-full rounded-[3px] border-2 border-resist bg-paper pl-11 pr-3 text-base text-iron outline-none focus:border-turmeric"
                autoComplete="off"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="browse-sort" className="text-[0.95rem] font-semibold text-resist-dim">
                Sort
              </label>
              <select
                id="browse-sort"
                value={sort}
                onChange={(e) => update('sort', e.target.value === 'rating' ? 'rating' : '')}
                className="field h-12 min-h-0 w-auto border-2 border-resist py-0"
              >
                <option value="newest">Newest first</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>
          </div>
        </div>
        <FringeBand edge="bottom" className="absolute inset-x-0 top-full" />
      </section>

      <div className="page-wrap pb-24 pt-12">
        <div className="flex flex-col gap-4">
          {cities.length > 0 && (
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <span className="print-label w-20 shrink-0" id="city-filter-label">
                City
              </span>
              <div
                role="group"
                aria-labelledby="city-filter-label"
                className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,#000_calc(100%_-_2.5rem),transparent)] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:[mask-image:none]"
              >
                <InkChip active={!city} onClick={() => update('city', '')}>
                  Every city
                </InkChip>
                {cities.map((c) => (
                  <InkChip
                    key={c.city}
                    active={city.toLowerCase() === c.city.toLowerCase()}
                    onClick={() => update('city', city.toLowerCase() === c.city.toLowerCase() ? '' : c.city)}
                  >
                    {c.city}
                    <span className="tabular text-sm opacity-70">{c.count}</span>
                  </InkChip>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <span className="print-label w-20 shrink-0" id="category-filter-label">
              Category
            </span>
            <div
              role="group"
              aria-labelledby="category-filter-label"
              className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,#000_calc(100%_-_2.5rem),transparent)] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:[mask-image:none]"
            >
              <InkChip active={!category} onClick={() => update('category', '')}>
                Every category
              </InkChip>
              {CATEGORIES.map((c) => (
                <InkChip key={c} active={category === c} onClick={() => update('category', category === c ? '' : c)}>
                  {c}
                </InkChip>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          {error && places.length === 0 ? (
            <div className="rounded-[3px] border-2 border-iron bg-paper p-8 text-center">
              <p className="font-display text-2xl text-iron">The places didn't load.</p>
              <p className="mx-auto mt-2 max-w-md text-iron-2">{error}</p>
              <button type="button" onClick={load} className="btn-ink mt-5">
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          ) : places.length === 0 ? (
            <div className="rounded-[3px] border-2 border-iron bg-paper p-8 text-center md:p-12">
              <p className="font-display text-[1.8rem] leading-tight text-iron">No places match these filters.</p>
              <p className="mx-auto mt-2 max-w-md text-[1.05rem] text-iron-2">
                Loosen a filter, or share the place you were hoping to find.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {hasFilters && (
                  <button type="button" onClick={clearAll} className="btn-line">
                    Clear filters
                  </button>
                )}
                <Link to="/add-place" className="btn-ink">
                  Share a place
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {places.map((place, i) => (
                  <li key={place._id}>
                    <PlaceCard place={place} priority={i < 3} />
                  </li>
                ))}
              </ul>
              {places.length < total && (
                <div className="mt-10 flex flex-col items-center gap-2">
                  <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-line min-w-[220px]">
                    {loadingMore ? 'Loading…' : `Show more places`}
                  </button>
                  <p className="tabular text-sm text-iron-3">
                    Showing {places.length} of {total}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReelsFeed;
