/**
 * Lightweight Chart Library
 * SVG-based charting with no external dependencies
 */

// Chart Color Palette
const CHART_COLORS = {
    primary: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6', '#F97316'],
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    neutral: '#6B7280'
};

/**
 * Base Chart Class
 */
class Chart {
    constructor(container, options = {}) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            throw new Error('Chart container not found');
        }

        this.options = {
            width: options.width || this.container.clientWidth || 600,
            height: options.height || this.container.clientHeight || 400,
            padding: options.padding || { top: 20, right: 20, bottom: 40, left: 50 },
            colors: options.colors || CHART_COLORS.primary,
            showLegend: options.showLegend !== false,
            showTooltip: options.showTooltip !== false,
            showGrid: options.showGrid !== false,
            showDataLabels: options.showDataLabels || false,
            animate: options.animate !== false,
            responsive: options.responsive !== false,
            ...options
        };

        this.data = null;
        this.svg = null;
        this.tooltip = null;
        this.legend = null;

        this.init();
    }

    init() {
        // Clear container
        this.container.innerHTML = '';
        this.container.classList.add('chart-container');

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.classList.add('chart-wrapper');
        this.container.appendChild(wrapper);

        // Create SVG
        this.svg = this.createSVG();
        wrapper.appendChild(this.svg);

        // Create tooltip
        if (this.options.showTooltip) {
            this.tooltip = this.createTooltip();
            this.container.appendChild(this.tooltip);
        }

        // Create legend
        if (this.options.showLegend) {
            this.legend = this.createLegend();
            wrapper.appendChild(this.legend);
        }

        // Handle responsive
        if (this.options.responsive) {
            this.handleResize();
        }
    }

    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('chart-svg');
        svg.setAttribute('width', this.options.width);
        svg.setAttribute('height', this.options.height);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', this.options.title || 'Chart');
        return svg;
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.classList.add('chart-tooltip');
        return tooltip;
    }

    createLegend() {
        const legend = document.createElement('div');
        legend.classList.add('chart-legend');
        return legend;
    }

    showTooltip(content, x, y) {
        if (!this.tooltip) return;

        this.tooltip.innerHTML = content;
        this.tooltip.classList.add('visible');

        // Position tooltip
        const rect = this.container.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let left = x;
        let top = y - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left + tooltipRect.width > rect.width) {
            left = rect.width - tooltipRect.width - 10;
        }
        if (top < 0) {
            top = y + 10;
        }

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
    }

    updateLegend(items) {
        if (!this.legend) return;

        this.legend.innerHTML = items.map((item, index) => `
            <div class="chart-legend-item" data-index="${index}">
                <span class="chart-legend-color" style="background-color: ${item.color}"></span>
                <span class="chart-legend-label">${item.label}</span>
            </div>
        `).join('');

        // Add click handlers
        this.legend.querySelectorAll('.chart-legend-item').forEach(item => {
            item.addEventListener('click', (e) => {
                item.classList.toggle('inactive');
                this.onLegendClick(parseInt(item.dataset.index));
            });
        });
    }

    onLegendClick(index) {
        // Override in child classes
    }

    getColor(index) {
        return this.options.colors[index % this.options.colors.length];
    }

    handleResize() {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    this.options.width = width;
                    this.options.height = Math.max(height, 300);
                    this.render(this.data);
                }
            }
        });

        resizeObserver.observe(this.container);
    }

    render(data) {
        this.data = data;
        // Override in child classes
    }

    destroy() {
        this.container.innerHTML = '';
    }
}

/**
 * Bar Chart Class
 */
class BarChart extends Chart {
    constructor(container, options = {}) {
        super(container, {
            orientation: 'vertical', // vertical, horizontal
            stacked: false,
            barPadding: 0.2,
            groupPadding: 0.1,
            ...options
        });
    }

    render(data) {
        super.render(data);
        if (!data || !data.labels || !data.datasets) return;

        this.svg.innerHTML = '';

        const { width, height, padding } = this.options;
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Create chart group
        const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        chartGroup.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
        this.svg.appendChild(chartGroup);

        if (this.options.orientation === 'vertical') {
            this.renderVerticalBars(chartGroup, data, chartWidth, chartHeight);
        } else {
            this.renderHorizontalBars(chartGroup, data, chartWidth, chartHeight);
        }

        // Update legend
        if (this.options.showLegend && data.datasets.length > 1) {
            this.updateLegend(data.datasets.map((dataset, i) => ({
                label: dataset.label,
                color: dataset.color || this.getColor(i)
            })));
        }
    }

