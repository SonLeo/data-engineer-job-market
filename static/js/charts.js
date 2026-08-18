/**
 * charts.js — Chart.js Helper Utilities & Unified Theme
 * Vietnam Data Engineer Job Market
 */

// Global Chart.js defaults configuration
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', sans-serif";
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
 * Helper to safely create or update a Chart instance
 */
function createBarChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const isHorizontal = options.horizontal || false;

  return new Chart(ctx, {
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
        maxBarThickness: options.maxBarThickness || 32,
      }]
    },
    options: {
      indexAxis: isHorizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
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
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#94a3b8',
            callback: options.yAxisCallback || undefined
          }
        }
      }
    }
  });
}

function createLineChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: options.datasetLabel || 'Số tin tuyển',
        data: data,
        borderColor: options.borderColor || ChartColors.primary,
        backgroundColor: options.backgroundColor || 'rgba(108, 142, 245, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: options.borderColor || ChartColors.primary,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: options.showLegend || false },
        title: {
          display: !!options.title,
          text: options.title || '',
          color: '#e2e8f0',
          font: { size: 14, weight: '600' }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', precision: 0 }
        }
      }
    }
  });
}

function createDoughnutChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
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
      cutout: '68%',
      plugins: {
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
      }
    }
  });
}
