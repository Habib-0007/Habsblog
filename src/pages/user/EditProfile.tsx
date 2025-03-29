import type React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { useAuthStore } from '../../store/authStore';

const EditProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
    } = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';

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

    setIsSubmitting(true);

    try {
      const userData: any = { name, email, bio };

      if (avatar) {
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onload = async () => {
          userData.avatar = reader.result;

          try {
            await updateProfile(userData);
            toast.success('Profile updated successfully!');
            navigate('/profile');
          } catch (error: any) {
            toast.error(
              error.response?.data?.error || 'Failed to update profile',
            );
          } finally {
            setIsSubmitting(false);
          }
        };
      } else {
        await updateProfile(userData);
        toast.success('Profile updated successfully!');
        navigate('/profile');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 gradient-text">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar
              src={avatarPreview || undefined}
              alt={name}
              size="lg"
              className="w-32 h-32 mb-4"
            />

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white ml-2"
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Change Profile Picture
              </Button>
            </label>
          </div>

          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white ml-2"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white ml-2"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;
