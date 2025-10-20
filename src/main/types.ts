/**
 * Data packet structure for ECU simulation
 * Contains timestamp, values array, and sequence number for tracking
 */
export interface DataPacket {
  /**
   * Timestamp when the packet was created (milliseconds since epoch)
   */
  timestamp: number;

  /**
   * Array of 300 parameter values
   * Using Float64Array for optimal performance with structured clone algorithm
   */
  values: Float64Array;

  /**
   * Sequential packet number for tracking and dropped packet detection
   */
  sequenceNumber: number;
}

/**
 * Performance metrics structure for logging
 */
export interface PerformanceMetrics {
  timestamp: number;
  process: 'main' | 'renderer';
  fps?: number;
  cpu?: number;
  memory?: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  packets?: {
    received: number;
    expected: number;
    dropped: number;
    droppedPercent: number;
  };
}
