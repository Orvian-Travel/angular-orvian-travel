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

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.filterReservationsByStatus(status);
  }

  private filterReservationsByStatus(status: string): void {
    // Aqui você fará a requisição para o backend
    // Exemplo:
    // this.reservationService.getReservationsByStatus(status).subscribe(...)

    console.log(`Filtrar reservas por status: ${status}`);
    // TODO: Implementar chamada para API
  }
}
