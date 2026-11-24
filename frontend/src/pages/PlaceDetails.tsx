import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Images,
  MapPin,
  MessageSquare,
  Navigation,
  Send,
  Star,
  ThumbsUp,
  Users,
  X,
} from 'lucide-react';
import { PlaceService } from '../services/PlaceService';
import { ReviewService } from '../services/ReviewService';
import { ThreadService } from '../services/ThreadService';
import { VisitService } from '../services/VisitService';
import { RideService } from '../services/RideService';
import { useAuth } from '../context/AuthContext';
import { useSavedPlaces } from '../context/SavedPlacesContext';
import ScheduleVisit from '../components/places/ScheduleVisit';
import { FactBlock } from '../components/print/FactBlock';
import { PlaceArt, SampleTag, Stamp } from '../components/print/Print';
import { Avatar } from '../components/layout/Navbar';
import type { IFareEstimate, IPlace, IReview, IThread, IVisitEvent } from '../types';
import {
  errorMessage,
  formatDate,
  googleMapsUrl,
  hasRating,
  photoUrl,
  plainText,
  plural,
} from '../lib/format';

type TabId = 'about' | 'reviews' | 'discussion' | 'visits';

type FareState =
  | { status: 'idle' }
  | { status: 'locating' | 'loading' }
  | { status: 'done'; fares: IFareEstimate[] }
  | { status: 'error'; message: string };

