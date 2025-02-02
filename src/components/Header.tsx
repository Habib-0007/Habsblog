import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-xl font-bold text-gray-800 ">Habsblog</h1>
        <nav>
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-500">
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user-timeline"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    My Posts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog-timeline"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    All Posts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-post"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Create Post
                  </Link>
                </li>
                <li>
                  <button
                    className="bg-red-600 text-white px-[12px] py-[4px]"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isOpen ? '✖' : '☰'}
          </button>
        </nav>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isOpen ? 'block' : 'hidden'
        } bg-white shadow-md`}
      >
        <ul className="flex flex-col items-center space-y-4 py-4">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-500"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/user-timeline"
                  className="text-gray-700 hover:text-blue-500"
                >
                  My Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/blog-timeline"
                  className="text-gray-700 hover:text-blue-500"
                >
                  All Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/create-post"
                  className="text-gray-700 hover:text-blue-500"
                >
                  Create Post
                </Link>
              </li>
              <li>
                <button
                  className="bg-red-600 text-white px-[12px] py-[4px]"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-gray-700 hover:text-blue-500">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-blue-500"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
