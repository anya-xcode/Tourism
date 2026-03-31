import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Music, MapPin, ChevronLeft } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ReelsFeed = () => {
  const [reels, setReels] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await api.get('/reels/feed');
        setReels(res.data);
      } catch (err) {
        console.error('Error fetching reels:', err);
      }
    };
    fetchReels();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const h = el.clientHeight || 1;
      const idx = Math.round(el.scrollTop / h);
      setActiveIdx((prev) => (prev === idx ? prev : idx));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleLike = async (id: string, idx: number) => {
    try {
      const res = await api.post(`/reels/${id}/like`);
      const newReels: any = [...reels];
      newReels[idx].likes = res.data.likes;
      newReels[idx].liked = res.data.liked;
      setReels(newReels);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  return (
    <div className="h-[calc(100vh-var(--header-height))] bg-zinc-950 flex justify-center overflow-hidden">
      <div 
        ref={containerRef}
        className="h-full w-full max-w-[450px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide flex flex-col items-center"
      >
        {reels.map((reel: any, idx) => (
          <div key={reel._id} className="relative h-full w-full snap-start flex items-center justify-center bg-black group/reel">
            <video 
              src={reel.videoUrl} 
              className="h-full w-full object-cover"
              loop
              autoPlay={idx === activeIdx}
              muted
              playsInline
            />
            
            {/* Top Back Action (Mobile friendly feel) */}
            <div className="absolute top-6 left-6 z-10">
               <Link to="/" className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-colors">
                  <ChevronLeft size={24} />
               </Link>
            </div>

            {/* Overlay Info - Redesigned */}
            <div className="absolute inset-x-0 bottom-0 p-8 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl border-2 border-[var(--primary)] p-0.5 overflow-hidden shadow-lg">
                  <img 
                    src={reel.userId?.avatar || `https://ui-avatars.com/api/?name=${reel.userId?.name}`} 
                    className="w-full h-full object-cover rounded-[14px]"
                    alt="" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    {reel.userId?.name}
                    <div className="w-1 h-1 rounded-full bg-white/50" />
                    <span className="text-[10px] font-black uppercase text-[var(--primary-light)] tracking-[0.15em]">Explorer</span>
                  </h4>
                  <p className="text-xs text-white/70 font-medium flex items-center gap-1.5 mt-0.5">
                    <MapPin size={14} className="text-[var(--primary-light)]" /> {reel.placeId?.name}, {reel.placeId?.city}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-5 line-clamp-2 leading-relaxed font-medium">{reel.caption}</p>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit">
                <Music size={14} className="text-white animate-spin-slow" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Original Travel Audio</span>
              </div>
            </div>

            {/* Sidebar Actions - Redesigned to be minimalist circles */}
            <div className="absolute right-4 bottom-32 flex flex-col gap-5 items-center z-10">
              <button 
                onClick={() => handleLike(reel._id, idx)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white/20 shadow-xl ${reel.liked ? 'text-red-500 scale-110 border-red-500/30' : 'text-white'}`}>
                  <Heart size={28} fill={reel.liked ? 'currentColor' : 'none'} className="transition-transform group-active:scale-125" />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-md tracking-wider">{reel.likes || 0}</span>
              </button>

              <button className="flex flex-col items-center gap-1.5 group">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white/20 shadow-xl text-white group-hover:text-[var(--primary-light)]">
                  <MessageCircle size={28} />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-md tracking-wider">12</span>
              </button>

              <button className="flex flex-col items-center gap-1.5 group">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white/20 shadow-xl text-white group-hover:text-[var(--secondary)]">
                  <Share2 size={24} />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-md tracking-wider">Share</span>
              </button>

              <button className="group mt-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-white/20 shadow-xl text-white group-hover:text-yellow-400">
                  <Bookmark size={24} />
                </div>
              </button>
            </div>
          </div>
        ))}
        {reels.length === 0 && (
          <div className="h-full w-full flex flex-col items-center justify-center text-white p-20 text-center gap-6">
             <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center animate-pulse">
                <Music size={40} className="text-zinc-500" />
             </div>
             <div className="space-y-2">
               <h3 className="text-xl font-bold">No Experiences Yet</h3>
               <p className="text-zinc-500 text-sm">Be the first to share a travel experience with the community!</p>
             </div>
             <Link to="/add-place" className="btn btn-primary rounded-full px-8">Upload Experience</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelsFeed;
