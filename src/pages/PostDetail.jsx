import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { posts } from '../data/posts';
import PostCard from '../components/PostCard';
import useWindowSize from '../hooks/useWindowSize';
import { ArrowLeft, Clock, Eye, Heart, Calendar, Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const post = posts.find(p => p.slug === slug);
  const related = posts.filter(p => p.slug !== slug && p.category === post?.category).slice(0, 2);

  if (!post) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#718096' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>Post not found</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>← Back Home</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '20px 16px 80px' : '32px 24px 80px' }}>

      {/* Back button */}
      <motion.button onClick={() => navigate('/')} whileHover={{ x: -4 }} whileTap={{ scale: 0.97 }}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 14px', color: '#a0aec0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '28px' }}>
        <ArrowLeft size={14} /> Back to Blog
      </motion.button>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 260px', gap: '32px', alignItems: 'start' }}>
        {/* Article */}
        <div>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: post.color, background: `${post.color}18`, border: `1px solid ${post.color}30` }}>
                {post.category}
              </span>
              {post.featured && <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: '#f59e0b', background: '#f59e0b18', border: '1px solid #f59e0b30' }}>⭐ Featured</span>}
            </div>

            <h1 style={{ fontSize: isMobile ? '22px' : '30px', fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: '16px', letterSpacing: '-0.5px' }}>
              {post.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff' }}>AS</div>
                <div>
                  <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{post.author.name}</p>
                  <p style={{ color: '#4a5568', fontSize: '11px' }}>{post.author.role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                {[
                  { icon: Calendar, text: post.date },
                  { icon: Clock, text: post.readTime },
                  { icon: Eye, text: `${post.views.toLocaleString()} views` },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4a5568', fontSize: '12px' }}>
                    <Icon size={12} />{text}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
              {[
                { icon: Heart, label: liked ? `${post.likes + 1} Liked` : `${post.likes} Likes`, action: () => setLiked(!liked), active: liked, color: '#ec4899' },
                { icon: Bookmark, label: bookmarked ? 'Saved' : 'Save', action: () => setBookmarked(!bookmarked), active: bookmarked, color: '#6366f1' },
                { icon: Share2, label: 'Share', action: () => {}, active: false, color: '#10b981' },
              ].map(({ icon: Icon, label, action, active, color }) => (
                <motion.button key={label} onClick={action} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.1)'}`, background: active ? `${color}15` : 'rgba(255,255,255,0.04)', color: active ? color : '#718096', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <Icon size={14} />{label}
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(99,102,241,0.4), transparent)', marginBottom: '28px' }} />
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="prose" style={{ marginBottom: '40px' }}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </motion.div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {post.tags.map(tag => (
              <motion.span key={tag} whileHover={{ scale: 1.06, y: -2 }}
                style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', cursor: 'pointer' }}>
                #{tag}
              </motion.span>
            ))}
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div>
              <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Related Articles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '14px' }}>
                {related.map((p, i) => <PostCard key={p.id} post={p} delay={i * 0.1} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sticky author card */}
        {!isMobile && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            style={{ position: 'sticky', top: '80px' }}>
            <div className="glass" style={{ padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 auto 12px' }}>AS</div>
              <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Amandeep Singh</h4>
              <p style={{ color: '#6366f1', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>Full Stack Developer</p>
              <p style={{ color: '#718096', fontSize: '12px', lineHeight: 1.6, marginBottom: '16px' }}>Building scalable web apps with MERN stack. Writing about code, architecture, and developer tools.</p>
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
                style={{ width: '100%', padding: '9px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                Follow
              </motion.button>
            </div>

            {/* Article info */}
            <div className="glass" style={{ padding: '20px' }}>
              <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>Article Info</h4>
              {[
                { label: 'Published', value: post.date },
                { label: 'Read time', value: post.readTime },
                { label: 'Views', value: post.views.toLocaleString() },
                { label: 'Likes', value: post.likes },
                { label: 'Category', value: post.category },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#4a5568', fontSize: '12px' }}>{label}</span>
                  <span style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
