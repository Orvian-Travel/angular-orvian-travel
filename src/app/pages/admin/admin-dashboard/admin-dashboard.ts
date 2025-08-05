import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { SERVICES_TOKEN } from '@services/services-token';
import { AdminService } from '@services/api/admin/admin-service';
import { IAdminService } from '@services/api/admin/admin-service.interface';
import { SumTotalByPackage } from '@services/entities/dashboard.model';


@Component({
  selector: 'app-admin-dashboard',
  imports: [
    BaseChartDirective,
    CommonModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.ADMIN, useClass: AdminService }
  ]
})
export class AdminDashboard implements OnInit, OnDestroy {
  constructor(@Inject(SERVICES_TOKEN.HTTP.ADMIN) private adminService: IAdminService) { }

  private intervalId!: number;
  isFirstLoad: boolean = true;
  chartType: 'doughnut' = 'doughnut';
  destinationData: { name: string; value: number }[] = [];
  Packages: SumTotalByPackage[] = [];
  faturamentoSemanal!: string;
  newUserCount: number | null = 0;
  ratingAVG: {
    currentRating: number | null,
    beforeRating: number | null,
    percentage: number | null
  } = {
      currentRating: null,
      beforeRating: null,
      percentage: null
    };
  newPackageCount: number | null = 0;

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return this.formatCurrency(context.parsed);
          }
        }
      }
    },
    animation: true,
    cutout: '60%',
  };

  ngOnInit() {
    this.loadDashboardData();

    this.intervalId = setInterval(() => {
      console.log('Atualizando dados do dashboard...');
      this.loadDashboardData();
    }, 180000); // Atualiza a cada 3 minutos

  }

  loadDashboardData() {
    this.adminService.getDashboardWeekReview().subscribe((data) => {

      this.destinationData = data.salesByPackage.map(item => ({
        name: item.destination,
        value: item.approvedPaymentsSum
      }));

      this.Packages = data.salesByPackage;

      this.faturamentoSemanal = this.formatCurrency(
        this.Packages.filter(item => item.reservationWeek === this.getCurrentISOWeek())
          .reduce((total, item) => total + item.approvedPaymentsSum, 0)
      );

      this.newUserCount = data.newUsers;
      this.ratingAVG = data.weekRating;
      this.newPackageCount = data.newPackages;
    })
  }

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

  getCurrentISOWeek(): number {
    const date = new Date();
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
