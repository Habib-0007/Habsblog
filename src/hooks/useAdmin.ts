import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/api';

// Get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    },
  });
};

// Get all users (admin only)
export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['admin', 'users', page, limit],
    queryFn: async () => {
      const response = await api.get(
        `/admin/users?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

// Get all posts (admin only)
export const useAdminPosts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['admin', 'posts', page, limit],
    queryFn: async () => {
      const response = await api.get(
        `/admin/posts?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

// Get all comments (admin only)
export const useAdminComments = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['admin', 'comments', page, limit],
    queryFn: async () => {
      const response = await api.get(
        `/admin/comments?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

// Update user role (admin only)
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: 'user' | 'admin';
    }) => {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User role updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    },
  });
};

// Delete user (admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    },
  });
};
