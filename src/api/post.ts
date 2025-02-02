import axios from 'axios';

const API_URL = 'https://habsblog-api.vercel.app/api';

export const createPost = async (postData: {
  title: string;
  content: string;
  images: File[];
}) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  postData.images.forEach((image) => formData.append('images', image));

  const response = await axios.post(`${API_URL}/posts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getAllPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

export const getUserPosts = async (userId: string) => {
  const response = await axios.get(`${API_URL}/posts/user/${userId}`);
  return response.data;
};

export const getPost = async (postId: string) => {
  const response = await axios.get(`${API_URL}/posts/${postId}`);
  return response.data;
};

export const updatePost = async (
  postId: string,
  postData: { title: string; content: string },
) => {
  const response = await axios.put(`${API_URL}/posts/${postId}`, postData);
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await axios.delete(`${API_URL}/posts/${postId}`);
  return response.data;
};
