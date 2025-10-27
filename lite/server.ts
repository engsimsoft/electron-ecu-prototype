import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import open from 'open';
import path from 'path';

// Import from Full version
import { DataGenerator } from '../src/main/data-generator';
import { PrecisionTimer } from '../src/main/precision-timer';
import { DataPacket } from '../src/main/types';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
const PORT = 3000;

// Инициализация генератора данных
const dataGen = new DataGenerator(300); // 300 параметров
let sequenceNumber = 0;

// Precision timer 40ms (25Hz)
const timer = new PrecisionTimer(40);

// Раздаём статические файлы из web/
app.use(express.static(path.join(__dirname, '../../web')));

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

  // Start simulation command
  socket.on('start-simulation', () => {
    console.log('[Server] Starting simulation...');
    sequenceNumber = 0;

    timer.start(() => {
      // Генерируем пакет данных
      const packet: DataPacket = dataGen.generatePacket(sequenceNumber++);

      // ВАЖНО: Socket.IO не умеет передавать Float64Array
      // Конвертируем в обычный массив
      const packetForWeb = {
        sequenceNumber: packet.sequenceNumber,
        timestamp: packet.timestamp,
        values: Array.from(packet.values)  // Float64Array -> Array
      };

      // Отправляем в браузер через WebSocket
      io.emit('ecu-data', packetForWeb);

      // Логируем каждый 100-й пакет
      if (sequenceNumber % 100 === 0) {
        console.log(`[DataGen] Sent packet #${sequenceNumber}`);
      }
    });

    socket.emit('simulation-status', { running: true });
  });

  // Stop simulation command
  socket.on('stop-simulation', () => {
    console.log('[Server] Stopping simulation...');
    timer.stop();
    socket.emit('simulation-status', { running: false });
  });

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
