'use client';

import type React from 'react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../stores/authStore';
import type { RegisterData } from '../../types/auth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.success && data.token && data.refreshToken && data.user) {
        login(data.user, data.token, data.refreshToken);
        toast.success('Registration successful!');
        navigate('/');
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || 'Registration failed. Please try again.',
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    registerMutation.mutate(formData);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card">
        <div className="card-header text-center">
          <h1 className="card-title text-3xl">Register</h1>
          <p className="card-description">
            Create a new account to get started.
          </p>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview || '/placeholder.svg'}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-muted-foreground">
                      {formData.name.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer"
                >
                  <Upload size={16} />
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Your name"
                disabled={registerMutation.isPending}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="your@email.com"
                disabled={registerMutation.isPending}
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
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                  minLength={6}
                  disabled={registerMutation.isPending}
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
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  minLength={6}
                  disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
