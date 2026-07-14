import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:5052/api/v1/Auth';

export const axiosAuth = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginRequest = async (emailOrUsername, password) => {
  const response = await axiosAuth.post('/login', {
    emailOrUsername,
    password,
  });
  return response.data;
};

export const registerRequest = async (userName, email, password) => {
  const response = await axiosAuth.post('/register', {
    userName,
    email,
    password,
  });
  return response.data;
};
