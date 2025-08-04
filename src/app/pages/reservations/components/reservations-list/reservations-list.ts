import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { SERVICES_TOKEN } from '../../../../services/services-token';
import { IReservationService } from '../../../../services/api/reservation/reservation-service.interface';
import { AuthStateService } from '../../../../services/auth/auth-state-service';
import { ReservationService } from '../../../../services/api/reservation/reservation-service';
import { RatingModalComponent } from '../../../../shared/components/rating-modal/rating-modal.component';
import { RatingService } from '../../../../services/api/rating/rating.service';
import { RatingDetail, SaveRatingResponse } from '../../../../services/entities/rating.model';

@Component({
  selector: 'app-reservations-list',
  imports: [CommonModule, RatingModalComponent],
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

  // Propriedades do sistema de avaliação
  isRatingModalOpen = false;
  selectedReservationId = '';
  selectedRating?: RatingDetail;
  reservationRatings: Map<string, RatingDetail> = new Map();

  // Propriedades para visualizar avaliações do pacote
  isViewRatingsModalOpen = false;
  packageRatings: RatingDetail[] = [];
  selectedPackageId = '';
  selectedPackageTitle = '';
  isLoadingPackageRatings = false;

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.RESERVATION) private readonly reservationService: IReservationService,
    private authStateService: AuthStateService,
    private ratingService: RatingService
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
        
        // Carregar avaliações existentes para as reservas
        this.loadRatingsForReservations();
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

  getStatusLabel(situation: string): string {
    switch (situation) {
      case 'CONFIRMADA': return 'CONFIRMADO';
      case 'PENDENTE': return 'PENDENTE';
      case 'CANCELADA': return 'CANCELADO';
      default: return situation;
    }
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'PIX': return 'PIX';
      case 'CREDITO': return 'Cartão de Crédito';
      case 'BOLETO': return 'Boleto';
      default: return method;
    }
  }

  getPaymentStatusLabel(status: string): string {
    switch (status) {
      case 'APROVADO': return 'Aprovado';
      case 'PENDENTE': return 'Pendente';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  }

  getPackageTitle(reservation: any): string {
    // Você pode ajustar isso baseado na estrutura real do seu pacote
    return `Pacote para ${reservation.packageDate?.packageTitle || 'Destino'}`;
  }

  getPackageDuration(reservation: any): string {
    if (reservation.packageDate?.startDate && reservation.packageDate?.endDate) {
      const start = new Date(reservation.packageDate.startDate);
      const end = new Date(reservation.packageDate.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias`;
    }
    return '0 dias';
  }

  cancelReservation(reservationId: string): void {
    // Implementar lógica de cancelamento
    console.log('Cancelar reserva:', reservationId);
  }

  payReservation(reservationId: string): void {
    // Implementar redirecionamento para pagamento
    console.log('Pagar reserva:', reservationId);
  }

  // ===== MÉTODOS DE AVALIAÇÃO =====

  /**
   * Carrega avaliações existentes para as reservas
   */
  private loadRatingsForReservations(): void {
    console.log('Carregando avaliações para reservas:', this.reservations.map(r => r.id));
    
    this.reservations.forEach(reservation => {
      this.ratingService.getRatingByReservation(reservation.id).subscribe({
        next: (rating) => {
          console.log(`Avaliação encontrada para reserva ${reservation.id}:`, rating);
          this.reservationRatings.set(reservation.id, rating);
        },
        error: (error) => {
          // Reserva ainda não foi avaliada - erro esperado
          console.log(`Reserva ${reservation.id} ainda não avaliada:`, error.status);
        }
      });
    });
  }

  /**
   * Verifica se uma reserva pode ser avaliada
   */
  canRateReservation(reservation: any): boolean {
    console.log('Verificando se pode avaliar:', {
      reservationId: reservation.id,
      situation: reservation.situation,
      hasRating: this.reservationRatings.has(reservation.id),
      isCompleted: this.isReservationCompleted(reservation),
      endDate: reservation.packageDate?.endDate
    });
    
    // Só pode avaliar se: CONFIRMADA + sem avaliação + viagem já aconteceu
    return reservation.situation === 'CONFIRMADA' && 
           !this.reservationRatings.has(reservation.id) &&
           this.isReservationCompleted(reservation);
  }

  /**
   * Verifica se uma reserva já foi avaliada
   */
  hasExistingRating(reservation: any): boolean {
    return this.reservationRatings.has(reservation.id);
  }

  /**
   * Verifica se a reserva foi concluída (data da viagem já passou)
   */
  private isReservationCompleted(reservation: any): boolean {
    if (!reservation.packageDate?.endDate) {
      console.log('Reserva sem data de fim:', reservation.id);
      return false;
    }
    
    const endDate = new Date(reservation.packageDate.endDate);
    const today = new Date();
    
    // Zerar horas para comparar apenas datas
    endDate.setHours(23, 59, 59, 999); // Final do dia da viagem
    today.setHours(0, 0, 0, 0); // Início do dia atual
    
    const isCompleted = endDate < today;
    
    console.log('Verificando conclusão da reserva:', {
      reservationId: reservation.id,
      endDate: endDate.toLocaleDateString('pt-BR'),
      today: today.toLocaleDateString('pt-BR'),
      isCompleted: isCompleted
    });
    
    return isCompleted;
  }

  /**
   * Abre o modal de avaliação
   */
  openRatingModal(reservationId: string): void {
    this.selectedReservationId = reservationId;
    this.selectedRating = undefined;
    this.isRatingModalOpen = true;
  }

  /**
   * Abre o modal para editar avaliação existente
   */
  editRating(reservation: any): void {
    this.selectedReservationId = reservation.id;
    this.selectedRating = this.reservationRatings.get(reservation.id);
    this.isRatingModalOpen = true;
  }

  /**
   * Fecha o modal de avaliação
   */
  closeRatingModal(): void {
    this.isRatingModalOpen = false;
    this.selectedReservationId = '';
    this.selectedRating = undefined;
  }

  /**
   * Callback quando avaliação é submetida
   */
  onRatingSubmitted(response: SaveRatingResponse): void {
    // Atualizar o mapa de avaliações
    this.reservationRatings.set(response.reservationId, response);
    
    // Mostrar mensagem de sucesso
    console.log('Avaliação salva com sucesso!');
    
    // Fechar modal
    this.closeRatingModal();
  }

  /**
   * Obtém a avaliação de uma reserva
   */
  getReservationRating(reservationId: string): RatingDetail | undefined {
    return this.reservationRatings.get(reservationId);
  }

  /**
   * Gera array de estrelas para exibição
   */
  getStarsArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  // ===== MÉTODOS PARA VISUALIZAR AVALIAÇÕES DO PACOTE =====

  /**
   * Abre modal para visualizar todas as avaliações de um pacote
   */
  viewPackageRatings(reservation: any): void {
    this.selectedPackageId = reservation.packageDate?.packageId || reservation.id;
    this.selectedPackageTitle = this.getPackageTitle(reservation);
    this.isViewRatingsModalOpen = true;
    this.loadPackageRatings();
  }

  /**
   * Carrega todas as avaliações de um pacote específico
   */
  private loadPackageRatings(): void {
    this.isLoadingPackageRatings = true;
    this.packageRatings = [];

    this.ratingService.getRatingsByPackage(this.selectedPackageId).subscribe({
      next: (ratings) => {
        console.log('Avaliações do pacote carregadas:', ratings);
        this.packageRatings = ratings.sort((a, b) => {
          // Ordena por data (mais recente primeiro)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.isLoadingPackageRatings = false;
      },
      error: (error) => {
        console.error('Erro ao carregar avaliações do pacote:', error);
        this.packageRatings = [];
        this.isLoadingPackageRatings = false;
      }
    });
  }

  /**
   * Fecha o modal de visualização de avaliações do pacote
   */
  closeViewRatingsModal(): void {
    this.isViewRatingsModalOpen = false;
    this.packageRatings = [];
    this.selectedPackageId = '';
    this.selectedPackageTitle = '';
  }

  /**
   * Calcula a média das avaliações do pacote
   */
  getPackageAverageRating(): number {
    if (this.packageRatings.length === 0) return 0;
    const sum = this.packageRatings.reduce((acc, rating) => acc + rating.rate, 0);
    return Math.round((sum / this.packageRatings.length) * 10) / 10;
  }

  /**
   * Formata data para exibição
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Limita texto a um número específico de caracteres
   */
  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Helper para arredondar números (usado no template)
   */
  roundNumber(num: number): number {
    return Math.round(num);
  }
}
