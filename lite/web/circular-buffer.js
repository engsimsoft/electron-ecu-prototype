/**
 * CircularBuffer - Generic circular buffer implementation
 * Adapted from Full version for Lite (JavaScript)
 */
class CircularBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.writeIndex = 0;
    this.size = 0;
  }

  /**
   * Add element to buffer (FIFO - overwrites oldest when full)
   */
  push(item) {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;

    if (this.size < this.capacity) {
      this.size++;
    }
  }

  /**
   * Get all elements in correct order (oldest to newest)
   */
  getAll() {
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
  clear() {
    this.writeIndex = 0;
    this.size = 0;
  }

  /**
   * Get current size
   */
  get length() {
    return this.size;
  }
}

/**
 * TypedCircularBuffer - Optimized version using Float64Array
 * For better performance with numeric data
 */
class TypedCircularBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = new Float64Array(capacity);
    this.writeIndex = 0;
    this.size = 0;
  }

  /**
   * Add element to buffer (FIFO - overwrites oldest when full)
   */
  push(item) {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;

    if (this.size < this.capacity) {
      this.size++;
    }
  }

  /**
   * Get all elements in correct order (oldest to newest)
   */
  getAll() {
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
  getAllAsArray() {
    return Array.from(this.getAll());
  }

  /**
   * Clear buffer
   */
  clear() {
    this.writeIndex = 0;
    this.size = 0;
  }

  /**
   * Get current size
   */
  get length() {
    return this.size;
  }
}
