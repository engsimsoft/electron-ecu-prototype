import { app, BrowserWindow, ipcMain, MessageChannelMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { DataGenerator } from './data-generator';
import { PrecisionTimer } from './precision-timer';
import { PerformanceLogger } from './performance-logger';
import { rendererLogger } from './logger';

let mainWindow: BrowserWindow | null = null;

// Data generation instances
const generator = new DataGenerator(300);
const timer = new PrecisionTimer(40); // 40ms = 25 Hz
let sequenceNumber = 0;
let simulationRunning = false;

// MessagePort for IPC communication
let dataPort: MessagePortMain | null = null;

// Performance logging
const performanceLogger = new PerformanceLogger();

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false  // Changed to false for IPC to work properly
    }
  });

  mainWindow = win;

  // Load the index.html from Vite dev server
  // In development, Vite serves files via HTTP
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    // In production, load from file
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Open DevTools for development
  win.webContents.openDevTools();

  win.on('closed', () => {
    mainWindow = null;
  });

  // Setup MessagePort after window is ready
  // Using multiple events to ensure MessagePort is set up
  let messagePortSetup = false;

  const trySetupMessagePort = () => {
    if (!messagePortSetup) {
      console.log('[Main] Attempting to setup MessagePort...');
      messagePortSetup = true;
      setupMessagePort(win);
    }
  };

  // Try on dom-ready (fires early)
  win.webContents.once('dom-ready', () => {
    console.log('[Main] dom-ready event fired');
    trySetupMessagePort();
  });

  // Backup: try on did-finish-load (with delay to ensure preload has executed)
  win.webContents.once('did-finish-load', () => {
    console.log('[Main] did-finish-load event fired');
    setTimeout(trySetupMessagePort, 100); // Increased delay to ensure preload is ready
  });
}

/**
 * Setup MessagePort for IPC communication
 * Stage 3: MessagePort-based real-time data streaming
 */
function setupMessagePort(win: BrowserWindow): void {
  console.log('[Main] Setting up MessagePort...');

  // Create MessageChannel
  const { port1, port2 } = new MessageChannelMain();

  // Store port1 for sending data from Main Process
  dataPort = port1;

  // Send port2 to Renderer Process via postMessage
  console.log('[Main] Sending port2 to renderer via postMessage...');
  win.webContents.postMessage('port', null, [port2]);

  // Start port1 to enable communication
  port1.start();

  console.log('[Main] MessagePort channel established and port1 started');
  console.log('[Main] Renderer should now receive MessagePort via "port" event');
}

/**
 * Start simulation - send data packets via MessagePort
 */
function startSimulation(): void {
  if (simulationRunning) {
    console.log('Simulation already running');
    return;
  }

  if (!dataPort) {
    console.error('MessagePort not initialized');
    return;
  }

  console.log('Starting simulation...');
  simulationRunning = true;
  sequenceNumber = 0;

  // Start performance logging
  performanceLogger.start(1000); // Log metrics every 1 second

  timer.start(() => {
    if (!dataPort || !simulationRunning) {
      return;
    }

    // Generate packet
    const packet = generator.generatePacket(sequenceNumber);

    // Track packet generation for performance metrics
    performanceLogger.getPacketTracker().onPacketGenerated();

    // Send packet via MessagePort
    dataPort.postMessage(packet);

    // Log every 100th packet for debugging
    if (sequenceNumber % 100 === 0) {
      console.log(`Sent packet #${sequenceNumber}`);
    }

    sequenceNumber++;
  });
}

/**
 * Stop simulation
 */
function stopSimulation(): void {
  if (!simulationRunning) {
    console.log('Simulation not running');
    return;
  }

  console.log('Stopping simulation...');
  simulationRunning = false;
  timer.stop();
  performanceLogger.stop(); // Stop performance logging
  console.log(`Total packets sent: ${sequenceNumber}`);
}

/**
 * Analyze performance logs and show results window
 */
