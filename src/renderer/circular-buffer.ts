/**
 * CircularBuffer - Generic circular buffer implementation
 * Stage 5: Charts with uPlot
 */
export class CircularBuffer<T> {
  private buffer: T[];
  private writeIndex: number = 0;
  private size: number = 0;

  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  /**
   * Add element to buffer (FIFO - overwrites oldest when full)
   */
  push(item: T): void {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;

    if (this.size < this.capacity) {
      this.size++;
    }
  }

  /**
   * Get all elements in correct order (oldest to newest)
   */
  getAll(): T[] {
    if (this.size < this.capacity) {
      // Buffer not full yet - return from start
      return this.buffer.slice(0, this.size);
    } else {
      // Buffer is full - return in correct order
      const result = new Array(this.capacity);
      for (let i = 0; i < this.capacity; i++) {
        result[i] = this.buffer[(this.writeIndex + i) % this.capacity];
      }
      return result;
    }
  }

  /**
   * Clear buffer
   */
  clear(): void {
    this.writeIndex = 0;
    this.size = 0;
  }

  /**
   * Get current size
   */
  get length(): number {
    return this.size;
  }
}

/**
 * TypedCircularBuffer - Optimized version using Float64Array
 * For better performance with numeric data
 */
export class TypedCircularBuffer {
  private buffer: Float64Array;
  private writeIndex: number = 0;
  private size: number = 0;

  constructor(private capacity: number) {
    this.buffer = new Float64Array(capacity);
  }

  /**
   * Add element to buffer (FIFO - overwrites oldest when full)
   */
  push(item: number): void {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;

    if (this.size < this.capacity) {
      this.size++;
    }
  }

  /**
   * Get all elements in correct order (oldest to newest)
   */
  getAll(): Float64Array {
    if (this.size < this.capacity) {
      // Buffer not full yet - return slice
      return this.buffer.slice(0, this.size);
    } else {
      // Buffer is full - return in correct order
      const result = new Float64Array(this.capacity);
      for (let i = 0; i < this.capacity; i++) {
        result[i] = this.buffer[(this.writeIndex + i) % this.capacity];
      }
      return result;
    }
  }

  /**
   * Get all elements as regular array (for uPlot compatibility)
   */
  getAllAsArray(): number[] {
    return Array.from(this.getAll());
  }

  /**
   * Clear buffer
   */
  clear(): void {
    this.writeIndex = 0;
    this.size = 0;
  }

  /**
   * Get current size
   */
  get length(): number {
    return this.size;
  }
}
