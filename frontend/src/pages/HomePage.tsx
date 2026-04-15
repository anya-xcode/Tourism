import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Users, TrendingUp, Compass, ArrowRight, Globe, Map,
  Palmtree, UtensilsCrossed, Landmark, Mountain, ShoppingBag, Moon, Sparkles, Plus
} from 'lucide-react';
import api from '../services/api';
import PlaceCard from '../components/places/PlaceCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

const categoryIcons: Record<string, React.ReactNode> = {
  'All': <Sparkles size={15} />,
  'Nature': <Palmtree size={15} />,
  'Food': <UtensilsCrossed size={15} />,
  'Heritage': <Landmark size={15} />,
  'Adventure': <Mountain size={15} />,
  'Shopping': <ShoppingBag size={15} />,
  'Nightlife': <Moon size={15} />,
};

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
];

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

  const stagger: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 220 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#fafbfc' }}
    >
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Full-bleed gradient background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 35%, #f0fdfa 65%, #fef3c7 100%)',
        }} />

        {/* Animated decorative orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-10%', right: '-5%', width: 520, height: 520, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', zIndex: 0,
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 35, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', bottom: '-8%', left: '-3%', width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)', zIndex: 0,
          }}
        />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="container-custom"
            style={{ maxWidth: 1200, paddingTop: '4rem', paddingBottom: '5.5rem' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}
              className="lg:!grid-cols-[1.1fr_0.9fr]"
            >
              {/* Left: Text Content */}
              <div style={{ maxWidth: 580 }}>
                {/* Status badge */}
                <motion.div variants={fadeUp} style={{ marginBottom: '1.75rem' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.5)', color: '#475569',
                  }}>
                    <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                      <span style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        background: '#34d399', opacity: 0.6,
                        animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                      }} />
                      <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                    </span>
                    Community-Powered Discovery
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  variants={fadeUp}
                  className="font-poppins"
                  style={{
                    fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                    fontWeight: 800, lineHeight: 1.1,
                    color: '#0f172a', marginBottom: '1.5rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Discover Places<br />
                  Through{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #4f46e5, #0ea5e9, #14b8a6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    Real Stories
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={fadeUp}
                  style={{
                    fontSize: 17, lineHeight: 1.7, color: '#64748b',
                    marginBottom: '2rem', maxWidth: 460, fontWeight: 500,
                  }}
                >
                  Explore hidden gems curated by travelers who value authenticity. No ads, no sponsored listings — just honest experiences.
                </motion.p>

                {/* Search bar */}
                <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#fff', borderRadius: 16, padding: 6,
                    boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)',
                    transition: 'box-shadow 0.3s',
                    maxWidth: 480,
                  }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Where to next?"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                          width: '100%', border: 'none', background: 'transparent',
                          padding: '14px 16px 14px 44px', fontSize: 14, fontWeight: 500,
                          outline: 'none', color: '#0f172a', borderRadius: 12,
                        }}
                      />
                    </div>
                    <button style={{
                      background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                      color: '#fff', border: 'none', borderRadius: 12,
                      padding: '12px 28px', fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', whiteSpace: 'nowrap' as const,
                      boxShadow: '0 4px 14px -3px rgba(79,70,229,0.4)',
                      transition: 'all 0.2s',
                    }}>
                      Explore
                    </button>
                  </div>
                </motion.div>

                {/* CTA row */}
                <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const }}>
                  <Link
                    to="/register"
                    className="no-underline"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '12px 24px', borderRadius: 12,
                      background: '#0f172a', color: '#fff',
                      fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                      boxShadow: '0 4px 12px -2px rgba(15,23,42,0.2)',
                    }}
                  >
                    Start Exploring <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/map"
                    className="no-underline"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '12px 24px', borderRadius: 12,
                      background: 'transparent', color: '#475569',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                      border: '1.5px solid #e2e8f0',
                    }}
                  >
                    <Map size={15} /> Open Map
                  </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  variants={fadeUp}
                  style={{ display: 'flex', gap: 24, marginTop: '2.5rem', flexWrap: 'wrap' as const }}
                >
                  {[
                    { num: '10K+', label: 'Travelers' },
                    { num: '500+', label: 'Places' },
                    { num: '4.9', label: 'Rating' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ display: 'flex', flexDirection: 'column' as const }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif' }}>{stat.num}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right: Image Collage */}
              <motion.div
                variants={fadeUp}
                className="hidden lg:block"
                style={{ position: 'relative', height: 420 }}
              >
                {HERO_IMAGES.map((src, i) => {
                  const positions = [
                    { top: 0, left: 0, width: 220, height: 260, rotate: -3, zIndex: 2 },
                    { top: 20, left: 200, width: 200, height: 240, rotate: 2, zIndex: 3 },
                    { top: 180, left: 40, width: 190, height: 220, rotate: 1, zIndex: 1 },
                    { top: 160, left: 230, width: 180, height: 210, rotate: -2, zIndex: 4 },
                  ];
                  const pos = positions[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30, rotate: 0 }}
                      animate={{ opacity: 1, y: 0, rotate: pos.rotate }}
                      transition={{ delay: 0.3 + i * 0.12, type: 'spring', damping: 20 }}
                      style={{
                        position: 'absolute', top: pos.top, left: pos.left,
                        width: pos.width, height: pos.height, zIndex: pos.zIndex,
                        borderRadius: 20, overflow: 'hidden',
                        boxShadow: '0 16px 40px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                      }}
                    >
                      <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ CATEGORY FILTERS + GRID ═══════════════════ */}
      <section style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="container-custom" style={{ maxWidth: 1200 }}>
          {/* Filter row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
            <div>
              <h2 className="font-poppins" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                Popular This Season
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <Compass size={14} style={{ color: '#6366f1' }} />
                Verified by community explorers
              </p>
            </div>

            {/* Category pills */}
            <div className="scrollbar-hide" style={{ display: 'flex', gap: 6, overflowX: 'auto' as const, padding: '4px 2px' }}>
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    whiteSpace: 'nowrap' as const, padding: '8px 16px',
                    borderRadius: 10, fontSize: 12, fontWeight: 600,
                    border: 'none', cursor: 'pointer', transition: 'all 0.25s',
                    ...(activeCategory === cat
                      ? {
                        background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                        color: '#fff',
                        boxShadow: '0 4px 12px -2px rgba(99,102,241,0.35)',
                      }
                      : {
                        background: '#fff',
                        color: '#64748b',
                        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)',
                      }
                    ),
                  }}
                >
                  {categoryIcons[cat]}
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Places Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: '#f8fafc' }} className="animate-pulse">
                    <div style={{ aspectRatio: '3/4', background: '#f1f5f9' }} />
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ height: 12, background: '#f1f5f9', borderRadius: 99, width: '75%' }} />
                      <div style={{ height: 10, background: '#f1f5f9', borderRadius: 99, width: '55%' }} />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : places.length > 0 ? (
              <motion.div
                key="grid"
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {places.map((place: any) => (
                  <PlaceCard key={place._id} place={place} />
                ))}
              </motion.div>
            ) : (
              /* ─── Engaging Empty State ─── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                style={{
                  textAlign: 'center', padding: '4rem 2rem',
                  background: 'linear-gradient(135deg, #eef2ff, #f0fdfa, #fefce8)',
                  borderRadius: 28, border: '1px solid rgba(99,102,241,0.08)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Background decoration */}
                <div style={{
                  position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: -30, left: -30, width: 160, height: 160, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
                }} />

                {/* Illustration-like icon cluster */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, position: 'relative', zIndex: 1 }}>
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px -2px rgba(99,102,241,0.15)',
                    }}
                  >
                    <Globe size={24} style={{ color: '#6366f1' }} />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px -2px rgba(16,185,129,0.15)',
                      marginTop: 12,
                    }}
                  >
                    <MapPin size={24} style={{ color: '#10b981' }} />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                    style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px -2px rgba(245,158,11,0.15)',
                    }}
                  >
                    <Compass size={24} style={{ color: '#f59e0b' }} />
                  </motion.div>
                </div>

                <h3 className="font-poppins" style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 8, position: 'relative', zIndex: 1 }}>
                  No destinations yet
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', maxWidth: 380, margin: '0 auto 24px', lineHeight: 1.6, fontWeight: 500, position: 'relative', zIndex: 1 }}>
                  Be the first to share a hidden gem! Add your favorite place or adjust your filters to discover what others have shared.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' as const, position: 'relative', zIndex: 1 }}>
                  <Link
                    to="/add-place"
                    className="no-underline"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '10px 22px', borderRadius: 12,
                      background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                      color: '#fff', fontSize: 13, fontWeight: 700,
                      boxShadow: '0 4px 12px -2px rgba(99,102,241,0.3)',
                    }}
                  >
                    <Plus size={15} /> Add a Place
                  </Link>
                  <button
                    onClick={() => { setSearch(''); setActiveCategory('All'); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '10px 22px', borderRadius: 12,
                      background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600,
                      border: '1.5px solid #e2e8f0', cursor: 'pointer',
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════ FEATURES SECTION ═══════════════════ */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}>
        <div className="container-custom" style={{ maxWidth: 1200 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <span style={{
              display: 'inline-block', padding: '5px 14px', borderRadius: 8,
              background: '#eef2ff', color: '#4f46e5', fontSize: 11,
              fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              Why TravelExplorer
            </span>
            <h2 className="font-poppins" style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700,
              color: '#0f172a', marginBottom: 10,
            }}>
              Built for Real Exploration
            </h2>
            <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 480, margin: '0 auto', fontWeight: 500, lineHeight: 1.6 }}>
              A community-driven ecosystem for travelers who seek more than sightseeing.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 20 }}
          >
            {[
              {
                icon: <Compass size={24} />,
                title: 'Authentic Feed',
                desc: 'Every place is shared by a real traveler with verified photos and honest context — no sponsored listings.',
                gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                bgLight: '#eef2ff',
                textColor: '#4f46e5',
                borderAccent: 'rgba(99,102,241,0.12)',
              },
              {
                icon: <Users size={24} />,
                title: 'Travel Network',
                desc: 'Connect with explorers who share your interests and get personalized trip recommendations.',
                gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                bgLight: '#f0fdf4',
                textColor: '#0d9488',
                borderAccent: 'rgba(20,184,166,0.12)',
              },
              {
                icon: <TrendingUp size={24} />,
                title: 'Fresh Trends',
                desc: 'Stay updated on under-the-radar destinations that are trending in the community right now.',
                gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
                bgLight: '#fffbeb',
                textColor: '#d97706',
                borderAccent: 'rgba(245,158,11,0.12)',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                style={{
                  position: 'relative', background: '#fff', borderRadius: 20,
                  padding: '2rem 1.75rem', cursor: 'default', overflow: 'hidden',
                  border: `1.5px solid ${feature.borderAccent}`,
                  boxShadow: '0 2px 12px -2px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.4s, border-color 0.4s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px -8px ${feature.borderAccent.replace('0.12', '0.25')}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px -2px rgba(0,0,0,0.04)';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: feature.bgLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: feature.textColor, marginBottom: 20,
                }}>
                  {feature.icon}
                </div>

                <h3 className="font-poppins" style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16, fontWeight: 500 }}>
                  {feature.desc}
                </p>

                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 12, fontWeight: 700, color: feature.textColor,
                }}>
                  Learn more <ArrowRight size={13} />
                </span>

                {/* Accent line at top */}
                <div style={{
                  position: 'absolute', top: 0, left: 24, right: 24, height: 3,
                  borderRadius: '0 0 99px 99px',
                  background: feature.gradient,
                  opacity: 0.6,
                }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ CTA FOOTER ═══════════════════ */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: '#0f172a', borderRadius: '40px 40px 0 0',
        margin: '0',
      }}>
        {/* Animated orbs */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-15%', right: '-8%', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)',
          }}
        />

        <div className="container-custom" style={{
          position: 'relative', zIndex: 1,
          padding: '5rem 1.5rem', textAlign: 'center',
          maxWidth: 700, margin: '0 auto',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 16, marginBottom: 24,
            background: 'rgba(99,102,241,0.15)',
          }}>
            <Globe size={26} style={{ color: '#818cf8' }} />
          </div>

          <h2 className="font-poppins" style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700,
            color: '#fff', marginBottom: 14, lineHeight: 1.2,
          }}>
            Ready to explore with us?
          </h2>
          <p style={{
            fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 32,
            maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.7, fontWeight: 500,
          }}>
            Join 10,000+ explorers and help us map the world's most authentic travel experiences.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="no-underline"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 14,
                  background: '#fff', color: '#0f172a',
                  fontSize: 14, fontWeight: 700,
                  boxShadow: '0 8px 24px -4px rgba(255,255,255,0.15)',
                }}
              >
                Start Exploring <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="no-underline"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '14px 32px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 14, fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                }}
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Inject the responsive grid override for the hero */}
      <style>{`
        @media (min-width: 1024px) {
          .lg\\:!grid-cols-\\[1\\.1fr_0\\.9fr\\] {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
          @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default HomePage;
