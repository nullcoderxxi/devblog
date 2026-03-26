import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { GET_POSTS, GET_STATS } from '../graphql/queries';
import { CREATE_POST, UPDATE_POST, DELETE_POST } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';
import useWindowSize from '../hooks/useWindowSize';

const CATEGORIES = ['React','Node.js','GraphQL','TypeScript','DevOps','MongoDB'];
const COLORS = ['#6366f1','#10b981','#f59e0b','#06b6d4','#8b5cf6','#ec4899'];

const emptyForm = { title: '', excerpt: '', content: '', category: 'React', tags: '', coverColor: '#6366f1', featured: false, readTime: '5 min read' };

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const [view, setView] = useState('posts'); // 'posts' | 'editor'
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saved, setSaved] = useState(false);

  const { data, loading, refetch } = useQuery(GET_POSTS, { variables: { page: 1, limit: 50 } });
  const { data: statsData } = useQuery(GET_STATS);
  const [createPost, { loading: creating }] = useMutation(CREATE_POST);
  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  if (authLoading) return <div style={{ padding: '80px', textAlign: 'center', color: '#718096' }}>Loading...</div>;
  if (!isAdmin) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: '#718096' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>Admin access required</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>← Go Home</button>
    </div>
  );

  const posts = data?.getPosts?.posts || [];
  const stats = statsData?.getStats;

  const openNew = () => { setEditPost(null); setForm(emptyForm); setView('editor'); };
  const openEdit = (p) => {
    setEditPost(p);
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content || '', category: p.category, tags: p.tags?.join(', ') || '', coverColor: p.coverColor || '#6366f1', featured: p.featured || false, readTime: p.readTime || '5 min read' });
    setView('editor');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const input = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (editPost) await updatePost({ variables: { id: editPost._id, input } });
    else await createPost({ variables: { input } });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
    refetch(); setView('posts');
  };

  const handleDelete = async (id) => {
    await deletePost({ variables: { id } });
    refetch(); setDeleteConfirm(null);
  };

  const btnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none',
    background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
    color: active ? '#fff' : '#718096', transition: 'all 0.2s',
  });

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px 16px 80px' : '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: isMobile ? '22px' : '28px', fontWeight: 900, marginBottom: '4px' }}>
            ⚡ Admin Panel
          </h1>
          <p style={{ color: '#4a5568', fontSize: '13px' }}>Manage your blog content</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setView('posts')} style={btnStyle(view === 'posts')}>
            📋 Posts
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={openNew} style={{ ...btnStyle(view === 'editor' && !editPost), background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#fff' }}>
            ✏️ New Post
          </motion.button>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Total Posts', value: stats.totalPosts, emoji: '📝' },
            { label: 'Total Views', value: stats.totalViews?.toLocaleString(), emoji: '👁️' },
            { label: 'Comments', value: stats.totalComments, emoji: '💬' },
            { label: 'Authors', value: stats.totalAuthors, emoji: '👤' },
          ].map(({ label, value, emoji }) => (
            <motion.div key={label} whileHover={{ y: -3, scale: 1.02 }}
              className="glass" style={{ padding: '16px', textAlign: 'center', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{emoji}</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>{value}</div>
              <div style={{ color: '#4a5568', fontSize: '11px', marginTop: '2px' }}>{label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'posts' && (
          <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {loading ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '12px' }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {posts.map((p, i) => (
                  <motion.div key={p._id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="glass"
                    style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{ width: '4px', height: '40px', borderRadius: '2px', background: p.coverColor || '#6366f1', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: 700, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#818cf8', fontSize: '11px' }}>{p.category}</span>
                          <span style={{ color: '#4a5568', fontSize: '11px' }}>👁️ {p.views}</span>
                          {p.featured && <span style={{ color: '#f59e0b', fontSize: '11px' }}>⭐</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        onClick={() => openEdit(p)}
                        style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#818cf8', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Edit
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        onClick={() => setDeleteConfirm(p._id)}
                        style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {view === 'editor' && (
          <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass" style={{ padding: isMobile ? '20px' : '32px', borderRadius: '16px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>
                {editPost ? '✏️ Edit Post' : '✨ New Post'}
              </h2>
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Title *</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="Post title..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d1117' }}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Excerpt *</label>
                  <textarea required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Short description..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Content (Markdown) *</label>
                  <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="Write your post in Markdown..." rows={14}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Tags (comma-separated)</label>
                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                      placeholder="React, Hooks, Performance" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Read Time</label>
                    <input value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })}
                      placeholder="5 min read" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: '#a0aec0', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Cover Color</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {COLORS.map(c => (
                        <button key={c} type="button" onClick={() => setForm({ ...form, coverColor: c })}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: form.coverColor === c ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer', transition: 'border 0.2s' }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#6366f1' }} />
                    <span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 600 }}>⭐ Featured Post</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <motion.button type="submit" disabled={creating || updating}
                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '12px 28px', background: saved ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s' }}>
                    {creating || updating ? 'Saving...' : saved ? '✓ Saved!' : editPost ? 'Update Post' : 'Publish Post'}
                  </motion.button>
                  <motion.button type="button" onClick={() => setView('posts')}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#718096', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ position: 'relative', zIndex: 1, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', textAlign: 'center', maxWidth: '360px', width: '100%' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
              <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Delete Post?</h3>
              <p style={{ color: '#718096', fontSize: '13px', marginBottom: '20px' }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => handleDelete(deleteConfirm)}
                  style={{ padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteConfirm(null)}
                  style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#718096', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
