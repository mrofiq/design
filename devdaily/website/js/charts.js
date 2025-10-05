/**
 * DevDaily - Charts JavaScript
 * Chart implementations using Chart.js
 * Note: Requires Chart.js library to be loaded
 */

// Initialize line chart for point trends
function createPointTrendChart(canvasId, data) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Points',
        data: data.values,
        borderColor: '#5B5BD6',
        backgroundColor: 'rgba(91, 91, 214, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#5B5BD6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#171717',
          bodyColor: '#525252',
          borderColor: '#E8E8E8',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Points: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
            },
            color: '#737373'
          }
        },
        y: {
          grid: {
            color: '#F5F5F5'
          },
          ticks: {
            font: {
              size: 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
            },
            color: '#737373'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

// Create activity heatmap (GitHub-style)
function createActivityHeatmap(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  const weeks = Math.ceil(data.length / 7);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Create grid
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${weeks}, 14px)`;
  grid.style.gridTemplateRows = `repeat(7, 14px)`;
  grid.style.gap = '3px';

  data.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.style.width = '14px';
    cell.style.height = '14px';
    cell.style.borderRadius = '2px';

    // Color intensity based on value
    if (value === 0) {
      cell.style.background = '#F5F5F5';
    } else if (value <= 5) {
      cell.style.background = '#DCFCE7';
    } else if (value <= 15) {
      cell.style.background = '#86EFAC';
    } else if (value <= 30) {
      cell.style.background = '#22C55E';
    } else {
      cell.style.background = '#16A34A';
    }

    cell.title = `${value} points`;
    cell.style.cursor = 'pointer';

    grid.appendChild(cell);
  });

  container.appendChild(grid);
}

// Mock data generators for demo purposes
function generateMockPointTrendData(days = 30) {
  const labels = [];
  const values = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    // Generate random points between 5-25
    values.push(Math.floor(Math.random() * 20) + 5);
  }

  return { labels, values };
}

function generateMockHeatmapData(days = 90) {
  const data = [];
  for (let i = 0; i < days; i++) {
    // Generate random points (0-40)
    data.push(Math.floor(Math.random() * 40));
  }
  return data;
}

// Export for global use
window.DevDailyCharts = {
  createPointTrendChart,
  createActivityHeatmap,
  generateMockPointTrendData,
  generateMockHeatmapData
};
