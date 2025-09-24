import http from 'http';
import 'reflect-metadata';
import './config/logging';

import App from './app';
import { server as socketServer } from './config/socket';
import { server as serverConfig } from './config/config';

/**
 * The HTTP server instance.
 * @type {http.Server}
 */
export let httpServer: http.Server;

/**
 * Starts the server by initializing the application, connecting to the database,
 * and setting up the HTTP/WebSocket server.
 * @returns {Promise<void>} A promise that resolves when the server is started successfully.
 */
export const startServer = async (): Promise<void> => {
    try {
        const appInstance = new App();
        await appInstance.connectDatabase();

        httpServer = socketServer;
        httpServer.listen(serverConfig.PORT, () => {
            logging.info(`Server Started: ${serverConfig.SERVER_HOSTNAME}:${serverConfig.PORT}`);
            logging.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        handleShutdown();
    } catch (error) {
        logging.error(`Server startup failed: ${error} `);
        process.exit(1);
    }
};

/**
 * Gracefully shuts down the server.
 * @param {any} callback - A callback function that is executed after the server is closed.
 */
export const shutdownServer = (callback: any) => httpServer && httpServer.close(callback);

/**
 * Handles system signals (SIGINT, SIGTERM) to gracefully shut down the server.
 * Ensures cleanup is performed before the process exits.
 */
const handleShutdown = (): void => {
    process.on('SIGINT', () => shutdownServer(() => process.exit(0)));
    process.on('SIGTERM', () => shutdownServer(() => process.exit(0)));
};

// Start the server
startServer();
