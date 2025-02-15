import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import Chart from 'chart.js/auto';
// import { Chart, ChartOptions } from 'chart.js';
import { Chart, ChartConfiguration, ChartOptions, registerables,Plugin } from 'chart.js';

import { ShadowPluginService } from '../service/plugine/shadow-plugin.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart!: Chart;

  hoveredIndex: number | null = null;

  // Initial data
  data = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 120 },
    { month: 'Mar', value: 130 },
    { month: 'Apr', value: 140 },
    { month: 'May', value: 150 },
    { month: 'Jun', value: 160 },
  ];

  constructor() {
    Chart.register(...registerables,this.backgroundColorPlugin, this.shadowEffect, this.barGlowEffect); 
  }

  ngAfterViewInit() {
    this.initChart();
    const canvas = this.chartCanvas.nativeElement as HTMLCanvasElement;
    canvas.addEventListener('mouseleave', () => {
      // call this method for reset
      this.resetHoveredBar()
      // also use this
      // this.chart.data.datasets[1].data = new Array(this.data.length).fill(0); 
      // this.chart.update();
    });
    
  }

  initChart():void{
    const canvas = this.chartCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    // Create gradient for line
    const lineGradient = ctx!.createLinearGradient(0, 0, 0, 400);
    lineGradient.addColorStop(0, 'rgba(255, 99, 132, 1)');
    lineGradient.addColorStop(1, 'rgba(54, 162, 235, 1)');

    // Create gradient for bars
   // Create a soft-glow gradient for bars
   const barGradient = ctx!.createLinearGradient(0, 0, 0, 400);
   barGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); // Soft white glow
   barGradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.8)'); // Light blue
   barGradient.addColorStop(1, 'rgba(135, 206, 250, 0.9)'); // Sky blue

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.data.map((d) => d.month),
        datasets: [
          {
            data: this.data.map((d) => d.value),
            borderColor: lineGradient,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 4,
            pointBackgroundColor: 'white',
            pointBorderColor: '#ff4081',
            pointRadius: 6,
            pointHoverRadius: 10,
            fill: false,
            tension: 0.4,
          },
          {
            data: new Array(this.data.length).fill(0), // Initially hidden
            type: 'bar',
            backgroundColor: barGradient,
            borderRadius: 20,
            barThickness: 60,
            animation: {
              duration: (context: any) => context.active ? 1000 : 1000, 
              easing: 'easeOutQuad', // Easing function for smooth animations
            },
          },
        ],
      },
      options: this.getChartOptions(),
    });
    
  }

  resetHoveredBar(): void {
    if (!this.chart) return;
    // this.hoveredIndex = null;
    this.chart.data.datasets[1].data = new Array(this.data.length).fill(0);
    this.chart.update();
  }
  backgroundColorPlugin: Plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
  
      const currentTime = performance.now();
      const waveSpeed = 4000; // Adjust for speed
      const waveHeight = 0.4; // Reduce height slightly to prevent overflow
  
      let step = (currentTime % waveSpeed) / waveSpeed;
      let wavePosition = 1 - step; // Moves wave from bottom (1) to top (0)
  
      // Ensure values remain within [0,1]
      const stop1 = Math.max(0, Math.min(1, wavePosition - waveHeight * 0.5));
      const stop2 = Math.max(0, Math.min(1, wavePosition + waveHeight * 0.5));
  
      // Create the gradient from bottom to top
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`); // White top
      gradient.addColorStop(stop1, `rgba(200, 225, 255, ${0.5 + 0.3 * Math.cos(step * Math.PI)})`); // Smooth highlight
      gradient.addColorStop(stop2, `rgba(180, 210, 255, ${0.5 + 0.3 * Math.sin(step * Math.PI)})`); // Wave effect
      gradient.addColorStop(1, `rgba(11, 46, 241, 0.200)`); // Deep blue bottom
  
      ctx.save();
      ctx.filter = 'blur(8px)'; // Frosted effect
      ctx.fillStyle = gradient;
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
      ctx.restore();
  
      // Moving reflection effect
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      const reflectionY = chartArea.top + chartArea.height * wavePosition;
      //ctx.ellipse(chartArea.left + chartArea.width * 0.5, reflectionY, chartArea.width * 0.3, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
  
      requestAnimationFrame(() => chart.update('none'));
    }
  };
  
  
  
  
   shadowEffect: Plugin = {
    id: '3dEffect',
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
    },
  };

  getChartOptions(): ChartOptions {
    return {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
          tooltip: {
            enabled: false, 
            external: this.customTooltip
          },
      },
      scales: {
        x: {
          ticks: { font: { size: 18 }, color: 'white' },
          grid: { display: true, color: 'rgba(200, 200, 200, 0.3)' },
        },
        y: {
          beginAtZero: true,
          ticks: { font: { size: 18 }, color: '#fff' },
          grid: { display: true, color: 'rgba(221, 216, 216, 0.38)' },
        },
      },
      animation: {
        duration: 1000, // Duration of the animation
        easing: 'easeOutQuad', // Easing function for smooth animations
      },
      onHover: (event:any, elements:any) => this.onHover(event, elements),
    };
  }

    // 🔵 Glow Effect for Bars
    barGlowEffect: Plugin = {
      id: 'barGlow',
      beforeDatasetsDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = 'rgba(173, 216, 230, 0.7)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.restore();
      }
    };

  onHover(event: any, elements: any[]): void {
    if (elements.length) {
      const index = elements[0].index;
    // If already hovered, don't repeat animation
    if (this.hoveredIndex === index) return;
    this.hoveredIndex = index;

    // Show only the hovered bar at 50% first
    this.chart.data.datasets[1].data = this.chart.data.datasets[0].data.map((_, i) =>
      i === index ? Number(this.chart.data.datasets[0].data[i]) * 1 : 0
    );

    this.chart.update('active');

    // Delay to fully animate the bar after the first animation
    setTimeout(() => {
      this.chart.data.datasets[1].data = this.chart.data.datasets[0].data.map((_, i) =>
        i === index ? Number(this.chart.data.datasets[0].data[i]) : 0
      );
      // this.chart.update('active');
    }, 400);
    } else {
      this.resetHoveredBar();
    }
  }
  
  
  customTooltip(context: any): void {
    let tooltipEl = document.getElementById('chart-tooltip');

    // Create tooltip if it does not exist
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chart-tooltip';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.background = 'white';
      tooltipEl.style.border = '1px solid rgba(0,0,0,0.1)';
      tooltipEl.style.borderRadius = '8px';
      tooltipEl.style.padding = '10px';
      tooltipEl.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.transition = 'opacity 0.3s ease';
      tooltipEl.style.opacity = '0';
      document.body.appendChild(tooltipEl);
    }

    // Hide tooltip if no active tooltip items
    const tooltipModel = context.tooltip;
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    // Get tooltip data
    const dataset = context.chart.data.datasets[tooltipModel.dataPoints[0].datasetIndex];
    const dataPoint = tooltipModel.dataPoints[0];
    const value = dataPoint.raw;
    const label = dataPoint.label;
    const color = dataset.borderColor;

    // Set inner HTML for tooltip (Styled as a card)
    tooltipEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 12px; height: 12px; border-radius: 2px;"></div>
        <strong>${label}</strong>
      </div>
      <div style="margin-top: 6px; color: #555;">Value: <strong>${value}</strong></div>
    `;

    // Position tooltip
    const canvasRect = context.chart.canvas.getBoundingClientRect();
    const x = canvasRect.left + tooltipModel.caretX;
    const y = canvasRect.top + tooltipModel.caretY;

    tooltipEl.style.left = `${x + 5}px`;
    tooltipEl.style.top = `${y - 5}px`;
    tooltipEl.style.opacity = '1';
  }
}
