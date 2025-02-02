import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, updateProfilePicture } from '../api/user';

const UserProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile({ username, email });
      setUser(updatedUser);
      setMessage('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      setMessage('Failed to update profile');
    }
  };

  const handlePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      try {
        const updatedUser = await updateProfilePicture(file);
        setUser(updatedUser);
        setMessage('Profile picture updated successfully');
      } catch (error) {
        console.error('Profile picture update failed:', error);
        setMessage('Failed to update profile picture');
      }
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handlePictureUpload}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
      {profilePicture && <p></p>}
    </div>
  );
};

export default UserProfile;
