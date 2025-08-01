import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { SERVICES_TOKEN } from '../../../../services/services-token';
import { IReservationService } from '../../../../services/api/reservation/reservation-service.interface';
import { AuthStateService } from '../../../../services/auth/auth-state-service';
import { ReservationService } from '../../../../services/api/reservation/reservation-service';

@Component({
  selector: 'app-reservations-list',
  imports: [CommonModule],
  templateUrl: './reservations-list.html',
  styleUrl: './reservations-list.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.RESERVATION, useClass: ReservationService }
  ]
})
export class ReservationsList implements OnInit {
  selectedStatus: string = 'todas';
  reservations: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.RESERVATION) private readonly reservationService: IReservationService,
    private authStateService: AuthStateService
  ) { }


  ngOnInit(): void {
    this.loadReservations();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadReservations();
  }

  private loadReservations(): void {

    const statusParam = this.selectedStatus === 'todas' ? undefined : this.selectedStatus; // Mudança aqui

    const userId = this.authStateService.getUserId() || undefined;

    console.log('Parâmetros da requisição:', {
      page: this.currentPage,
      size: this.pageSize,
      userId: userId,
      status: statusParam
    });

    this.reservationService.getAllReservationsWithPaginationWithStatus(
      this.currentPage,
      this.pageSize,
      userId,
      statusParam
    ).subscribe({
      next: (response) => {
        console.log('Resposta completa da API:', response);
        this.reservations = response._embedded?.DTOList || [];
        this.totalElements = response.page?.totalElements || 0;
        this.totalPages = response.page?.totalPages || 0;
        console.log('Reservas carregadas:', this.reservations);
      },
      error: (error) => {
        console.error('Erro ao carregar reservas:', error);
        this.reservations = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }
    });

  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReservations();
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadReservations();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadReservations();
    }
  }
}
