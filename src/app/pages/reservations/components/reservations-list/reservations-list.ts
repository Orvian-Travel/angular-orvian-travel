import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reservations-list',
  imports: [CommonModule],
  templateUrl: './reservations-list.html',
  styleUrl: './reservations-list.css'
})
export class ReservationsList {
  selectedStatus: string = 'todas';
  reservations: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadReservations();
  }

  private loadReservations(): void {
    // Aqui você fará a requisição para o backend
    // Exemplo:
    // this.reservationService.getReservationsByStatus(status).subscribe(...)
    const statusParam = this.selectedStatus === '' ? undefined : this.selectedStatus;

    console.log(`Filtrar reservas por status: ${statusParam}`);
    // TODO: Implementar chamada para API
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
