import { useState } from 'react';
import { Calendar, Clock, Users, Globe, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisitService } from '../../services/VisitService';
import { EventVisibility } from '../../types';

interface ScheduleVisitProps {
  placeId: string;
  placeName: string;
  onClose: () => void;
  onCreated?: () => void;
}

/**
 * ScheduleVisit — Modal component for creating group visit events.
 * Connected to VisitService.createEvent() API.
 */
const ScheduleVisit = ({ placeId, placeName, onClose, onCreated }: ScheduleVisitProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: `Visit to ${placeName}`,
    description: '',
    scheduledDate: '',
    time: '10:00',
    maxParticipants: 10,
    visibility: EventVisibility.OPEN as 'open' | 'invite-only',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await VisitService.createEvent({ ...formData, placeId });
      onCreated?.();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to schedule visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-lg p-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-poppins font-bold">Schedule Group Visit</h2>
            <p className="text-sm text-[var(--text-muted)] font-600 mt-1">{placeName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--background-subtle)] transition-colors">
            <X size={20} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 px-5 py-3 text-sm font-bold text-red-700 border border-red-100">
            <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">
              Event Title
            </label>
            <input
              type="text"
              required
              className="input-field !pl-4 shadow-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full bg-white border border-[var(--border)] rounded-2xl py-3 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all resize-none shadow-sm text-sm"
              placeholder="What's the plan?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1 flex items-center gap-1.5">
                <Calendar size={12} className="text-[var(--primary)]" /> Date
              </label>
              <input
                type="date"
                required
                className="input-field !pl-4 shadow-sm text-sm"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1 flex items-center gap-1.5">
                <Clock size={12} className="text-[var(--secondary)]" /> Time
              </label>
              <input
                type="time"
                required
                className="input-field !pl-4 shadow-sm text-sm"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1 flex items-center gap-1.5">
                <Users size={12} className="text-orange-500" /> Max People
              </label>
              <input
                type="number"
                min={2}
                max={100}
                className="input-field !pl-4 shadow-sm text-sm"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1 flex items-center gap-1.5">
                <Globe size={12} className="text-[var(--primary)]" /> Visibility
              </label>
              <select
                className="w-full bg-white border border-[var(--border)] rounded-2xl py-3 px-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all appearance-none cursor-pointer shadow-sm text-sm font-600"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'open' | 'invite-only' })}
              >
                <option value="open">Open to All</option>
                <option value="invite-only">Invite Only</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center py-4 text-base shadow-teal mt-4 rounded-[20px]"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <div className="flex items-center gap-2">
                <Save size={18} /> Schedule Visit
              </div>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleVisit;
