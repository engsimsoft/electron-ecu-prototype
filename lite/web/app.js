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

// Button handlers
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  startBtn.addEventListener('click', () => {
    console.log('[UI] Start button clicked');
    socket.emit('start-simulation');
  });

  stopBtn.addEventListener('click', () => {
    console.log('[UI] Stop button clicked');
    socket.emit('stop-simulation');
  });
});

console.log('[App] Initialized');
