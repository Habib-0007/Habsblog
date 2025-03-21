import axiosInstance from './axiosConfig';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin/users?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin') => {
    const response = await axiosInstance.put(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getPosts: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin/posts?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getComments: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin/comments?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};
