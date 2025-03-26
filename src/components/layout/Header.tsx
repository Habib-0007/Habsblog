'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  LogOut,
  FileText,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b-2 border-black bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold gradient-text-vibrant">
              HabsBlog
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-bold hover:text-primary">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/posts/create"
                  className="font-bold hover:text-primary"
                >
                  Write
                </Link>
                <Link
                  to="/posts/drafts"
                  className="font-bold hover:text-primary"
                >
                  Drafts
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2"
                  >
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name}
                      size="sm"
                      className="cursor-pointer hover:opacity-80"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 neobrutalism-card z-50">
                      <div className="py-1">
                        <p className="px-4 py-2 font-bold border-b border-black">
                          {user?.name}
                        </p>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 hover:bg-muted"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/posts/drafts"
                          className="flex items-center px-4 py-2 hover:bg-muted"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          My Drafts
                        </Link>
                        <Link
                          to="/profile/edit"
                          className="flex items-center px-4 py-2 hover:bg-muted"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-2 hover:bg-muted"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-muted"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white"
                    variant="outline"
                    size="sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white"
                    size="sm"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-black">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="font-bold hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/posts/create"
                    className="font-bold hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Write
                  </Link>
                  <Link
                    to="/posts/drafts"
                    className="font-bold hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Drafts
                  </Link>
                  <Link
                    to="/profile"
                    className="font-bold hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="font-bold hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left font-bold text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white w-full"
                      variant="outline"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
