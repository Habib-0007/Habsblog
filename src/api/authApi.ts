import axiosInstance from './axiosConfig';
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  UpdateProfileData,
  UpdatePasswordData,
} from '../types/auth';

export const authApi = {
  register: async (data: RegisterData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    const response = await axiosInstance.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await axiosInstance.post('/auth/logout', { refreshToken });
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await axiosInstance.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (token: string, data: ResetPasswordData) => {
    const response = await axiosInstance.put(
      `/auth/reset-password/${token}`,
      data,
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.bio) formData.append('bio', data.bio);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await axiosInstance.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordData) => {
    const response = await axiosInstance.put('/auth/password', data);
    return response.data;
  },
};
