import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Plus, X, Image as ImageIcon, MapPin, Tag, Clock, DollarSign, FileText, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceService } from '../services/PlaceService';
import { MediaService } from '../services/MediaService';
import { PlaceCategory, BudgetRange } from '../types';

const sections = [
  { id: 'basics', label: 'Basics', icon: <FileText size={14} /> },
  { id: 'location', label: 'Location', icon: <MapPin size={14} /> },
  { id: 'photos', label: 'Photos', icon: <ImageIcon size={14} /> },
  { id: 'details', label: 'Details', icon: <Tag size={14} /> },
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#fff', border: '1.5px solid #e5e7eb',
  borderRadius: 12, padding: '12px 16px', fontSize: 14, fontWeight: 500,
  outline: 'none', color: '#0f172a', transition: 'all 0.2s',
  fontFamily: 'Inter, sans-serif',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8,
};

const SectionCard = ({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
  <div
    {...props}
    style={{
      background: '#fff', borderRadius: 20, border: '1.5px solid #f1f5f9',
      padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 20,
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
      transition: 'box-shadow 0.3s',
      ...style,
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px -4px rgba(0,0,0,0.06)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px 0 rgba(0,0,0,0.03)'; }}
  >
    {children}
  </div>
);

const AddPlace = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('basics');
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    category: PlaceCategory.NATURE,
    budgetRange: BudgetRange.MODERATE,
    suggestedDurationMinutes: 60,
    tags: '',
    latitude: '',
    longitude: ''
  });

  // Scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        setError('Only image files are allowed.');
        return;
      }

      const largeFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB limit
      if (largeFiles.length > 0) {
        setError('Images must be smaller than 5MB.');
        return;
      }

      setError('');
      setFiles([...files, ...selectedFiles]);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please upload at least one photo.');
      return;
    }

    // Auto-assigning default coordinates since precise manual entry is removed
    const lat = 18.5204; // Default latitude (e.g., Pune)
    const lng = 73.8567; // Default longitude

    setLoading(true);
    setError('');
    
    try {
      const placeData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        latitude: lat,
        longitude: lng,
        suggestedDurationMinutes: Number(formData.suggestedDurationMinutes) || 60
      };

      const placeRes = await PlaceService.createPlace(placeData);
      const placeId = (placeRes as any)._id;

      if (files.length > 0) {
        // Sequentially upload photos
        for (const file of files) {
          await MediaService.upload(file, placeId, 'photo');
        }
      }

      navigate(`/place/${placeId}`);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to publish place');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      {/* ─── Sticky Progress Bar ─── */}
      <div style={{
        position: 'sticky', top: 'var(--header-height)', zIndex: 40,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <div style={{
          maxWidth: 720, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          <Link to="/" className="no-underline" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, color: '#94a3b8', transition: 'color 0.2s',
          }}>
            <ChevronLeft size={16} /> Cancel
          </Link>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 4 }} className="hidden sm:flex">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  ...(activeSection === s.id
                    ? { background: '#0f172a', color: '#fff' }
                    : { background: 'transparent', color: '#94a3b8' }
                  ),
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <button
            form="add-place-form"
            type="submit"
            disabled={loading}
            style={{
              fontSize: 13, fontWeight: 700, background: '#0f172a', color: '#fff',
              padding: '8px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
              opacity: loading ? 0.4 : 1, transition: 'all 0.2s',
            }}
          >
            {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 140px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  marginBottom: 28, padding: '14px 18px', background: '#fef2f2',
                  border: '1px solid #fecaca', color: '#dc2626', borderRadius: 14,
                  fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <X size={15} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page header */}
          <div style={{ marginBottom: 36 }}>
            <h1 className="font-poppins" style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Share a new place
            </h1>
            <p style={{ fontSize: 15, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
              Help the community discover incredible experiences.
            </p>
          </div>

          <form id="add-place-form" ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ─── Section 1: Basics ─── */}
            <SectionCard id="basics">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: '#eef2ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1',
                }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="font-poppins" style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>The Basics</h2>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Name, description & category</p>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Place Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text" required style={inputStyle}
                  placeholder="e.g. Hidden Rooftop Cafe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Description <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea
                  required rows={5}
                  style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.7 }}
                  placeholder="What makes this place special? Share your honest experience..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <div style={{ position: 'relative' }}>
                    <Compass size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }} />
                    <select
                      style={{ ...inputStyle, paddingLeft: 40, cursor: 'pointer', appearance: 'none' as const }}
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as any})}
                    >
                      {Object.values(PlaceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Budget Range</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }} />
                    <select
                      style={{ ...inputStyle, paddingLeft: 40, cursor: 'pointer', appearance: 'none' as const }}
                      value={formData.budgetRange}
                      onChange={e => setFormData({...formData, budgetRange: e.target.value as any})}
                    >
                      {Object.values(BudgetRange).map(br => <option key={br} value={br}>{br}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ─── Section 2: Location ─── */}
            <SectionCard id="location">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: '#f0fdf4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981',
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="font-poppins" style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Location</h2>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, margin: 0 }}>City, address & coordinates</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>City <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text" required style={inputStyle}
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text" required style={inputStyle}
                    placeholder="Full street address"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>


            </SectionCard>

            {/* ─── Section 3: Photos ─── */}
            <SectionCard id="photos">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: '#fffbeb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b',
                }}>
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h2 className="font-poppins" style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Photos</h2>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Upload high-quality images</p>
                </div>
              </div>

              {/* Upload area */}
              <div style={{
                position: 'relative', border: '2px dashed #e2e8f0', background: '#fafbfc',
                borderRadius: 16, padding: '40px 24px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                <input
                  type="file" multiple accept="image/*"
                  onChange={handleFileChange}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 52, height: 52, background: '#fff', borderRadius: 14,
                    boxShadow: '0 2px 8px -2px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                  }}
                >
                  <ImageIcon size={22} style={{ color: '#94a3b8' }} />
                </motion.div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 2 }}>Drop photos here</p>
                <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>or click to browse</p>
              </div>

              {/* Image previews */}
              <AnimatePresence>
                {previews.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}
                  >
                    {previews.map((url, i) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        style={{
                          position: 'relative', aspectRatio: '1', borderRadius: 14,
                          overflow: 'hidden', border: '1px solid #f1f5f9',
                        }}
                        className="group"
                      >
                        <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          style={{
                            position: 'absolute', top: 6, right: 6, padding: 5,
                            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                            borderRadius: 8, color: '#fff', border: 'none', cursor: 'pointer',
                            opacity: 0, transition: 'opacity 0.2s',
                          }}
                          className="group-hover:!opacity-100"
                        >
                          <X size={13} />
                        </button>
                      </motion.div>
                    ))}
                    {/* Add more */}
                    <div style={{
                      aspectRatio: '1', borderRadius: 14, border: '2px dashed #e2e8f0',
                      background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#cbd5e1', cursor: 'pointer', position: 'relative',
                    }}>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                      <Plus size={22} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>

            {/* ─── Section 4: Details ─── */}
            <SectionCard id="details">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: '#f5f3ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6',
                }}>
                  <Tag size={18} />
                </div>
                <div>
                  <h2 className="font-poppins" style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Discoverability</h2>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Tags & visit duration</p>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tags (Keywords)</label>
                <input
                  type="text" style={inputStyle}
                  placeholder="e.g. scenic, quiet, pet-friendly..."
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 500, marginTop: 6 }}>Separate keywords with commas</p>
              </div>

              <div>
                <label style={labelStyle}>Suggested Visit Duration</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }} />
                  <input
                    type="number" style={{ ...inputStyle, paddingLeft: 40 }}
                    placeholder="60"
                    value={formData.suggestedDurationMinutes}
                    onChange={e => setFormData({...formData, suggestedDurationMinutes: parseInt(e.target.value)})}
                    onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>minutes</span>
                </div>
              </div>
            </SectionCard>
          </form>
        </motion.div>
      </div>

      {/* ─── Sticky Bottom Bar ─── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid #f1f5f9',
      }}>
        <div style={{
          maxWidth: 720, margin: '0 auto', padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <MapPin size={14} style={{ color: '#94a3b8' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {formData.name || 'Untitled place'}
            </span>
          </div>
          <button
            form="add-place-form"
            type="submit"
            disabled={loading}
            style={{
              background: '#0f172a', color: '#fff', padding: '10px 28px',
              borderRadius: 12, fontWeight: 700, fontSize: 13, border: 'none',
              cursor: 'pointer', opacity: loading ? 0.4 : 1, flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Saving...' : 'Publish Place'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlace;
