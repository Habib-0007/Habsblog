import axios from 'axios';

const API_URL = 'https://habsblog-api.vercel.app/api';

export const createComment = async (postId: string, content: string) => {
  const response = await axios.post(`${API_URL}/comments`, { postId, content });
  return response.data;
};

export const getComments = async (postId: string) => {
  const response = await axios.get(`${API_URL}/comments/post/${postId}`);
  return response.data;
};

export const updateComment = async (commentId: string, content: string) => {
  const response = await axios.put(`${API_URL}/comments/${commentId}`, {
    content,
  });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await axios.delete(`${API_URL}/comments/${commentId}`);
  return response.data;
};
