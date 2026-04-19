import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Mail, BookmarkCheck, Star, Clock, Plus, Settings, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BookmarkService } from '../services/BookmarkService';
import type { IPlace } from '../types';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

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

  const stagger: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 220 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#fafbfc', minHeight: '100vh', paddingBottom: 80 }}
    >
      {/* ─── Profile Header ─── */}
      <section style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 35%, #f0fdfa 65%, #fefce8 100%)',
        paddingTop: '2.5rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
        }} />

        <div className="container-custom" style={{ maxWidth: 960, position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            {/* Avatar */}
            <div style={{
              width: 100, height: 100, borderRadius: 28, border: '4px solid #fff',
              boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)', overflow: 'hidden',
              background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} style={{ color: '#6366f1' }} />
              )}
            </div>

            {/* User Info */}
            <h1 className="font-poppins" style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              {user.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: '#64748b' }}>
                <Mail size={14} style={{ color: '#6366f1' }} /> {user.email}
              </span>
              {user.city && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: '#64748b' }}>
                  <MapPin size={14} style={{ color: '#14b8a6' }} /> {user.city}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/add-place" className="no-underline" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 22px', borderRadius: 12,
                background: '#0f172a', color: '#fff',
                fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
              }}>
                <Plus size={15} /> Add Place
              </Link>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 22px', borderRadius: 12,
                background: '#fff', color: '#475569',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                border: '1.5px solid #e2e8f0', cursor: 'pointer',
              }}>
                <Settings size={15} /> Edit Profile
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Cards ─── */}
      <div className="container-custom" style={{ maxWidth: 960, marginTop: -40, position: 'relative', zIndex: 10, marginBottom: 48 }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          className="grid grid-cols-2 md:!grid-cols-4"
        >
          {[
            { icon: <BookmarkCheck size={22} />, label: 'Saved Places', value: bookmarks.length, color: '#6366f1', bg: '#eef2ff' },
            { icon: <Star size={22} />, label: 'Reviews', value: '—', color: '#f59e0b', bg: '#fffbeb' },
            { icon: <MapPin size={22} />, label: 'Places Added', value: '—', color: '#14b8a6', bg: '#f0fdfa' },
            { icon: <Clock size={22} />, label: 'Member Since', value: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: '#8b5cf6', bg: '#f5f3ff' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              style={{
                background: '#fff', borderRadius: 20, padding: '24px 20px',
                textAlign: 'center', border: '1px solid #f1f5f9',
                boxShadow: '0 2px 12px -2px rgba(0,0,0,0.04)',
                transition: 'all 0.3s', cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px -8px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px -2px rgba(0,0,0,0.04)'; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 14, margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: stat.bg, color: stat.color,
              }}>
                {stat.icon}
              </div>
              <p className="font-poppins" style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ─── Bookmarked Places ─── */}
      <div className="container-custom" style={{ maxWidth: 960 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 className="font-poppins" style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 }}>Saved Places</h2>
          <span style={{
            padding: '4px 12px', background: '#eef2ff', color: '#6366f1',
            borderRadius: 8, fontSize: 11, fontWeight: 700,
          }}>
            {bookmarks.length} saved
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ height: 140, borderRadius: 20, background: '#f1f5f9' }} />
            ))}
          </div>
        ) : bookmarks.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gap: 16 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {bookmarks.map((bm: any) => {
              const place: Partial<IPlace> = bm.placeId || {};
              return (
                <motion.div key={bm._id} variants={fadeUp}>
                  <Link
                    to={`/place/${place._id}`}
                    className="no-underline"
                    style={{ display: 'block' }}
                  >
                    <div
                      style={{
                        display: 'flex', gap: 14, padding: 14, borderRadius: 18,
                        background: '#fff', border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)',
                        transition: 'all 0.3s', cursor: 'pointer',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px -8px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px -2px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                      <div style={{
                        width: 72, height: 72, borderRadius: 14, overflow: 'hidden', flexShrink: 0, background: '#f1f5f9',
                      }}>
                        <img
                          src={(place.photos as string[])?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200'}
                          alt={place.name || ''}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                        <h4 className="font-poppins" style={{
                          fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {place.name || 'Unknown Place'}
                        </h4>
                        <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, margin: '0 0 6px' }}>
                          <MapPin size={11} style={{ color: '#6366f1' }} /> {place.city || '—'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {place.category || ''}
                          </span>
                          {place.averageRating ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Star size={10} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{place.averageRating}</span>
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: '#fff', borderRadius: 24,
              border: '2px dashed #e2e8f0',
            }}
          >
            <div style={{
              width: 64, height: 64, background: '#f8fafc', borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <BookmarkCheck size={28} style={{ color: '#cbd5e1' }} />
            </div>
            <h3 className="font-poppins" style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No saved places yet</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 340, margin: '0 auto 24px', lineHeight: 1.6, fontWeight: 500 }}>
              Explore the community and bookmark places you love.
            </p>
            <Link to="/" className="no-underline" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 24px', borderRadius: 12,
              background: '#0f172a', color: '#fff',
              fontSize: 13, fontWeight: 700,
            }}>
              <Globe size={15} /> Start Exploring
            </Link>
          </motion.div>
        )}
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (min-width: 768px) {
          .md\\:!grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
          .md\\:!grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .lg\\:!grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default ProfilePage;
