/**
 * charts.js — Chart.js Helper Utilities, Theme & DataLabels Support
 * Vietnam Data Engineer Job Market
 */

// Register ChartDataLabels plugin if loaded
if (typeof Chart !== 'undefined') {
  if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
  }

  // Global Chart.js defaults configuration
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.tooltip.backgroundColor = '#1e2130';
  Chart.defaults.plugins.tooltip.titleColor = '#e2e8f0';
  Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
  Chart.defaults.plugins.tooltip.borderColor = '#2a2d3e';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.legend.labels.color = '#94a3b8';
}

// Track chart instances per canvasId to prevent canvas reuse/overlap bugs
const chartInstances = {};

const ChartColors = {
  primary: '#6c8ef5',
  secondary: '#7c5cbf',
  accent: '#38bdf8',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  palette: [
    '#6c8ef5', '#38bdf8', '#34d399', '#fbbf24', '#f87171',
    '#7c5cbf', '#a78bfa', '#f472b6', '#fb923c', '#4ade80'
  ]
};

/**
 * Destroy existing chart on canvas if present
 */
function destroyChart(canvasId) {
  if (chartInstances[canvasId]) {
    try {
      chartInstances[canvasId].destroy();
    } catch (e) {
      console.warn(`Could not destroy chart on #${canvasId}:`, e);
    }
    delete chartInstances[canvasId];
  }
}

/**
 * Helper to safely create or update a Bar Chart instance
 */
function createBarChart(canvasId, labels, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  destroyChart(canvasId);

  const isHorizontal = options.horizontal || false;
  const showDataLabels = options.showDataLabels !== false;

  const pluginsConfig = {
    legend: { display: options.showLegend || false },
    title: {
      display: !!options.title,
      text: options.title || '',
      color: '#e2e8f0',
      font: { size: 14, weight: '600' }
    },
    tooltip: {
      callbacks: {
        label: options.tooltipCallback || function(context) {
          return ` ${context.dataset.label}: ${context.raw}`;
        }
      }
    }
  };

  // Configure DataLabels plugin
  if (typeof ChartDataLabels !== 'undefined' && showDataLabels) {
    pluginsConfig.datalabels = {
      display: true,
      color: '#ffffff',
      font: {
        family: "'Inter', sans-serif",
        size: 11,
        weight: '600'
      },
      anchor: isHorizontal ? 'end' : 'end',
      align: isHorizontal ? 'right' : 'top',
      offset: 4,
      formatter: options.dataLabelFormatter || function(value) {
        if (value === null || value === undefined || value === 0) return '';
        return typeof value === 'number' ? value.toLocaleString('en-US') : value;
      }
    };
  } else {
    pluginsConfig.datalabels = { display: false };
  }

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: options.datasetLabel || 'Số lượng',
        data: data,
        backgroundColor: options.backgroundColor || ChartColors.primary,
        borderColor: options.borderColor || 'transparent',
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: options.maxBarThickness || 28,
      }]
    },
    options: {
      indexAxis: isHorizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: isHorizontal ? 38 : 12,
          top: isHorizontal ? 12 : 24,
          left: isHorizontal ? 8 : 6,
          bottom: 6
        }
      },
      plugins: pluginsConfig,
      scales: {
        x: {
          type: isHorizontal ? 'linear' : 'category',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 11 }
          }
        },
        y: {
          type: isHorizontal ? 'category' : 'linear',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#e2e8f0',
            autoSkip: false,
            font: { size: 12, weight: isHorizontal ? '600' : 'normal' },
            callback: function(value, index) {
              if (isHorizontal) {
                if (typeof this.getLabelForValue === 'function') {
                  const lbl = this.getLabelForValue(value);
                  if (lbl !== undefined && lbl !== null && isNaN(lbl)) return lbl;
                }
                return labels[index] !== undefined ? labels[index] : (labels[value] || value);
              }
              if (options.yAxisCallback) {
                return options.yAxisCallback(value, index);
              }
              return value;
            }
          }
        }
      }
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}

/**
 * Helper to safely create or update a Line Chart instance
 */
function createLineChart(canvasId, labels, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  destroyChart(canvasId);

  const showDataLabels = options.showDataLabels !== false;

  const pluginsConfig = {
    legend: { display: options.showLegend || false },
    title: {
      display: !!options.title,
      text: options.title || '',
      color: '#e2e8f0',
      font: { size: 14, weight: '600' }
    },
    tooltip: {
      callbacks: {
        label: options.tooltipCallback || function(context) {
          return ` ${context.dataset.label}: ${context.raw}`;
        }
      }
    }
  };

  // Configure DataLabels for Line Chart
  if (typeof ChartDataLabels !== 'undefined' && showDataLabels) {
    pluginsConfig.datalabels = {
      display: function(context) {
        return data.length <= 25;
      },
      color: '#e2e8f0',
      backgroundColor: 'rgba(30, 33, 48, 0.85)',
      borderRadius: 4,
      padding: { top: 2, bottom: 2, left: 4, right: 4 },
      font: {
        family: "'Inter', sans-serif",
        size: 10,
        weight: '600'
      },
      anchor: 'end',
      align: 'top',
      offset: 6,
      formatter: options.dataLabelFormatter || function(value) {
        return value > 0 ? value : '';
      }
    };
  } else {
    pluginsConfig.datalabels = { display: false };
  }

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: options.datasetLabel || 'Số tin tuyển',
        data: data,
        borderColor: options.borderColor || ChartColors.primary,
        backgroundColor: options.backgroundColor || 'rgba(108, 142, 245, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: options.borderColor || ChartColors.primary,
        pointBorderColor: '#1e2130',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 20, right: 14, bottom: 6, left: 6 }
      },
      plugins: pluginsConfig,
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', maxRotation: 45 }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', precision: 0 }
        }
      }
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}

/**
 * Helper to safely create or update a Doughnut Chart instance
 */
function createDoughnutChart(canvasId, labels, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  destroyChart(canvasId);

  const showDataLabels = options.showDataLabels !== false;

  const pluginsConfig = {
    legend: {
      position: options.legendPosition || 'bottom',
      labels: { boxWidth: 12, padding: 12, color: '#94a3b8' }
    },
    title: {
      display: !!options.title,
      text: options.title || '',
      color: '#e2e8f0',
      font: { size: 14, weight: '600' }
    }
  };

  if (typeof ChartDataLabels !== 'undefined' && showDataLabels) {
    pluginsConfig.datalabels = {
      display: function(context) {
        const dataset = context.chart.data.datasets[0];
        const total = dataset.data.reduce((a, b) => a + b, 0);
        const val = dataset.data[context.dataIndex];
        return (val / total) > 0.06;
      },
      color: '#ffffff',
      font: {
        family: "'Inter', sans-serif",
        size: 11,
        weight: '700'
      },
      formatter: options.dataLabelFormatter || function(value, context) {
        const dataset = context.chart.data.datasets[0];
        const total = dataset.data.reduce((a, b) => a + b, 0);
        const pct = ((value / total) * 100).toFixed(0);
        return `${pct}%`;
      }
    };
  } else {
    pluginsConfig.datalabels = { display: false };
  }

  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: options.colors || ChartColors.palette,
        borderColor: '#1e2130',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: pluginsConfig
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}