function showResultsWindow(): void {
  console.log('Creating results window...');

  // Create results window
  const resultsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Test Results',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Analyze logs
  const logsDir = path.join(process.cwd(), 'logs');
  const mainLogPath = path.join(logsDir, 'performance-main.log');
  const rendererLogPath = path.join(logsDir, 'performance-renderer.log');

  let resultsHtml = '<html><head><title>Test Results</title><style>';
  resultsHtml += 'body { font-family: Arial, sans-serif; padding: 20px; background: #1e1e1e; color: #d4d4d4; }';
  resultsHtml += 'h1 { color: #4ec9b0; }';
  resultsHtml += 'h2 { color: #569cd6; margin-top: 20px; }';
  resultsHtml += '.metric { margin: 10px 0; padding: 10px; background: #2d2d2d; border-left: 3px solid #4ec9b0; }';
  resultsHtml += '.label { font-weight: bold; color: #dcdcaa; }';
  resultsHtml += '.value { color: #ce9178; }';
  resultsHtml += '.error { color: #f48771; }';
  resultsHtml += '</style></head><body>';
  resultsHtml += '<h1>📊 Test Results</h1>';

  try {
    // Analyze main process logs
    if (fs.existsSync(mainLogPath)) {
      const mainContent = fs.readFileSync(mainLogPath, 'utf-8');
      const mainLines = mainContent.trim().split('\n');
      const cpuValues: number[] = [];
      const memoryValues: number[] = [];

      mainLines.forEach(line => {
        try {
          const entry = JSON.parse(line);
          if (entry.cpu) cpuValues.push(entry.cpu);
          if (entry.memory?.rss) memoryValues.push(entry.memory.rss / 1024 / 1024); // Convert to MB
        } catch (e) { /* skip invalid lines */ }
      });

      if (cpuValues.length > 0) {
        resultsHtml += '<h2>Main Process</h2>';
        resultsHtml += `<div class="metric"><span class="label">CPU Average:</span> <span class="value">${(cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length).toFixed(2)}%</span></div>`;
        resultsHtml += `<div class="metric"><span class="label">CPU Min:</span> <span class="value">${Math.min(...cpuValues).toFixed(2)}%</span></div>`;
        resultsHtml += `<div class="metric"><span class="label">CPU Max:</span> <span class="value">${Math.max(...cpuValues).toFixed(2)}%</span></div>`;

        if (memoryValues.length > 0) {
          resultsHtml += `<div class="metric"><span class="label">Memory Average:</span> <span class="value">${(memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length).toFixed(2)} MB</span></div>`;
        }
      }
    }

    // Analyze renderer process logs
    if (fs.existsSync(rendererLogPath)) {
      const rendererContent = fs.readFileSync(rendererLogPath, 'utf-8');
      const rendererLines = rendererContent.trim().split('\n');
      const fpsValues: number[] = [];
      const latencyValues: number[] = [];

      rendererLines.forEach(line => {
        try {
          const entry = JSON.parse(line);
          if (entry.fps) fpsValues.push(entry.fps);
          if (entry.ipc?.latency) latencyValues.push(entry.ipc.latency);
        } catch (e) { /* skip invalid lines */ }
      });

      if (fpsValues.length > 0) {
        resultsHtml += '<h2>Renderer Process</h2>';
        resultsHtml += `<div class="metric"><span class="label">FPS Average:</span> <span class="value">${(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length).toFixed(2)}</span></div>`;
        resultsHtml += `<div class="metric"><span class="label">FPS Min:</span> <span class="value">${Math.min(...fpsValues).toFixed(2)}</span></div>`;
        resultsHtml += `<div class="metric"><span class="label">FPS Max:</span> <span class="value">${Math.max(...fpsValues).toFixed(2)}</span></div>`;

        if (latencyValues.length > 0) {
          resultsHtml += `<div class="metric"><span class="label">Latency Average:</span> <span class="value">${(latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length).toFixed(2)} ms</span></div>`;
        }
      }
    }
  } catch (error) {
    resultsHtml += `<div class="error">Error analyzing logs: ${error}</div>`;
  }

  resultsHtml += '</body></html>';

  // Load HTML content
  resultsWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(resultsHtml)}`);
}

/**
 * Setup IPC handlers
 */
function setupIpcHandlers(): void {
  // Start simulation command
  ipcMain.on('start-simulation', () => {
    console.log('Received start-simulation command');
    startSimulation();
  });

  // Stop simulation command
  ipcMain.on('stop-simulation', () => {
    console.log('Received stop-simulation command');
    stopSimulation();
  });

  // Renderer performance metrics logging
  ipcMain.on('log-renderer-metrics', (_event, metrics) => {
    rendererLogger.info(metrics);
  });

  // Show results window
  ipcMain.on('show-results', () => {
    console.log('Received show-results command');
    showResultsWindow();
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  // Setup IPC handlers
  setupIpcHandlers();

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS apps stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
