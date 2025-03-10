import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { FRONTEND_BASEURL } from './config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [FRONTEND_BASEURL]
    }
});

export function getReceiverSocketId(userId: string) {
    return userSocketMap[userId];
}

// used to store online users
const userSocketMap: { [key: string]: string } = {};

io.on('connection', (socket) => {
    // console.info(`🟢 New client connected: ${socket.id}`);

    const userId = socket.handshake.query.userId as string;

    if (userId) userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        // console.info(`🔴 Client disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };
