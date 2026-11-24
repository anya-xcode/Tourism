import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImagePlus, LocateFixed, X } from 'lucide-react';
import { PlaceService } from '../services/PlaceService';
import { MediaService } from '../services/MediaService';
import { BudgetRange, PlaceCategory } from '../types';
import { InkChip } from '../components/print/InkChip';
import { FactBlock } from '../components/print/FactBlock';
import { FringeBand, LatticeBand, LatticeField } from '../components/print/Print';
import { errorMessage } from '../lib/format';

type Errors = Partial<Record<'name' | 'description' | 'city' | 'address' | 'coords' | 'photos', string>>;

const isImageUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

const AddPlace = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [photoLinks, setPhotoLinks] = useState('');
  const [locating, setLocating] = useState(false);
  const previewsRef = useRef<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    category: PlaceCategory.HERITAGE as PlaceCategory,
    budgetRange: BudgetRange.FREE as BudgetRange,
    operatingHours: '',
    suggestedDurationMinutes: 60,
    tags: '',
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  // Release object URLs on unmount
  useEffect(() => {
    previewsRef.current = files.map((f) => f.preview);
  }, [files]);
  useEffect(() => () => previewsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles((cur) => [...cur, ...picked.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    e.target.value = '';
  };

  const removeFile = (i: number) =>
    setFiles((cur) => {
      URL.revokeObjectURL(cur[i].preview);
      return cur.filter((_, idx) => idx !== i);
    });

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setErrors((e) => ({ ...e, coords: 'Your browser does not share location. Enter the coordinates instead.' }));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(5), longitude: pos.coords.longitude.toFixed(5) }));
        setErrors((e) => ({ ...e, coords: undefined }));
        setLocating(false);
      },
      () => {
        setErrors((e) => ({ ...e, coords: 'Location access was blocked. Enter the coordinates instead.' }));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const links = photoLinks
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Give the place a name.';
    if (form.description.trim().length < 20) e.description = 'Write at least a sentence or two (20+ characters).';
    if (!form.city.trim()) e.city = 'Which city or town is it in?';
    if (!form.address.trim()) e.address = 'Add an address or landmark people can find.';
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (form.latitude === '' || form.longitude === '' || Number.isNaN(lat) || Number.isNaN(lng)) {
      e.coords = 'Add latitude and longitude, or use your current location.';
    } else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      e.coords = 'Latitude must be between -90 and 90, longitude between -180 and 180.';
    }
    if (links.some((l) => !isImageUrl(l))) e.photos = 'Photo links must start with http:// or https://.';
    else if (files.length === 0 && links.length === 0) e.photos = 'Add at least one photo — upload it or paste a link.';
    return e;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      setFormError('A few details need fixing before this place can be published.');
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const created = await PlaceService.createPlace({
        name: form.name.trim(),
        description: form.description.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        category: form.category,
        budgetRange: form.budgetRange,
        operatingHours: form.operatingHours.trim() || undefined,
        suggestedDurationMinutes: Number(form.suggestedDurationMinutes) || 60,
        tags: form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
        photos: links,
      });

      let failed = 0;
      for (const { file } of files) {
        try {
          await MediaService.upload(file, created._id, 'photo');
        } catch {
          failed += 1;
        }
      }

      navigate(`/place/${created._id}`, {
        state: failed
          ? {
              uploadNotice: `Your place is published, but ${failed === 1 ? '1 photo' : `${failed} photos`} could not be uploaded. Photo uploads need the server's Cloudinary settings; pasting image links works without them.`,
            }
          : undefined,
      });
    } catch (err) {
      setFormError(errorMessage(err, 'The place could not be published. Try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="on-dye relative bg-dye text-resist">
        <LatticeField opacity={0.1} />
        {/* The ornate end-band the cloth opens with */}
        <LatticeBand className="relative" />
        <div className="page-wrap relative pb-10 pt-8">
          <h1 className="font-display text-[2.6rem] leading-none md:text-[3.4rem]">Share a place</h1>
          <p className="mt-3 max-w-[56ch] text-[1.1rem] text-resist-dim">
            Somewhere you'd send a friend. Fill in the facts honestly — they're printed on the place for everyone who finds it.
          </p>
        </div>
        <FringeBand edge="bottom" className="absolute inset-x-0 top-full" />
      </section>

      <form onSubmit={handleSubmit} noValidate className="page-wrap grid gap-12 pb-28 pt-14 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col">
          {formError && (
            <p role="alert" className="mb-8 rounded-[3px] border-[1.5px] border-madder bg-madder-wash p-4 font-semibold text-madder-deep">
              {formError}
            </p>
          )}

          <Pass title="The place" first>
            <Field id="name" label="Name" error={errors.name}>
              <input id="name" className="field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Sanjay Van sunrise trail" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
            </Field>
            <Field id="description" label="What makes it worth the trip?" error={errors.description}>
              <textarea
                id="description"
                className="field"
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="When to go, what to do there, what a first-timer should know."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
            </Field>
            <fieldset>
              <legend className="field-label">Category</legend>
              <div className="flex flex-wrap gap-2">
                {Object.values(PlaceCategory).map((c) => (
                  <InkChip key={c} active={form.category === c} onClick={() => set('category', c)}>
                    {c}
                  </InkChip>
                ))}
              </div>
            </fieldset>
          </Pass>

          <Pass title="Where it is">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="city" label="City or town" error={errors.city}>
                <input id="city" className="field" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="e.g. Pune" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? 'city-error' : undefined} />
              </Field>
              <Field id="address" label="Address or landmark" error={errors.address}>
                <input id="address" className="field" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, area, or nearest landmark" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'address-error' : undefined} />
              </Field>
            </div>
            <div>
              <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <Field id="lat" label="Latitude">
                  <input id="lat" inputMode="decimal" className="field tabular" value={form.latitude} onChange={(e) => set('latitude', e.target.value)} placeholder="18.5204" aria-invalid={Boolean(errors.coords)} aria-describedby="coords-help" />
                </Field>
                <Field id="lng" label="Longitude">
                  <input id="lng" inputMode="decimal" className="field tabular" value={form.longitude} onChange={(e) => set('longitude', e.target.value)} placeholder="73.8567" aria-invalid={Boolean(errors.coords)} aria-describedby="coords-help" />
                </Field>
                <button type="button" onClick={useMyLocation} disabled={locating} className="btn-line h-12">
                  <LocateFixed size={16} aria-hidden="true" />
                  {locating ? 'Finding you…' : "I'm here now"}
                </button>
              </div>
              <p id="coords-help" className={`mt-2 text-[0.95rem] ${errors.coords ? 'font-semibold text-madder' : 'text-iron-3'}`}>
                {errors.coords || 'Not there now? In Google Maps, right-click the spot and click the numbers to copy them.'}
              </p>
            </div>
          </Pass>

          <Pass title="Photos">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {files.map((f, i) => (
                <div key={f.preview} className="group relative aspect-square overflow-hidden rounded-[3px] border border-rule bg-dye">
                  <img src={f.preview} alt={`Selected photo ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-1.5 top-1.5 inline-flex h-9 w-9 items-center justify-center rounded-[3px] bg-paper text-iron shadow-[var(--shadow-lift)] hover:bg-madder hover:text-resist"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-[3px] border-[1.5px] border-dashed border-rule-strong bg-paper text-center text-iron-2 transition-colors focus-within:border-madder hover:border-iron hover:text-iron">
                <ImagePlus size={24} aria-hidden="true" />
                <span className="px-2 text-[0.95rem] font-semibold">Upload photos</span>
                <input type="file" accept="image/*" multiple onChange={addFiles} className="sr-only" />
              </label>
            </div>
            <Field id="photo-links" label="Or paste image links" error={errors.photos} hint="One per line. Handy when uploads aren't set up.">
              <textarea
                id="photo-links"
                className="field min-h-[88px]"
                rows={2}
                value={photoLinks}
                onChange={(e) => setPhotoLinks(e.target.value)}
                placeholder="https://…"
                aria-invalid={Boolean(errors.photos)}
                aria-describedby={errors.photos ? 'photo-links-error' : 'photo-links-hint'}
              />
            </Field>
          </Pass>

          <Pass title="The facts">
            <fieldset>
              <legend className="field-label">Cost</legend>
              <div className="flex flex-wrap gap-2">
                {Object.values(BudgetRange).map((b) => (
                  <InkChip key={b} active={form.budgetRange === b} onClick={() => set('budgetRange', b)}>
                    {b}
                  </InkChip>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="hours" label="Opening hours" hint="Include closed days if any.">
                <input id="hours" className="field" value={form.operatingHours} onChange={(e) => set('operatingHours', e.target.value)} placeholder="9:00 AM – 6:00 PM · closed Mondays" aria-describedby="hours-hint" />
              </Field>
              <Field id="duration" label="How long to stay (minutes)">
                <input
                  id="duration"
                  type="number"
                  min={5}
                  step={5}
                  className="field tabular"
                  value={form.suggestedDurationMinutes}
                  onChange={(e) => set('suggestedDurationMinutes', parseInt(e.target.value, 10) || 0)}
                />
              </Field>
            </div>
            <Field id="tags" label="Tags" hint="Comma-separated, e.g. sunrise, quiet, street-food">
              <input id="tags" className="field" value={form.tags} onChange={(e) => set('tags', e.target.value)} aria-describedby="tags-hint" />
            </Field>
          </Pass>
        </div>

        {/* Live proof: the block this place will be printed with */}
        <aside className="lg:sticky lg:top-[calc(var(--masthead-h)+32px)] lg:self-start">
          <p className="font-display text-[1.4rem] leading-tight text-iron">{form.name.trim() || 'Your place'}</p>
          <p className="mb-3 text-[0.95rem] text-iron-2">{form.city.trim() || 'City'} · {form.category}</p>
          <FactBlock
            place={{
              budgetRange: form.budgetRange,
              operatingHours: form.operatingHours,
              suggestedDurationMinutes: form.suggestedDurationMinutes,
              averageRating: 0,
              totalReviews: 0,
            }}
          />
          <p className="mt-3 text-sm text-iron-3">This is the block your place is printed with. The rating fills in as people review it.</p>
          <div className="mt-6 hidden flex-col gap-2 lg:flex">
            <button type="submit" disabled={submitting} className="btn-ink w-full">
              {submitting ? 'Publishing…' : 'Publish place'}
            </button>
            <Link to="/" className="btn-line w-full">
              Cancel
            </Link>
          </div>
        </aside>

        {/* Mobile action bar */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 p-3 backdrop-blur-sm lg:hidden">
          <button type="submit" disabled={submitting} className="btn-ink w-full">
            {submitting ? 'Publishing…' : 'Publish place'}
          </button>
        </div>
      </form>
    </>
  );
};

function Pass({ title, children, first = false }: { title: string; children: ReactNode; first?: boolean }) {
  return (
    <section className={`flex flex-col gap-6 ${first ? '' : 'mt-12 border-t-2 border-iron pt-10'}`}>
      <h2 className="font-display text-[1.9rem] leading-none text-iron">{title}</h2>
      {children}
    </section>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.95rem] font-semibold text-madder">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.95rem] text-iron-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default AddPlace;
