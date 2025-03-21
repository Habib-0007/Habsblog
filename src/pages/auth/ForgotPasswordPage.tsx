'use client';

import type React from 'react';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: { email: string }) => authApi.forgotPassword(data),
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error ||
          'Failed to send reset email. Please try again.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card">
          <div className="card-header text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="card-title text-3xl">Check Your Email</h1>
            <p className="card-description">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div className="card-content">
            <p className="text-sm text-muted-foreground mb-6">
              Please check your email inbox and follow the instructions to reset
              your password. If you don't see the email, check your spam folder.
            </p>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn btn-outline w-full"
              >
                Try another email
              </button>

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
          <h1 className="card-title text-3xl">Forgot Password</h1>
          <p className="card-description">
            Enter your email address and we'll send you a link to reset your
            password.
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your@email.com"
                required
                disabled={forgotPasswordMutation.isPending}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
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

export default ForgotPasswordPage;
