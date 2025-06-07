import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getUsers = () => API.get('/users');
export const getUsersbyID = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/user/${id}`, data);
export const deleteUser = (id) => API.delete(`/user/${id}`);
