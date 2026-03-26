import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { posts } from '../data/posts';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import StatsBar from '../components/StatsBar';
import useWindowSize from '../hooks/useWindowSize';
import { Sparkles } from 'lucide-react';

export default function Home({ searchQuery }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const { isMobile, isTablet } = useWindowSize();

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: isMobile ? '20px 16px 60px' : '32px 24px 60px' }}>
      {/* Hero header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ marginBottom: '36px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
          <Sparkles size={13} /> Developer Blog & CMS
        </motion.div>
        <h1 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '14px', letterSpacing: '-1px' }}>
          Thoughts on <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Full Stack Dev</span>
        </h1>
        <p style={{ color: '#718096', fontSize: isMobile ? '14px' : '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
          Articles on React, Node.js, MongoDB, GraphQL, DevOps and everything in between.
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ marginBottom: '36px' }}>
        <StatsBar />
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 280px', gap: '28px', alignItems: 'start' }}>
        {/* Posts */}
        <div>
          {/* Featured */}
          {featured.length > 0 && !searchQuery && (
            <div style={{ marginBottom: '28px' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: '#f59e0b', fontSize: '13px' }}>⭐</span>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>Featured Articles</span>
              </motion.div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {featured.map((p, i) => <PostCard key={p.id} post={p} delay={i * 0.08} featured />)}
              </div>
            </div>
          )}

          {/* All / filtered */}
          {rest.length > 0 && (
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>
                  {searchQuery ? `Results for "${searchQuery}"` : activeCategory === 'All' ? 'All Articles' : activeCategory}
                  <span style={{ color: '#4a5568', fontSize: '13px', fontWeight: 500, marginLeft: '8px' }}>({filtered.length})</span>
                </span>
              </motion.div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <AnimatePresence>
                  {rest.map((p, i) => <PostCard key={p.id} post={p} delay={i * 0.06} />)}
                </AnimatePresence>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 0', color: '#4a5568' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '15px' }}>No posts found for "{searchQuery}"</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
        </div>
      </div>
    </div>
  );
}
