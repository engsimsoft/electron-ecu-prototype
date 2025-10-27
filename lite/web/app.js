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

// Test message
socket.on('test-message', (data) => {
  console.log('[WebSocket] Received:', data);
});

console.log('[App] Initialized');
