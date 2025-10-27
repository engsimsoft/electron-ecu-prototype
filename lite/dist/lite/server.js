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
// Import from Full version
const data_generator_1 = require("../src/main/data-generator");
const precision_timer_1 = require("../src/main/precision-timer");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const PORT = 3000;
// Инициализация генератора данных
const dataGen = new data_generator_1.DataGenerator(300); // 300 параметров
let sequenceNumber = 0;
// Precision timer 40ms (25Hz)
const timer = new precision_timer_1.PrecisionTimer(40);
// Раздаём статические файлы из web/
app.use(express_1.default.static(path_1.default.join(__dirname, '../../web')));
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
    // Start simulation command
    socket.on('start-simulation', () => {
        console.log('[Server] Starting simulation...');
        sequenceNumber = 0;
        timer.start(() => {
            // Генерируем пакет данных
            const packet = dataGen.generatePacket(sequenceNumber++);
            // ВАЖНО: Socket.IO не умеет передавать Float64Array
            // Конвертируем в обычный массив
            const packetForWeb = {
                sequenceNumber: packet.sequenceNumber,
                timestamp: packet.timestamp,
                values: Array.from(packet.values) // Float64Array -> Array
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
