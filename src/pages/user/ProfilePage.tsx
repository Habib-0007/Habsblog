'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  FileText,
  Eye,
  ThumbsUp,
  Upload,
  Save,
  Key,
} from 'lucide-react';
import { authApi } from '../../api/authApi';
import { postApi } from '../../api/postApi';
import { useAuthStore } from '../../stores/authStore';
import type { UpdateProfileData, UpdatePasswordData } from '../../types/auth';
import LoadingPage from '../../components/common/LoadingPage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
    currentPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user profile data
  const { isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    // onSuccess: (data) => {
    //   if (data.success && data.user) {
    //     setUser(data.user);
    //     setProfileData({
    //       name: data.user.name,
    //       email: data.user.email,
    //       bio: data.user.bio || '',
    //     });
    //   }
    // },
  });

  // Get user posts stats
  const { data: postsData } = useQuery({
    queryKey: ['posts', 'user', user?.id],
    queryFn: () => postApi.getPosts({ author: user?.id, status: 'published' }),
    enabled: !!user?.id,
  });

  // Get user drafts stats
  const { data: draftsData } = useQuery({
    queryKey: ['drafts', 'user', user?.id],
    queryFn: () => postApi.getUserDrafts(),
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateProfile(data),
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser(data.user);
        setIsEditingProfile(false);
        toast.success('Profile updated successfully');
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: UpdatePasswordData) => authApi.updatePassword(data),
    onSuccess: () => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
      });
      setConfirmPassword('');
      toast.success('Password updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update password');
    },
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: UpdateProfileData = {
      ...profileData,
    };

    if (avatarFile) {
      formData.avatar = avatarFile;
    }

    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    updatePasswordMutation.mutate(passwordData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="card sticky top-20">
            <div className="p-6 flex flex-col items-center">
              <Avatar
                src={avatarPreview || user?.avatar}
                alt={user?.name || ''}
                fallback={user?.name?.charAt(0) || 'U'}
                className="h-24 w-24 mb-4"
              />
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.email}
              </p>

              <div className="w-full space-y-2 mt-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  }`}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'security'
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                    activeTab === 'activity'
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Activity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:w-3/4">
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h2 className="card-title">Profile Information</h2>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        bio: user?.bio || '',
                      });
                    }}
                    className="btn btn-sm btn-outline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="card-content">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <Avatar
                          src={avatarPreview || user?.avatar}
                          alt={user?.name || ''}
                          fallback={user?.name?.charAt(0) || 'U'}
                          className="h-24 w-24"
                        />
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2"
                        >
                          <Upload size={16} />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        className="input min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <span className="flex items-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{user?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bio</p>
                      <p>{user?.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Security Settings</h2>
              </div>

              <div className="card-content">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium mb-1"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="input"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium mb-1"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input"
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updatePasswordMutation.isPending}
                  >
                    {updatePasswordMutation.isPending ? (
                      <span className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Updating...
                      </span>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Activity Overview</h2>
                </div>

                <div className="card-content">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Published Posts</h3>
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-2xl font-bold">
                        {postsData?.count || 0}
                      </p>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Drafts</h3>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">
                        {draftsData?.count || 0}
                      </p>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Total Views</h3>
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-2xl font-bold">
                        {postsData?.data.reduce(
                          (total: Number, post: any) => total + post.viewCount,
                          0,
                        ) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Recent Posts</h2>
                </div>

                <div className="card-content">
                  {postsData?.data && postsData.data.length > 0 ? (
                    <div className="space-y-4">
                      {postsData.data.slice(0, 5).map((post: any) => (
                        <div
                          key={post._id}
                          className="flex items-center justify-between border-b border-border pb-4"
                        >
                          <div>
                            <h3 className="font-medium">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center text-sm text-muted-foreground">
                              <Eye size={14} className="mr-1" />
                              {post.viewCount}
                            </span>
                            <span className="flex items-center text-sm text-muted-foreground">
                              <ThumbsUp size={14} className="mr-1" />
                              {post.likeCount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      You haven't published any posts yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