    renderVerticalBars(group, data, width, height) {
        const { labels, datasets } = data;
        const numBars = labels.length;
        const numDatasets = datasets.length;

        // Calculate scales
        const maxValue = Math.max(...datasets.flatMap(d => d.data));
        const yScale = height / maxValue;
        const barGroupWidth = width / numBars;
        const barWidth = this.options.stacked
            ? barGroupWidth * (1 - this.options.barPadding)
            : (barGroupWidth * (1 - this.options.barPadding)) / numDatasets;

        // Draw grid
        if (this.options.showGrid) {
            this.drawHorizontalGrid(group, width, height, 5);
        }

        // Draw bars
        labels.forEach((label, i) => {
            const groupX = i * barGroupWidth;

            if (this.options.stacked) {
                let stackY = height;
                datasets.forEach((dataset, j) => {
                    const value = dataset.data[i];
                    const barHeight = value * yScale;
                    const barX = groupX + (barGroupWidth - barWidth) / 2;
                    const barY = stackY - barHeight;
                    const color = dataset.color || this.getColor(j);

                    this.drawBar(group, barX, barY, barWidth, barHeight, color, {
                        label,
                        dataset: dataset.label,
                        value
                    });

                    stackY -= barHeight;
                });
            } else {
                datasets.forEach((dataset, j) => {
                    const value = dataset.data[i];
                    const barHeight = value * yScale;
                    const barX = groupX + j * barWidth + (barGroupWidth - numDatasets * barWidth) / 2;
                    const barY = height - barHeight;
                    const color = dataset.color || this.getColor(j);

                    this.drawBar(group, barX, barY, barWidth, barHeight, color, {
                        label,
                        dataset: dataset.label,
                        value
                    });
                });
            }
        });

        // Draw axes
        this.drawXAxis(group, labels, width, height, barGroupWidth);
        this.drawYAxis(group, height, maxValue, 5);
    }

    renderHorizontalBars(group, data, width, height) {
        const { labels, datasets } = data;
        const numBars = labels.length;
        const numDatasets = datasets.length;

        // Calculate scales
        const maxValue = Math.max(...datasets.flatMap(d => d.data));
        const xScale = width / maxValue;
        const barGroupHeight = height / numBars;
        const barHeight = this.options.stacked
            ? barGroupHeight * (1 - this.options.barPadding)
            : (barGroupHeight * (1 - this.options.barPadding)) / numDatasets;

        // Draw grid
        if (this.options.showGrid) {
            this.drawVerticalGrid(group, width, height, 5);
        }

        // Draw bars
        labels.forEach((label, i) => {
            const groupY = i * barGroupHeight;

            if (this.options.stacked) {
                let stackX = 0;
                datasets.forEach((dataset, j) => {
                    const value = dataset.data[i];
                    const barWidth = value * xScale;
                    const barY = groupY + (barGroupHeight - barHeight) / 2;
                    const color = dataset.color || this.getColor(j);

                    this.drawBar(group, stackX, barY, barWidth, barHeight, color, {
                        label,
                        dataset: dataset.label,
                        value
                    }, true);

                    stackX += barWidth;
                });
            } else {
                datasets.forEach((dataset, j) => {
                    const value = dataset.data[i];
                    const barWidth = value * xScale;
                    const barY = groupY + j * barHeight + (barGroupHeight - numDatasets * barHeight) / 2;
                    const color = dataset.color || this.getColor(j);

                    this.drawBar(group, 0, barY, barWidth, barHeight, color, {
                        label,
                        dataset: dataset.label,
                        value
                    }, true);
                });
            }
        });
    }

    drawBar(group, x, y, width, height, color, data, horizontal = false) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.classList.add('chart-bar');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', color);
        rect.setAttribute('rx', 4);

        if (this.options.animate) {
            rect.classList.add('chart-animate-bar');
        }

