import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [liked, setLiked] = useState(false);
  const defaultImage = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600";
  const imageSource = place.photos?.[0] || defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className="h-full block"
    >
      <Link to={`/place/${place._id}`} className="group no-underline block h-full">
        <div
          className="h-full flex flex-col rounded-[20px] overflow-hidden bg-white border border-gray-100 transition-all duration-500"
          style={{
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(46,144,250,0.08)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px 0 rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          }}
        >
          {/* Image Section */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={imageSource.includes('unsplash.com') ? `${imageSource.split('?')[0]}?w=800&q=80&auto=format&fit=crop` : imageSource}
              alt={place.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            {/* Category badge */}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] backdrop-blur-xl border border-white/20"
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
              >
                {place.category}
              </span>
            </div>

            {/* Heart button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all"
              style={{ background: liked ? 'rgba(239,68,68,0.85)' : 'rgba(255,255,255,0.18)' }}
            >
              <Heart
                size={15}
                className={liked ? 'text-white fill-white' : 'text-white'}
              />
            </motion.button>

            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h3 className="font-poppins font-bold text-[17px] text-white leading-tight mb-1.5 line-clamp-1 drop-shadow-sm">
                {place.name}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/80">
                  <MapPin size={12} />
                  <span className="text-xs font-semibold">{place.city}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md rounded-full px-2 py-0.5">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-white">{place.averageRating || '4.8'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col gap-2.5">
            <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed font-medium">
              {place.description}
            </p>

            {/* Details Footer */}
            <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock size={13} />
                <span className="text-[11px] font-semibold">{place.suggestedDurationMinutes} mins</span>
              </div>

              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
              >
                {place.budgetRange}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PlaceCard;
