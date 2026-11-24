import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisitService } from '../../services/VisitService';
import { EventVisibility } from '../../types';
import { errorMessage } from '../../lib/format';

interface ScheduleVisitProps {
  placeId: string;
  placeName: string;
  onClose: () => void;
  onCreated?: () => void;
}

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/**
 * ScheduleVisit — dialog for planning a group visit (VisitService.createEvent).
 */
const ScheduleVisit = ({ placeId, placeName, onClose, onCreated }: ScheduleVisitProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const firstField = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: `Visit to ${placeName}`,
    description: '',
    scheduledDate: '',
    time: '10:00',
    maxParticipants: 8,
    visibility: EventVisibility.OPEN as 'open' | 'invite-only',
  });

  // Keep the latest onClose without re-running the mount effect (which would steal focus)
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    firstField.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.scheduledDate) return setError('Pick a date for the visit.');
    if (formData.maxParticipants < 2) return setError('A group visit needs room for at least 2 people.');
    setLoading(true);
    setError('');
    try {
      await VisitService.createEvent({ ...formData, placeId });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(errorMessage(err, 'The visit could not be planned. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-dye-deep/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-title"
        initial={{ y: 24, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[3px] border-2 border-iron bg-paper p-6 shadow-[var(--shadow-lift)] sm:rounded-[3px] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="schedule-title" className="font-display text-[1.8rem] leading-tight text-iron">
              Plan a group visit
            </h2>
            <p className="mt-1 text-iron-2">{placeName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-1 inline-flex h-11 w-11 items-center justify-center rounded-[3px] text-iron-2 hover:bg-cotton hover:text-iron"
            aria-label="Close"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5" noValidate>
          <div>
            <label htmlFor="visit-title" className="field-label">
              Name of the visit
            </label>
            <input
              ref={firstField}
              id="visit-title"
              type="text"
              required
              className="field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="visit-plan" className="field-label">
              The plan <span className="font-normal text-iron-3">(optional)</span>
            </label>
            <textarea
              id="visit-plan"
              rows={3}
              className="field"
              placeholder="Where to meet, what to bring, what happens after"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="visit-date" className="field-label">
                Date
              </label>
              <input
                id="visit-date"
                type="date"
                required
                min={todayISO()}
                className="field"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="visit-time" className="field-label">
                Meeting time
              </label>
              <input
                id="visit-time"
                type="time"
                required
                className="field"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="visit-max" className="field-label">
                Spots
              </label>
              <input
                id="visit-max"
                type="number"
                min={2}
                max={100}
                className="field tabular"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div>
              <label htmlFor="visit-visibility" className="field-label">
                Who can join
              </label>
              <select
                id="visit-visibility"
                className="field"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'open' | 'invite-only' })}
              >
                <option value="open">Anyone</option>
                <option value="invite-only">Invite only</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-[3px] bg-madder-wash p-3 font-semibold text-madder-deep" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-line">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-ink">
              {loading ? 'Planning…' : 'Plan visit'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleVisit;
