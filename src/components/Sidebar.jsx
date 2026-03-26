import { motion } from 'framer-motion';
import { posts, categories } from '../data/posts';
import { TrendingUp, Tag, Clock } from 'lucide-react';

const tagColors = ['#6366f1','#10b981','#f59e0b','#06b6d4','#ec4899','#8b5cf6','#10b981','#f59e0b'];

export default function Sidebar({ onCategorySelect, activeCategory }) {
  const allTags = [...new Set(posts.flatMap(p => p.tags))].slice(0, 12);
  const popular = [...posts].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Categories */}
      <motion.div className="glass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <TrendingUp size={14} color="#6366f1" />
          <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>Categories</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map((cat, i) => {
            const count = cat === 'All' ? posts.length : posts.filter(p => p.category === cat).length;
            return (
              <motion.button key={cat} onClick={() => onCategorySelect?.(cat)}
                whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400 }}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeCategory === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: activeCategory === cat ? '#818cf8' : '#718096',
                  fontSize: '13px', fontWeight: activeCategory === cat ? 700 : 500,
                  transition: 'background 0.2s',
                }}>
                <span>{cat}</span>
                <span style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1px 8px', fontSize: '11px' }}>{count}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div className="glass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Tag size={14} color="#6366f1" />
          <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>Popular Tags</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {allTags.map((tag, i) => (
            <motion.span key={tag} whileHover={{ scale: 1.08, y: -2 }}
              style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: tagColors[i % tagColors.length], background: `${tagColors[i % tagColors.length]}15`, border: `1px solid ${tagColors[i % tagColors.length]}30`, cursor: 'pointer' }}>
              #{tag}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Popular posts */}
      <motion.div className="glass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Clock size={14} color="#6366f1" />
          <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>Most Read</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {popular.map((p, i) => (
            <motion.div key={p.id} whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400 }}
              style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${p.color}20`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: p.color, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div>
                <p style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600, lineHeight: 1.4, marginBottom: '3px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</p>
                <span style={{ color: '#4a5568', fontSize: '11px' }}>{p.views.toLocaleString()} views</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
