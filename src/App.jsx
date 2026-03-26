import './index.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TechBadges from './components/TechBadges';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <div style={{ background: '#0c0e16', minHeight: '100vh' }}>
        <Navbar onSearch={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/post/:slug" element={<PostDetail />} />
        </Routes>
        <TechBadges />
      </div>
    </BrowserRouter>
  );
}
