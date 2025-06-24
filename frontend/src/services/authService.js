import axios from 'axios';

const API = 'http://localhost:5000/api/auth'; // backend base URL

export const registerUser = async (data) => {
  return axios.post(`${API}/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API}/login`, data);
};
