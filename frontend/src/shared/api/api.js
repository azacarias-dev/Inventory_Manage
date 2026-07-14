import axios from 'axios';

const BASE_URL = 'http://localhost:3002/service-inventory/v1/inventory';

export const axiosAdmin = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const handleRefreshToken = async () => {
  return null;
};
