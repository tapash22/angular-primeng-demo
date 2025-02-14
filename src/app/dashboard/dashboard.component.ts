import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit {
 
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  // Initial data
  data = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 120 },
    { month: 'Mar', value: 130 },
    { month: 'Apr', value: 140 },
    { month: 'May', value: 150 },
    { month: 'Jun', value: 160 },
  ];

  chart!: Chart;

  ngAfterViewInit() {
    const canvas = this.chartCanvas.nativeElement as HTMLCanvasElement;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.data.map((d) => d.month), // Month labels
        datasets: [
          {
            label: 'Monthly Sales',
            data: this.data.map((d) => d.value), // Values for each month
            borderColor: 'green',
            borderWidth: 2,
            pointBackgroundColor: 'green',
            fill: false,
            tension: 0.4, // Smooth line
          },
          {
            label: 'Hovered Bar',
            data: new Array(this.data.length).fill(0), // Initially hidden
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            type: 'bar',
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              font: { size: 16, weight: 'bold', family: 'Arial' },
              color: 'black',
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                return `(${tooltipItem.label}, ${tooltipItem.raw})`; // Show only (X, Y)
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 14 }, color: 'black' } },
          y: { beginAtZero: true, ticks: { font: { size: 14 }, color: 'black' } },
        },
        onHover: (event, elements) => {
          if (elements.length) {
            const index = elements[0].index;
            this.chart.data.datasets[1].data = this.chart.data.datasets[0].data.map((_, i) =>
              i === index ? (this.chart.data.datasets[0].data[i] as number) + 10 : 0
            );
          } else {
            this.chart.data.datasets[1].data = new Array(this.data.length).fill(0);
          }
          this.chart.update();
        },
      },
    });
  }
  
}
