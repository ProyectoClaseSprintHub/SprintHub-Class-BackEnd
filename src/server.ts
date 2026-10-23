import app from './app';
import env from './config/env';
import { connectDatabase } from './config/database';
import { createServer } from 'http';
import { configureSockets } from './sockets/socket';

async function startserver(): Promise<void> {
    await connectDatabase();

    const httpServer = createServer(app);
    configureSockets(httpServer);

    httpServer.listen(env.port, () => {
        console.log(`Servidor HTTP y WebSockets escuchando en el puerto ${env.port}`);
        console.log(`Ver estado del servidor: ${env.serverUrl}/api/health`);
    });
} 

startserver();