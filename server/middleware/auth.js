import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const getUser = async (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    return await User.findById(decoded.id).select('-password');
  } catch {
    return null;
  }
};

export const requireAuth = (user) => {
  if (!user) throw new Error('Authentication required');
  return user;
};

export const requireAdmin = (user) => {
  requireAuth(user);
  if (user.role !== 'admin' && user.role !== 'author') throw new Error('Access denied');
  return user;
};
