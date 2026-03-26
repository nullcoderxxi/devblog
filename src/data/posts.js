export const categories = ['All', 'React', 'Node.js', 'MongoDB', 'GraphQL', 'DevOps', 'TypeScript', 'System Design'];

export const posts = [
  {
    id: 1,
    title: 'Building Scalable REST APIs with Node.js and Express',
    slug: 'scalable-rest-apis-nodejs',
    excerpt: 'Learn how to architect production-ready REST APIs with proper authentication, rate limiting, caching, and error handling patterns.',
    content: `## Introduction

Building scalable REST APIs requires careful planning and solid architectural decisions. In this guide, we'll cover everything you need to build production-ready APIs.

## Setting Up Express

\`\`\`javascript
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());
\`\`\`

## Authentication with JWT

JSON Web Tokens provide a stateless authentication mechanism perfect for REST APIs.

\`\`\`javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};
\`\`\`

## Rate Limiting

Protect your API from abuse with express-rate-limit:

\`\`\`javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);
\`\`\`

## Error Handling

Centralised error handling keeps your code clean:

\`\`\`javascript
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message });
});
\`\`\`

## Caching with Redis

> Redis caching can reduce database load by up to **80%** for read-heavy APIs.

## Conclusion

Following these patterns will give you a solid foundation for building APIs that scale to millions of requests.`,
    category: 'Node.js',
    tags: ['Node.js', 'Express', 'REST', 'JWT', 'Redis'],
    author: { name: 'Amandeep Singh', initials: 'AS', role: 'Full Stack Developer' },
    date: 'Mar 20, 2026',
    readTime: '8 min read',
    views: 4820,
    likes: 312,
    featured: true,
    color: '#10b981',
  },
  {
    id: 2,
    title: 'React Performance Optimisation: From Slow to Blazing Fast',
    slug: 'react-performance-optimisation',
    excerpt: 'Deep dive into React.memo, useMemo, useCallback, code splitting, and lazy loading to make your React apps lightning fast.',
    content: `## Why Performance Matters

A 1-second delay in page load can cause a **7% reduction** in conversions. Let's fix that.

## React.memo

Prevent unnecessary re-renders with React.memo:

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
});
\`\`\`

## useMemo and useCallback

\`\`\`jsx
const sortedData = useMemo(() => {
  return data.sort((a, b) => b.value - a.value);
}, [data]);

const handleClick = useCallback((id) => {
  dispatch({ type: 'SELECT', payload: id });
}, [dispatch]);
\`\`\`

## Code Splitting

\`\`\`jsx
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Dashboard />
    </Suspense>
  );
}
\`\`\`

## Virtual Lists

For large lists, use **react-window** to only render visible items — reducing DOM nodes from thousands to dozens.

## Conclusion

Profile first with React DevTools, then apply these techniques where they actually matter.`,
    category: 'React',
    tags: ['React', 'Performance', 'Hooks', 'Optimisation'],
    author: { name: 'Amandeep Singh', initials: 'AS', role: 'Full Stack Developer' },
    date: 'Mar 14, 2026',
    readTime: '6 min read',
    views: 3210,
    likes: 245,
    featured: true,
    color: '#6366f1',
  },
  {
    id: 3,
    title: 'GraphQL vs REST: When to Use Which',
    slug: 'graphql-vs-rest',
    excerpt: 'A practical comparison of GraphQL and REST APIs — covering over-fetching, under-fetching, real-time subscriptions, and when each shines.',
    content: `## The Problem with REST

REST APIs often suffer from **over-fetching** (too much data) or **under-fetching** (multiple requests needed).

## Enter GraphQL

GraphQL lets clients request exactly what they need:

\`\`\`graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    posts {
      title
      createdAt
    }
  }
}
\`\`\`

## Setting Up Apollo Server

\`\`\`javascript
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql\`
  type Query {
    users: [User]
    user(id: ID!): User
  }
\`;

const server = new ApolloServer({ typeDefs, resolvers });
\`\`\`

## When to Use REST

- Simple CRUD operations
- Public APIs consumed by third parties
- Heavy caching requirements (HTTP caching is simpler with REST)

## When to Use GraphQL

- Complex data relationships
- Multiple client types (web, mobile, IoT)
- Rapid frontend iteration

> **Rule of thumb:** Start with REST, migrate to GraphQL when you feel the pain.`,
    category: 'GraphQL',
    tags: ['GraphQL', 'REST', 'API', 'Apollo'],
    author: { name: 'Amandeep Singh', initials: 'AS', role: 'Full Stack Developer' },
    date: 'Mar 8, 2026',
    readTime: '7 min read',
    views: 2890,
    likes: 198,
    featured: false,
    color: '#f59e0b',
  },
  {
    id: 4,
    title: 'MongoDB Schema Design Best Practices',
    slug: 'mongodb-schema-design',
    excerpt: 'Master embedding vs referencing, indexing strategies, and aggregation pipelines to build efficient MongoDB schemas.',
    content: `## Embedding vs Referencing

The most important decision in MongoDB schema design.

**Embed when:**
- Data is frequently read together
- One-to-few relationships
- Data doesn't grow unboundedly

**Reference when:**
- Many-to-many relationships
- Large sub-documents
- Data accessed independently

## Indexing Strategy

\`\`\`javascript
// Compound index for common query patterns
db.posts.createIndex({ author: 1, createdAt: -1 });

// Text index for search
db.posts.createIndex({ title: 'text', content: 'text' });
\`\`\`

## Aggregation Pipeline

\`\`\`javascript
const result = await Post.aggregate([
  { $match: { status: 'published' } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 5 }
]);
\`\`\`

## Conclusion

Design your schema around your query patterns, not your data model.`,
    category: 'MongoDB',
    tags: ['MongoDB', 'Database', 'Schema', 'NoSQL'],
    author: { name: 'Amandeep Singh', initials: 'AS', role: 'Full Stack Developer' },
    date: 'Feb 28, 2026',
    readTime: '9 min read',
    views: 2100,
    likes: 167,
    featured: false,
    color: '#10b981',
  },
  {
    id: 5,
    title: 'Docker & Kubernetes: Containerising Your Node.js App',
    slug: 'docker-kubernetes-nodejs',
    excerpt: 'Step-by-step guide to containerising a Node.js application, pushing to ECR, and deploying to a Kubernetes cluster on AWS EKS.',
    content: `## Writing Your Dockerfile

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
USER node
CMD ["node", "server.js"]
\`\`\`

## Docker Compose for Local Dev

\`\`\`yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/mydb
  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
\`\`\`

## Kubernetes Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
      - name: api
        image: your-ecr-repo/api:latest
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
\`\`\`

> Always set resource **limits** in production to prevent runaway containers from consuming all node resources.`,
    category: 'DevOps',
    tags: ['Docker', 'Kubernetes', 'AWS', 'DevOps', 'Node.js'],
    author: { name: 'Amandeep Singh', initials: 'AS', role: 'Full Stack Developer' },
    date: 'Feb 18, 2026',
    readTime: '11 min read',
    views: 3540,
    likes: 287,
    featured: true,
    color: '#06b6d4',
  },
  {
    id: 6,
    title: 'TypeScript Generics: The Complete Guide',
    slug: 'typescript-generics-guide',
    excerpt: 'Master TypeScript generics from basic type parameters to advanced conditional types, mapped types, and utility types.',
    content: `## What Are Generics?

Generics allow you to write reusable, type-safe code:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>('hello');
\`\`\`

## Generic Interfaces

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const response: ApiResponse<User[]> = await fetchUsers();
\`\`\`

## Conditional Types

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;
type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false
\`\`\`

## Mapped Types

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## Conclusion

Generics are the key to writing reusable, type-safe abstractions in TypeScript.`,
    category: 'TypeScript',
    tags: ['TypeScript', 'Generics', 'Types', 'JavaScript'],
    author: { name: 'Amandeep Singh', initials: 'AS', role: 'Full Stack Developer' },
    date: 'Feb 10, 2026',
    readTime: '10 min read',
    views: 1980,
    likes: 143,
    featured: false,
    color: '#818cf8',
  },
];

export const stats = [
  { label: 'Articles', value: 24, icon: '✍️', color: '#6366f1' },
  { label: 'Total Views', value: 48200, icon: '👁️', color: '#10b981' },
  { label: 'Followers', value: 1840, icon: '❤️', color: '#ec4899' },
  { label: 'Categories', value: 8, icon: '📂', color: '#f59e0b' },
];
