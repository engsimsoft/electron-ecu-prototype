import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Stage 2: Receive test messages from main process
  onTestMessage: (callback: (data: { message: string; type: string }) => void) => {
    ipcRenderer.on('test-message', (_event, data) => callback(data));
  },

  // Stage 3: MessagePort IPC for real-time data streaming
  // We handle MessagePort in preload and forward messages to renderer
  onDataPacket: (callback: (packet: any) => void) => {
    let portInitialized = false;

    ipcRenderer.on('port', (event) => {
      // Only initialize port once
      if (portInitialized) {
        return;
      }

      // Get the MessagePort from the event
      const ports = (event as any).ports;
      if (!ports || !Array.isArray(ports) || ports.length === 0) {
        console.error('No ports in event or ports is not an array');
        return;
      }

      const port = ports[0];
      if (!port) {
        console.error('Port at index 0 is null or undefined');
        return;
      }

      portInitialized = true;
      console.log('MessagePort received in preload context');

      // Set up message handler IN PRELOAD (before contextBridge)
      port.onmessage = (messageEvent: MessageEvent) => {
        // Forward the data packet to renderer via callback
        if (messageEvent && messageEvent.data) {
          callback(messageEvent.data);
        }
      };

      // Start the port to begin receiving messages
      port.start();
      console.log('MessagePort started in preload context, forwarding messages to renderer');
    });
  },

  // Start simulation command
  startSimulation: () => {
    ipcRenderer.send('start-simulation');
  },

  // Stop simulation command
  stopSimulation: () => {
    ipcRenderer.send('stop-simulation');
  }
});

console.log('Preload script loaded successfully');
