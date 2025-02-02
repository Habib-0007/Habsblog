import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Our Blog</h1>
      <p>Share your thoughts and connect with others.</p>
      <div>
        <Link to="/signup">
          <button>Get Started</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
