import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShadowPluginService {

  static shadowPlugin = {
    id: 'shadowPlugin', // Unique plugin ID
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const datasets = chart.data.datasets;
      
      // Set shadow properties (for line shadows)
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Shadow color
      ctx.shadowBlur = 10; // Shadow blur
      ctx.shadowOffsetX = 4; // Horizontal shadow offset
      ctx.shadowOffsetY = 4; // Vertical shadow offset

      // Redraw the dataset lines with shadow
      datasets.forEach((dataset: any) => {
        if (dataset.borderColor) {
          ctx.strokeStyle = dataset.borderColor;
          ctx.lineWidth = dataset.borderWidth;
        }
      });
      
      // Restore context after drawing shadows
      ctx.restore();
    },
  };
}