        // Tooltip
        rect.addEventListener('mouseenter', (e) => {
            const content = `
                <div class="chart-tooltip-title">${data.label}</div>
                <div class="chart-tooltip-item">
                    <span class="chart-tooltip-label">
                        <span class="chart-tooltip-color" style="background-color: ${color}"></span>
                        ${data.dataset}
                    </span>
                    <span class="chart-tooltip-value">${data.value}</span>
                </div>
            `;
            this.showTooltip(content, e.clientX - this.container.getBoundingClientRect().left,
                            e.clientY - this.container.getBoundingClientRect().top);
        });

        rect.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });

        group.appendChild(rect);

        // Data labels
        if (this.options.showDataLabels) {
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.classList.add('chart-data-label');
            label.setAttribute('x', horizontal ? x + width + 5 : x + width / 2);
            label.setAttribute('y', horizontal ? y + height / 2 : y - 5);
            label.setAttribute('text-anchor', horizontal ? 'start' : 'middle');
            label.setAttribute('dominant-baseline', horizontal ? 'middle' : 'auto');
            label.textContent = data.value;
            group.appendChild(label);
        }
    }

    drawHorizontalGrid(group, width, height, numLines) {
        for (let i = 0; i <= numLines; i++) {
            const y = (height / numLines) * i;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('chart-grid');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', width);
            line.setAttribute('y2', y);
            group.appendChild(line);
        }
    }

    drawVerticalGrid(group, width, height, numLines) {
        for (let i = 0; i <= numLines; i++) {
            const x = (width / numLines) * i;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('chart-grid');
            line.setAttribute('x1', x);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', x);
            line.setAttribute('y2', height);
            group.appendChild(line);
        }
    }

    drawXAxis(group, labels, width, height, barWidth) {
        // Axis line
        const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        axis.classList.add('chart-axis');
        axis.setAttribute('x1', 0);
        axis.setAttribute('y1', height);
        axis.setAttribute('x2', width);
        axis.setAttribute('y2', height);
        group.appendChild(axis);

        // Labels
        labels.forEach((label, i) => {
            const x = i * barWidth + barWidth / 2;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('chart-axis-label');
            text.setAttribute('x', x);
            text.setAttribute('y', height + 20);
            text.setAttribute('text-anchor', 'middle');
            text.textContent = label;
            group.appendChild(text);
        });
    }

    drawYAxis(group, height, maxValue, numTicks) {
        // Axis line
        const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        axis.classList.add('chart-axis');
        axis.setAttribute('x1', 0);
        axis.setAttribute('y1', 0);
        axis.setAttribute('x2', 0);
        axis.setAttribute('y2', height);
        group.appendChild(axis);

        // Labels
        for (let i = 0; i <= numTicks; i++) {
            const value = (maxValue / numTicks) * (numTicks - i);
            const y = (height / numTicks) * i;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('chart-axis-label');
            text.setAttribute('x', -10);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('dominant-baseline', 'middle');
            text.textContent = Math.round(value);
            group.appendChild(text);
        }
    }
}

/**
 * Line Chart Class
 */
class LineChart extends Chart {
    constructor(container, options = {}) {
        super(container, {
            showPoints: true,
            showArea: false,
            smooth: false,
            tension: 0.4,
            ...options
        });
    }

