import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { authApi } from '../../api/authApi';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, refreshToken, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold font-heading text-primary">
                HabsBlog
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  to="/posts/create"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                >
                  Write
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/drafts"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                >
                  My Drafts
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProfile();
                    }}
                    className="flex text-sm rounded-full focus:outline-none"
                  >
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name || 'User'}
                      fallback={user?.name?.charAt(0) || 'U'}
                      className="h-8 w-8"
                    />
                  </button>
                </div>

                {isProfileOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>

                      <Link
                        to="/drafts"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FileText size={16} className="mr-2" />
                        My Drafts
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard size={16} className="mr-2" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted text-left"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex md:items-center md:ml-6 md:space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dark"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu();
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" onClick={(e) => e.stopPropagation()}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/posts/create"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Write
                </Link>
                <Link
                  to="/drafts"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Drafts
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
