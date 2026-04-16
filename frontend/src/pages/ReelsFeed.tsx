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
    <div className="min-h-screen bg-[#f8fafc] pt-[calc(var(--header-height)+20px)] pb-20">
      
      {/* ─── STICKY HEADER & FILTERS ─── */}
      <div className="sticky top-[var(--header-height)] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm py-4 mb-8">
        <div className="container-custom">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
             <div className="flex justify-between items-center w-full md:w-auto">
                <div>
                   <h1 className="text-2xl font-bold font-poppins text-gray-900 tracking-tight">Community Experiences</h1>
                   <p className="text-sm font-medium text-gray-500">Discover handpicked locations updated by travelers.</p>
                </div>
                {/* Mobile FAB-style icon near title */}
                <Link to="/add-place" className="md:hidden bg-teal-600 text-white shadow-md flex items-center justify-center p-2.5 rounded-xl transition-all active:scale-95">
                   <Plus size={20} strokeWidth={2.5} />
                </Link>
             </div>
             
             {/* Search Bar & Desktop CTA */}
             <div className="flex items-center gap-3 w-full md:w-auto flex-1 md:flex-none justify-end">
                <div className="relative w-full md:w-80">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Search destinations..." 
                     className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                
                <Link to="/add-place" className="hidden md:flex flex-shrink-0 items-center justify-center gap-2 bg-teal-600 text-white shadow-sm h-[46px] px-6 rounded-2xl font-bold text-sm transition-all hover:bg-teal-700 active:scale-95">
                   <Plus size={18} strokeWidth={3} />
                   <span>Add Place</span>
                </Link>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
             
             {/* Category Pills */}
             <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-full md:w-auto flex-1">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? 'bg-[var(--primary)] text-white shadow-teal' 
                        : 'bg-white text-gray-500 border border-gray-100 hover:border-[var(--primary-light)] hover:text-[var(--primary)]'
                    }`}
                  >
                     {cat}
                  </button>
                ))}
             </div>
             
             <div className="w-px h-8 bg-gray-200 hidden md:block" />
             
             {/* Dropdown Filters */}
             <div className="flex gap-3 w-full md:w-auto">
               <div className="relative group flex-1 md:w-36">
                  <select 
                    className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-black uppercase tracking-widest text-gray-600 appearance-none shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-gray-100"
                    value={activeCity}
                    onChange={(e) => setActiveCity(e.target.value)}
                  >
                     {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary)] pointer-events-none" />
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
               </div>
               
               <div className="relative group flex-1 md:w-40">
                  <select 
                    className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-black uppercase tracking-widest text-gray-600 appearance-none shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-gray-100"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                     <option value="newest">Latest First</option>
                     <option value="rating">Top Rated</option>
                  </select>
                  <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
               </div>
             </div>
             
          </div>

        </div>
      </div>
      
      {/* ─── GRID CONTENT ─── */}
      <div className="container-custom">
         {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
               <div key={i} className="bg-white rounded-[20px] p-2 border border-gray-100 shadow-sm animate-pulse h-[340px]">
                 <div className="w-full h-48 bg-gray-100 rounded-[16px] mb-4" />
                 <div className="px-3">
                   <div className="w-2/3 h-5 bg-gray-100 rounded-lg mb-2" />
                   <div className="w-1/2 h-4 bg-gray-50 rounded-lg mb-4" />
                   <div className="w-full h-8 bg-gray-50 rounded-lg" />
                 </div>
               </div>
             ))}
           </div>
         ) : places.length > 0 ? (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
           >
             <AnimatePresence>
                {places.map((place, i) => (
                  <motion.div
                    key={place._id}
                    layout // Animate items when filtering
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
                  >
                     <PlaceCard place={place} />
                  </motion.div>
                ))}
             </AnimatePresence>
           </motion.div>
         ) : (
           <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-24 h-24 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                 <Compass size={40} className="text-[var(--primary-light)] opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No experiences found</h3>
              <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm text-center">
                 We couldn't find any locations matching your precise radar. Try clearing some filters.
              </p>
              <button 
                onClick={() => { setActiveCategory('All'); setActiveCity('All'); setSearchTerm(''); }}
                className="bg-white text-gray-900 border border-gray-200 shadow-sm py-3 px-8 rounded-full text-xs font-black uppercase tracking-widest hover:border-gray-300 transition-colors"
              >
                Reset Radar
              </button>
           </div>
         )}
      </div>

    </div>
  );
};

export default ReelsFeed;
