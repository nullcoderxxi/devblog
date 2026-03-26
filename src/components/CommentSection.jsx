import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COMMENTS } from '../graphql/queries';
import { ADD_COMMENT, DELETE_COMMENT } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Avatar({ name, size = 8 }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = ['from-indigo-500 to-purple-500', 'from-cyan-500 to-blue-500', 'from-pink-500 to-rose-500', 'from-amber-500 to-orange-500'];
  const idx = name?.charCodeAt(0) % colors.length || 0;
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const { data, loading, refetch } = useQuery(GET_COMMENTS, { variables: { postId } });
  const [addComment, { loading: adding }] = useMutation(ADD_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addComment({ variables: { postId, content: text, parentComment: replyTo } });
    setText(''); setReplyTo(null);
    refetch();
  };

  const remove = async (id) => {
    await deleteComment({ variables: { id } });
    refetch();
  };

  const comments = data?.getComments || [];
  const topLevel = comments.filter(c => !c.parentComment);
  const replies = (parentId) => comments.filter(c => c.parentComment === parentId);

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-indigo-400">💬</span>
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {user ? (
        <form onSubmit={submit} className="mb-8">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-sm text-indigo-400">
              <span>Replying to comment</span>
              <button type="button" onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
          )}
          <div className="flex gap-3">
            <Avatar name={user.name} />
            <div className="flex-1 flex gap-2">
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={2}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-sm"
              />
              <motion.button
                type="submit" disabled={adding || !text.trim()}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm disabled:opacity-40 transition-colors self-end"
              >
                {adding ? '...' : 'Post'}
              </motion.button>
            </div>
          </div>
        </form>
      ) : (
        <motion.div
          className="mb-8 p-4 border border-white/10 rounded-xl bg-white/5 text-center"
          whileHover={{ borderColor: 'rgba(99,102,241,0.4)' }}
        >
          <p className="text-gray-400 text-sm">
            <button onClick={() => setShowAuth(true)} className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</button>
            {' '}to join the discussion
          </p>
        </motion.div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded w-32" />
                <div className="h-3 bg-white/10 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {topLevel.map((comment, i) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mb-6"
            >
              <div className="flex gap-3">
                <Avatar name={comment.author?.name} />
                <div className="flex-1">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">{comment.author?.name}</span>
                      <span className="text-gray-500 text-xs">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                  <div className="flex gap-3 mt-1 ml-1">
                    {user && (
                      <button onClick={() => setReplyTo(comment._id)} className="text-xs text-gray-500 hover:text-indigo-400 transition-colors">Reply</button>
                    )}
                    {user && (user._id === comment.author?._id || user.role === 'admin') && (
                      <button onClick={() => remove(comment._id)} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Delete</button>
                    )}
                  </div>

                  {/* Replies */}
                  {replies(comment._id).map(reply => (
                    <div key={reply._id} className="flex gap-3 mt-3 ml-4">
                      <Avatar name={reply.author?.name} size={6} />
                      <div className="flex-1">
                        <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-xs">{reply.author?.name}</span>
                            <span className="text-gray-500 text-xs">{timeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-300 text-xs leading-relaxed">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {comments.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-8">Be the first to comment!</p>
      )}
    </div>
  );
}
