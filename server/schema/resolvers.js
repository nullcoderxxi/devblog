import jwt from 'jsonwebtoken';
import slugify from '../utils/slugify.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const resolvers = {
  Query: {
    getMe: (_, __, { user }) => user,

    getPosts: async (_, { category, search, page = 1, limit = 9 }) => {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }
      const total = await Post.countDocuments(filter);
      const posts = await Post.find(filter)
        .populate('author', 'name bio role')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return { posts, total, pages: Math.ceil(total / limit), currentPage: page };
    },

    getPost: async (_, { slug }) => {
      return Post.findOne({ slug }).populate('author', 'name bio role');
    },

    getComments: async (_, { postId }) => {
      return Comment.find({ post: postId })
        .populate('author', 'name')
        .sort({ createdAt: -1 });
    },

    getStats: async () => {
      const [totalPosts, totalAuthors, totalComments, viewsAgg] = await Promise.all([
        Post.countDocuments(),
        User.countDocuments(),
        Comment.countDocuments(),
        Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      ]);
      return { totalPosts, totalAuthors, totalComments, totalViews: viewsAgg[0]?.total || 0 };
    },
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const exists = await User.findOne({ email });
      if (exists) throw new Error('Email already registered');
      const user = await User.create({ name, email, password });
      return { token: signToken(user._id), user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) throw new Error('Invalid credentials');
      return { token: signToken(user._id), user };
    },

    createPost: async (_, { input }, { user }) => {
      requireAdmin(user);
      const readTime = input.readTime || `${Math.ceil((input.content.split(' ').length) / 200)} min read`;
      const slug = slugify(input.title);
      return Post.create({ ...input, slug, readTime, author: user._id });
    },

    updatePost: async (_, { id, input }, { user }) => {
      requireAdmin(user);
      const updates = { ...input };
      if (updates.title) updates.slug = slugify(updates.title);
      return Post.findByIdAndUpdate(id, updates, { new: true }).populate('author', 'name bio role');
    },

    deletePost: async (_, { id }, { user }) => {
      requireAdmin(user);
      await Post.findByIdAndDelete(id);
      await Comment.deleteMany({ post: id });
      return true;
    },

    incrementViews: async (_, { slug }) => {
      return Post.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).populate('author', 'name');
    },

    addComment: async (_, { postId, content, parentComment }, { user }) => {
      requireAuth(user);
      const comment = await Comment.create({ content, post: postId, author: user._id, parentComment: parentComment || null });
      return Comment.findById(comment._id).populate('author', 'name');
    },

    deleteComment: async (_, { id }, { user }) => {
      requireAuth(user);
      const comment = await Comment.findById(id);
      if (!comment) throw new Error('Comment not found');
      if (comment.author.toString() !== user._id.toString() && user.role !== 'admin') throw new Error('Not authorized');
      await Comment.findByIdAndDelete(id);
      return true;
    },
  },
};