    render(data) {
        super.render(data);
        if (!data || !data.labels || !data.datasets) return;

        this.svg.innerHTML = '';

        const { width, height, padding } = this.options;
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Create chart group
        const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        chartGroup.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
        this.svg.appendChild(chartGroup);

        const { labels, datasets } = data;
        const numPoints = labels.length;
        const maxValue = Math.max(...datasets.flatMap(d => d.data));

        const xStep = chartWidth / (numPoints - 1);
        const yScale = chartHeight / maxValue;

        // Draw grid
        if (this.options.showGrid) {
            this.drawGrid(chartGroup, chartWidth, chartHeight, 5, numPoints);
        }

        // Draw lines
        datasets.forEach((dataset, i) => {
            const color = dataset.color || this.getColor(i);
            const points = dataset.data.map((value, j) => ({
                x: j * xStep,
                y: chartHeight - (value * yScale)
            }));

            // Draw area
            if (this.options.showArea || dataset.showArea) {
                this.drawArea(chartGroup, points, chartHeight, color);
            }

            // Draw line
            this.drawLine(chartGroup, points, color, dataset.label);

            // Draw points
            if (this.options.showPoints) {
                points.forEach((point, j) => {
                    this.drawPoint(chartGroup, point.x, point.y, color, {
                        label: labels[j],
                        dataset: dataset.label,
                        value: dataset.data[j]
                    });
                });
            }
        });

        // Draw axes
        this.drawXAxis(chartGroup, labels, chartWidth, chartHeight, xStep);
        this.drawYAxis(chartGroup, chartHeight, maxValue, 5);

        // Update legend
        if (this.options.showLegend) {
            this.updateLegend(datasets.map((dataset, i) => ({
                label: dataset.label,
                color: dataset.color || this.getColor(i)
            })));
        }
    }

    drawLine(group, points, color, label) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('chart-line');

        let d = `M ${points[0].x} ${points[0].y}`;

        if (this.options.smooth) {
            // Smooth curve using bezier
            for (let i = 1; i < points.length; i++) {
                const cp1x = points[i-1].x + (points[i].x - points[i-1].x) * this.options.tension;
                const cp1y = points[i-1].y;
                const cp2x = points[i].x - (points[i].x - points[i-1].x) * this.options.tension;
                const cp2y = points[i].y;
                d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
            }
        } else {
            // Straight lines
            points.slice(1).forEach(point => {
                d += ` L ${point.x} ${point.y}`;
            });
        }

        path.setAttribute('d', d);
        path.setAttribute('stroke', color);
        path.setAttribute('data-label', label);

        if (this.options.animate) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.classList.add('chart-animate-line');
        }

        group.appendChild(path);
    }

    drawArea(group, points, height, color) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('chart-area');

        let d = `M ${points[0].x} ${height}`;
        d += ` L ${points[0].x} ${points[0].y}`;

        points.slice(1).forEach(point => {
            d += ` L ${point.x} ${point.y}`;
        });

        d += ` L ${points[points.length - 1].x} ${height}`;
        d += ' Z';

        path.setAttribute('d', d);
        path.setAttribute('fill', color);
        group.appendChild(path);
    }

    drawPoint(group, x, y, color, data) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.classList.add('chart-line-point');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', 2);

        // Tooltip
        circle.addEventListener('mouseenter', (e) => {
            const content = `
                <div class="chart-tooltip-title">${data.label}</div>
                <div class="chart-tooltip-item">
                    <span class="chart-tooltip-label">
                        <span class="chart-tooltip-color" style="background-color: ${color}"></span>
                        ${data.dataset}
                    </span>
                    <span class="chart-tooltip-value">${data.value}</span>
                </div>
            `;
            this.showTooltip(content, e.clientX - this.container.getBoundingClientRect().left,
                            e.clientY - this.container.getBoundingClientRect().top);
        });

        circle.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });

        group.appendChild(circle);
    }

    drawGrid(group, width, height, numLinesY, numLinesX) {
        // Horizontal grid lines
        for (let i = 0; i <= numLinesY; i++) {
            const y = (height / numLinesY) * i;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('chart-grid');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', width);
            line.setAttribute('y2', y);
            group.appendChild(line);
        }
    }

    drawXAxis(group, labels, width, height, xStep) {
        const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        axis.classList.add('chart-axis');
        axis.setAttribute('x1', 0);
        axis.setAttribute('y1', height);
        axis.setAttribute('x2', width);
        axis.setAttribute('y2', height);
        group.appendChild(axis);

        labels.forEach((label, i) => {
            const x = i * xStep;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('chart-axis-label');
            text.setAttribute('x', x);
            text.setAttribute('y', height + 20);
            text.setAttribute('text-anchor', 'middle');
            text.textContent = label;
            group.appendChild(text);
        });
    }

    drawYAxis(group, height, maxValue, numTicks) {
        const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        axis.classList.add('chart-axis');
        axis.setAttribute('x1', 0);
        axis.setAttribute('y1', 0);
        axis.setAttribute('x2', 0);
        axis.setAttribute('y2', height);
        group.appendChild(axis);

        for (let i = 0; i <= numTicks; i++) {
            const value = (maxValue / numTicks) * (numTicks - i);
            const y = (height / numTicks) * i;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('chart-axis-label');
            text.setAttribute('x', -10);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('dominant-baseline', 'middle');
            text.textContent = Math.round(value);
            group.appendChild(text);
        }
    }
}

