import { motion } from 'framer-motion';
import { Clock, Eye, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTilt from '../hooks/useTilt';

export default function PostCard({ post, delay = 0, featured = false }) {
  const navigate = useNavigate();
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(featured ? 8 : 12);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: 'spring', stiffness: 180 }}
      onClick={() => navigate(`/post/${post.slug}`)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(14px)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: '16px',
        padding: featured ? '28px' : '22px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top glow accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${post.color}, ${post.color}44)`, borderRadius: '16px 16px 0 0' }} />

      {/* Glow orb */}
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: `radial-gradient(circle, ${post.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Category + featured badge */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: post.color, background: `${post.color}18`, border: `1px solid ${post.color}30` }}>
          {post.category}
        </span>
        {post.featured && (
          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: '#f59e0b', background: '#f59e0b18', border: '1px solid #f59e0b30' }}>
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{ color: '#fff', fontSize: featured ? '18px' : '15px', fontWeight: 700, lineHeight: 1.4, marginBottom: '10px', flex: 1 }}>
        {post.title}
      </h3>

      {/* Excerpt */}
      <p style={{ color: '#718096', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {post.excerpt}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {post.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4a5568', fontSize: '11px' }}>
            <Clock size={11} />{post.readTime}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4a5568', fontSize: '11px' }}>
            <Eye size={11} />{post.views.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4a5568', fontSize: '11px' }}>
            <Heart size={11} />{post.likes}
          </div>
        </div>
        <motion.div whileHover={{ x: 4 }} style={{ color: post.color, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
          Read <ArrowRight size={13} />
        </motion.div>
      </div>
    </motion.div>
  );
}
