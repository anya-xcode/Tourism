import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Star, MapPin, Clock, Calendar, Users, MessageSquare, 
  ChevronRight, Car, Compass, Camera, Info, Heart, Award, Share2
} from 'lucide-react';
import { PlaceService } from '../services/PlaceService';

const PlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const placeData = await PlaceService.getPlaceById(id!);
        setPlace(placeData);
      } catch (err) {
        console.error('Error fetching place details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-[var(--primary-soft)] to-white">
      <div className="w-16 h-16 border-4 border-teal-100 border-t-[var(--primary)] rounded-full animate-spin shadow-lg" />
      <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--primary)] animate-pulse">Initializing Experience...</span>
    </div>
  );
  
  if (!place) return <div className="min-h-screen flex items-center justify-center text-center py-20 bg-subtle"><div><h1 className="mb-4">Place not found</h1><Link to="/" className="btn btn-primary">Back to Home</Link></div></div>;

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Header / Hero Gallery - Updated Aesthetic */}
      <section className="bg-gradient-to-b from-[var(--primary-soft)] to-white pt-10 pb-16">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-[var(--text-light)]">
            <Link to="/" className="hover:text-[var(--primary)] transition-colors">Explorer</Link>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-[var(--text-muted)]">{place.city}</span>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-[var(--text)]">{place.name}</span>
          </div>

          <div className="grid grid-cols-4 grid-rows-2 gap-5 h-[450px] md:h-[550px] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white">
              <div className="col-span-2 row-span-2 relative group overflow-hidden">
                <img src={place.photos?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'} className="relative w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={place.name} />
                <div className="absolute inset-x-0 bottom-0 p-10 pt-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center border-white/30">
                      <Award size={24} className="text-teal-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-200">Featured Gem</p>
                      <p className="text-xl font-poppins font-bold">Community Choice Destination</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 row-span-1 relative group overflow-hidden">
                  <img src={place.photos?.[1] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="view 1" />
              </div>
              <div className="col-span-1 row-span-1 relative group overflow-hidden">
                  <img src={place.photos?.[2] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="view 2" />
              </div>
              <div className="col-span-2 row-span-1 relative group overflow-hidden">
                  <img src={place.photos?.[3] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="view 3" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors" />
                  <button className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 font-bold group">
                      <div className="w-14 h-14 rounded-full glass flex items-center justify-center border-white/20 group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-shadow">Explore Gallery</span>
                  </button>
              </div>
          </div>
        </div>
      </section>

      <div className="container-custom relative z-10 -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Area - Redesigned as Glass Card */}
          <div className="lg:col-span-2">
            <div className="glass-card p-10 md:p-14 rounded-[48px] border-white/60 shadow-teal">
              <div className="flex flex-wrap justify-between items-start gap-10 mb-12">
                <div>
                  <div className="flex gap-3 mb-6">
                    <span className="badge badge-primary">{place.category}</span>
                    <span className="badge bg-white/50 text-[var(--primary)] font-black border border-teal-100">{place.budgetRange}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4 tracking-tight leading-tight">{place.name}</h1>
                  <div className="flex items-center gap-2.5 text-[var(--text-muted)] font-600">
                    <MapPin size={20} className="text-[var(--primary)]" />
                    <span>{place.address}, {place.city}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 bg-[var(--primary-soft)] p-5 rounded-[32px] border border-teal-100/50">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <Star size={28} className="text-[var(--accent)] fill-[var(--accent)]" />
                      <span className="text-3xl font-poppins font-bold">{place.averageRating || '4.8'}</span>
                    </div>
                    <p className="text-[9px] text-[var(--primary)] font-black uppercase tracking-widest">{place.totalReviews || '0'} Community Stories</p>
                  </div>
                  <div className="w-px h-16 bg-[var(--primary-light)]/30 mx-1" />
                  <button className="p-5 bg-white text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-md group">
                    <Heart size={28} className="transition-transform group-active:scale-125" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs - Minimalist */}
              <div className="flex gap-12 border-b border-[var(--border-light)] mb-12 overflow-x-auto scrollbar-hide">
                {['Overview', 'Community Feed', 'Reviews', 'Events'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-6 text-sm font-black uppercase tracking-[0.15em] relative transition-all whitespace-nowrap ${
                      activeTab === tab ? 'text-[var(--primary)]' : 'text-[var(--text-light)] hover:text-[var(--text)]'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-[var(--primary)] rounded-full animate-fade-in" />}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'Overview' && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="p-8 bg-white/40 rounded-[32px] border border-white flex flex-col items-center text-center shadow-sm">
                      <Clock className="text-[var(--primary)] mb-4" size={32} />
                      <p className="text-[10px] uppercase font-black text-[var(--text-light)] tracking-widest mb-1">Travel Duration</p>
                      <p className="font-bold text-lg text-[var(--text)]">{place.suggestedDurationMinutes} MINS</p>
                    </div>
                    <div className="p-8 bg-white/40 rounded-[32px] border border-white flex flex-col items-center text-center shadow-sm">
                      <Calendar className="text-[var(--secondary)] mb-4" size={32} />
                      <p className="text-[10px] uppercase font-black text-[var(--text-light)] tracking-widest mb-1">Best Visit Time</p>
                      <p className="font-bold text-lg text-[var(--text)] leading-tight">{place.operatingHours || '9 AM - 6 PM'}</p>
                    </div>
                    <div className="p-8 bg-white/40 rounded-[32px] border border-white flex flex-col items-center text-center shadow-sm">
                      <Users className="text-[#f59e0b] mb-4" size={32} />
                      <p className="text-[10px] uppercase font-black text-[var(--text-light)] tracking-widest mb-1">Density Peak</p>
                      <p className="font-bold text-lg text-[var(--text)]">Moderate</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-poppins font-bold mb-6">About the Experience</h3>
                  <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-12 font-500">{place.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-16">
                    {place.tags?.map((tag: any) => (
                      <span key={tag} className="bg-white/60 py-2.5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white hover:border-[var(--primary)] hover:bg-white transition-all cursor-default shadow-sm text-[var(--text-muted)]">#{tag}</span>
                    ))}
                  </div>

                  <div className="p-10 bg-gradient-to-br from-[var(--primary-soft)] to-white rounded-[40px] border border-teal-100/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-16 bg-[var(--primary-light)]/20 blur-[80px] rounded-full" />
                    <h4 className="flex items-center gap-4 text-2xl font-poppins font-bold mb-8 text-[var(--text)]">
                      <Info size={28} className="text-[var(--primary)]" /> Local Tips for {place.name.split(' ')[0]}
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      {[
                        'Verified Local Context',
                        'Optimized Travel Paths',
                        'Community-Sourced Visuals',
                        'Real-time Access Guides'
                      ].map((tip, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm font-bold text-[var(--text-secondary)]">
                          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[var(--primary)] shadow-sm border border-teal-50/50">✓</div> 
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area - Redesigned as Glass Widgets */}
          <div className="space-y-10">
            {/* Direct Connect */}
            <div className="glass-card p-10 rounded-[40px] border-white/60 shadow-lg">
              <h3 className="text-base font-black uppercase tracking-widest mb-8 flex items-center gap-3"><MessageSquare size={22} className="text-[var(--primary)]" /> Community Actions</h3>
              <div className="space-y-4">
                <button className="btn btn-primary w-full justify-between group py-5 rounded-[24px] shadow-teal text-base">
                  <span>Plan Group Visit</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn btn-outline w-full justify-between group py-5 rounded-[24px] text-base border-teal-100">
                  <span>Ask Local Advice</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Ride Logistics */}
            <div className="glass-card p-10 rounded-[40px] bg-gradient-to-br from-white/80 to-[var(--secondary-soft)] border-white/60 shadow-lg group">
              <h3 className="text-base font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <Car size={26} className="text-[var(--secondary)]" /> Ride Estimates
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-white/90 rounded-[28px] border border-white hover:border-[var(--secondary)] hover:shadow-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-2xl italic shadow-inner">U</div>
                    <div>
                      <p className="text-sm font-bold">Uber Max</p>
                      <p className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest mt-0.5">14m Arrival</p>
                    </div>
                  </div>
                  <span className="font-poppins font-bold text-xl text-[var(--primary)]">₹340</span>
                </div>
                
                <div className="flex justify-between items-center p-5 bg-white/90 rounded-[28px] border border-white hover:border-[var(--secondary)] hover:shadow-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic shadow-inner">O</div>
                    <div>
                      <p className="text-sm font-bold">Ola Prime</p>
                      <p className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest mt-0.5">8m Arrival</p>
                    </div>
                  </div>
                  <span className="font-poppins font-bold text-xl text-[var(--secondary)]">₹310</span>
                </div>
              </div>
              
              <Link to="/map" className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--secondary)] hover:underline transition-all">
                Compare Providers <Share2 size={12} />
              </Link>
            </div>

            {/* Local Gem Discovery */}
            <div className="p-10 bg-white/40 border-2 border-dashed border-teal-100 rounded-[40px] group text-center">
              <Compass className="text-[var(--primary)] mx-auto mb-6 group-hover:rotate-45 transition-transform" size={40} />
              <h3 className="text-base font-black uppercase tracking-widest mb-4">Nearby Discoveries</h3>
              <p className="text-[11px] font-bold text-[var(--text-muted)] mb-8 leading-loose">We're finding matching gems in the local travel grid for you.</p>
              <div className="space-y-3">
                 <div className="h-16 bg-white/60 rounded-[24px] animate-pulse shadow-sm" />
                 <div className="h-16 bg-white/60 rounded-[24px] animate-pulse shadow-sm opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
