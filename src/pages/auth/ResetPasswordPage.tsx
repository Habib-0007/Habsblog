'use client';

import type React from 'react';

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { password: string }) =>
      authApi.resetPassword(token!, data),
    onSuccess: () => {
      toast.success('Password reset successful!');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error ||
          'Failed to reset password. The link may be invalid or expired.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    resetPasswordMutation.mutate({ password });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card">
          <div className="card-header text-center">
            <h1 className="card-title text-3xl">Invalid Reset Link</h1>
            <p className="card-description text-red-500">
              The password reset link is invalid or has expired.
            </p>
          </div>

          <div className="card-content">
            <p className="text-sm text-muted-foreground mb-6">
              Please request a new password reset link.
            </p>

            <div className="flex flex-col space-y-4">
              <Link to="/forgot-password" className="btn btn-primary w-full">
                Request New Link
              </Link>

              <Link
                to="/login"
                className="btn btn-ghost w-full flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <div className="card-header text-center">
          <h1 className="card-title text-3xl">Reset Password</h1>
          <p className="card-description">Enter your new password below.</p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary hover:underline flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
