import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import open from 'open';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
const PORT = 3000;

// Раздаём статические файлы из web/
app.use(express.static(path.join(__dirname, '../web')));

// Запускаем сервер
server.listen(PORT, async () => {
  console.log(`[Server] Running at http://localhost:${PORT}`);

  // Автоматически открываем браузер
  try {
    await open(`http://localhost:${PORT}`);
    console.log('[Server] Browser opened automatically');
  } catch (err) {
    console.error('[Server] Failed to open browser. Please open manually: http://localhost:3000');
  }
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('[WebSocket] Client connected');

  socket.on('disconnect', () => {
    console.log('[WebSocket] Client disconnected');
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[Server] Shutting down...');
  server.close(() => {
    console.log('[Server] Closed');
    process.exit(0);
  });
});
