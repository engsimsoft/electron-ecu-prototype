import { DataPacket } from './types';

/**
 * DataGenerator class for simulating ECU data packets
 * Generates realistic parameter values with smooth transitions
 */
export class DataGenerator {
  private currentValues: Float64Array;
  private readonly parameterCount: number;

  /**
   * Creates a new DataGenerator instance
   * @param parameterCount - Number of parameters to generate (default: 300)
   */
  constructor(parameterCount: number = 300) {
    this.parameterCount = parameterCount;
    this.currentValues = new Float64Array(parameterCount);

    // Initialize with random starting values
    this.initializeValues();
  }

  /**
   * Initialize all parameters with random starting values
   */
  private initializeValues(): void {
    for (let i = 0; i < this.parameterCount; i++) {
      if (i < 51) {
        // Parameters 0-50: Fast changing (RPM, throttle) - range 0-8000
        this.currentValues[i] = Math.random() * 8000;
      } else if (i < 101) {
        // Parameters 51-100: Medium changing (pressure, AFR) - range 0-200
        this.currentValues[i] = Math.random() * 200;
      } else {
        // Parameters 101-300: Slow changing (temperatures) - range 0-100
        this.currentValues[i] = Math.random() * 100;
      }
    }
  }

  /**
   * Generate a single data packet with smooth value transitions
   * @param sequenceNumber - Sequential packet number
   * @returns DataPacket with current timestamp and generated values
   */
  generatePacket(sequenceNumber: number): DataPacket {
    const values = new Float64Array(this.parameterCount);

    for (let i = 0; i < this.parameterCount; i++) {
      let change: number;

      if (i < 51) {
        // Fast changing parameters: ±50-100
        change = (Math.random() - 0.5) * 200;
        // Clamp to range 0-8000
        this.currentValues[i] = Math.max(0, Math.min(8000, this.currentValues[i] + change));
      } else if (i < 101) {
        // Medium changing parameters: ±10-20
        change = (Math.random() - 0.5) * 40;
        // Clamp to range 0-200
        this.currentValues[i] = Math.max(0, Math.min(200, this.currentValues[i] + change));
      } else {
        // Slow changing parameters: ±1-5
        change = (Math.random() - 0.5) * 10;
        // Clamp to range 0-100
        this.currentValues[i] = Math.max(0, Math.min(100, this.currentValues[i] + change));
      }

      values[i] = this.currentValues[i];
    }

    return {
      timestamp: Date.now(),
      values,
      sequenceNumber,
    };
  }

  /**
   * Reset all values to random starting values
   */
  reset(): void {
    this.initializeValues();
  }
}
