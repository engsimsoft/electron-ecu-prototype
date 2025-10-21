#!/usr/bin/env node

/**
 * Performance Log Analyzer
 * Parses NDJSON performance logs and generates statistics
 *
 * Usage:
 *   node scripts/analyze-logs.js logs/performance-main.log
 *   node scripts/analyze-logs.js logs/performance-renderer.log
 */

const fs = require('fs');
const path = require('path');

/**
 * Calculate percentile from sorted array
 */
function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Analyze main process logs
 */
function analyzeMainLog(logPath) {
  console.log('\n=== Main Process Performance Analysis ===\n');

  const content = fs.readFileSync(logPath, 'utf-8');
  const lines = content.trim().split('\n');

  const cpuValues = [];
  const memoryRSS = [];
  const memoryHeapUsed = [];
  const eventLoopUtil = [];
  const packetsGenerated = [];
  const packetsDropped = [];

  lines.forEach((line, index) => {
    try {
      const entry = JSON.parse(line);

      // Skip non-metric entries
      if (!entry.cpu) return;

      cpuValues.push(entry.cpu);

      if (entry.memory) {
        memoryRSS.push(entry.memory.rss);
        memoryHeapUsed.push(entry.memory.heapUsed);
      }

      if (entry.eventLoop) {
        eventLoopUtil.push(entry.eventLoop.utilization);
      }

      if (entry.packets) {
        packetsGenerated.push(entry.packets.generated);
        packetsDropped.push(entry.packets.dropped);
      }
    } catch (err) {
      console.warn(`Warning: Failed to parse line ${index + 1}: ${err.message}`);
    }
  });

  if (cpuValues.length === 0) {
    console.log('No performance metrics found in log file.');
    return;
  }

  // CPU statistics
  console.log('CPU Usage (%)');
  console.log(`  Min:     ${Math.min(...cpuValues).toFixed(2)}%`);
  console.log(`  Max:     ${Math.max(...cpuValues).toFixed(2)}%`);
  console.log(`  Average: ${(cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length).toFixed(2)}%`);
  console.log(`  Median:  ${percentile(cpuValues, 50).toFixed(2)}%`);
  console.log(`  P95:     ${percentile(cpuValues, 95).toFixed(2)}%`);
  console.log(`  P99:     ${percentile(cpuValues, 99).toFixed(2)}%`);

  // Memory statistics
  console.log('\nMemory (MB)');
  const rssStart = memoryRSS[0] / (1024 * 1024);
  const rssEnd = memoryRSS[memoryRSS.length - 1] / (1024 * 1024);
  const heapStart = memoryHeapUsed[0] / (1024 * 1024);
  const heapEnd = memoryHeapUsed[memoryHeapUsed.length - 1] / (1024 * 1024);

  console.log(`  RSS Start:      ${rssStart.toFixed(2)} MB`);
  console.log(`  RSS End:        ${rssEnd.toFixed(2)} MB`);
  console.log(`  RSS Growth:     ${(rssEnd - rssStart).toFixed(2)} MB`);
  console.log(`  Heap Start:     ${heapStart.toFixed(2)} MB`);
  console.log(`  Heap End:       ${heapEnd.toFixed(2)} MB`);
  console.log(`  Heap Growth:    ${(heapEnd - heapStart).toFixed(2)} MB`);

  // Event Loop statistics
  console.log('\nEvent Loop Utilization (%)');
  console.log(`  Min:     ${Math.min(...eventLoopUtil).toFixed(2)}%`);
  console.log(`  Max:     ${Math.max(...eventLoopUtil).toFixed(2)}%`);
  console.log(`  Average: ${(eventLoopUtil.reduce((a, b) => a + b, 0) / eventLoopUtil.length).toFixed(2)}%`);
  console.log(`  P95:     ${percentile(eventLoopUtil, 95).toFixed(2)}%`);

  // Packets statistics
  if (packetsGenerated.length > 0) {
    const totalGenerated = packetsGenerated[packetsGenerated.length - 1];
    const totalDropped = packetsDropped[packetsDropped.length - 1];
    const dropRate = totalGenerated > 0 ? (totalDropped / totalGenerated) * 100 : 0;

    console.log('\nPackets');
    console.log(`  Total Generated: ${totalGenerated}`);
    console.log(`  Total Dropped:   ${totalDropped} (${dropRate.toFixed(2)}%)`);
  }

  console.log(`\nTotal Samples: ${cpuValues.length}`);
}

