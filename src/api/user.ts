import axios from 'axios';

const API_URL = 'https://habsblog-api.vercel.app/api';

export const updateProfile = async (userData: {
  username: string;
  email: string;
}) => {
  const response = await axios.put(`${API_URL}/users/profile`, userData);
  return response.data;
};

export const updateProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  const response = await axios.post(
    `${API_URL}/users/profile-picture`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return response.data;
};
