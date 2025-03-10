import axios from 'axios';

export const axiosInstance = axios.create({
   baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000/api/v1' : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1`,
   withCredentials: true
});
