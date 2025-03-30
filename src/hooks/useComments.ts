import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { CommentFilters } from '../types/comment';

export const useComments = (filters: CommentFilters) => {
  return useQuery({
    queryKey: ['comments', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.postId) params.append('postId', filters.postId);
      if (filters.parentId) params.append('parentId', filters.parentId);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/comments?${params.toString()}`);
      return response.data;
    },
    enabled: !!filters.postId,
  });
};

export const useComment = (id: string) => {
  return useQuery({
    queryKey: ['comment', id],
    queryFn: async () => {
      const response = await api.get(`/comments/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: FormData) => {
      const response = await api.post('/comments', commentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', { postId: data.post }],
      });
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add comment');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      commentData,
    }: {
      id: string;
      commentData: FormData;
    }) => {
      const response = await api.put(`/comments/${id}`, commentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['comments', { postId: data.post }],
      });
      queryClient.invalidateQueries({ queryKey: ['comment', data._id] });
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/comments/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete comment');
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(`/comments/${id}/like`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to like comment');
    },
  });
};
