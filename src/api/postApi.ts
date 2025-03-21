import axiosInstance from './axiosConfig';
import type {
  CreatePostData,
  UpdatePostData,
  PostFilters,
} from '../types/post';

export const postApi = {
  getPosts: async (filters: PostFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.author) params.append('author', filters.author);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get(`/posts?${params.toString()}`);
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: CreatePostData) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('content', data.content);

    if (data.excerpt) formData.append('excerpt', data.excerpt);
    if (data.coverImage) formData.append('coverImage', data.coverImage);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.status) formData.append('status', data.status);

    const response = await axiosInstance.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (id: string, data: UpdatePostData) => {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.content) formData.append('content', data.content);
    if (data.excerpt) formData.append('excerpt', data.excerpt);
    if (data.coverImage) formData.append('coverImage', data.coverImage);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.status) formData.append('status', data.status);

    const response = await axiosInstance.put(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePost: async (id: string) => {
    const response = await axiosInstance.delete(`/posts/${id}`);
    return response.data;
  },

  toggleLikePost: async (id: string) => {
    const response = await axiosInstance.put(`/posts/${id}/like`);
    return response.data;
  },

  getUserDrafts: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/posts/user/drafts?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};
