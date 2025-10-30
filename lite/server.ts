import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import open from 'open';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Import from Full version
import { DataGenerator } from '../src/main/data-generator';
import { PrecisionTimer } from '../src/main/precision-timer';
import { DataPacket } from '../src/main/types';

// ============================================
// LOGGING SETUP - Логирование в файл
// ============================================

// @ts-ignore
const logPath = process.pkg
  ? path.join(path.dirname(process.execPath), 'ecu-tuner-lite.log')
  : path.join(__dirname, '../../ecu-tuner-lite.log');

const logStream = fs.createWriteStream(logPath, { flags: 'a' });

function log(level: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };

  // Пишем в файл
  logStream.write(JSON.stringify(logEntry) + '\n');

  // И в консоль (для dev режима)
  console.log(`[${timestamp}] [${level}] ${message}`, data || '');
}

// Перехватываем необработанные исключения
process.on('uncaughtException', (error) => {
  log('FATAL', 'Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log('ERROR', 'Unhandled Rejection', {
    reason: String(reason),
    promise: String(promise)
  });
});

// ============================================
// SYSTEM INFO - Информация о системе
// ============================================

log('INFO', '========================================');
log('INFO', 'ECU Tuner Lite Starting...');
log('INFO', '========================================');
log('INFO', 'System Information', {
  platform: os.platform(),
  release: os.release(),
  arch: os.arch(),
  nodeVersion: process.version,
  exePath: process.execPath,
  // @ts-ignore
  isPkg: !!process.pkg
});

// ============================================
// EXPRESS + SOCKET.IO SETUP
// ============================================

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

let PORT = 3000;
const MAX_PORT_TRIES = 10;

// Инициализация генератора данных
const dataGen = new DataGenerator(300); // 300 параметров
let sequenceNumber = 0;

// Precision timer 40ms (25Hz)
const timer = new PrecisionTimer(40);

// ============================================
// STATIC FILES - Раздача статических файлов
// ============================================

// @ts-ignore - pkg добавляет process.pkg в runtime
const webPath = process.pkg
  ? path.join(path.dirname(process.execPath), 'web')
  : path.join(__dirname, '../../web');

log('INFO', 'Static files path', { webPath });

// Проверяем существование web/ папки
if (!fs.existsSync(webPath)) {
  log('FATAL', 'Web folder not found!', {
    webPath,
    exePath: process.execPath,
    cwd: process.cwd()
  });
  process.exit(1);
}

// Проверяем наличие критичных файлов
const requiredFiles = ['index.html', 'app.js', 'chart-manager.js', 'circular-buffer.js', 'styles.css'];
for (const file of requiredFiles) {
  const filePath = path.join(webPath, file);
  if (!fs.existsSync(filePath)) {
    log('ERROR', `Required file not found: ${file}`, { filePath });
  }
}

app.use(express.static(webPath));
log('INFO', 'Static files middleware configured');

// ============================================
// PORT FINDING - Автоматический поиск порта
// ============================================

function tryStartServer(port: number, attempt: number): Promise<void> {
  return new Promise((resolve, reject) => {
    server.listen(port, async () => {
      log('INFO', `Server started successfully on port ${port}`, { attempt });
      PORT = port;

      // Автоматически открываем браузер
      try {
        await open(`http://localhost:${port}`);
        log('INFO', 'Browser opened automatically');
      } catch (err: any) {
        log('WARN', 'Failed to open browser automatically', {
          error: err.message
        });
        log('INFO', `Please open manually: http://localhost:${port}`);
      }

      resolve();
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log('WARN', `Port ${port} is already in use`, { attempt });

        if (attempt < MAX_PORT_TRIES) {
          const nextPort = port + 1;
          log('INFO', `Trying next port: ${nextPort}`);
          server.close();
          tryStartServer(nextPort, attempt + 1).then(resolve).catch(reject);
        } else {
          log('FATAL', `Could not find available port after ${MAX_PORT_TRIES} attempts`);
          reject(new Error('No available ports'));
        }
      } else {
        log('FATAL', 'Server error', {
          code: err.code,
          message: err.message,
          stack: err.stack
        });
        reject(err);
      }
    });
  });
}

// Запускаем сервер с автоматическим поиском порта
tryStartServer(PORT, 1).catch((err) => {
  log('FATAL', 'Failed to start server', { error: err.message });
  process.exit(1);
});

// ============================================
// WEBSOCKET - Socket.IO connection handler
// ============================================

io.on('connection', (socket) => {
  log('INFO', 'WebSocket client connected', {
    socketId: socket.id,
    transport: socket.conn.transport.name
  });

  // Start simulation command
  socket.on('start-simulation', () => {
    log('INFO', 'Starting simulation');
    sequenceNumber = 0;

    timer.start(() => {
      try {
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
          log('DEBUG', `Sent packet #${sequenceNumber}`);
        }
      } catch (err: any) {
        log('ERROR', 'Error generating packet', {
          error: err.message,
          stack: err.stack
        });
      }
    });

    socket.emit('simulation-status', { running: true });
    log('INFO', 'Simulation started');
  });

  // Stop simulation command
  socket.on('stop-simulation', () => {
    log('INFO', 'Stopping simulation');
    timer.stop();
    socket.emit('simulation-status', { running: false });
  });

  socket.on('disconnect', (reason) => {
    log('INFO', 'WebSocket client disconnected', {
      socketId: socket.id,
      reason
    });
  });

  socket.on('error', (error) => {
    log('ERROR', 'WebSocket error', {
      socketId: socket.id,
      error: error.message
    });
  });
});

// Socket.IO ошибки
io.engine.on('connection_error', (err) => {
  log('ERROR', 'Socket.IO connection error', {
    code: err.code,
    message: err.message,
    context: err.context
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

function shutdown(signal: string) {
  log('INFO', `Received ${signal}, shutting down gracefully`);

  timer.stop();

  server.close(() => {
    log('INFO', 'HTTP server closed');
    logStream.end();
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    log('WARN', 'Forcing shutdown after timeout');
    logStream.end();
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Windows-specific signals
if (process.platform === 'win32') {
  process.on('SIGBREAK', () => shutdown('SIGBREAK'));
}

log('INFO', 'Server initialization complete');
log('INFO', 'Waiting for connections...');
