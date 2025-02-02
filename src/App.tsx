import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';
import UserTimeline from './pages/UserTimeline';
import BlogTimeline from './pages/BlogTimeline';
import CreatePost from './pages/CreatePost';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <section className="mt-16">
        <Routes>
          <Route index path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user-timeline" element={<UserTimeline />} />
          <Route path="/blog-timeline" element={<BlogTimeline />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </section>
    </Router>
  );
};

export default App;
