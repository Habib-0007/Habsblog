'use client';

import type React from 'react';

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../stores/authStore';
import type { LoginCredentials } from '../../types/auth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success && data.token && data.refreshToken && data.user) {
        login(data.user, data.token, data.refreshToken);
        toast.success('Login successful!');
        navigate(from, { replace: true });
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || 'Login failed. Please try again.',
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <div className="card-header text-center">
          <h1 className="card-title text-3xl">Login</h1>
          <p className="card-description">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="input"
                placeholder="your@email.com"
                disabled={loginMutation.isPending}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
