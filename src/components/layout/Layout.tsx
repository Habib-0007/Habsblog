import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeProvider from './ThemeProvider';

const Layout = () => {
  const { isAuthenticated, login, logout, setInitialized } = useAuthStore();
  const { theme } = useThemeStore();

  // Check if user is authenticated on initial load
  const { data, isError } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      logout();
    }

    setInitialized(true);
  }, [isError, logout, setInitialized]);

  // Apply theme class to document
  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
