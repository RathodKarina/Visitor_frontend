import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      req.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return req;
});

export default API;