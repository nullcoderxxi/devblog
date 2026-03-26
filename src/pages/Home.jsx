import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client/react';
import { useSearchParams } from 'react-router-dom';
import { GET_POSTS } from '../graphql/queries';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import StatsBar from '../components/StatsBar';
import BlogHero from '../three/BlogHero';
import useWindowSize from '../hooks/useWindowSize';

const CATEGORIES = ['All','React','Node.js','GraphQL','TypeScript','DevOps','MongoDB'];

export default function Home() {
  const { isMobile, isTablet } = useWindowSize();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryParam && CATEGORIES.includes(categoryParam)) setActiveCategory(categoryParam);
  }, [categoryParam]);

  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: {
      category: activeCategory === 'All' ? null : activeCategory,
      search: searchQuery || null,
      page: 1, limit: 20,
    },
    fetchPolicy: 'cache-and-network',
  });

  const posts = data?.getPosts?.posts || [];
  const featured = posts.filter(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: isMobile ? '60px 16px 40px' : '80px 24px 50px', textAlign: 'center' }}>
        <BlogHero />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 16px', borderRadius: '20px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '12px', fontWeight: 700, marginBottom: '20px' }}>
            ✨ Full Stack Developer Blog
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: isMobile ? '28px' : '52px', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-2px' }}>
            Thoughts on{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Full Stack Dev
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ color: '#718096', fontSize: isMobile ? '14px' : '17px', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Deep dives into React, Node.js, GraphQL, MongoDB, TypeScript and modern DevOps.
          </motion.p>

          {/* Category pills */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {CATEGORIES.map((cat, i) => (
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleCategory(cat)}
                style={{
                  padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  background: activeCategory === cat ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  border: activeCategory === cat ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                  color: activeCategory === cat ? '#fff' : '#718096',
                }}>
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: isMobile ? '0 16px 80px' : '0 24px 80px' }}>
        {/* Stats */}
        <div style={{ marginBottom: '36px' }}>
          <StatsBar />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 280px', gap: '28px', alignItems: 'start' }}>
          <div>
            {loading && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="skeleton" style={{ height: '6px' }} />
                    <div style={{ padding: '20px' }}>
                      <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '12px', borderRadius: '6px' }} />
                      <div className="skeleton" style={{ height: '22px', width: '90%', marginBottom: '8px', borderRadius: '6px' }} />
                      <div className="skeleton" style={{ height: '14px', width: '100%', borderRadius: '6px' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
                <p>Failed to load posts. Is the server running?</p>
                <p style={{ color: '#4a5568', fontSize: '13px', marginTop: '8px' }}>Make sure the GraphQL server is running on port 4000</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Featured */}
                {featured.length > 0 && !searchQuery && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '13px' }}>⭐</span>
                      <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>Featured Articles</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                      {featured.map((p, i) => <PostCard key={p._id} post={p} delay={i * 0.08} featured />)}
                    </div>
                  </div>
                )}

                {/* Rest */}
                {rest.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>
                        {searchQuery ? `Results for "${searchQuery}"` : activeCategory === 'All' ? 'All Articles' : activeCategory}
                        <span style={{ color: '#4a5568', fontSize: '13px', fontWeight: 500, marginLeft: '8px' }}>({posts.length})</span>
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      <AnimatePresence>
                        {rest.map((p, i) => <PostCard key={p._id} post={p} delay={i * 0.06} />)}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {posts.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0', color: '#4a5568' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                    <p style={{ fontSize: '16px', color: '#718096' }}>
                      {searchQuery ? `No results for "${searchQuery}"` : 'No posts yet. Check back soon!'}
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Sidebar onCategorySelect={handleCategory} activeCategory={activeCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}
