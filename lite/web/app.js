// Socket.IO connection
const socket = io('http://localhost:3000');

// Connection status
const statusElement = document.getElementById('status');

// ChartManager instance (initialized after DOM loads)
let chartManager = null;

// Animation frame for chart updates @ 60 FPS
let animationFrameId = null;

function updateChartsLoop() {
  if (chartManager) {
    chartManager.updateCharts();
  }
  animationFrameId = requestAnimationFrame(updateChartsLoop);
}

// Start time for relative timestamps
let startTime = Date.now();

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
  if (!chartManager) return;

  // Calculate relative timestamp in seconds
  const timestamp = (Date.now() - startTime) / 1000;

  // Add data to charts (9 parameters total, 3 per chart)
  chartManager.addDataPoint(0, timestamp, [
    packet.data[0],  // Param 0 (red)
    packet.data[1],  // Param 1 (blue)
    packet.data[2]   // Param 2 (green)
  ]);

  chartManager.addDataPoint(1, timestamp, [
    packet.data[3],  // Param 3 (red)
    packet.data[4],  // Param 4 (blue)
    packet.data[5]   // Param 5 (green)
  ]);

  chartManager.addDataPoint(2, timestamp, [
    packet.data[6],  // Param 6 (red)
    packet.data[7],  // Param 7 (blue)
    packet.data[8]   // Param 8 (green)
  ]);
});

// Simulation status updates
socket.on('simulation-status', (status) => {
  console.log('[Simulation] Status:', status.running ? 'Running' : 'Stopped');
});

// Initialize ChartManager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Get chart containers
  const containers = [
    document.getElementById('chart1'),
    document.getElementById('chart2'),
    document.getElementById('chart3')
  ];

  // Initialize ChartManager
  try {
    chartManager = new ChartManager(containers);
    console.log('[Charts] ChartManager initialized with 3 charts');

    // Start animation loop for 60 FPS updates
    updateChartsLoop();
    console.log('[Charts] Animation loop started @ 60 FPS');
  } catch (error) {
    console.error('[Charts] Failed to initialize ChartManager:', error);
  }

  // Button handlers
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  startBtn.addEventListener('click', () => {
    console.log('[UI] Start button clicked');
    startTime = Date.now(); // Reset start time
    if (chartManager) {
      chartManager.clear(); // Clear old data
    }
    socket.emit('start-simulation');
  });

  stopBtn.addEventListener('click', () => {
    console.log('[UI] Stop button clicked');
    socket.emit('stop-simulation');
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (chartManager) {
      chartManager.resize();
    }
  });
});

console.log('[App] Initialized');
