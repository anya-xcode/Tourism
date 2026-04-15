import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Mail, BookmarkCheck, Star, Clock, Plus, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BookmarkService } from '../services/BookmarkService';
import type { IPlace } from '../types';
import { motion } from 'framer-motion';

/**
 * ProfilePage — User profile dashboard.
 * Shows user info, stats, and bookmarked places.
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await BookmarkService.getAll('place');
        setBookmarks(data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen pb-20"
    >
      {/* Header */}
      <section className="bg-gradient-to-b from-[var(--primary-soft)] via-[var(--secondary-soft)] to-white pt-10 pb-24 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-1/3 h-1/2 bg-[var(--primary-light)] blur-[120px] rounded-full opacity-20" />
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex flex-col md:flex-row items-center md:items-end gap-8"
          >
            {/* Avatar */}
            <div className="w-28 h-28 rounded-[32px] border-4 border-white shadow-xl overflow-hidden bg-[var(--primary-soft)] flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-[var(--primary)]" />
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-poppins font-bold mb-2">{user.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[var(--text-muted)] font-600">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-[var(--primary)]" /> {user.email}
                </span>
                {user.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[var(--secondary)]" /> {user.city}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/add-place" className="btn btn-primary rounded-[20px] px-6 shadow-teal">
                <Plus size={16} /> Add Place
              </Link>
              <button className="btn btn-outline rounded-[20px] px-6">
                <Settings size={16} /> Edit Profile
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="container-custom -mt-12 relative z-20 mb-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: <BookmarkCheck size={24} />, label: 'Saved Places', value: bookmarks.length, color: 'var(--primary)' },
            { icon: <Star size={24} />, label: 'Reviews', value: '—', color: 'var(--accent, #f59e0b)' },
            { icon: <MapPin size={24} />, label: 'Places Added', value: '—', color: 'var(--secondary)' },
            { icon: <Clock size={24} />, label: 'Member Since', value: new Date(user.city ? Date.now() : Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: '#8b5cf6' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 rounded-[28px] text-center border-white/60"
            >
              <div
                className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-poppins font-bold mb-1">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bookmarked Places */}
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-poppins font-bold">Saved Places</h2>
          <span className="badge badge-primary">{bookmarks.length} saved</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[200px] rounded-[32px] animate-pulse bg-[var(--background-subtle)]" />
            ))}
          </div>
        ) : bookmarks.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {bookmarks.map((bm: any) => {
              const place: Partial<IPlace> = bm.placeId || {};
              return (
                <motion.div key={bm._id} variants={itemVariants} whileHover={{ y: -8 }}>
                  <Link
                    to={`/place/${place._id}`}
                    className="group no-underline block h-full"
                  >
                    <div className="card flex gap-5 p-5 rounded-[28px] bg-white border-white/50 shadow-sm group-hover:shadow-xl transition-all h-full">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={(place.photos as string[])?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200'}
                          alt={place.name || ''}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="font-poppins font-bold text-base line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                          {place.name || 'Unknown Place'}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] font-600 flex items-center gap-1 mt-1">
                          <MapPin size={12} className="text-[var(--primary)]" /> {place.city || '—'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)]">
                            {place.category || ''}
                          </span>
                          {place.averageRating ? (
                            <span className="flex items-center gap-1 text-xs">
                              <Star size={12} className="text-[var(--accent)] fill-[var(--accent)]" />
                              <span className="font-bold">{place.averageRating}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-[40px] border-dashed border-2 border-[var(--border)]"
          >
            <BookmarkCheck size={40} className="text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl mb-3">No saved places yet</h3>
            <p className="text-[var(--text-muted)] max-w-sm mx-auto font-500 mb-8">
              Explore the community and bookmark places you love.
            </p>
            <Link to="/" className="btn btn-primary px-10 rounded-[20px] shadow-teal">
              Start Exploring
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
