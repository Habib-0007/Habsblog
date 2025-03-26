import type React from 'react';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send reset email');
      toast.error(error.response?.data?.error || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto">
        <Card gradient="cool" className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Check Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions.
            </p>
          </div>

          <div className="mt-6">
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card gradient="cool" className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 gradient-text">
            Forgot Password
          </h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white w-full"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-primary hover:underline flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
