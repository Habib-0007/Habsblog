import type React from 'react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Upload, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const userData: any = { name, email, password };

      if (avatar) {
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onload = async () => {
          userData.avatar = reader.result;

          try {
            await register(userData);
            toast.success('Registration successful!');
            navigate('/');
          } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
          }
        };
      } else {
        await register(userData);
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card gradient="cool" className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 gradient-text-vibrant">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join our community and start sharing your thoughts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div>
            <label className="block mb-2 font-bold">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black">
                  <img
                    src={avatarPreview || '/placeholder.svg'}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <label
                className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white cursor-pointer neobrutalism-button rounded-md transition-all flex justify-center gap-2 items-center neobrutalism-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                htmlFor="avatar"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar"
                  name="avatar"
                />
                <Upload className="w-4 h-4" />
                {avatarPreview ? 'Change Image' : 'Upload Image'}
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white w-full"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
