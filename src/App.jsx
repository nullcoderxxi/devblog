import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './graphql/client';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import TechBadges from './components/TechBadges';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Admin from './pages/Admin';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ background: '#0c0e16', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
            <TechBadges />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}
