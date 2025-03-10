export interface ApiResponse<T> {
   success: boolean;
   status: number;
   message: string;
   data: T;
}

export interface User {
   _id: string;
   fullName: string;
   email: string;
   profilePic: string;
   createdAt: string;
   updatedAt: string;
}

export interface SignupData {
   fullName: string;
   email: string;
   password: string;
}

export interface LoginData {
   email: string;
   password: string;
}

export interface updateProfileData {
   profilePic: string;
}

export interface Message {
   _id: string;
   senderId: string;
   receiverId: string;
   text?: string;
   image?: string;
   createdAt: string;
   updatedAt: string;
}

export interface MessageData {
   text?: string;
   image?: string;
}