const PlaceDetailsView = ({ id }: { id: string }) => {
  const { user } = useAuth();
  const { isSaved, toggle } = useSavedPlaces();
  const navigate = useNavigate();
  const location = useLocation();

  const [place, setPlace] = useState<IPlace | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState<TabId>('about');
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [threads, setThreads] = useState<IThread[]>([]);
  const [events, setEvents] = useState<IVisitEvent[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [fares, setFares] = useState<FareState>({ status: 'idle' });
  const [notice, setNotice] = useState<string>((location.state as { uploadNotice?: string } | null)?.uploadNotice || '');

  const goSignIn = useCallback(
    () => navigate('/login', { state: { from: location.pathname } }),
    [navigate, location.pathname],
  );

  const loadPlace = useCallback(async () => {
    try {
      const data = await PlaceService.getPlaceById(id);
      setPlace(data);
      setStatus('ready');
    } catch (err) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      if (code === 404 || code === 400) setStatus('missing');
      else {
        setLoadError(errorMessage(err, 'This place could not be loaded.'));
        setStatus('error');
      }
    }
  }, [id]);

  const loadReviews = useCallback(() => ReviewService.getByPlace(id).then(setReviews).catch(() => setReviews([])), [id]);
  const loadThreads = useCallback(() => ThreadService.getByPlace(id).then(setThreads).catch(() => setThreads([])), [id]);
  const loadEvents = useCallback(() => VisitService.getUpcoming(id).then(setEvents).catch(() => setEvents([])), [id]);

  useEffect(() => {
    // Data fetch on mount: every setState in these loaders runs after an await
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPlace();
    loadReviews();
    loadThreads();
    loadEvents();
  }, [loadPlace, loadReviews, loadThreads, loadEvents]);

  const compareFares = () => {
    if (!user) return goSignIn();
    if (!place?.location?.coordinates || !navigator.geolocation) {
      setFares({ status: 'error', message: 'Your browser does not share location, so fares cannot be estimated here.' });
      return;
    }
    setFares({ status: 'locating' });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setFares({ status: 'loading' });
        try {
          const result = await RideService.compareFares(
            { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
            { latitude: place.location.coordinates[1], longitude: place.location.coordinates[0] },
          );
          setFares({ status: 'done', fares: result });
        } catch (err) {
          setFares({ status: 'error', message: errorMessage(err, 'Fares could not be estimated right now.') });
        }
      },
      () =>
        setFares({
          status: 'error',
          message: 'Location access was blocked. Allow it for this site to estimate fares from where you are.',
        }),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  if (status === 'loading') {
    return (
      <div className="page-wrap py-16" aria-busy="true">
        <div className="skeleton h-12 w-2/3 max-w-xl rounded-[3px]" />
        <div className="skeleton mt-8 h-[320px] rounded-[3px] md:h-[440px]" />
      </div>
    );
  }

  if (status === 'missing' || status === 'error' || !place) {
    return (
      <section className="page-wrap flex flex-1 flex-col justify-center py-24">
        <h1 className="max-w-[20ch] font-display text-[2.4rem] leading-[1.05] text-iron">
          {status === 'missing' ? 'This place isn’t in the collection.' : 'This place didn’t load.'}
        </h1>
        <p className="mt-3 max-w-[50ch] text-[1.1rem] text-iron-2">
          {status === 'missing' ? 'It may have been removed, or the link is mistyped.' : loadError}
        </p>
        <div className="mt-8 flex gap-3">
          {status === 'error' && (
            <button type="button" className="btn-ink" onClick={loadPlace}>
              Try again
            </button>
          )}
          <Link to="/uploads" className="btn-line">
            Browse all places
          </Link>
        </div>
      </section>
    );
  }

  const name = plainText(place.name);
  const photos = (place.photos || []).map((p) => photoUrl(p)).filter((p): p is string => Boolean(p));
  const saved = isSaved(place._id);
  const addedBy = typeof place.addedBy === 'object' ? place.addedBy : null;
  const directions = googleMapsUrl(place, true);
  const mapLink = googleMapsUrl(place);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'discussion', label: `Discussion (${threads.length})` },
    { id: 'visits', label: `Visits (${events.length})` },
  ];

  const onTabKey = (e: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    document.getElementById(`tab-${tabs[next].id}`)?.focus();
  };

  return (
    <article className="pb-24">
      {notice && (
        <div role="status" className="border-b border-turmeric bg-turmeric-wash">
          <div className="page-wrap flex items-start justify-between gap-4 py-3 pt-8 text-iron">
            <p>{notice}</p>
            <button type="button" onClick={() => setNotice('')} className="shrink-0 font-semibold underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="page-wrap pt-10">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] text-iron-2">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/uploads" className="text-iron-2 hover:text-iron">
                All places
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/uploads?city=${encodeURIComponent(place.city)}`} className="text-iron-2 hover:text-iron">
                {place.city}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="truncate font-semibold text-iron">
              {name}
            </li>
          </ol>
        </nav>

        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-[2.5rem] leading-[1.02] tracking-[-0.01em] text-iron md:text-[3.6rem]">{name}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[1.02rem] text-iron-2">
              <span className="rounded-[2px] bg-dye px-2 py-0.5 text-sm font-bold uppercase tracking-[0.08em] text-resist">
                {place.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={16} aria-hidden="true" /> {place.city}
              </span>
              {/* Byline pieces are separate flex items, so a wrap never leaves a dangling separator */}
              {addedBy && (
                <span className="inline-flex flex-wrap items-center gap-x-2">
                  <span>
                    Shared by <strong className="font-semibold text-iron">{addedBy.name}</strong>
                  </span>
                  {addedBy.isSample && <SampleTag inline={false} />}
                </span>
              )}
              {place.createdAt && (
                <time dateTime={place.createdAt} className="whitespace-nowrap">
                  {formatDate(place.createdAt)}
                </time>
              )}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => toggle(place._id)}
              aria-pressed={saved}
              className={saved ? 'btn-ink' : 'btn-line'}
            >
              <Bookmark size={17} className={saved ? 'fill-current' : ''} aria-hidden="true" />
              {saved ? 'Saved' : 'Save'}
            </button>
            {directions && (
              <a href={directions} target="_blank" rel="noreferrer" className="btn-line">
                <Navigation size={16} aria-hidden="true" />
                Directions
              </a>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-8">
          {photos.length === 0 ? (
            <div className="h-[260px] overflow-hidden rounded-[3px] md:h-[380px]">
              <PlaceArt name={name} />
            </div>
          ) : photos.length === 1 ? (
            <button
              type="button"
              onClick={() => setLightbox(0)}
              className="block aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-dye md:aspect-[21/9]"
              aria-label={`View photo of ${name}`}
            >
              <img src={photos[0]} alt="" className="h-full w-full object-cover" />
            </button>
          ) : (
            <div className="grid gap-2 md:h-[460px] md:grid-cols-[2fr_1fr] md:grid-rows-2">
              <button
                type="button"
                onClick={() => setLightbox(0)}
                className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-dye md:row-span-2 md:aspect-auto"
                aria-label={`View photo 1 of ${photos.length}`}
              >
                <img src={photos[0]} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-[3px] bg-paper px-3 py-1.5 text-sm font-bold text-iron md:hidden">
                  <Images size={15} aria-hidden="true" /> {photos.length} photos
                </span>
              </button>
              {photos.slice(1, 3).map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(i + 1)}
                  className={`relative hidden overflow-hidden rounded-[3px] bg-dye md:block ${photos.length === 2 ? 'md:row-span-2' : ''}`}
                  aria-label={`View photo ${i + 2} of ${photos.length}`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  {i === 1 && photos.length > 3 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-dye/60 font-display text-2xl text-resist">
                      +{photos.length - 3} more
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* The fact block, stamped onto the lower edge of the photographs */}
        <div className="relative z-10 mt-6 md:-mt-14 md:mx-8">
          <FactBlock place={place} size="full" />
        </div>
      </div>

      <div className="page-wrap mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div role="tablist" aria-label={`About ${name}`} className="scrollbar-none flex gap-5 overflow-x-auto border-b border-rule-strong sm:gap-6">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`-mb-px shrink-0 whitespace-nowrap border-b-[3px] pb-3 pt-1 text-[1.05rem] font-semibold transition-colors ${
                  tab === t.id ? 'border-madder text-iron' : 'border-transparent text-iron-3 hover:text-iron'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="pt-8 outline-none">
            {tab === 'about' && <AboutPanel place={place} mapLink={mapLink} directions={directions} />}
            {tab === 'reviews' && (
              <ReviewsPanel
                place={place}
                reviews={reviews}
                signedIn={Boolean(user)}
                onSignIn={goSignIn}
                onChanged={async () => {
                  await Promise.all([loadReviews(), loadPlace()]);
                }}
              />
            )}
            {tab === 'discussion' && (
              <DiscussionPanel placeId={place._id} threads={threads} signedIn={Boolean(user)} onSignIn={goSignIn} onChanged={loadThreads} />
            )}
            {tab === 'visits' && (
              <VisitsPanel
                events={events}
                signedIn={Boolean(user)}
                onSignIn={goSignIn}
                onPlan={() => (user ? setShowSchedule(true) : goSignIn())}
                onChanged={loadEvents}
              />
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--masthead-h)+32px)] lg:self-start">
          <section className="rounded-[3px] border border-rule bg-paper p-5" aria-labelledby="getting-there">
            <h2 id="getting-there" className="font-display text-[1.5rem] leading-tight text-iron">
              Getting there
            </h2>
            <p className="mt-1.5 text-[0.98rem] text-iron-2">Estimated ride fares from where you are now.</p>

            {fares.status === 'done' ? (
              <FareList fares={fares.fares} />
            ) : (
              <>
                {fares.status === 'error' && (
                  <p className="mt-3 rounded-[3px] bg-madder-wash p-3 text-sm text-madder-deep" role="alert">
                    {fares.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={compareFares}
                  disabled={fares.status === 'locating' || fares.status === 'loading'}
                  className="btn-ink mt-4 w-full"
                >
                  {fares.status === 'locating'
                    ? 'Finding you…'
                    : fares.status === 'loading'
                      ? 'Comparing…'
                      : user
                        ? 'Compare Uber, Ola & Rapido'
                        : 'Sign in to compare fares'}
                </button>
              </>
            )}
            {directions && (
              <a href={directions} target="_blank" rel="noreferrer" className="ink-link mt-4 inline-flex items-center gap-1.5 text-[0.98rem]">
                <Navigation size={15} aria-hidden="true" /> Directions in Google Maps
              </a>
            )}
          </section>

          <section className="on-dye rounded-[3px] bg-dye p-5 text-resist" aria-labelledby="plan-visit">
            <h2 id="plan-visit" className="font-display text-[1.5rem] leading-tight">
              Going with others?
            </h2>
            <p className="mt-1.5 text-[0.98rem] text-resist-dim">
              Pick a date and time, set how many can join, and travelers headed here can sign up.
            </p>
            <button type="button" onClick={() => (user ? setShowSchedule(true) : goSignIn())} className="btn-ink mt-4 w-full">
              <CalendarDays size={16} aria-hidden="true" />
              Plan a group visit
            </button>
          </section>
        </aside>
      </div>

      {lightbox !== null && photos.length > 0 && (
        <Lightbox photos={photos} index={lightbox} name={name} onChange={setLightbox} onClose={() => setLightbox(null)} />
      )}

      {showSchedule && (
        <ScheduleVisit
          placeId={place._id}
          placeName={name}
          onClose={() => setShowSchedule(false)}
          onCreated={() => {
            loadEvents();
            setTab('visits');
          }}
        />
      )}
    </article>
  );
};

/* ─── About ─────────────────────────────────────────────────────────── */

function AboutPanel({ place, mapLink, directions }: { place: IPlace; mapLink?: string; directions?: string }) {
  const paragraphs = plainText(place.description).split(/\n+/).filter(Boolean);
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-[58ch] space-y-4 text-[1.12rem] leading-[1.7] text-iron">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {place.tags?.length > 0 && (
        <div>
          <h3 className="print-label">Tagged</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <li key={tag}>
                <Link
                  to={`/uploads?search=${encodeURIComponent(tag)}`}
                  className="inline-flex h-9 items-center rounded-[3px] border-[1.5px] border-rule-strong px-3 text-[0.95rem] font-semibold text-iron-2 no-underline hover:border-iron hover:text-iron"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-rule pt-6">
        <h3 className="print-label">Address</h3>
        <p className="mt-1 max-w-[60ch] text-[1.05rem] text-iron">{place.address}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {mapLink && (
            <a href={mapLink} target="_blank" rel="noreferrer" className="ink-link">
              View on Google Maps
            </a>
          )}
          {directions && (
            <a href={directions} target="_blank" rel="noreferrer" className="ink-link">
              Get directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Reviews ───────────────────────────────────────────────────────── */

/** Five stars, filled to the exact value: 4.5 prints four and a half, never five. */
function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const label = `${Number.isInteger(value) ? value : value.toFixed(1)} out of 5`;
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <span key={n} className="relative inline-block shrink-0" style={{ width: size, height: size }}>
            <Star size={size} aria-hidden="true" className="absolute inset-0 text-rule-strong" />
            {fill > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} aria-hidden="true" className="block max-w-none fill-turmeric text-turmeric" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

function ReviewsPanel({
  place,
  reviews,
  signedIn,
  onSignIn,
  onChanged,
}: {
  place: IPlace;
  reviews: IReview[];
  signedIn: boolean;
  onSignIn: () => void;
  onChanged: () => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rated = hasRating(place);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rating) return setError('Choose a rating from 1 to 5 stars.');
    if (!text.trim()) return setError('Write a line or two about your visit.');
    setBusy(true);
    setError('');
    try {
      await ReviewService.create({ placeId: place._id, rating, text: text.trim() });
      setRating(0);
      setText('');
      await onChanged();
    } catch (err) {
      setError(errorMessage(err, 'Your review could not be posted. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const vote = async (reviewId: string) => {
    if (!signedIn) return onSignIn();
    try {
      await ReviewService.voteHelpful(reviewId);
      await onChanged();
    } catch {
      /* the count simply stays as it was */
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
        {rated ? (
          <>
            <span className="font-display text-[3.4rem] leading-none text-iron">{place.averageRating.toFixed(1)}</span>
            <div className="pb-1.5">
              <Stars value={place.averageRating} size={20} />
              <p className="mt-0.5 text-iron-2">from {plural(place.totalReviews, 'review')}</p>
            </div>
          </>
        ) : (
          <p className="font-display text-[1.8rem] leading-tight text-iron">No reviews yet.</p>
        )}
      </div>

      {signedIn ? (
        <form onSubmit={submit} className="rounded-[3px] border border-rule bg-paper p-5" noValidate>
          <h3 className="font-display text-[1.35rem] text-iron">Write a review</h3>
          <div role="radiogroup" aria-label="Your rating" className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={plural(n, 'star')}
                onClick={() => setRating(n)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] hover:bg-turmeric-wash"
              >
                <Star size={26} aria-hidden="true" className={n <= rating ? 'fill-turmeric text-turmeric' : 'text-rule-strong'} />
              </button>
            ))}
          </div>
          <label htmlFor="review-text" className="field-label mt-4">
            Your visit
          </label>
          <textarea
            id="review-text"
            className="field"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="When did you go, what was worth it, what would you tell a friend?"
          />
          {error && (
            <p className="mt-2 text-[0.95rem] font-semibold text-madder" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-ink mt-4">
            {busy ? 'Posting…' : 'Post review'}
          </button>
        </form>
      ) : (
        <SignInPrompt onSignIn={onSignIn} action="write a review" />
      )}

      {reviews.length > 0 && (
        <ul className="flex flex-col divide-y divide-rule border-y border-rule">
          {reviews.map((r) => {
            const author = typeof r.userId === 'object' && r.userId ? r.userId : null;
            return (
              <li key={r._id} className="py-5">
                <div className="flex items-center gap-3">
                  <Avatar name={author?.name || 'Traveler'} src={author?.avatar} size={38} />
                  <div>
                    <p className="font-semibold text-iron">
                      {author?.name || 'A traveler'}
                      {author?.isSample && <SampleTag />}
                    </p>
                    <p className="text-sm text-iron-3">
                      {r.visitDate ? `Visited ${formatDate(r.visitDate, { month: 'long', year: 'numeric' })}` : formatDate(r.createdAt)}
                    </p>
                  </div>
                  <span className="ml-auto">
                    <Stars value={r.rating} />
                  </span>
                </div>
                <p className="mt-3 max-w-[60ch] text-[1.05rem] leading-relaxed text-iron">{r.text}</p>
                <button
                  type="button"
                  onClick={() => vote(r._id)}
                  className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-[3px] border border-rule-strong px-3 text-sm font-semibold text-iron-2 hover:border-iron hover:text-iron"
                >
                  <ThumbsUp size={14} aria-hidden="true" /> Helpful · {r.helpfulVotes || 0}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ─── Discussion ───────────────────────────────────────────────────── */

function DiscussionPanel({
  placeId,
  threads,
  signedIn,
  onSignIn,
  onChanged,
}: {
  placeId: string;
  threads: IThread[];
  signedIn: boolean;
  onSignIn: () => void;
  onChanged: () => Promise<void>;
}) {
  const [question, setQuestion] = useState('');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const ask = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setBusy(true);
    setError('');
    try {
      await ThreadService.createThread({ placeId, content: question.trim() });
      setQuestion('');
      await onChanged();
    } catch (err) {
      setError(errorMessage(err, 'Your post could not be published.'));
    } finally {
      setBusy(false);
    }
  };

  const reply = async (threadId: string) => {
    const content = replies[threadId]?.trim();
    if (!content) return;
    try {
      await ThreadService.createReply({ threadId, content });
      setReplies((r) => ({ ...r, [threadId]: '' }));
      await onChanged();
    } catch (err) {
      setError(errorMessage(err, 'Your reply could not be posted.'));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {signedIn ? (
        <form onSubmit={ask} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="thread-text" className="sr-only">
            Ask or share something about this place
          </label>
          <input
            id="thread-text"
            className="field flex-1"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question or share a tip"
          />
          <button type="submit" disabled={busy || !question.trim()} className="btn-ink">
            <Send size={16} aria-hidden="true" /> Post
          </button>
        </form>
      ) : (
        <SignInPrompt onSignIn={onSignIn} action="ask a question" />
      )}
      {error && (
        <p className="font-semibold text-madder" role="alert">
          {error}
        </p>
      )}

      {threads.length === 0 ? (
        <p className="flex items-center gap-2 text-[1.05rem] text-iron-2">
          <MessageSquare size={18} aria-hidden="true" /> No questions yet. Ask the people who have been.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {threads.map((t) => (
            <li key={t.id} className="rounded-[3px] border border-rule bg-paper p-5">
              <div className="flex items-center gap-3">
                <Avatar name={t.userName} size={34} />
                <p className="flex flex-wrap items-center gap-x-2 font-semibold text-iron">
                  <span>{t.userName}</span>
                  {t.userIsSample && <SampleTag inline={false} />}
                  <time dateTime={t.createdAt} className="whitespace-nowrap font-normal text-iron-3">
                    {formatDate(t.createdAt)}
                  </time>
                </p>
              </div>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-iron">{t.content}</p>
              {t.replies?.length > 0 && (
                <ul className="mt-4 flex flex-col gap-3 border-l-0 pl-0">
                  {t.replies.map((rep) => (
                    <li key={rep.id} className="ml-4 rounded-[3px] bg-cotton p-3.5 sm:ml-10">
                      <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-iron">
                        <span>{rep.userName}</span>
                        {rep.userIsSample && <SampleTag inline={false} />}
                        <time dateTime={rep.createdAt} className="whitespace-nowrap font-normal text-iron-3">
                          {formatDate(rep.createdAt)}
                        </time>
                      </p>
                      <p className="mt-1 text-[1rem] text-iron">{rep.content}</p>
                    </li>
                  ))}
                </ul>
              )}
              {signedIn && (
                <form
                  className="mt-4 flex gap-2 sm:ml-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    reply(t.id);
                  }}
                >
                  <label htmlFor={`reply-${t.id}`} className="sr-only">
                    Reply to {t.userName}
                  </label>
                  <input
                    id={`reply-${t.id}`}
                    className="field min-h-[42px] flex-1 py-2"
                    value={replies[t.id] || ''}
                    onChange={(e) => setReplies((r) => ({ ...r, [t.id]: e.target.value }))}
                    placeholder="Reply"
                  />
                  <button type="submit" className="btn-line min-h-[42px]" disabled={!replies[t.id]?.trim()}>
                    Reply
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Group visits ─────────────────────────────────────────────────── */

function VisitsPanel({
  events,
  signedIn,
  onSignIn,
  onPlan,
  onChanged,
}: {
  events: IVisitEvent[];
  signedIn: boolean;
  onSignIn: () => void;
  onPlan: () => void;
  onChanged: () => Promise<void>;
}) {
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const join = async (eventId: string) => {
    if (!signedIn) return onSignIn();
    setError('');
    try {
      await VisitService.rsvp(eventId, 'going');
      setJoined((s) => new Set(s).add(eventId));
      await onChanged();
    } catch (err) {
      setError(errorMessage(err, 'You could not be added to this visit.'));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[52ch] text-[1.05rem] text-iron-2">Upcoming visits travelers have planned here. Join one, or plan your own.</p>
        <button type="button" onClick={onPlan} className="btn-line">
          <CalendarDays size={16} aria-hidden="true" /> Plan a group visit
        </button>
      </div>
      {error && (
        <p className="font-semibold text-madder" role="alert">
          {error}
        </p>
      )}
      {events.length === 0 ? (
        <p className="rounded-[3px] border border-dashed border-rule-strong p-6 text-iron-2">No visits planned here yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {events.map((ev) => {
            const going = ev.currentParticipants ?? 0;
            const full = going >= ev.maxParticipants;
            const date = new Date(ev.scheduledDate);
            const host = typeof ev.creatorId === 'object' ? ev.creatorId : null;
            return (
              <li key={ev._id} className="relative flex flex-col rounded-[3px] border border-rule bg-paper p-5">
                <div className="flex gap-4">
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-[3px] bg-dye py-2 text-resist">
                    <span className="font-display text-[1.9rem] leading-none">{date.getDate()}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-resist-dim">
                      {date.toLocaleDateString('en-IN', { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.35rem] leading-tight text-iron">{ev.title}</h3>
                    <p className="tabular mt-1 flex flex-wrap gap-x-3 text-sm text-iron-2">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} aria-hidden="true" /> {formatDate(ev.scheduledDate, { weekday: 'short', day: 'numeric', month: 'short' })}, {ev.time}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} aria-hidden="true" /> {going} of {ev.maxParticipants} going
                      </span>
                    </p>
                  </div>
                </div>
                {ev.description && <p className="mt-3 text-[1rem] text-iron">{ev.description}</p>}
                {host && (
                  <p className="mt-2 text-sm text-iron-3">
                    Planned by {host.name}
                    {host.isSample && <SampleTag />}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-3 pt-1">
                  {joined.has(ev._id) ? (
                    <Stamp rotate={-4}>
                      You're going
                    </Stamp>
                  ) : (
                    <button type="button" onClick={() => join(ev._id)} disabled={full} className="btn-ink min-h-[40px] py-2">
                      {full ? 'Full' : 'Join this visit'}
                    </button>
                  )}
                  {ev.visibility === 'invite-only' && <span className="text-sm font-semibold text-iron-3">Invite only</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ─── Shared bits ──────────────────────────────────────────────────── */

function SignInPrompt({ onSignIn, action }: { onSignIn: () => void; action: string }) {
  return (
    <p className="rounded-[3px] border border-dashed border-rule-strong p-5 text-[1.02rem] text-iron-2">
      <button type="button" onClick={onSignIn} className="ink-link">
        Sign in
      </button>{' '}
      to {action}.
    </p>
  );
}

function FareList({ fares }: { fares: IFareEstimate[] }) {
  const cheapest = Math.min(...fares.map((f) => f.fare));
  return (
    <div className="mt-4">
      <ul className="divide-y divide-rule border-y border-rule">
        {[...fares]
          .sort((a, b) => a.fare - b.fare)
          .map((f) => (
            <li key={f.provider} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-bold text-iron">{f.provider}</p>
                <p className="tabular text-sm text-iron-2">
                  {f.estimatedMinutes} min · {f.distanceKm} km
                </p>
              </div>
              <div className="flex items-center gap-3">
                {f.fare === cheapest && (
                  <Stamp rotate={-6}>
                    Cheapest
                  </Stamp>
                )}
                <span className="tabular text-lg font-extrabold text-iron">₹{Math.round(f.fare)}</span>
              </div>
            </li>
          ))}
      </ul>
      <p className="mt-2 text-sm text-iron-3">Estimates, not quotes — surge and tolls can change the fare.</p>
    </div>
  );
}

function Lightbox({
  photos,
  index,
  name,
  onChange,
  onClose,
}: {
  photos: string[];
  index: number;
  name: string;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prev = useCallback(() => onChange((index - 1 + photos.length) % photos.length), [index, photos.length, onChange]);
  const next = useCallback(() => onChange((index + 1) % photos.length), [index, photos.length, onChange]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${name}`}
      className="on-dye fixed inset-0 z-50 flex flex-col bg-dye-deep/95 text-resist"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between p-4">
        <p className="tabular font-semibold">
          {name} · {index + 1} / {photos.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] hover:bg-dye-raised"
          aria-label="Close photos"
        >
          <X size={24} aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img src={photos[index]} alt={`${name}, photo ${index + 1}`} className="max-h-full max-w-full rounded-[3px] object-contain" />
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[3px] bg-dye/80 hover:bg-dye-raised"
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[3px] bg-dye/80 hover:bg-dye-raised"
              aria-label="Next photo"
            >
              <ChevronRight size={26} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Remount per place so every piece of page state starts fresh. */
const PlaceDetails = () => {
  const { id = '' } = useParams();
  return <PlaceDetailsView key={id} id={id} />;
};

export default PlaceDetails;
