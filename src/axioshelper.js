import axios from 'axios';


// Create an axios instance
const api = axios.create({
    baseURL: 'https://localhost:8081/api',
  });
  
  // Add a request interceptor to attach the token to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Set Authorization header
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  export default api;