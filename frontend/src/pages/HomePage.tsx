import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, TrendingUp, Compass, ArrowRight } from 'lucide-react';
import api from '../services/api';
import PlaceCard from '../components/places/PlaceCard';

const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Nature', 'Food', 'Heritage', 'Adventure', 'Shopping', 'Nightlife'];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const params: any = { search };
        if (activeCategory !== 'All') params.category = activeCategory;
        const res = await api.get('/places', { params });
        setPlaces(res.data.places);
      } catch (err) {
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounceFn = setTimeout(() => {
        fetchPlaces();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, activeCategory]);

  return (
    <div className="bg-white">
      {/* Hero Section - Fresh Calming Gradient */}
      <section className="relative pt-10 md:pt-14 pb-28 md:pb-32 overflow-hidden bg-gradient-to-b from-[var(--primary-soft)] via-[var(--secondary-soft)] to-white">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-5%] w-1/3 h-1/2 bg-[var(--primary-light)] blur-[120px] rounded-full opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-1/4 h-1/3 bg-[var(--secondary)] blur-[100px] rounded-full opacity-20" />

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-10 animate-fade-in shadow-teal border-teal-100">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Trusted Community Feed</span>
          </div>
          
          <h1 className="text-h1 mb-8 animate-fade-in leading-[1.1]">
            Experience Places Through <br className="hidden md:block" />
            <span className="accent-text">Real Local Stories</span>
          </h1>
          
          <p className="text-lg text-[var(--text-muted)] mb-14 max-w-2xl mx-auto font-500 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Discover hidden ocean retreats and mountain escapes curated by travelers who value authenticity over tourism.
          </p>
          
          {/* Search Bar - Glassmorphism */}
          <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass shadow-2xl rounded-[32px] p-2 flex flex-col md:flex-row items-center gap-2 border-white/50">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-[var(--primary)]" size={22} />
                <input 
                  type="text" 
                  placeholder="Where is your next adventure?" 
                  className="w-full bg-transparent border-none rounded-full pl-20 pr-6 py-5 text-base font-600 focus:outline-none placeholder:text-[var(--text-light)]"
                  style={{ paddingLeft: '5rem' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-primary w-full md:w-auto px-10 py-5 rounded-[24px] text-base shadow-teal">
                 Find Gems
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Discoveries Grid */}
      <section className="section-py relative z-20">
        <div className="container-custom">
          {/* Header & Filter Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-10 mb-16">
            <div className="max-w-xl">
              <h2 className="text-h2 mb-4">Popular This Season</h2>
              <p className="text-[var(--text-muted)] font-600 flex items-center gap-2">
                <Compass className="text-[var(--primary)]" size={18} /> Verified by top community explorers
              </p>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`btn whitespace-nowrap px-6 transition-all font-bold ${
                    activeCategory === cat 
                      ? 'btn-primary shadow-teal scale-105' 
                      : 'bg-white border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Places Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card h-[450px] animate-pulse bg-[var(--background-subtle)]" />
              ))}
            </div>
          ) : places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-fade-in">
              {places.map((place: any) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-card rounded-[40px] border-dashed border-2 border-[var(--border)]">
              <div className="w-24 h-24 bg-[var(--primary-soft)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <MapPin size={44} className="text-[var(--primary)] opacity-40" />
              </div>
              <h3 className="text-2xl mb-4">No destinations found</h3>
              <p className="text-[var(--text-muted)] max-w-sm mx-auto font-500">Try adjusting your search or category filter to discover other amazing gems.</p>
              <button 
                onClick={() => { setSearch(''); setActiveCategory('All'); }} 
                className="btn btn-outline mt-10 px-10"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Travel Explorer - Fresh Redesign with Glassmorphism */}
      <section className="section-py bg-gradient-to-b from-white to-[var(--background-subtle)]">
        <div className="container-custom">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <h2 className="text-h2 mb-4">Built for Personal Exploration</h2>
             <p className="text-[var(--text-muted)] text-lg font-500">A community-driven ecosystem designed for travelers who seek more than just sightseeing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {[
              { 
                icon: <Compass size={32} />, 
                title: 'Authentic Feed', 
                desc: 'Every place is shared by a real traveler with verified photos and honest context.',
                color: 'var(--primary)'
              },
              { 
                icon: <Users size={32} />, 
                title: 'Travel Network', 
                desc: 'Connect with explorers who share your interests and get personalized advice.',
                color: 'var(--secondary)'
              },
              { 
                icon: <TrendingUp size={32} />, 
                title: 'Fresh Trends', 
                desc: 'Stay updated on under-the-radar destinations that are trending this month.',
                color: 'var(--accent)'
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-10 md:p-12 h-full flex flex-col group hover:scale-[1.02] transition-all duration-300">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:rotate-6 shadow-lg"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-5 flex items-center gap-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] font-500 mb-8 leading-relaxed">{feature.desc}</p>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                   Explore feature <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="section-py bg-[var(--text)] relative overflow-hidden rounded-t-[60px]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)] blur-[150px] rounded-full opacity-20 -mr-40 -mt-20" />
        <div className="container-custom relative z-10 text-center">
           <h2 className="text-4xl text-white mb-8">Ready to join the community?</h2>
           <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto font-500">Join 10,000+ explorers today and help us map the world's most authentic experiences.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link to="/register" className="btn bg-white text-[var(--text)] px-12 py-5 text-base shadow-xl">Start Exploring</Link>
              <Link to="/login" className="btn btn-outline border-white/20 text-white px-12 py-5 text-base hover:bg-white/10">Sign In</Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
