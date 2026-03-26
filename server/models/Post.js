import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  coverColor: { type: String, default: '#6366f1' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  readTime: { type: String, default: '5 min read' },
}, { timestamps: true });

postSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('Post', postSchema);
