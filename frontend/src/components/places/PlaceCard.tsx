import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Heart } from 'lucide-react';

interface PlaceCardProps {
  place: {
    _id: string;
    name: string;
    description: string;
    city: string;
    photos: string[];
    averageRating: number;
    totalReviews: number;
    category: string;
    budgetRange: string;
    suggestedDurationMinutes: number;
  };
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const defaultImage = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600";
  
  return (
    <Link to={`/place/${place._id}`} className="group no-underline block h-full">
      <div className="card h-full flex flex-col p-0 rounded-[32px] overflow-hidden bg-white border-white/50 shadow-teal">
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img 
            src={place.photos?.[0] || defaultImage} 
            alt={place.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Top Badges - Glassmorphism */}
          <div className="absolute top-4 left-4 z-10">
            <span className="glass px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--primary)] shadow-sm">
              {place.category}
            </span>
          </div>

          <button className="absolute top-4 right-4 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-white transition-all shadow-sm">
            <Heart size={18} />
          </button>

          {/* Rating Badge Overlay - Glassmorphism */}
          <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border-white/40">
            <Star size={14} className="text-[var(--accent)] fill-[var(--accent)]" />
            <span className="text-sm font-bold text-[var(--text)]">{place.averageRating || '4.8'}</span>
            <span className="text-[10px] text-[var(--text-muted)] font-bold">({place.totalReviews || '42'})</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-7 flex-1 flex flex-col gap-3 relative">
          <div className="flex justify-between items-start">
            <h3 className="font-poppins font-bold text-lg leading-tight transition-colors group-hover:text-[var(--primary)] line-clamp-1">
              {place.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-wider">
            <MapPin size={14} className="text-[var(--primary)]" />
            <span>{place.city}</span>
          </div>

          <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-1 font-500">
            {place.description}
          </p>

          {/* Details Footer */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2 text-[var(--text-light)] text-[10px] font-bold uppercase tracking-[0.1em]">
              <Clock size={14} className="text-[var(--primary-light)]" />
              <span>{place.suggestedDurationMinutes} MINS</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold">
              <span className="text-xs">{place.budgetRange}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
