import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import useWindowSize from '../hooks/useWindowSize';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { isMobile } = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false); setSearchVal('');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'rgba(12,14,22,0.95)' : 'rgba(12,14,22,0.7)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 24px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'background 0.3s',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
            {'</>'}
          </div>
          <span style={{ fontWeight: 800, fontSize: '17px', color: '#fff', letterSpacing: '-0.5px' }}>
            Dev<span style={{ color: '#818cf8' }}>Blog</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {['React','Node.js','GraphQL','DevOps'].map(cat => (
              <Link key={cat} to={`/?category=${cat}`}
                style={{ padding: '6px 12px', color: '#718096', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRadius: '8px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.background='rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.target.style.color='#718096'; e.target.style.background='transparent'; }}>
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Right section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.form key="search-form" onSubmit={handleSearch}
                initial={{ width: 36 }} animate={{ width: isMobile ? 160 : 220 }} exit={{ width: 36 }}
                style={{ overflow: 'hidden', position: 'relative' }}>
                <input
                  autoFocus type="text" value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search posts..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '8px', padding: '7px 32px 7px 12px', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: '12px' }}>✕</button>
              </motion.form>
            ) : (
              <motion.button key="search-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}>
                🔍
              </motion.button>
            )}
          </AnimatePresence>

          {/* Auth / User */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                {!isMobile && <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>}
              </motion.button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '160px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'block', padding: '12px 16px', color: '#818cf8', fontSize: '13px', textDecoration: 'none', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.target.style.background='rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.target.style.background='transparent'}>
                        ⚡ Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setUserMenuOpen(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: '#718096', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.background='rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { e.target.style.color='#718096'; e.target.style.background='transparent'; }}>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.96 }}
              onClick={() => setAuthOpen(true)}
              style={{ padding: '7px 16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Sign In
            </motion.button>
          )}

          {/* Mobile menu btn */}
          {isMobile && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)}
              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '16px' }}>
              {mobileOpen ? '✕' : '☰'}
            </motion.button>
          )}
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ position: 'absolute', top: '60px', left: 0, right: 0, background: 'rgba(12,14,22,0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
              {['React','Node.js','GraphQL','TypeScript','DevOps','MongoDB'].map(cat => (
                <Link key={cat} to={`/?category=${cat}`} onClick={() => setMobileOpen(false)}
                  style={{ padding: '10px 0', color: '#a0aec0', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {cat}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}
                  style={{ padding: '10px 0', color: '#818cf8', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                  ⚡ Admin Panel
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
