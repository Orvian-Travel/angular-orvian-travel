import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    BaseChartDirective,
    CommonModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  addData() {
    this.destinationData.push({
      name: Math.random().toString(36).substring(7),
      value: Math.floor(Math.random() * 100) + 1
    });
  }

  chartType: 'doughnut' = 'doughnut';

  destinationData = [
    { name: 'Paraty, RJ', value: 35 },
    { name: 'Bonito, MS', value: 25 },
    { name: 'Gramado, RS', value: 20 },
    { name: 'Fernando de Noronha, PE', value: 10 },
    { name: 'Jericoacoara, CE', value: 5 },
    { name: 'Lençóis, BA', value: 3 },
    { name: 'Ouro Preto, MG', value: 2 },
    { name: 'Alter do Chão, PA', value: 1 }
  ];

  get autoColors(): string[] {
    return this.destinationData.map((_, index) => {
      const hue = (index * 137.508) % 360;
      const saturation = 65 + (index % 3) * 10;
      const lightness = 50 + (index % 2) * 5;

      return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
    });
  }


  get chartData(): ChartConfiguration<'doughnut'>['data'] {
    const colors = this.autoColors;

    return {
      labels: this.destinationData.map(item => item.name),
      datasets: [{
        data: this.destinationData.map(item => item.value),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBackgroundColor: colors.map(color =>
          color.replace('50%', '40%')
        )
      }]
    };
  }

  get destinationDataWithColors() {
    return this.destinationData.map((item, index) => ({
      ...item,
      color: this.autoColors[index]
    }));
  }

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%'
  };

  ngOnInit() { }
}
