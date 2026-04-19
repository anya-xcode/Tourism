import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Compass, ChevronDown, Filter, Plus } from 'lucide-react';
import { PlaceService } from '../services/PlaceService';
import PlaceCard from '../components/places/PlaceCard';
import { PlaceCategory } from '../types';

const CITIES = ['All', 'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Goa'];
const CATEGORIES = ['All', ...Object.values(PlaceCategory)];

const ReelsFeed = () => {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCity, setActiveCity] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, activeCity, sortBy, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const filters: any = {
        sortBy: sortBy === 'rating' ? 'rating' : 'newest',
      };
      if (activeCategory !== 'All') filters.category = activeCategory;
      if (activeCity !== 'All') filters.city = activeCity.toLowerCase();
      if (searchTerm) filters.search = searchTerm;

      const res = await PlaceService.getPlaces(filters);
      // Backend returns { places, total }
      setPlaces(res?.places || []);
    } catch (err) {
      console.error('Failed to fetch experiences', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc', paddingBottom: 80 }}>
      
      {/* ─── HEADER & FILTERS ─── */}
      <div style={{
        position: 'sticky', top: 'var(--header-height)', zIndex: 40,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <div className="container-custom" style={{ maxWidth: 1280, padding: '20px 24px' }}>
          
          {/* Row 1: Title + Search + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <h1 className="font-poppins" style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                Community Experiences
              </h1>
              <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, margin: '4px 0 0' }}>
                Discover handpicked locations updated by travelers.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 auto', maxWidth: 480, justifyContent: 'flex-end' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }} />
                <input 
                  type="text" 
                  placeholder="Search destinations..." 
                  style={{
                    width: '100%', background: '#f8fafc', border: '1.5px solid #f1f5f9',
                    borderRadius: 12, padding: '10px 16px 10px 40px', fontSize: 13, fontWeight: 500,
                    outline: 'none', color: '#0f172a', transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.background = '#fff'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#f8fafc'; }}
                />
              </div>

              {/* Add Place Button */}
              <Link to="/add-place" className="no-underline" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', background: '#0f172a', color: '#fff',
                borderRadius: 12, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                transition: 'all 0.2s', flexShrink: 0,
              }}>
                <Plus size={16} strokeWidth={3} />
                <span className="hidden sm:inline">Add Place</span>
              </Link>
            </div>
          </div>
          
          {/* Row 2: Category Pills + Dropdown Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            
            {/* City Pills */}
            <div className="scrollbar-hide" style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: '1 1 auto', paddingBottom: 2 }}>
              {CITIES.map(city => (
                <button 
                  key={city}
                  onClick={() => setActiveCity(city)}
                  style={{
                    whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 9,
                    fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.04em',
                    ...(activeCity === city
                      ? { background: '#0f172a', color: '#fff', boxShadow: '0 2px 8px -2px rgba(15,23,42,0.2)' }
                      : { background: '#fff', color: '#64748b', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)' }
                    ),
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
            
            <div style={{ width: 1, height: 28, background: '#e2e8f0', flexShrink: 0 }} className="hidden md:block" />
            
            {/* Dropdown Filters */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <Compass size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6366f1', pointerEvents: 'none' }} />
                <select 
                  style={{
                    background: '#fff', border: '1.5px solid #f1f5f9', borderRadius: 9,
                    padding: '7px 28px 7px 30px', fontSize: 11, fontWeight: 700,
                    color: '#475569', appearance: 'none', cursor: 'pointer', outline: 'none',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)',
                  }}
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option disabled>Category</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              </div>
              
              <div style={{ position: 'relative' }}>
                <Filter size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <select 
                  style={{
                    background: '#fff', border: '1.5px solid #f1f5f9', borderRadius: 9,
                    padding: '7px 28px 7px 30px', fontSize: 11, fontWeight: 700,
                    color: '#475569', appearance: 'none', cursor: 'pointer', outline: 'none',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)',
                  }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Latest First</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* ─── GRID CONTENT ─── */}
      <div className="container-custom" style={{ maxWidth: 1280, paddingTop: 28 }}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 20 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: '#fff', border: '1px solid #f1f5f9' }} className="animate-pulse">
                <div style={{ aspectRatio: '3/4', background: '#f1f5f9' }} />
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ height: 12, background: '#f1f5f9', borderRadius: 99, width: '75%' }} />
                  <div style={{ height: 10, background: '#f8fafc', borderRadius: 99, width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : places.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            style={{ gap: 20 }}
          >
            <AnimatePresence>
              {places.map((place, i) => (
                <motion.div
                  key={place._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.04 }}
                >
                  <PlaceCard place={place} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9',
            }}
          >
            <div style={{
              width: 72, height: 72, background: '#f8fafc', borderRadius: 20,
              border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Compass size={32} style={{ color: '#cbd5e1' }} />
            </div>
            <h3 className="font-poppins" style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No experiences found</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 380, margin: '0 auto 24px', lineHeight: 1.6, fontWeight: 500 }}>
              We couldn't find any locations matching your criteria. Try clearing some filters.
            </p>
            <button 
              onClick={() => { setActiveCategory('All'); setActiveCity('All'); setSearchTerm(''); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 24px', borderRadius: 12,
                background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700,
                border: 'none', cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default ReelsFeed;
