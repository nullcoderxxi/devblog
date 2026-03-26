import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_POST, GET_POSTS } from '../graphql/queries';
import { INCREMENT_VIEWS } from '../graphql/mutations';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';
import ReadingProgress from '../components/ReadingProgress';
import SyntaxBlock from '../components/SyntaxBlock';
import useWindowSize from '../hooks/useWindowSize';
import { useState, useEffect } from 'react';

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { data, loading, error } = useQuery(GET_POST, { variables: { slug } });
  const [incrementViews] = useMutation(INCREMENT_VIEWS);

  const post = data?.getPost;

  const { data: relatedData } = useQuery(GET_POSTS, {
    variables: { category: post?.category, page: 1, limit: 4 },
    skip: !post,
  });
  const related = (relatedData?.getPosts?.posts || []).filter(p => p.slug !== slug).slice(0, 2);

  useEffect(() => {
    if (slug) incrementViews({ variables: { slug } }).catch(() => {});
  }, [slug]);

  const mdComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match
        ? <SyntaxBlock language={match[1]}>{children}</SyntaxBlock>
        : <code style={{ background: 'rgba(99,102,241,0.15)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85em', color: '#818cf8', fontFamily: 'monospace' }} {...props}>{children}</code>;
    },
    h1: ({ children }) => <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: '#fff', marginTop: '32px', marginBottom: '16px', lineHeight: 1.3 }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: '#e2e8f0', marginTop: '28px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.3 }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#cbd5e0', marginTop: '20px', marginBottom: '10px' }}>{children}</h3>,
    p: ({ children }) => <p style={{ color: '#a0aec0', lineHeight: 1.8, marginBottom: '16px', fontSize: '15px' }}>{children}</p>,
    ul: ({ children }) => <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: '#a0aec0' }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ paddingLeft: '20px', marginBottom: '16px', color: '#a0aec0' }}>{children}</ol>,
    li: ({ children }) => <li style={{ marginBottom: '6px', lineHeight: 1.7 }}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: '3px solid #6366f1', paddingLeft: '16px', margin: '20px 0', color: '#718096', fontStyle: 'italic', background: 'rgba(99,102,241,0.05)', borderRadius: '0 8px 8px 0', padding: '12px 16px' }}>
        {children}
      </blockquote>
    ),
    strong: ({ children }) => <strong style={{ color: '#e2e8f0', fontWeight: 700 }}>{children}</strong>,
    a: ({ href, children }) => <a href={href} style={{ color: '#818cf8', textDecoration: 'underline', textDecorationColor: 'rgba(129,140,248,0.4)' }} target="_blank" rel="noreferrer">{children}</a>,
  };

  if (loading) return (
    <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 24px' }}>
      <ReadingProgress />
      <div className="skeleton" style={{ height: '12px', width: '80px', marginBottom: '32px', borderRadius: '6px' }} />
      <div className="skeleton" style={{ height: '36px', width: '90%', marginBottom: '16px', borderRadius: '8px' }} />
      <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '32px', borderRadius: '6px' }} />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '14px', width: `${80 + Math.random() * 20}%`, marginBottom: '10px', borderRadius: '4px' }} />
      ))}
    </div>
  );

  if (error || !post) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#718096' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>Post not found</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>← Back Home</button>
    </div>
  );

  const accentColor = post.coverColor || '#6366f1';
  const publishDate = new Date(Number(post.createdAt) || post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <ReadingProgress />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '20px 16px 80px' : '32px 24px 80px' }}>

        {/* Back */}
        <motion.button onClick={() => navigate('/')} whileHover={{ x: -4 }} whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 14px', color: '#a0aec0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '28px' }}>
          ← Back to Blog
        </motion.button>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 260px', gap: '32px', alignItems: 'start' }}>
          {/* Main article */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Category + featured badge */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: accentColor, background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
                  {post.category}
                </span>
                {post.featured && <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: '#f59e0b', background: '#f59e0b18', border: '1px solid #f59e0b30' }}>⭐ Featured</span>}
              </div>

              <h1 style={{ fontSize: isMobile ? '24px' : '34px', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                {post.title}
              </h1>

              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                    {post.author?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{post.author?.name}</p>
                    <p style={{ color: '#4a5568', fontSize: '11px' }}>Full Stack Developer</p>
                  </div>
                </div>
                {[
                  { emoji: '📅', text: publishDate },
                  { emoji: '⏱️', text: post.readTime },
                  { emoji: '👁️', text: `${(post.views || 0).toLocaleString()} views` },
                ].map(({ emoji, text }) => (
                  <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4a5568', fontSize: '12px' }}>
                    {emoji} {text}
                  </span>
                ))}
              </div>

              {/* Action btns */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
                {[
                  { emoji: '❤️', label: liked ? 'Liked!' : 'Like', action: () => setLiked(!liked), active: liked, color: '#ec4899' },
                  { emoji: '🔖', label: bookmarked ? 'Saved' : 'Save', action: () => setBookmarked(!bookmarked), active: bookmarked, color: '#6366f1' },
                  { emoji: '🔗', label: 'Share', action: () => navigator.clipboard?.writeText(window.location.href), active: false, color: '#10b981' },
                ].map(({ emoji, label, action, active, color }) => (
                  <motion.button key={label} onClick={action} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: `1px solid ${active ? color + '50' : 'rgba(255,255,255,0.1)'}`, background: active ? `${color}15` : 'rgba(255,255,255,0.04)', color: active ? color : '#718096', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {emoji} {label}
                  </motion.button>
                ))}
              </div>

              <div style={{ height: '1px', background: `linear-gradient(90deg, ${accentColor}60, transparent)`, marginBottom: '28px' }} />
            </motion.div>

            {/* Content */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
              style={{ marginBottom: '40px' }}>
              <ReactMarkdown components={mdComponents}>{post.content}</ReactMarkdown>
            </motion.div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {post.tags?.map(tag => (
                <motion.span key={tag} whileHover={{ scale: 1.06, y: -2 }}
                  style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', cursor: 'pointer' }}>
                  #{tag}
                </motion.span>
              ))}
            </div>

            {/* Comments */}
            <CommentSection postId={post._id} />

            {/* Related */}
            {related.length > 0 && (
              <div style={{ marginTop: '48px' }}>
                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Related Articles</h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '14px' }}>
                  {related.map((p, i) => <PostCard key={p._id} post={p} delay={i * 0.1} />)}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          {!isMobile && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              style={{ position: 'sticky', top: '80px' }}>
              {/* Author card */}
              <div className="glass" style={{ padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 auto 12px' }}>
                  {post.author?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{post.author?.name}</h4>
                <p style={{ color: '#6366f1', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>Full Stack Developer</p>
                <p style={{ color: '#718096', fontSize: '12px', lineHeight: 1.6, marginBottom: '16px' }}>
                  {post.author?.bio || 'Building scalable web apps with MERN stack. Writing about code, architecture, and developer tools.'}
                </p>
              </div>

              {/* Article info */}
              <div className="glass" style={{ padding: '20px' }}>
                <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>Article Info</h4>
                {[
                  { label: 'Published', value: publishDate },
                  { label: 'Read time', value: post.readTime },
                  { label: 'Views', value: (post.views || 0).toLocaleString() },
                  { label: 'Category', value: post.category },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#4a5568', fontSize: '12px' }}>{label}</span>
                    <span style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* TOC placeholder */}
              <div className="glass" style={{ padding: '20px', marginTop: '16px' }}>
                <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Quick Links</h4>
                <Link to="/" style={{ display: 'block', color: '#718096', fontSize: '13px', marginBottom: '8px', textDecoration: 'none' }}>← All Articles</Link>
                <Link to={`/?category=${post.category}`} style={{ display: 'block', color: '#818cf8', fontSize: '13px', textDecoration: 'none' }}>More in {post.category}</Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
