import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@apollo/client/react';
import { LOGIN, REGISTER } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const [loginMutation, { loading: loggingIn }] = useMutation(LOGIN);
  const [registerMutation, { loading: registering }] = useMutation(REGISTER);

  const loading = loggingIn || registering;

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const vars = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const mutation = mode === 'login' ? loginMutation : registerMutation;
      const key = mode === 'login' ? 'login' : 'register';
      const { data } = await mutation({ variables: vars });
      login(data[key].token, data[key].user);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-8 shadow-2xl"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl font-bold text-white mb-2 relative">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {mode === 'login' ? 'Sign in to comment and interact' : 'Join the DevBlog community'}
          </p>

          <form onSubmit={handle} className="space-y-4">
            {mode === 'register' && (
              <input
                type="text" placeholder="Full name" required
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            )}
            <input
              type="email" placeholder="Email address" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <input
              type="password" placeholder="Password" required minLength={6}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <p className="mt-4 text-center text-gray-400 text-sm">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-indigo-400 hover:text-indigo-300 font-medium">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
