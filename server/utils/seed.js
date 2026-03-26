import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

const seedData = async () => {
  await connectDB();

  await User.deleteMany();
  await Post.deleteMany();

  const admin = await User.create({
    name: 'Amandeep Singh',
    email: 'amandeepsiingh22@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    bio: 'Full-stack MERN developer with 3+ years of experience. MSc Project Management, BPP University London.',
  });

  const posts = [
    {
      title: 'Building Scalable REST APIs with Node.js and Express',
      excerpt: 'Learn how to architect production-ready REST APIs with JWT auth, rate limiting, caching, and error handling.',
      content: `## Introduction\n\nBuilding scalable REST APIs requires careful planning. In this guide we cover everything needed for production.\n\n## JWT Authentication\n\n\`\`\`javascript\nconst token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });\n\`\`\`\n\n## Rate Limiting\n\n\`\`\`javascript\nconst limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });\napp.use('/api/', limiter);\n\`\`\`\n\n## Caching with Redis\n\n> Redis caching can reduce database load by up to **80%** for read-heavy APIs.\n\n## Conclusion\n\nFollowing these patterns gives you a solid foundation for APIs that scale to millions of requests.`,
      category: 'Node.js', tags: ['Node.js', 'Express', 'REST', 'JWT'], coverColor: '#10b981', featured: true, views: 4820, author: admin._id,
      slug: 'building-scalable-rest-apis-nodejs-' + Date.now().toString(36),
      readTime: '8 min read',
    },
    {
      title: 'React Performance Optimisation: From Slow to Blazing Fast',
      excerpt: 'Deep dive into React.memo, useMemo, useCallback, code splitting and lazy loading.',
      content: `## Why Performance Matters\n\nA 1-second delay causes a **7% reduction** in conversions.\n\n## React.memo\n\n\`\`\`jsx\nconst Component = React.memo(({ data }) => {\n  return <div>{data}</div>;\n});\n\`\`\`\n\n## useMemo and useCallback\n\n\`\`\`jsx\nconst sorted = useMemo(() => data.sort(), [data]);\nconst handler = useCallback((id) => dispatch(id), [dispatch]);\n\`\`\`\n\n## Code Splitting\n\n\`\`\`jsx\nconst Dashboard = lazy(() => import('./Dashboard'));\n\`\`\``,
      category: 'React', tags: ['React', 'Performance', 'Hooks'], coverColor: '#6366f1', featured: true, views: 3210, author: admin._id,
      slug: 'react-performance-optimisation-' + Date.now().toString(36),
      readTime: '6 min read',
    },
    {
      title: 'GraphQL vs REST: When to Use Which',
      excerpt: 'A practical comparison covering over-fetching, under-fetching, subscriptions and when each shines.',
      content: `## The Problem with REST\n\nREST APIs often suffer from **over-fetching** or **under-fetching**.\n\n## GraphQL Query\n\n\`\`\`graphql\nquery GetUser($id: ID!) {\n  user(id: $id) {\n    name\n    posts { title }\n  }\n}\n\`\`\`\n\n## When to Use REST\n- Simple CRUD, public APIs, heavy caching\n\n## When to Use GraphQL\n- Complex data relationships, multiple clients\n\n> **Rule:** Start with REST, migrate to GraphQL when you feel the pain.`,
      category: 'GraphQL', tags: ['GraphQL', 'REST', 'API', 'Apollo'], coverColor: '#f59e0b', featured: false, views: 2890, author: admin._id,
      slug: 'graphql-vs-rest-' + Date.now().toString(36),
      readTime: '7 min read',
    },
    {
      title: 'Docker & Kubernetes: Containerising Your Node.js App',
      excerpt: 'Step-by-step guide to containerising Node.js, pushing to ECR, and deploying to AWS EKS.',
      content: `## Dockerfile\n\n\`\`\`dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]\n\`\`\`\n\n## Docker Compose\n\n\`\`\`yaml\nservices:\n  api:\n    build: .\n    ports:\n      - "3000:3000"\n  mongo:\n    image: mongo:6\n\`\`\`\n\n> Always set resource **limits** in production.`,
      category: 'DevOps', tags: ['Docker', 'Kubernetes', 'AWS', 'DevOps'], coverColor: '#06b6d4', featured: true, views: 3540, author: admin._id,
      slug: 'docker-kubernetes-nodejs-' + Date.now().toString(36),
      readTime: '11 min read',
    },
    {
      title: 'MongoDB Schema Design Best Practices',
      excerpt: 'Master embedding vs referencing, indexing strategies and aggregation pipelines.',
      content: `## Embedding vs Referencing\n\n**Embed when:** data is read together, one-to-few relationships.\n\n**Reference when:** many-to-many, large sub-documents.\n\n## Indexing\n\n\`\`\`javascript\ndb.posts.createIndex({ author: 1, createdAt: -1 });\ndb.posts.createIndex({ title: 'text', content: 'text' });\n\`\`\`\n\n## Aggregation Pipeline\n\n\`\`\`javascript\nconst result = await Post.aggregate([\n  { $match: { status: 'published' } },\n  { $group: { _id: '$category', count: { $sum: 1 } } },\n]);\n\`\`\``,
      category: 'MongoDB', tags: ['MongoDB', 'Database', 'Schema', 'NoSQL'], coverColor: '#10b981', featured: false, views: 2100, author: admin._id,
      slug: 'mongodb-schema-design-' + Date.now().toString(36),
      readTime: '9 min read',
    },
    {
      title: 'TypeScript Generics: The Complete Guide',
      excerpt: 'Master TypeScript generics from basic type parameters to advanced conditional and mapped types.',
      content: `## What Are Generics?\n\n\`\`\`typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\`\`\`\n\n## Generic Interfaces\n\n\`\`\`typescript\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n}\n\`\`\`\n\n## Conditional Types\n\n\`\`\`typescript\ntype IsArray<T> = T extends any[] ? true : false;\n\`\`\`\n\n## Mapped Types\n\n\`\`\`typescript\ntype Readonly<T> = { readonly [P in keyof T]: T[P] };\n\`\`\``,
      category: 'TypeScript', tags: ['TypeScript', 'Generics', 'Types'], coverColor: '#818cf8', featured: false, views: 1980, author: admin._id,
      slug: 'typescript-generics-guide-' + Date.now().toString(36),
      readTime: '10 min read',
    },
  ];

  await Post.insertMany(posts);
  console.log('✅ Database seeded successfully');
  console.log(`👤 Admin: amandeepsiingh22@gmail.com / Admin@123`);
  mongoose.connection.close();
};

seedData().catch(console.error);
