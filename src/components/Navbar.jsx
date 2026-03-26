import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Rss, PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useWindowSize from '../hooks/useWindowSize';

export default function Navbar({ onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isMobile } = useWindowSize();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(12,14,22,0.95)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.04 }} style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Rss size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '17px', color: '#fff', letterSpacing: '-0.5px' }}>
          Dev<span style={{ color: '#818cf8' }}>Blog</span>
        </span>
      </motion.div>

      {/* Desktop nav */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {['Home', 'Articles', 'Tags', 'About'].map((item) => (
            <motion.span key={item} whileHover={{ color: '#818cf8' }} onClick={() => navigate('/')}
              style={{ color: '#718096', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}>
              {item}
            </motion.span>
          ))}
        </div>
      )}

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AnimatePresence>
          {searchOpen && (
            <motion.input
              initial={{ width: 0, opacity: 0 }} animate={{ width: isMobile ? 160 : 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              autoFocus placeholder="Search posts..."
              onChange={(e) => onSearch?.(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '7px 12px', color: '#fff', fontSize: '13px', outline: 'none', overflow: 'hidden' }}
            />
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={() => setSearchOpen(!searchOpen)}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#718096' }}>
          <Search size={16} />
        </motion.button>

        {!isMobile && (
          <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <PenSquare size={14} /> Write Post
          </motion.button>
        )}

        {isMobile && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', padding: '6px' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        )}
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: 'absolute', top: '60px', left: 0, right: 0, background: 'rgba(12,14,22,0.98)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['Home', 'Articles', 'Tags', 'About'].map((item) => (
              <span key={item} onClick={() => { navigate('/'); setMenuOpen(false); }}
                style={{ color: '#a0aec0', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>{item}</span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
