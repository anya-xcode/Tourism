import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Global Footer component with CTA.
 * Adapted from the previous home page CTA section.
 */
const Footer = () => {
  const { user } = useAuth();
  
  return (
    <footer style={{
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
          
          {/* Only show Sign In if user is not logged in */}
          {!user && (
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
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
