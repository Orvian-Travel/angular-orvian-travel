import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit, AfterViewInit {
  private salesChart: any;

  ngOnInit() {}

  ngAfterViewInit() {
    this.initSalesChart();
  }

  private initSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      this.salesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Paraty, RJ', 'Bonito, MS', 'Gramado, RS', 'Fernando de Noronha, PE', 'Jericoacoara, CE', 'Lençóis, BA', 'Ouro Preto, MG', 'Alter do Chão, PA'],
          datasets: [{
            data: [35, 25, 20, 10, 5, 5, 3, 2],
            backgroundColor: [
              '#E53E3E',
              '#3182CE',
              '#38A169',
              '#00B5D8',
              '#D69E2E',
              '#9F7AEA',
              '#48BB78',
              '#4FD1C7'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          cutout: '70%'
        }
      });
    }
  }
}
