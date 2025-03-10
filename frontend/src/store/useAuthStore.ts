import { create } from 'zustand';
import { axiosInstance } from '../config/axios';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ApiResponse, LoginData, SignupData, updateProfileData, User } from '../types';
import { io, Socket } from 'socket.io-client';

interface AuthStore {
   authUser: User | null;
   isSigningUp: boolean;
   isLoggingIn: boolean;
   isUpdatingProfile: boolean;
   isCheckingAuth: boolean;
   onlineUsers: string[];
   socket: Socket | null;
   checkAuth: () => Promise<void>;
   signup: (data: SignupData) => Promise<void>;
   login: (data: LoginData) => Promise<void>;
   logout: () => Promise<void>;
   updateProfile: (data: updateProfileData) => Promise<void>;
   connectSocket: () => void;
   disconnectSocket: () => void;
}

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`;

export const useAuthStore = create<AuthStore>((set, get) => ({
   authUser: null,
   isSigningUp: false,
   isLoggingIn: false,
   isUpdatingProfile: false,
   isCheckingAuth: true,
   onlineUsers: [],
   socket: null,

   checkAuth: async () => {
      try {
         const res = await axiosInstance.get<ApiResponse<User>>('/auth/check');
         set({ authUser: res.data.data });

         get().connectSocket();
      } catch (error) {
         console.error('Error in checkAuth: ', error);
         set({ authUser: null });
      } finally {
         set({ isCheckingAuth: false });
      }
   },

   signup: async (data: SignupData) => {
      set({ isSigningUp: true });
      try {
         const res = await axiosInstance.post('/auth/signup', data);
         set({ authUser: res.data.data });
         toast.success('Account created successfully');

         get().connectSocket();
      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || 'Signup failed');
         } else {
            toast.error('An unexpected error occurred');
         }
      } finally {
         set({ isSigningUp: false });
      }
   },

   login: async (data: LoginData) => {
      set({ isLoggingIn: true });
      try {
         const res = await axiosInstance.post('/auth/login', data);
         set({ authUser: res.data.data });
         toast.success('Logged in successfully');

         get().connectSocket();
      } catch (error) {
         if (error instanceof AxiosError) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Login failed');
         } else {
            toast.error('An unexpected error occurred');
         }
      } finally {
         set({ isLoggingIn: false });
      }
   },

   logout: async () => {
      try {
         await axiosInstance.post('/auth/logout');
         set({ authUser: null });
         toast.success('Logged out successfully');

         get().disconnectSocket();
      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || 'Logout failed');
         } else {
            toast.error('An unexpected error occurred');
         }
      }
   },

   updateProfile: async (data: updateProfileData) => {
      set({ isUpdatingProfile: true });
      try {
         const res = await axiosInstance.patch('/users/update-profile', data);
         set({ authUser: res.data.data });
         toast.success('Profile updated successfully');
      } catch (error) {
         if (error instanceof AxiosError) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Update profile failed');
         } else {
            toast.error('An unexpected error occurred');
         }
      } finally {
         set({ isUpdatingProfile: false });
      }
   },

   // Function to establish a socket connection
   connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL, {
         query: {
            userId: authUser._id
         }
      });

      socket.connect();

      set({ socket: socket });

      socket.on('getOnlineUsers', (userIds: string[]) => {
         set({ onlineUsers: userIds });
      });
   },

   // Function to disconnect the socket
   disconnectSocket: () => {
      if (get().socket?.connected) get().socket?.disconnect();
   }
}));
