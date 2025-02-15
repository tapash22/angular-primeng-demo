import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import Chart from 'chart.js/auto';
// import { Chart, ChartOptions } from 'chart.js';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';

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
    Chart.register(...registerables); 
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

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.data.map((d) => d.month),
        datasets: [
          {
            data: this.data.map((d) => d.value),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 5,
            pointBackgroundColor: 'rgb(250, 8, 61)',
            pointRadius: 5,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: 'rgba(255, 0, 106, 0.72)',
            pointHoverBorderWidth: 3,
            fill: false,
            tension: 0.4,
          },
          {
            data: new Array(this.data.length).fill(0), // Initially hidden
            type: 'bar',
            backgroundColor: (context: any) => {
              const canvas = context.chart.canvas;
              const ctx = canvas.getContext('2d');
              const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
              gradient.addColorStop(0, 'rgba(255, 0, 0, 0.86)');
              gradient.addColorStop(0.3, 'rgba(255, 166, 0, 0.61)');
              gradient.addColorStop(0.6, 'rgba(0, 255, 0, 0.52)');
              gradient.addColorStop(1, 'rgba(0, 0, 255, 0.29)');
              return gradient;
            },
            borderRadius: 30,
            barThickness: 100,
          },
        ],
      },
      options: this.getChartOptions(),
    });
  }

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
          ticks: { font: { size: 14 }, color: 'black' },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { font: { size: 14 }, color: 'black' },
          grid: { display: false },
        },
      },
      onHover: (event:any, elements:any) => this.onHover(event, elements),
    };
  }

  onHover(event: any, elements: any[]): void  {
    if (elements.length) {
      const index = elements[0].index;
    this.chart.data.datasets[1].data =
      this.chart.data.datasets[0].data.map((_, i) =>
        i === index ? (this.chart.data.datasets[0].data[i] as number) : 0
      );
    } else {
      this.resetHoveredBar(); 
    }
    this.chart.update();
  }
  

  resetHoveredBar(): void {
    if (!this.chart) return;
    this.chart.data.datasets[1].data = new Array(this.data.length).fill(0);
    this.chart.update();
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
