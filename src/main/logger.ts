/**
 * Performance Logger for Main Process
 * Uses Pino for high-performance structured logging with automatic file rotation
 */

import pino from 'pino';
import { createStream } from 'rotating-file-stream';
import * as path from 'path';
import * as fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create rotating file stream for main process logs
const mainStream = createStream('performance-main.log', {
  size: '10M',      // Rotate at 10MB
  maxFiles: 5,      // Keep max 5 files
  compress: 'gzip', // Compress old logs
  path: logsDir,
});

// Create rotating file stream for renderer process logs
const rendererStream = createStream('performance-renderer.log', {
  size: '10M',
  maxFiles: 5,
  compress: 'gzip',
  path: logsDir,
});

// Main process logger
export const mainLogger = pino({
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
}, mainStream);

// Renderer process logger (receives data from renderer via IPC)
export const rendererLogger = pino({
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
}, rendererStream);

// Log startup
mainLogger.info({ event: 'logger_initialized' }, 'Performance logging initialized');