/**
 * Analyze renderer process logs
 */
function analyzeRendererLog(logPath) {
  console.log('\n=== Renderer Process Performance Analysis ===\n');

  const content = fs.readFileSync(logPath, 'utf-8');
  const lines = content.trim().split('\n');

  const fpsValues = [];
  const renderTimes = [];
  const latencies = [];
  const memoryUsed = [];

  lines.forEach((line, index) => {
    try {
      const entry = JSON.parse(line);

      // Skip non-metric entries
      if (entry.fps === undefined) return;

      fpsValues.push(entry.fps);

      if (entry.renderTime !== undefined) {
        renderTimes.push(entry.renderTime);
      }

      if (entry.ipc && entry.ipc.latency !== undefined) {
        latencies.push(entry.ipc.latency);
      }

      if (entry.memory && entry.memory.usedJSHeapSize) {
        memoryUsed.push(entry.memory.usedJSHeapSize);
      }
    } catch (err) {
      console.warn(`Warning: Failed to parse line ${index + 1}: ${err.message}`);
    }
  });

  if (fpsValues.length === 0) {
    console.log('No performance metrics found in log file.');
    return;
  }

  // FPS statistics
  console.log('FPS (Frames Per Second)');
  console.log(`  Min:     ${Math.min(...fpsValues)}`);
  console.log(`  Max:     ${Math.max(...fpsValues)}`);
  console.log(`  Average: ${(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length).toFixed(2)}`);
  console.log(`  Median:  ${percentile(fpsValues, 50)}`);
  console.log(`  P95:     ${percentile(fpsValues, 95)}`);
  console.log(`  P99:     ${percentile(fpsValues, 99)}`);

  // Render time statistics
  if (renderTimes.length > 0) {
    console.log('\nRender Time (ms)');
    console.log(`  Min:     ${Math.min(...renderTimes).toFixed(2)} ms`);
    console.log(`  Max:     ${Math.max(...renderTimes).toFixed(2)} ms`);
    console.log(`  Average: ${(renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length).toFixed(2)} ms`);
    console.log(`  P95:     ${percentile(renderTimes, 95).toFixed(2)} ms`);
    console.log(`  P99:     ${percentile(renderTimes, 99).toFixed(2)} ms`);
  }

  // IPC latency statistics
  if (latencies.length > 0) {
    console.log('\nIPC Latency (ms)');
    console.log(`  Min:     ${Math.min(...latencies).toFixed(2)} ms`);
    console.log(`  Max:     ${Math.max(...latencies).toFixed(2)} ms`);
    console.log(`  Average: ${(latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)} ms`);
    console.log(`  P95:     ${percentile(latencies, 95).toFixed(2)} ms`);
    console.log(`  P99:     ${percentile(latencies, 99).toFixed(2)} ms`);
  }

  // Memory statistics
  if (memoryUsed.length > 0) {
    const memStart = memoryUsed[0] / (1024 * 1024);
    const memEnd = memoryUsed[memoryUsed.length - 1] / (1024 * 1024);

    console.log('\nJS Heap Memory (MB)');
    console.log(`  Start:  ${memStart.toFixed(2)} MB`);
    console.log(`  End:    ${memEnd.toFixed(2)} MB`);
    console.log(`  Growth: ${(memEnd - memStart).toFixed(2)} MB`);
  }

  console.log(`\nTotal Samples: ${fpsValues.length}`);
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node scripts/analyze-logs.js <log-file-path>');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/analyze-logs.js logs/performance-main.log');
    console.log('  node scripts/analyze-logs.js logs/performance-renderer.log');
    process.exit(1);
  }

  const logPath = args[0];

  if (!fs.existsSync(logPath)) {
    console.error(`Error: Log file not found: ${logPath}`);
    process.exit(1);
  }

  const filename = path.basename(logPath);

  if (filename.includes('main')) {
    analyzeMainLog(logPath);
  } else if (filename.includes('renderer')) {
    analyzeRendererLog(logPath);
  } else {
    console.log('Cannot determine log type from filename. Trying renderer format...');
    analyzeRendererLog(logPath);
  }

  console.log('\n');
}

// Run main function
main();
