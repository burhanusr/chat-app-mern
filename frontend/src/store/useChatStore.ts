import toast from 'react-hot-toast';
import { create } from 'zustand';

import { AxiosError } from 'axios';
import { axiosInstance } from '../config/axios';
import { ApiResponse, Message, MessageData, User } from '../types';
import { useAuthStore } from './useAuthStore';

interface ChatStore {
   messages: Message[];
   users: User[];
   selectedUser: User | null;
   isUsersLoading: boolean;
   isMessagesLoading: boolean;
   getUsers: () => Promise<void>;
   getMessages: (userId: string) => Promise<void>;
   sendMessage: (messageData: MessageData) => Promise<void>;
   subscribeToMessages: () => void;
   unsubscribeFromMessages: () => void;
   setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
   messages: [],
   users: [],
   selectedUser: null,
   isUsersLoading: false,
   isMessagesLoading: false,

   getUsers: async () => {
      set({ isUsersLoading: true });
      try {
         const res = await axiosInstance.get<ApiResponse<User[]>>('/messages/users');
         set({ users: res.data.data });
      } catch (error) {
         if (error instanceof AxiosError) {
            console.log(error);
            toast.error(error.response?.data?.message);
         } else {
            toast.error('An unexpected error occurred');
         }
      } finally {
         set({ isUsersLoading: false });
      }
   },

   getMessages: async (userId: string) => {
      set({ isMessagesLoading: true });
      try {
         const res = await axiosInstance.get<ApiResponse<Message[]>>(`/messages/${userId}`);
         set({ messages: res.data.data });
      } catch (error) {
         if (error instanceof AxiosError) {
            console.log(error);
            toast.error(error.response?.data?.message);
         } else {
            toast.error('An unexpected error occurred');
         }
      } finally {
         set({ isMessagesLoading: false });
      }
   },
   sendMessage: async (messageData: MessageData) => {
      const { selectedUser, messages } = get();
      try {
         const res = await axiosInstance.post<ApiResponse<Message>>(`/messages/send/${selectedUser?._id}`, messageData);
         set({ messages: [...messages, res.data.data] });
      } catch (error) {
         if (error instanceof AxiosError) {
            console.log(error);
            toast.error(error.response?.data?.message);
         } else {
            toast.error('An unexpected error occurred');
         }
      }
   },

   subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const socket = useAuthStore.getState().socket;

      socket?.on('newMessage', (newMessage) => {
         const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
         if (!isMessageSentFromSelectedUser) return;

         set({
            messages: [...get().messages, newMessage]
         });
      });
   },

   unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket?.off('newMessage');
   },

   setSelectedUser: (selectedUser) => set({ selectedUser })
}));
