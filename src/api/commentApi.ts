import axiosInstance from './axiosConfig';
import type { CreateCommentData, UpdateCommentData } from '../types/comment';

export const commentApi = {
  getComments: async (
    postId: string,
    parentId?: string,
    page = 1,
    limit = 10,
  ) => {
    const params = new URLSearchParams();
    params.append('postId', postId);
    if (parentId) params.append('parentId', parentId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axiosInstance.get(`/comments?${params.toString()}`);
    return response.data;
  },

  getComment: async (id: string) => {
    const response = await axiosInstance.get(`/comments/${id}`);
    return response.data;
  },

  createComment: async (data: CreateCommentData) => {
    const formData = new FormData();

    formData.append('content', data.content);
    formData.append('postId', data.postId);
    if (data.parentId) formData.append('parentId', data.parentId);

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await axiosInstance.post('/comments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateComment: async (id: string, data: UpdateCommentData) => {
    const formData = new FormData();

    formData.append('content', data.content);

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await axiosInstance.put(`/comments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await axiosInstance.delete(`/comments/${id}`);
    return response.data;
  },

  toggleLikeComment: async (id: string) => {
    const response = await axiosInstance.put(`/comments/${id}/like`);
    return response.data;
  },
};
