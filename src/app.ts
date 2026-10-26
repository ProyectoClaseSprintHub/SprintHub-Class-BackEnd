import express from 'express';
import https from 'https';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import boardRoutes from './routes/boardRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import env from './config/env';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/boards', boardRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Api funcionando.',
  });
});

setInterval(() => {
  const url: string = env.serverUrl; 
  https.get(url, (res) => {
    console.log(`Self-ping exitoso: Código ${res.statusCode}`);
  }).on('error', (err: Error) => {
    console.error('Error en el self-ping:', err.message);
  });
}, 14 * 60 * 1000);

app.use(errorMiddleware);

export default app;
