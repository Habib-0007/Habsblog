// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import api from '../lib/api';
// import type { PostFilters } from '../types/post';

// // Get all posts with filters
// export const usePosts = (filters: PostFilters = {}) => {
//   return useQuery({
//     queryKey: ['posts', filters],
//     queryFn: async () => {
//       const params = new URLSearchParams();

//       if (filters.search) params.append('search', filters.search);
//       if (filters.tag) params.append('tag', filters.tag);
//       if (filters.author) params.append('author', filters.author);
//       if (filters.status) params.append('status', filters.status);
//       if (filters.sortBy) params.append('sortBy', filters.sortBy);
//       if (filters.page) params.append('page', filters.page.toString());
//       if (filters.limit) params.append('limit', filters.limit.toString());

//       const response = await api.get(`/posts?${params.toString()}`);
//       return response.data;
//     },
//   });
// };

// // Get a single post by ID
// export const usePost = (id: string) => {
//   return useQuery({
//     queryKey: ['post', id],
//     queryFn: async () => {
//       const response = await api.get(`/posts/${id}`);
//       return response.data.data;
//     },
//     enabled: !!id,
//   });
// };

// // Get user's draft posts
// export const useUserDrafts = (page = 1, limit = 10) => {
//   return useQuery({
//     queryKey: ['posts', 'drafts', page, limit],
//     queryFn: async () => {
//       const response = await api.get(
//         `/posts/user/drafts?page=${page}&limit=${limit}`,
//       );
//       return response.data;
//     },
//   });
// };

// // Create a new post
// export const useCreatePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (postData: FormData) => {
//       // If postData contains tags as a JSON string, convert it to the proper format
//       const tagsValue = postData.get('tags');
//       if (tagsValue) {
//         // Remove the stringified tags
//         postData.delete('tags');

//         // Parse the JSON string back to an array
//         const tagsArray = JSON.parse(tagsValue as string);

//         // Append each tag individually to make it an array on the server
//         tagsArray.forEach((tag: string) => {
//           postData.append('tags[]', tag);
//         });
//       }

//       const response = await api.post('/posts', postData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//       toast.success('Post created successfully!');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.error || 'Failed to create post');
//     },
//   });
// };

// // Update an existing post
// export const useUpdatePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       id,
//       postData,
//     }: {
//       id: string;
//       postData: FormData;
//     }) => {
//       // If postData contains tags as a JSON string, convert it to the proper format
//       const tagsValue = postData.get('tags');
//       if (tagsValue) {
//         // Remove the stringified tags
//         postData.delete('tags');

//         // Parse the JSON string back to an array
//         const tagsArray = JSON.parse(tagsValue as string);

//         // Append each tag individually to make it an array on the server
//         tagsArray.forEach((tag: string) => {
//           postData.append('tags[]', tag);
//         });
//       }

//       const response = await api.put(`/posts/${id}`, postData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data.data;
//     },
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//       queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
//       toast.success('Post updated successfully!');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.error || 'Failed to update post');
//     },
//   });
// };

// // Delete a post
// export const useDeletePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: string) => {
//       await api.delete(`/posts/${id}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//       toast.success('Post deleted successfully!');
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.error || 'Failed to delete post');
//     },
//   });
// };

// // Like/unlike a post
// export const useLikePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: string) => {
//       const response = await api.put(`/posts/${id}/like`);
//       return response.data.data;
//     },
//     onSuccess: (_, id) => {
//       queryClient.invalidateQueries({ queryKey: ['post', id] });
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.error || 'Failed to like post');
//     },
//   });
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/api';
import type { PostFilters } from '../types/post';

// Get all posts with filters
export const usePosts = (filters: PostFilters = {}) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.author) params.append('author', filters.author);
      if (filters.status) params.append('status', filters.status);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/posts?${params.toString()}`);
      return response.data;
    },
  });
};

// Get a single post by ID
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/posts/${id}`);
      return response.data.data;
    },
    enabled: !!id, // Only fetch if `id` is provided
  });
};

// Get user's draft posts
export const useUserDrafts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['posts', 'drafts', page, limit],
    queryFn: async () => {
      const response = await api.get(
        `/posts/user/drafts?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

// Create a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: FormData) => {
      const response = await api.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create post');
    },
  });
};

// Update an existing post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      postData,
    }: {
      id: string;
      postData: FormData;
    }) => {
      const response = await api.put(`/posts/${id}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      toast.success('Post updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update post');
    },
  });
};

// Delete a post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete post');
    },
  });
};

// Like/unlike a post
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(`/posts/${id}/like`);
      return response.data.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to like post');
    },
  });
};
