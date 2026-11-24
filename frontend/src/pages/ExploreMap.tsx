import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ArrowRight, LocateFixed, MapPin, Minus, Plus, Search, Star } from 'lucide-react';
import { PlaceService } from '../services/PlaceService';
import { FactBlock } from '../components/print/FactBlock';
import { LatticeField, PlaceArt } from '../components/print/Print';
import type { IPlace } from '../types';
import { budgetMarks, errorMessage, formatDuration, hasRating, plainText, plural, sizedPhoto } from '../lib/format';

const MAPS_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';
const DEFAULT_CENTER = { lat: 22.5, lng: 79 }; // centre of India

const coords = (p: IPlace) => {
  const [lng, lat] = p.location?.coordinates || [];
  return typeof lat === 'number' && typeof lng === 'number' ? { lat, lng } : null;
};

const ExploreMap = () => {
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await PlaceService.getPlaces({ limit: 100 });
      setPlaces((res.places || []).filter((p) => coords(p)));
    } catch (err) {
      setError(errorMessage(err, 'Places could not be loaded.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return places;
    return places.filter(
      (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [places, term]);

  const selected = filtered.find((p) => p._id === selectedId) || null;

  const select = useCallback(
    (place: IPlace) => {
      setSelectedId(place._id);
      const c = coords(place);
      if (map && c) {
        map.panTo(c);
        if ((map.getZoom() || 5) < 12) map.setZoom(13);
      }
    },
    [map],
  );

  return (
    <div className="flex flex-col lg:h-[calc(100vh-var(--masthead-h))] lg:flex-row">
      {/* ─── List ─── */}
      <aside className="order-2 flex flex-col border-rule bg-paper lg:order-1 lg:w-[380px] lg:shrink-0 lg:border-r">
        <div className="border-b border-rule px-4 pb-4 pt-8 lg:pt-9">
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="font-display text-[2rem] leading-none text-iron">Map</h1>
            <span className="tabular text-[0.95rem] text-iron-2" aria-live="polite">
              {loading ? 'Loading…' : plural(filtered.length, 'place')}
            </span>
          </div>
          {!MAPS_KEY && (
            <p className="mt-2 text-sm text-iron-3">Places are plotted by their coordinates. The street map appears once a Google Maps key is set.</p>
          )}
          <div className="relative mt-4">
            <label htmlFor="map-search" className="sr-only">
              Filter places on the map
            </label>
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-iron-3" aria-hidden="true" />
            <input
              id="map-search"
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Filter by name, city or category"
              className="field pl-10"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {error ? (
            <div className="p-5">
              <p className="text-iron-2">{error}</p>
              <button type="button" onClick={load} className="btn-ink mt-3">
                Try again
              </button>
            </div>
          ) : loading ? (
            <ul className="flex flex-col gap-1 p-2" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex gap-3 p-2">
                  <div className="skeleton h-14 w-14 rounded-[3px]" />
                  <div className="flex flex-1 flex-col gap-2 pt-1">
                    <div className="skeleton h-4 w-3/4 rounded-[2px]" />
                    <div className="skeleton h-3 w-1/2 rounded-[2px]" />
                  </div>
                </li>
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            <p className="p-5 text-iron-2">No places match “{term}”.</p>
          ) : (
            <ul className="flex flex-col gap-1 p-2">
              {filtered.map((p) => {
                const active = p._id === selectedId;
                const thumb = sizedPhoto(p.photos?.[0], 160);
                return (
                  <li key={p._id}>
                    <button
                      type="button"
                      onClick={() => select(p)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-[3px] border-[1.5px] p-2 text-left transition-colors ${
                        active ? 'border-madder bg-madder-wash' : 'border-transparent hover:bg-cotton'
                      }`}
                    >
                      <span className="h-14 w-14 shrink-0 overflow-hidden rounded-[3px] bg-dye">
                        {thumb ? <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" /> : <PlaceArt name={p.name} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[1.15rem] leading-tight text-iron">{plainText(p.name)}</span>
                        <span className="mt-0.5 block truncate text-sm text-iron-2">
                          {p.city} · {p.category}
                        </span>
                        {/* The compact facts every map row carries: cost, stay, rating */}
                        <span className="tabular mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-iron">
                          <span>{budgetMarks(p.budgetRange)}</span>
                          <span aria-hidden="true" className="text-rule-strong">·</span>
                          <span>{formatDuration(p.suggestedDurationMinutes)}</span>
                          <span aria-hidden="true" className="text-rule-strong">·</span>
                          <span className="inline-flex items-center gap-0.5">
                            {hasRating(p) ? (
                              <>
                                {p.averageRating.toFixed(1)}
                                <Star size={12} className="fill-iron" aria-hidden="true" />
                              </>
                            ) : (
                              <span className="font-normal text-iron-3">New</span>
                            )}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* ─── Map ─── */}
      <section className="on-dye relative order-1 h-[52vh] min-h-[340px] flex-1 overflow-hidden bg-dye lg:order-2 lg:h-auto" aria-label="Map of places">
        {MAPS_KEY ? (
          <GoogleMapPane places={filtered} selected={selected} onSelect={select} onLoad={setMap} onClear={() => setSelectedId(null)} map={map} />
        ) : (
          <PlotPane places={filtered} selected={selected} onSelect={select} />
        )}
        {selected && !MAPS_KEY && (
          <div className="absolute right-4 top-8 hidden w-[360px] sm:block">
            <SelectedCard place={selected} />
          </div>
        )}
      </section>
      {selected && !MAPS_KEY && (
        <div className="order-1 border-b border-rule bg-cotton p-3 sm:hidden">
          <SelectedCard place={selected} />
        </div>
      )}
    </div>
  );
};

/* ─── Fallback: places plotted by coordinates (no map key needed) ───── */

const LABEL_PX = 15; // label size on screen, independent of how far the plot is scaled
const DOT_PX = 7;

function PlotPane({ places, selected, onSelect }: { places: IPlace[]; selected: IPlace | null; onSelect: (p: IPlace) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (!box.w || !box.h || places.length === 0) return null;
    const pts = places.map((p) => ({ p, c: coords(p)! }));
    const lats = pts.map((x) => x.c.lat);
    const lngs = pts.map((x) => x.c.lng);
    const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const k = Math.cos((midLat * Math.PI) / 180); // shrink longitude so shapes stay honest
    const minX = Math.min(...lngs) * k;
    const maxX = Math.max(...lngs) * k;
    const minY = -Math.max(...lats);
    const maxY = -Math.min(...lats);
    const dataW = Math.max(maxX - minX, 0.5);
    const dataH = Math.max(maxY - minY, 0.5);
    // Fit the data into the pane in screen pixels, leaving room for labels
    const padX = 90;
    const padTop = 48;
    const padBottom = 40;
    const scale = Math.min((box.w - padX * 2) / dataW, (box.h - padTop - padBottom) / dataH);
    const offX = (box.w - dataW * scale) / 2;
    const offY = padTop + (box.h - padTop - padBottom - dataH * scale) / 2;
    const toXY = (c: { lat: number; lng: number }) => ({ x: offX + (c.lng * k - minX) * scale, y: offY + (-c.lat - minY) * scale });
    const dots = pts.map(({ p, c }) => ({ p, ...toXY(c) }));

    // Nudge near-coincident places apart (a few pixels) so every dot stays visible and tappable
    const MIN_GAP = DOT_PX * 2 + 8;
    for (let pass = 0; pass < 24; pass++) {
      let moved = false;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d = Math.hypot(dx, dy);
          if (d >= MIN_GAP) continue;
          if (d < 0.01) [dx, dy, d] = [1, 0, 1];
          const push = (MIN_GAP - d) / 2;
          a.x -= (dx / d) * push;
          a.y -= (dy / d) * push;
          b.x += (dx / d) * push;
          b.y += (dy / d) * push;
          moved = true;
        }
      }
      if (!moved) break;
    }

    // One label per city; cities too close to label apart share one label ("Alappuzha · Kumarakom")
    type Rect = { x1: number; y1: number; x2: number; y2: number };
    type Group = { names: string[]; box: Rect };
    const groups: Group[] = [];
    const MERGE_PX = 46;
    dots.forEach(({ p, x, y }) => {
      const name = p.city.trim();
      const near = (g: Group) =>
        g.names.includes(name) ||
        (x > g.box.x1 - MERGE_PX && x < g.box.x2 + MERGE_PX && y > g.box.y1 - MERGE_PX / 2 && y < g.box.y2 + MERGE_PX / 2);
      const g = groups.find(near);
      if (!g) {
        groups.push({ names: [name], box: { x1: x, y1: y, x2: x, y2: y } });
        return;
      }
      if (!g.names.includes(name)) g.names.push(name);
      g.box = { x1: Math.min(g.box.x1, x), y1: Math.min(g.box.y1, y), x2: Math.max(g.box.x2, x), y2: Math.max(g.box.y2, y) };
    });

    const overlap = (a: Rect, b: Rect) =>
      Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1)) * Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
    // Dots reserve the selection ring's footprint, so a label never sits under a ring
    const RING = DOT_PX + 9;
    const taken: Rect[] = dots.map(({ x, y }) => ({ x1: x - RING, y1: y - RING, x2: x + RING, y2: y + RING }));
    const labels: { text: string; x: number; y: number; anchor: 'start' | 'middle' | 'end' }[] = [];
    groups
      .sort((a, b) => a.box.y1 - b.box.y1)
      .forEach(({ names, box: b }) => {
        const text = names.join(' · ');
        const w = text.length * LABEL_PX * 0.58;
        const h = LABEL_PX;
        const g = RING + 2;
        const cx = (b.x1 + b.x2) / 2;
        const cy = (b.y1 + b.y2) / 2;
        const candidates: { x: number; y: number; anchor: 'start' | 'middle' | 'end'; r: Rect }[] = [
          { x: b.x2 + g, y: cy + h * 0.35, anchor: 'start', r: { x1: b.x2 + g, y1: cy - h * 0.65, x2: b.x2 + g + w, y2: cy + h * 0.35 } },
          { x: b.x1 - g, y: cy + h * 0.35, anchor: 'end', r: { x1: b.x1 - g - w, y1: cy - h * 0.65, x2: b.x1 - g, y2: cy + h * 0.35 } },
          { x: cx, y: b.y2 + g + h * 0.8, anchor: 'middle', r: { x1: cx - w / 2, y1: b.y2 + g, x2: cx + w / 2, y2: b.y2 + g + h } },
          { x: cx, y: b.y1 - g - h * 0.2, anchor: 'middle', r: { x1: cx - w / 2, y1: b.y1 - g - h, x2: cx + w / 2, y2: b.y1 - g } },
          { x: b.x2 + g, y: b.y1 - g * 0.4, anchor: 'start', r: { x1: b.x2 + g, y1: b.y1 - g * 0.4 - h, x2: b.x2 + g + w, y2: b.y1 - g * 0.4 } },
          { x: b.x1 - g, y: b.y2 + g * 0.4 + h * 0.8, anchor: 'end', r: { x1: b.x1 - g - w, y1: b.y2 + g * 0.4, x2: b.x1 - g, y2: b.y2 + g * 0.4 + h } },
        ];
        const fits = (r: Rect) => r.x1 >= 4 && r.x2 <= box.w - 4 && r.y1 >= 4 && r.y2 <= box.h - 4;
        const cost = (r: Rect) => taken.reduce((sum, t) => sum + overlap(t, r), 0);
        const inside = candidates.filter((c) => fits(c.r));
        // First clear spot inside the pane; otherwise whichever spot covers the least
        const pick = inside.find((c) => cost(c.r) === 0) || [...(inside.length ? inside : candidates)].sort((p, q) => cost(p.r) - cost(q.r))[0];
        taken.push(pick.r);
        labels.push({ text, x: pick.x, y: pick.y, anchor: pick.anchor });
      });
    return { dots, labels };
  }, [places, box]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      <LatticeField opacity={0.08} />
      {places.length === 0 ? (
        <div className="relative flex h-full items-center justify-center text-resist-dim">No places to plot.</div>
      ) : layout ? (
        <svg width={box.w} height={box.h} className="relative block" role="group" aria-label="Places plotted by location">
          {layout.labels.map((l) => (
            <text
              key={l.text}
              x={l.x}
              y={l.y}
              textAnchor={l.anchor}
              fill="var(--color-resist)"
              fontSize={LABEL_PX}
              fontFamily="var(--font-display)"
              paintOrder="stroke"
              stroke="var(--color-dye)"
              strokeWidth={4}
              aria-hidden="true"
            >
              {l.text}
            </text>
          ))}
          {layout.dots.map(({ p, x, y }) => {
            const active = selected?._id === p._id;
            return (
              <g
                key={p._id}
                role="button"
                tabIndex={0}
                aria-label={`${plainText(p.name)}, ${p.city}`}
                aria-pressed={active}
                onClick={() => onSelect(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(p);
                  }
                }}
                className="cursor-pointer"
              >
                <circle cx={x} cy={y} r={20} fill="transparent" />
                {active && <circle cx={x} cy={y} r={DOT_PX + 7} fill="none" stroke="var(--color-turmeric)" strokeWidth={3} />}
                <circle cx={x} cy={y} r={active ? DOT_PX + 2 : DOT_PX} fill="var(--color-madder)" stroke="var(--color-resist)" strokeWidth={2.5} />
              </g>
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}

function SelectedCard({ place }: { place: IPlace }) {
  const thumb = sizedPhoto(place.photos?.[0], 480);
  return (
    <div className="rounded-[3px] border-2 border-iron bg-paper text-iron shadow-[var(--shadow-lift)]">
      <div className="flex gap-3 p-3">
        <span className="h-20 w-20 shrink-0 overflow-hidden rounded-[3px] bg-dye">
          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <PlaceArt name={place.name} />}
        </span>
        <div className="min-w-0">
          <p className="font-display text-[1.3rem] leading-tight">{plainText(place.name)}</p>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-iron-2">
            <MapPin size={13} aria-hidden="true" /> {place.city} · {place.category}
          </p>
          <Link to={`/place/${place._id}`} className="ink-link mt-2 inline-flex items-center gap-1 text-[0.95rem]">
            Open place <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="px-3 pb-3">
        <FactBlock place={place} />
      </div>
    </div>
  );
}

/* ─── With a key: the Google map, inked to match ─────────────────────── */

function GoogleMapPane({
  places,
  selected,
  onSelect,
  onLoad,
  onClear,
  map,
}: {
  places: IPlace[];
  selected: IPlace | null;
  onSelect: (p: IPlace) => void;
  onLoad: (m: google.maps.Map) => void;
  onClear: () => void;
  map: google.maps.Map | null;
}) {
  const { isLoaded, loadError } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: MAPS_KEY });
  const [locating, setLocating] = useState(false);

  const locate = () => {
    if (!navigator.geolocation || !map) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        map.setZoom(12);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  };

  if (loadError) {
    return <div className="flex h-full items-center justify-center p-6 text-center text-resist-dim">The map couldn't load. Check the Google Maps key.</div>;
  }
  if (!isLoaded) {
    return <div className="flex h-full items-center justify-center text-resist-dim">Loading map…</div>;
  }

  const sel = selected ? coords(selected) : null;
  return (
    <>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={DEFAULT_CENTER}
        zoom={5}
        onLoad={onLoad}
        onClick={onClear}
        options={{ styles: MAP_STYLES, disableDefaultUI: true, clickableIcons: false }}
      >
        {places.map((p) => {
          const c = coords(p)!;
          const active = selected?._id === p._id;
          return (
            <Marker
              key={p._id}
              position={c}
              title={plainText(p.name)}
              onClick={() => onSelect(p)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#a3262a',
                fillOpacity: 1,
                strokeColor: active ? '#d9a11e' : '#f2f3f6',
                strokeWeight: active ? 4 : 2.5,
                scale: active ? 10 : 7,
              }}
            />
          );
        })}
        {selected && sel && (
          <InfoWindow position={sel} onCloseClick={onClear}>
            <div className="max-w-[220px] font-sans text-iron">
              <p className="font-display text-lg leading-tight">{plainText(selected.name)}</p>
              <p className="text-sm text-iron-2">{selected.city}</p>
              <Link to={`/place/${selected._id}`} className="ink-link mt-1 inline-block text-sm">
                Open place
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <div className="absolute right-4 top-6 flex flex-col gap-1.5">
        <MapButton label="Zoom in" onClick={() => map?.setZoom((map.getZoom() || 5) + 1)}>
          <Plus size={18} aria-hidden="true" />
        </MapButton>
        <MapButton label="Zoom out" onClick={() => map?.setZoom((map.getZoom() || 5) - 1)}>
          <Minus size={18} aria-hidden="true" />
        </MapButton>
        <MapButton label={locating ? 'Finding you' : 'Show my location'} onClick={locate}>
          <LocateFixed size={18} aria-hidden="true" />
        </MapButton>
      </div>
    </>
  );
}

function MapButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-[1.5px] border-iron bg-paper text-iron hover:bg-cotton"
    >
      {children}
    </button>
  );
}

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#eff1f2' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4b4640' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#eff1f2' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#fafbfc' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4d7d9' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c4c8dc' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#868b91' }] },
];

export default ExploreMap;
