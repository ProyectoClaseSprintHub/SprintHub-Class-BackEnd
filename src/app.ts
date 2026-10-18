import express from 'express';
import https from 'https';
import cors from 'cors';

import env from './config/env';

const app = express();

app.use(cors());
app.use(express.json());

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


export default app;
