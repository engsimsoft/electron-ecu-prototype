/**
 * Performance Logger and Monitoring Classes
 * Collects CPU, Memory, Event Loop metrics for Main Process
 */

import { performance } from 'perf_hooks';
import { mainLogger } from './logger';

/**
 * CPU Monitor - tracks CPU usage percentage
 */
export class CPUMonitor {
  private previousCPU = process.cpuUsage();
  private previousTime = Date.now();

  /**
   * Get CPU usage percentage since last call
   * @returns CPU usage as percentage (0-100)
   */
  getCPUPercentage(): number {
    const currentCPU = process.cpuUsage(this.previousCPU);
    const currentTime = Date.now();
    const timeDiff = currentTime - this.previousTime;

    // Convert microseconds to milliseconds
    const totalCPU = (currentCPU.user + currentCPU.system) / 1000;

    // Calculate CPU percentage
    const cpuPercent = (totalCPU / timeDiff) * 100;

    // Update state for next call
    this.previousCPU = process.cpuUsage();
    this.previousTime = currentTime;

    return parseFloat(cpuPercent.toFixed(2));
  }

  /**
   * Reset the monitor (useful when restarting measurements)
   */
  reset(): void {
    this.previousCPU = process.cpuUsage();
    this.previousTime = Date.now();
  }
}

/**
 * Event Loop Monitor - tracks event loop utilization
 */
export class EventLoopMonitor {
  private previousELU = performance.eventLoopUtilization();

  /**
   * Get event loop utilization metrics
   * @returns Object with utilization percentage, active and idle times
   */
  getUtilization() {
    const currentELU = performance.eventLoopUtilization(this.previousELU);
    this.previousELU = performance.eventLoopUtilization();

    return {
      utilization: parseFloat((currentELU.utilization * 100).toFixed(2)),
      active: parseFloat(currentELU.active.toFixed(2)),
      idle: parseFloat(currentELU.idle.toFixed(2)),
    };
  }

  /**
   * Reset the monitor
   */
  reset(): void {
    this.previousELU = performance.eventLoopUtilization();
  }
}

/**
 * Packet Tracker - tracks packet generation and potential drops
 */
export class PacketTracker {
  private generatedCount = 0;
  private startTime: number | null = null;

  /**
   * Call when a packet is generated
   */
  onPacketGenerated(): void {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
    this.generatedCount++;
  }

  /**
   * Get expected packet count based on elapsed time and 25 Hz rate
   */
  getExpectedCount(): number {
    if (this.startTime === null) return 0;
    const elapsed = Date.now() - this.startTime;
    return Math.floor(elapsed / 40); // 40ms interval = 25 Hz
  }

  /**
   * Get actual generated count
   */
  getGeneratedCount(): number {
    return this.generatedCount;
  }

  /**
   * Get dropped packet count (expected - generated)
   */
  getDroppedCount(): number {
    const expected = this.getExpectedCount();
    return Math.max(0, expected - this.generatedCount);
  }

  /**
   * Get dropped percentage
   */
  getDroppedPercentage(): number {
    const expected = this.getExpectedCount();
    if (expected === 0) return 0;
    const dropped = this.getDroppedCount();
    return parseFloat(((dropped / expected) * 100).toFixed(2));
  }

  /**
   * Reset the tracker
   */
  reset(): void {
    this.generatedCount = 0;
    this.startTime = null;
  }
}

/**
 * Performance Logger - orchestrates all monitors and logs metrics
 */
export class PerformanceLogger {
  private cpuMonitor: CPUMonitor;
  private eventLoopMonitor: EventLoopMonitor;
  private packetTracker: PacketTracker;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.cpuMonitor = new CPUMonitor();
    this.eventLoopMonitor = new EventLoopMonitor();
    this.packetTracker = new PacketTracker();
  }

  /**
   * Start logging metrics at specified interval
   * @param intervalMs Logging interval in milliseconds (default: 1000ms)
   */
  start(intervalMs = 1000): void {
    if (this.isRunning) {
      mainLogger.warn('Performance logger already running');
      return;
    }

    this.isRunning = true;
    this.reset();

    mainLogger.info({ event: 'performance_logging_started', interval: intervalMs });

    this.intervalId = setInterval(() => {
      this.logMetrics();
    }, intervalMs);
  }

  /**
   * Stop logging metrics
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    mainLogger.info({ event: 'performance_logging_stopped' });
  }

  /**
   * Collect and log all metrics
   */
  private logMetrics(): void {
    const cpu = this.cpuMonitor.getCPUPercentage();
    const memory = process.memoryUsage();
    const eventLoop = this.eventLoopMonitor.getUtilization();

    const metrics = {
      timestamp: Date.now(),
      process: 'main',
      cpu,
      memory: {
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal,
        rss: memory.rss,
        external: memory.external,
      },
      eventLoop: {
        utilization: eventLoop.utilization,
        active: eventLoop.active,
        idle: eventLoop.idle,
      },
      packets: {
        generated: this.packetTracker.getGeneratedCount(),
        expected: this.packetTracker.getExpectedCount(),
        dropped: this.packetTracker.getDroppedCount(),
        droppedPercent: this.packetTracker.getDroppedPercentage(),
      },
    };

    mainLogger.info(metrics);
  }

  /**
   * Get packet tracker for external use
   */
  getPacketTracker(): PacketTracker {
    return this.packetTracker;
  }

  /**
   * Reset all monitors
   */
  reset(): void {
    this.cpuMonitor.reset();
    this.eventLoopMonitor.reset();
    this.packetTracker.reset();
  }

  /**
   * Check if logger is running
   */
  get running(): boolean {
    return this.isRunning;
  }
}