/**
 * Pie/Doughnut Chart Class
 */
class PieChart extends Chart {
    constructor(container, options = {}) {
        super(container, {
            doughnut: false,
            innerRadius: 0.6,
            showPercentages: true,
            ...options
        });
    }

    render(data) {
        super.render(data);
        if (!data || !data.labels || !data.values) return;

        this.svg.innerHTML = '';

        const { width, height } = this.options;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        const innerRadius = this.options.doughnut ? radius * this.options.innerRadius : 0;

        // Create chart group
        const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.svg.appendChild(chartGroup);

        const total = data.values.reduce((sum, val) => sum + val, 0);
        let currentAngle = -90; // Start from top

        data.values.forEach((value, i) => {
            const percentage = (value / total) * 100;
            const angle = (value / total) * 360;
            const color = data.colors?.[i] || this.getColor(i);

            this.drawSlice(chartGroup, centerX, centerY, radius, innerRadius,
                          currentAngle, angle, color, {
                label: data.labels[i],
                value,
                percentage: percentage.toFixed(1)
            });

            currentAngle += angle;
        });

        // Update legend
        if (this.options.showLegend) {
            this.updateLegend(data.labels.map((label, i) => ({
                label: `${label} (${((data.values[i] / total) * 100).toFixed(1)}%)`,
                color: data.colors?.[i] || this.getColor(i)
            })));
        }
    }

    drawSlice(group, cx, cy, radius, innerRadius, startAngle, angle, color, data) {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = ((startAngle + angle) * Math.PI) / 180;

        // Outer arc points
        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);

        let path;
        if (innerRadius > 0) {
            // Doughnut - inner arc points
            const x3 = cx + innerRadius * Math.cos(endRad);
            const y3 = cy + innerRadius * Math.sin(endRad);
            const x4 = cx + innerRadius * Math.cos(startRad);
            const y4 = cy + innerRadius * Math.sin(startRad);

            const largeArc = angle > 180 ? 1 : 0;
            path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
        } else {
            // Pie
            const largeArc = angle > 180 ? 1 : 0;
            path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        }

        const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        slice.classList.add('chart-slice');
        slice.setAttribute('d', path);
        slice.setAttribute('fill', color);

        if (this.options.animate) {
            slice.classList.add('chart-animate-slice');
        }

        // Tooltip
        slice.addEventListener('mouseenter', (e) => {
            const content = `
                <div class="chart-tooltip-title">${data.label}</div>
                <div class="chart-tooltip-item">
                    <span class="chart-tooltip-label">
                        <span class="chart-tooltip-color" style="background-color: ${color}"></span>
                        Value
                    </span>
                    <span class="chart-tooltip-value">${data.value}</span>
                </div>
                <div class="chart-tooltip-item">
                    <span class="chart-tooltip-label">Percentage</span>
                    <span class="chart-tooltip-value">${data.percentage}%</span>
                </div>
            `;
            this.showTooltip(content, e.clientX - this.container.getBoundingClientRect().left,
                            e.clientY - this.container.getBoundingClientRect().top);
        });

        slice.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });

        group.appendChild(slice);

        // Label
        if (this.options.showPercentages && parseFloat(data.percentage) > 5) {
            const labelAngle = startAngle + angle / 2;
            const labelRad = (labelAngle * Math.PI) / 180;
            const labelRadius = innerRadius > 0 ? (radius + innerRadius) / 2 : radius * 0.7;
            const labelX = cx + labelRadius * Math.cos(labelRad);
            const labelY = cy + labelRadius * Math.sin(labelRad);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('chart-slice-percentage');
            text.setAttribute('x', labelX);
            text.setAttribute('y', labelY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-weight', '600');
            text.textContent = `${data.percentage}%`;
            group.appendChild(text);
        }
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Chart, BarChart, LineChart, PieChart };
}
