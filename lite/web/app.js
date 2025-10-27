// Socket.IO connection
const socket = io('http://localhost:3000');

// Connection status
const statusElement = document.getElementById('status');

socket.on('connect', () => {
  console.log('[WebSocket] Connected');
  statusElement.textContent = 'Connected';
  statusElement.style.color = '#4ade80';
});

socket.on('disconnect', () => {
  console.log('[WebSocket] Disconnected');
  statusElement.textContent = 'Disconnected';
  statusElement.style.color = '#ef4444';
});

// Получение данных ЭБУ
socket.on('ecu-data', (packet) => {
  console.log('[Data] Received packet:', packet.sequenceNumber);
  // TODO: Этап 4 - отправить в графики
});

// Simulation status updates
socket.on('simulation-status', (status) => {
  console.log('[Simulation] Status:', status.running ? 'Running' : 'Stopped');
});

// Тестовая команда - автозапуск симуляции через 2 секунды
setTimeout(() => {
  console.log('[Test] Starting simulation...');
  socket.emit('start-simulation');
}, 2000);

console.log('[App] Initialized');
