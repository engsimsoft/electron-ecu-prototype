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
    ipcRenderer.on('port', (event) => {
      // Get the MessagePort from the event
      if (!event.ports || event.ports.length === 0) {
        console.error('No ports in event');
        return;
      }

      const port = event.ports[0];
      if (port) {
        console.log('MessagePort received in preload context');

        // Set up message handler IN PRELOAD (before contextBridge)
        port.onmessage = (messageEvent) => {
          // Forward the data packet to renderer via callback
          callback(messageEvent.data);
        };

        // Start the port to begin receiving messages
        port.start();
        console.log('MessagePort started in preload context, forwarding messages to renderer');
      }
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
