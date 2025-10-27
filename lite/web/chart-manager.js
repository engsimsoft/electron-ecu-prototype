/**
 * ChartManager - Manages 3 uPlot charts for real-time ECU data visualization
 * Adapted from Full version for Lite (JavaScript)
 */
class ChartManager {
  constructor(containers) {
    if (containers.length !== 3) {
      throw new Error('ChartManager requires exactly 3 containers');
    }

    this.charts = [];
    this.chartData = [];
    this.bufferCapacity = 1500; // 60 seconds @ 25Hz

    // Initialize data buffers for each chart
    for (let i = 0; i < 3; i++) {
      this.chartData.push({
        timestamps: new TypedCircularBuffer(this.bufferCapacity),
        series: [
          new TypedCircularBuffer(this.bufferCapacity),
          new TypedCircularBuffer(this.bufferCapacity),
          new TypedCircularBuffer(this.bufferCapacity)
        ]
      });
    }

    // Parameter mapping
    const paramMappings = [
      { params: [0, 1, 2], labels: ['Param 0', 'Param 1', 'Param 2'] },
      { params: [3, 4, 5], labels: ['Param 3', 'Param 4', 'Param 5'] },
      { params: [6, 7, 8], labels: ['Param 6', 'Param 7', 'Param 8'] }
    ];

    // Create uPlot instances
    containers.forEach((container, index) => {
      const mapping = paramMappings[index];

      const opts = {
        width: container.clientWidth,
        height: 300,
        // Performance optimizations
        ms: 1,  // Sub-pixel rendering
        pxAlign: 0,  // Disable pixel alignment for smoother rendering
        series: [
          { label: 'Time (s)' },  // x-axis
          { label: mapping.labels[0], stroke: '#ef4444', width: 2 },  // red
          { label: mapping.labels[1], stroke: '#3b82f6', width: 2 },  // blue
          { label: mapping.labels[2], stroke: '#10b981', width: 2 }   // green
        ],
        axes: [
          {
            label: 'Time (s)',
            stroke: '#888888',
            grid: { stroke: '#3e3e3e' }
          },
          {
            label: 'Value',
            stroke: '#888888',
            grid: { stroke: '#3e3e3e' }
          }
        ],
        legend: {
          show: true,
          live: false  // Performance: disable live legend updates
        },
        cursor: {
          show: true,
          drag: { x: false, y: false },  // Disable drag for performance
          sync: {
            key: 'charts-sync'  // Sync cursor across all charts
          }
        },
        hooks: {},
        plugins: []
      };

      // Initial empty data
      const data = [
        [0],  // timestamps
        [0],  // series 1
        [0],  // series 2
        [0]   // series 3
      ];

      const chart = new uPlot(opts, data, container);
      this.charts.push(chart);
    });
  }

  /**
   * Add data point to specific chart
   * @param chartIndex Chart index (0-2)
   * @param timestamp Timestamp in seconds
   * @param values Array of 3 values for the 3 series
   */
  addDataPoint(chartIndex, timestamp, values) {
    if (chartIndex < 0 || chartIndex >= 3) {
      console.warn(`Invalid chart index: ${chartIndex}`);
      return;
    }

    if (values.length !== 3) {
      console.warn(`Expected 3 values, got ${values.length}`);
      return;
    }

    const data = this.chartData[chartIndex];
    data.timestamps.push(timestamp);

    for (let i = 0; i < 3; i++) {
      data.series[i].push(values[i]);
    }
  }

  /**
   * Update all charts with latest data from buffers
   * Should be called once per frame (60 FPS)
   */
  updateCharts() {
    for (let chartIndex = 0; chartIndex < 3; chartIndex++) {
      const data = this.chartData[chartIndex];

      // Skip if no data
      if (data.timestamps.length === 0) {
        continue;
      }

      // Convert buffers to arrays for uPlot
      const timestamps = data.timestamps.getAllAsArray();
      const series1 = data.series[0].getAllAsArray();
      const series2 = data.series[1].getAllAsArray();
      const series3 = data.series[2].getAllAsArray();

      // Update chart
      const chartData = [
        timestamps,
        series1,
        series2,
        series3
      ];

      this.charts[chartIndex].setData(chartData);
    }
  }

  /**
   * Clear all chart data
   */
  clear() {
    this.chartData.forEach(data => {
      data.timestamps.clear();
      data.series.forEach(s => s.clear());
    });

    // Reset charts with empty data
    const emptyData = [[0], [0], [0], [0]];
    this.charts.forEach(chart => chart.setData(emptyData));
  }

  /**
   * Destroy all charts and cleanup resources
   */
  destroy() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
    this.chartData = [];
  }

  /**
   * Handle window resize
   */
  resize() {
    this.charts.forEach(chart => {
      const container = chart.root.parentElement;
      if (container) {
        chart.setSize({
          width: container.clientWidth,
          height: 300
        });
      }
    });
  }
}
