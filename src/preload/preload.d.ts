export interface ElectronAPI {
  // Stage 2: Test message receiver
  onTestMessage: (callback: (data: { message: string; type: string }) => void) => void;

  // Stage 3: MessagePort IPC (data forwarding from preload)
  onDataPacket: (callback: (packet: any) => void) => void;
  startSimulation: () => void;
  stopSimulation: () => void;

  // Stage 6: Performance logging
  logRendererMetrics: (metrics: any) => void;

  // Show test results
  showResults: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
