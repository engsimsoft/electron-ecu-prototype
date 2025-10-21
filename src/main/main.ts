import { app, BrowserWindow, ipcMain, MessageChannelMain } from 'electron';
import * as path from 'path';
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
