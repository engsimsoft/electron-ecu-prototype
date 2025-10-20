/// <reference path="../preload/preload.d.ts" />

// Import types
import type { DataPacket } from '../main/types';

// Import uPlot (Stage 5)
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { ChartManager } from './chart-manager';

/**
 * FPSMonitor class - tracks frames per second
 * Stage 4: UI and Control Panel
 */
class FPSMonitor {
  private frames: number[] = [];
  private readonly windowSize: number = 1000; // 1 second window

  /**
   * Register a frame tick
   */
  tick(): void {
    const now = performance.now();
    this.frames.push(now);

    // Remove frames older than 1 second
    const cutoff = now - this.windowSize;
    while (this.frames.length > 0 && this.frames[0] < cutoff) {
      this.frames.shift();
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.frames.length;
  }

  /**
   * Reset the FPS counter
   */
  reset(): void {
    this.frames = [];
  }
}

// Renderer process - Stage 3: MessagePort IPC
console.log('Renderer process initialized');

// Check that electronAPI is available
if (window.electronAPI) {
  console.log('electronAPI is available');
} else {
  console.error('electronAPI is NOT available - check preload script');
}

// Data reception (MessagePort handled in preload)
let dataReady = false;

// Statistics
let receivedCount = 0;
let lastSequenceNumber = -1;
let droppedPackets = 0;
let startTime = 0;
let isRunning = false;

// Latency tracking
let latencies: number[] = [];
const MAX_LATENCY_SAMPLES = 100; // Keep last 100 latencies for averaging

// FPS Monitoring (Stage 4)
const fpsMonitor = new FPSMonitor();

// Chart Management (Stage 5)
let chartManager: ChartManager | null = null;

/**
 * Handle incoming data packet
 */
function handleDataPacket(packet: DataPacket): void {
  receivedCount++;

  // Check for dropped packets
  if (lastSequenceNumber !== -1) {
    const expectedSeq = lastSequenceNumber + 1;
    if (packet.sequenceNumber !== expectedSeq) {
      const dropped = packet.sequenceNumber - expectedSeq;
      droppedPackets += dropped;
      console.warn(`Dropped ${dropped} packets! Expected seq ${expectedSeq}, got ${packet.sequenceNumber}`);
    }
  }
  lastSequenceNumber = packet.sequenceNumber;

  // Calculate latency
  const latency = Date.now() - packet.timestamp;
  latencies.push(latency);
  if (latencies.length > MAX_LATENCY_SAMPLES) {
    latencies.shift(); // Remove oldest
  }

  // Add data to charts (Stage 5)
  if (chartManager && packet.data.length >= 9) {
    // Calculate timestamp in seconds from start
    const timestampSeconds = (Date.now() - startTime) / 1000;

    // Chart 1: Parameters 0-2
    chartManager.addDataPoint(0, timestampSeconds, [
      packet.data[0],
      packet.data[1],
      packet.data[2]
    ]);

    // Chart 2: Parameters 3-5
    chartManager.addDataPoint(1, timestampSeconds, [
      packet.data[3],
      packet.data[4],
      packet.data[5]
    ]);

    // Chart 3: Parameters 6-8
    chartManager.addDataPoint(2, timestampSeconds, [
      packet.data[6],
      packet.data[7],
      packet.data[8]
    ]);
  }

  // Log every 100th packet
  if (receivedCount % 100 === 0) {
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    console.log(
      `Received packet #${receivedCount}, ` +
      `seq: ${packet.sequenceNumber}, ` +
      `latency: ${latency.toFixed(2)}ms, ` +
      `avg latency: ${avgLatency.toFixed(2)}ms, ` +
      `dropped: ${droppedPackets}`
    );
  }

  // Update UI stats (Stage 4)
  updateStats();
}

/**
 * Update statistics display
 */
function updateStats(): void {
  const packetsElement = document.getElementById('packets-received');
  const fpsElement = document.getElementById('fps-count');
  const droppedElement = document.getElementById('packets-dropped');
  const latencyElement = document.getElementById('avg-latency');
  const uptimeElement = document.getElementById('uptime');

  if (packetsElement) {
    packetsElement.textContent = receivedCount.toString();
  }

  // Update FPS with color indication
  if (fpsElement) {
    const currentFPS = fpsMonitor.getFPS();
    fpsElement.textContent = currentFPS.toString();

    // Update FPS color class based on value
    fpsElement.classList.remove('fps-good', 'fps-warning', 'fps-bad');
    if (currentFPS >= 55) {
      fpsElement.classList.add('fps-good');
    } else if (currentFPS >= 45) {
      fpsElement.classList.add('fps-warning');
    } else {
      fpsElement.classList.add('fps-bad');
    }
  }

  if (droppedElement) {
    const totalExpected = receivedCount + droppedPackets;
    const droppedPercent = totalExpected > 0 ? (droppedPackets / totalExpected * 100).toFixed(2) : '0.00';
    droppedElement.textContent = `${droppedPackets} (${droppedPercent}%)`;
  }

  if (latencyElement && latencies.length > 0) {
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    latencyElement.textContent = `${avgLatency.toFixed(2)}ms`;
  }

  if (uptimeElement && isRunning) {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    uptimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Start simulation
 */
function startSimulation(): void {
  if (isRunning) {
    console.log('Simulation already running');
    return;
  }

  console.log('Starting simulation...');
  isRunning = true;
  receivedCount = 0;
  lastSequenceNumber = -1;
  droppedPackets = 0;
  latencies = [];
  renderTimes = [];
  startTime = Date.now();

  // Reset FPS monitor
  fpsMonitor.reset();

  // Clear charts (Stage 5)
  if (chartManager) {
    chartManager.clear();
  }

  // Send command to main process
  window.electronAPI.startSimulation();

  // Update UI
  updateButtonStates();
}

/**
 * Stop simulation
 */
function stopSimulation(): void {
  if (!isRunning) {
    console.log('Simulation not running');
    return;
  }

  console.log('Stopping simulation...');
  isRunning = false;

  // Send command to main process
  window.electronAPI.stopSimulation();

  // Log final statistics
  const elapsed = Date.now() - startTime;
  const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
  const expectedPackets = Math.floor(elapsed / 40); // 40ms intervals

  console.log('');
  console.log('=== Simulation Statistics ===');
  console.log(`Duration: ${(elapsed / 1000).toFixed(2)}s`);
  console.log(`Packets received: ${receivedCount}`);
  console.log(`Expected packets: ${expectedPackets}`);
  console.log(`Dropped packets: ${droppedPackets} (${(droppedPackets / expectedPackets * 100).toFixed(2)}%)`);
  console.log(`Average latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`Min latency: ${Math.min(...latencies).toFixed(2)}ms`);
  console.log(`Max latency: ${Math.max(...latencies).toFixed(2)}ms`);
  console.log('============================');

  // Update UI
  updateButtonStates();
}

/**
 * Update button states
 */
function updateButtonStates(): void {
  const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
  const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;

  if (startBtn && stopBtn) {
    startBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;
  }
}

// Setup data packet listener (MessagePort handled in preload)
console.log('Setting up data packet listener...');
window.electronAPI.onDataPacket((packet: DataPacket) => {
  if (!dataReady) {
    console.log('✅ Data channel ready! Receiving packets from preload...');
    dataReady = true;
  }

  // Log first few packets, then only every 100th
  if (receivedCount < 5 || receivedCount % 100 === 0) {
    console.log('📦 Packet received, seq:', packet.sequenceNumber);
  }

  handleDataPacket(packet);
});

// Setup button event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up UI...');

  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');

  if (startBtn) {
    startBtn.addEventListener('click', startSimulation);
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', stopSimulation);
  }

  // Initialize button states
  updateButtonStates();

  // Initialize charts (Stage 5)
  const chart1 = document.getElementById('chart-1') as HTMLElement;
  const chart2 = document.getElementById('chart-2') as HTMLElement;
  const chart3 = document.getElementById('chart-3') as HTMLElement;

  if (chart1 && chart2 && chart3) {
    console.log('Initializing ChartManager...');
    chartManager = new ChartManager([chart1, chart2, chart3]);
    console.log('ChartManager initialized successfully');
  } else {
    console.error('Chart containers not found!');
  }

  console.log('UI setup complete');
});

/**
 * Rendering loop with requestAnimationFrame
 * Stage 4: Updates FPS counter
 * Stage 5: Updates charts
 */
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS; // ~16.67ms

// Performance tracking
let renderTimes: number[] = [];
const MAX_RENDER_SAMPLES = 100;

function renderLoop(currentTime: number): void {
  const deltaTime = currentTime - lastFrameTime;

  if (deltaTime >= frameInterval) {
    lastFrameTime = currentTime - (deltaTime % frameInterval);

    // Measure render time
    const renderStartTime = performance.now();

    // Update charts (Stage 5)
    if (chartManager && isRunning) {
      chartManager.updateCharts();
    }

    // Update FPS counter
    fpsMonitor.tick();

    // Track render time
    const renderTime = performance.now() - renderStartTime;
    renderTimes.push(renderTime);
    if (renderTimes.length > MAX_RENDER_SAMPLES) {
      renderTimes.shift();
    }

    // Log render time every 100 frames (warning if slow)
    if (fpsMonitor.getFPS() > 0 && receivedCount % 100 === 0 && renderTimes.length > 0) {
      const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      if (avgRenderTime > 10) {
        console.warn(`Average render time: ${avgRenderTime.toFixed(2)}ms (target: <16.67ms)`);
      }
    }
  }

  requestAnimationFrame(renderLoop);
}

// Start rendering loop
requestAnimationFrame(renderLoop);

// Update stats periodically (every second)
setInterval(() => {
  if (isRunning) {
    updateStats();
  }
}, 1000);
