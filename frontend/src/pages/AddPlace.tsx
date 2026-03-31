import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, MapPin, Tag, Clock, Save, X, Plus, Info, ChevronLeft, Map as MapIcon, Image as ImageIcon, Award } from 'lucide-react';
import api from '../services/api';
import { PlaceCategory, BudgetRange } from '../types';

const AddPlace = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
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
    setLoading(true);
    setError('');

    try {
      const placeRes = await api.post('/places', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });

      const placeId = placeRes.data._id;

      if (files.length > 0) {
        for (const file of files) {
          const uploadData = new FormData();
          uploadData.append('file', file);
          uploadData.append('placeId', placeId);
          uploadData.append('type', 'image');
          await api.post('/media', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      navigate(`/place/${placeId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add place');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-subtle min-h-screen pb-20">
      <div className="bg-white border-b border-[var(--border)] py-8 mb-10 shadow-sm">
        <div className="container">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-6">
            <ChevronLeft size={16} /> Back to Explorer
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[var(--primary-soft)] rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-sm">
                <Plus size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-poppins font-bold">Share a New Gem</h1>
                <p className="text-[var(--text-muted)] font-medium">Contribute to the collective travel knowledge</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => navigate(-1)} className="btn btn-outline px-6 rounded-xl">Discard Changes</button>
               <button form="add-place-form" type="submit" disabled={loading} className="btn btn-primary px-8 rounded-xl shadow-lg shadow-[var(--primary-glow)]">
                 {loading ? 'Publishing...' : 'Publish Experience'} <Save size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {error && (
            <div className="max-w-5xl mx-auto p-4 mb-8 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold flex items-center gap-3 animate-fade-in text-sm">
                <X size={18} className="text-red-500" /> {error}
            </div>
        )}

        <form id="add-place-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="card p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--primary)] opacity-80" />
              <h3 className="text-xl mb-8 flex items-center gap-3">
                <Info size={22} className="text-[var(--primary)]" /> Basic Information
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">Place Title</label>
                  <input 
                    type="text" required
                    className="input-field !pl-4 shadow-sm"
                    placeholder="e.g. Secret Rooftop Garden"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">Detailed Description</label>
                  <textarea 
                    required rows={5}
                    className="w-full bg-white border border-[var(--border)] rounded-2xl py-4 px-5 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all resize-none shadow-sm placeholder:text-[var(--text-light)]"
                    placeholder="Tell the community what makes this spot special. The vibe, the view, the best time to visit..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">Category</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-[var(--border)] rounded-2xl py-4 px-5 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all appearance-none cursor-pointer shadow-sm font-600"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                      >
                        {Object.values(PlaceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                        <Plus size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">Budget level</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-[var(--border)] rounded-2xl py-4 px-5 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all appearance-none cursor-pointer shadow-sm font-600"
                        value={formData.budgetRange}
                        onChange={e => setFormData({...formData, budgetRange: e.target.value as any})}
                      >
                        {Object.values(BudgetRange).map(br => <option key={br} value={br}>{br}</option>)}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                        <Tag size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographical Data */}
            <div className="card p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--secondary)] opacity-80" />
              <h3 className="text-xl mb-8 flex items-center gap-3">
                <MapPin size={22} className="text-[var(--secondary)]" /> Geographical Details
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">City</label>
                  <input 
                    type="text" required
                    className="input-field !pl-4 shadow-sm"
                    placeholder="e.g. New Delhi"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">Official Address</label>
                  <input 
                    type="text" required
                    className="input-field !pl-4 shadow-sm"
                    placeholder="123 Street, Area..."
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-6 bg-subtle rounded-3xl border border-[var(--border-light)] mb-6">
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-muted)] mb-6">
                  <MapIcon size={18} className="text-[var(--secondary)]" /> Precise Mapping Coordinates
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black opacity-60 uppercase tracking-widest ml-1">Latitude</label>
                    <input 
                      type="number" step="any" required
                      className="input-field !pl-4 bg-white shadow-inner"
                      placeholder="e.g. 28.6139"
                      value={formData.latitude}
                      onChange={e => setFormData({...formData, latitude: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black opacity-60 uppercase tracking-widest ml-1">Longitude</label>
                    <input 
                      type="number" step="any" required
                      className="input-field !pl-4 bg-white shadow-inner"
                      placeholder="e.g. 77.2090"
                      value={formData.longitude}
                      onChange={e => setFormData({...formData, longitude: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-light)] px-2">
                <Info size={12} className="text-[var(--secondary)]" /> Coordinates are critical for the interactive map discovery feature.
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Visual Experiences */}
            <div className="card p-8 shadow-lg">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-[var(--text-muted)]">
                <ImageIcon size={18} className="text-[var(--primary)]" /> Visual Feed
              </h3>
              
              <div className="border-2 border-dashed border-[var(--border)] rounded-[20px] p-8 text-center hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all cursor-pointer relative group">
                <input 
                  type="file" multiple accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:scale-110 transition-all shadow-sm">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-[var(--text-secondary)]">Drop experience photos</p>
                <p className="text-[10px] text-[var(--text-light)] mt-1 font-600 uppercase tracking-widest">Hi-res JPG/PNG supported</p>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-8 animate-fade-in">
                  {previews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--border-light)] group/img shadow-sm">
                      <img src={url} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" alt="" />
                      <button 
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-red-500 hover:bg-white transition-all shadow-md opacity-0 group-hover/img:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--text-light)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors cursor-pointer relative">
                     <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                     <Plus size={24} />
                  </div>
                </div>
              )}
            </div>

            {/* Final Metadata */}
            <div className="card p-8 bg-subtle">
              <h3 className="text-base font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-[var(--text-muted)]">
                <Tag size={18} className="text-orange-500" /> Discoverability
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">Community Tags</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                    <input 
                      type="text"
                      className="input-field !pl-12 !py-4 shadow-sm text-sm"
                      placeholder="e.g. scenic, quiet, pet-friendly"
                      value={formData.tags}
                      onChange={e => setFormData({...formData, tags: e.target.value})}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-[var(--text-light)] px-1">Separate keywords with commas</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)] ml-1">Suggested Visit Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-light)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                    <input 
                      type="number"
                      className="input-field !pl-12 !py-4 shadow-sm text-sm"
                      placeholder="60"
                      value={formData.suggestedDurationMinutes}
                      onChange={e => setFormData({...formData, suggestedDurationMinutes: parseInt(e.target.value)})}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[var(--text-light)]">MINS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Helper Card */}
            <div className="p-8 bg-black rounded-[32px] text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] blur-3xl rounded-full opacity-30 -mr-16 -mt-16" />
               <h4 className="flex items-center gap-2 font-poppins font-bold text-lg mb-4 relative z-10">
                 <Award size={22} className="text-yellow-400" /> Local Hero Points
               </h4>
               <p className="text-xs text-white/70 leading-relaxed mb-6 relative z-10">Sharing high-quality photos and accurate locations helps you earn badges and increases your rank in the global explorer network.</p>
               <div className="w-full h-2 bg-white/10 rounded-full relative z-10">
                  <div className="w-2/3 h-full bg-[var(--primary)] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-3 text-right">Progress to Elite Status</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlace;
