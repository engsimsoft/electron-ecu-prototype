"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const open_1 = __importDefault(require("open"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const PORT = 3000;
// Раздаём статические файлы из web/
app.use(express_1.default.static(path_1.default.join(__dirname, '../web')));
// Запускаем сервер
server.listen(PORT, async () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
    // Автоматически открываем браузер
    try {
        await (0, open_1.default)(`http://localhost:${PORT}`);
        console.log('[Server] Browser opened automatically');
    }
    catch (err) {
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
