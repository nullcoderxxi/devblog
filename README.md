# DevBlog CMS ✍️

> Built by **Amandeep Singh** | Full Stack MERN Developer

A full-stack developer blog CMS with GraphQL API, JWT auth, admin panel, Three.js hero, syntax highlighting, nested comments, and rich animations.

**🔗 Live Demo:** [coming soon](#)
**📁 GitHub:** [github.com/nullcoderxxi/devblog](https://github.com/nullcoderxxi/devblog)

---

## Tech Stack

**Frontend**
- React.js + Vite
- Three.js + React Three Fiber — 3D particle hero background
- Framer Motion — spring physics, 3D tilt, stagger, AnimatePresence
- Apollo Client v4 — GraphQL state management
- React Markdown + React Syntax Highlighter — article rendering
- React Router DOM

**Backend**
- Node.js + Express
- Apollo Server v4 + GraphQL
- MongoDB + Mongoose
- JWT Authentication + bcrypt
- RESTful health endpoint

---

## Features

- 🎨 Three.js animated particle hero with floating cubes
- 🔐 JWT auth — sign up, sign in, admin access
- ⚡ Admin panel — create / edit / delete posts (Markdown editor)
- 💬 Nested comment system (requires auth)
- 📊 Live stats bar with count-up animations
- 🃏 3D tilt post cards with mouse tracking
- ✨ Syntax highlighted code blocks with copy button
- 📖 Reading progress bar
- 🔍 Full-text search with animated expand
- 📱 Fully responsive (mobile / tablet / desktop)
- 🏷️ Category + tag filtering
- 📌 Sticky author sidebar
- 🌓 Dark glassmorphism design

---

## Getting Started

### 1. Frontend
```bash
npm install
cp .env.example .env   # set VITE_GRAPHQL_URL
npm run dev
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env   # set MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Seed Database
```bash
cd server
npm run seed
# Admin: amandeepsiingh22@gmail.com / Admin@123
```

---

Built with ❤️ by **Amandeep Singh**
[GitHub](https://github.com/nullcoderxxi) · [LinkedIn](https://www.linkedin.com/in/aman1999/)
