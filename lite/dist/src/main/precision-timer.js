"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecisionTimer = void 0;
/**
 * PrecisionTimer class with drift compensation
 * Uses process.hrtime.bigint() for nanosecond precision
 * Self-adjusting to maintain target interval accuracy
 */
class PrecisionTimer {
    /**
     * Creates a new PrecisionTimer
     * @param targetIntervalMs - Target interval in milliseconds (e.g., 40 for 25 Hz)
     */
    constructor(targetIntervalMs) {
        this.running = false;
        this.nextTick = 0n;
        this.timeoutId = null;
        this.targetInterval = targetIntervalMs;
    }
    /**
     * Start the precision timer
     * @param callback - Function to call on each tick
     */
    start(callback) {
        if (this.running) {
            console.warn('PrecisionTimer: Timer already running');
            return;
        }
        this.running = true;
        // Set initial next tick time
        this.nextTick = process.hrtime.bigint() + BigInt(this.targetInterval * 1000000);
        // Start the tick loop
        this.tick(callback);
    }
    /**
     * Stop the precision timer
     */
    stop() {
        this.running = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
    /**
     * Internal tick method with drift compensation
     * @param callback - Function to call on each tick
     */
    tick(callback) {
        if (!this.running) {
            return;
        }
        // Get current time in nanoseconds
        const now = process.hrtime.bigint();
        // Calculate drift (how much we're off from the planned time)
        const drift = now - this.nextTick;
        // Execute the callback
        callback();
        // Calculate next tick time with drift compensation
        // If we're late (drift > 0), we'll schedule the next tick slightly earlier
        // If we're early (drift < 0), we'll schedule slightly later
        this.nextTick = this.nextTick + BigInt(this.targetInterval * 1000000);
        // Calculate delay for next tick in nanoseconds
        const delayNs = this.nextTick - process.hrtime.bigint();
        // Convert nanoseconds to milliseconds
        // Using Math.max to ensure we don't have negative delays
        const delayMs = Math.max(0, Number(delayNs) / 1000000);
        // Schedule next tick
        this.timeoutId = setTimeout(() => this.tick(callback), delayMs);
    }
    /**
     * Check if timer is currently running
     */
    isRunning() {
        return this.running;
    }
    /**
     * Get the target interval in milliseconds
     */
    getTargetInterval() {
        return this.targetInterval;
    }
}
exports.PrecisionTimer = PrecisionTimer;
