import axios from 'axios';

const API_URL = 'https://habsblog-api.vercel.app/api';

export const login = async (email: string, password: string) => {
	const response = await axios.post(`${API_URL}/auth/login`, {
		email,
		password,
	});
	return response.data;
};

export const signup = async (
	username: string,
	email: string,
	password: string,
) => {
	const response = await axios.post(`${API_URL}/auth/signup`, {
		username,
		email,
		password,
	});
	return response.data;
};

export const forgotPassword = async (email: string) => {
	const response = await axios.post(`${API_URL}/auth/forgot-password`, {
		email,
	});
	return response.data;
};

export const resetPassword = async (token: string | undefined, password: string) => {
	const response = await axios.post(`${API_URL}/auth/reset-password`, {
		token,
		password,
	});
	return response.data;
};

export const logout = async () => {
	const response = await axios.post(`${API_URL}/auth/logout`);
	return response.data;
};
