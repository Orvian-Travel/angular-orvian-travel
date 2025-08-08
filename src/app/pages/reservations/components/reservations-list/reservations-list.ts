import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Imports do Angular Material para o datepicker
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { SERVICES_TOKEN } from '../../../../services/services-token';
import { IReservationService } from '../../../../services/api/reservation/reservation-service.interface';
import { AuthStateService } from '../../../../services/auth/auth-state-service';
import { ReservationService } from '../../../../services/api/reservation/reservation-service';
import {
  ReservationDetail,
  ReservationDateDTO,
  PaginatedReservationResponse,
  ReservationSituation
} from '../../../../services/entities/reservation.model';
import { PaymentMethod, PaymentStatus } from '../../../../services/entities/payment.model';
import { RatingModalComponent } from '../../../../shared/components/rating-modal/rating-modal.component';
import { PackageRatingsViewerComponent } from '../../../../shared/components/package-ratings-viewer/package-ratings-viewer.component';
import { RatingService } from '../../../../services/api/rating/rating.service';
import { RatingDetail } from '../../../../services/entities/rating.model';

@Component({
  selector: 'app-reservations-list',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    RatingModalComponent,
    PackageRatingsViewerComponent
  ],
  templateUrl: './reservations-list.html',
  styleUrl: './reservations-list.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.RESERVATION, useClass: ReservationService }
  ]
})
export class ReservationsList implements OnInit {
  // Propriedades existentes para filtros
  selectedStatus: string = 'todas';
  reservations: ReservationDetail[] = [];
  currentPage: number = 0;
  pageSize: number = 6; // 6 reservas por página
  totalElements: number = 0;
  totalPages: number = 0;

  // Novas propriedades para o filtro de data
  selectedDate: Date | null = null; // Data selecionada no datepicker
  availableDates: ReservationDateDTO[] = []; // Datas disponíveis vindas do backend
  availableDateObjects: Date[] = []; // Array de objetos Date para o filtro

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.RESERVATION) private readonly reservationService: IReservationService,
    private authStateService: AuthStateService,
    private ratingService: RatingService
  ) { }

  // Propriedades para o modal de avaliação
  showRatingModal = false;
  selectedReservationForRating: ReservationDetail | null = null;
  existingRatingForReservation: RatingDetail | undefined = undefined;

  // Cache para avaliações existentes por reserva
  existingRatingsCache: Map<string, RatingDetail | null> = new Map();

  // Propriedades para o modal de visualização de avaliações do pacote
  showPackageRatingsViewer = false;
  selectedPackageForViewing: { id: string, title: string } | null = null;


  ngOnInit(): void {
    // Carrega as datas disponíveis primeiro, depois carrega as reservas
    this.loadAvailableDates();
    this.loadReservations();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 0; // Reset para primeira página ao trocar filtro
    this.loadReservations();
  }

  // Novo método: Evento disparado quando uma data é selecionada no datepicker
  onDateSelected(date: Date | null): void {
    console.log('Data selecionada:', date);
    this.selectedDate = date;
    this.currentPage = 0; // Reset para primeira página ao trocar filtro
    this.loadReservations();
  }

  // Novo método: Limpa o filtro de data
  clearDateFilter(): void {
    this.selectedDate = null;
    this.currentPage = 0;
    this.loadReservations();
  }

  // Novo método: Carrega as datas disponíveis do backend
  private loadAvailableDates(): void {
    const userId = this.authStateService.getUserId() || undefined;

    this.reservationService.getAvailableReservationDates(userId).subscribe({
      next: (dates: ReservationDateDTO[]) => {

        this.availableDates = dates;

        // Converte as strings de data para objetos Date para usar no filtro do datepicker
        this.availableDateObjects = dates.map(dateDTO => {
          // Assumindo que dateDTO.reservationDate está no formato 'YYYY-MM-DD'
          const [year, month, day] = dateDTO.reservationDate.split('-').map(Number);
          return new Date(year, month - 1, day); // month - 1 porque Date usa meses de 0-11
        });

      },
      error: (error: Error) => {
        console.error('Erro ao carregar datas disponíveis:', error);
        // Em caso de erro, permite qualquer data (fallback)
        this.availableDateObjects = [];
        this.availableDates = [];
      }
    });
  }

  // Método atualizado para incluir filtro por data
  private loadReservations(): void {
    const statusParam: ReservationSituation | undefined = this.selectedStatus === 'todas'
      ? undefined
      : this.selectedStatus as ReservationSituation;
    const userId: string | undefined = this.authStateService.getUserId() || undefined;

    // Usa o novo método que inclui filtro de data
    this.reservationService.getAllReservationsWithPaginationWithStatusAndReservationDate(
      this.currentPage,
      this.pageSize,
      userId,
      statusParam,
      this.selectedDate || undefined // Converte null para undefined
    ).subscribe({
      next: (response: PaginatedReservationResponse) => {

        this.reservations = response._embedded?.DTOList || [];
        this.totalElements = response.page?.totalElements || 0;
        this.totalPages = response.page?.totalPages || 0;

        // Carrega cache de avaliações após carregar reservas
        this.loadExistingRatingsCache();

      },
      error: (error: Error) => {
        console.error('Erro ao carregar reservas:', error);
        this.reservations = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }
    });

  }

  /**
   * Carrega cache de avaliações existentes para as reservas atuais
   */
  private loadExistingRatingsCache(): void {
    this.reservations.forEach(reservation => {
      if (this.canRateReservation(reservation)) {
        this.ratingService.findRatingByReservation(reservation.id).subscribe({
          next: (rating) => {
            this.existingRatingsCache.set(reservation.id, rating);
          },
          error: () => {
            this.existingRatingsCache.set(reservation.id, null);
          }
        });
      }
    });
  }

  /**
   * Verifica se já existe avaliação para uma reserva (usando cache)
   */
  hasExistingRating(reservationId: string): boolean {
    return this.existingRatingsCache.get(reservationId) !== null &&
      this.existingRatingsCache.get(reservationId) !== undefined;
  }

  onImageError(event: Event): void {
    console.warn('Erro ao carregar imagem da reserva, usando imagem padrão');
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/default-package.jpg'; // Fallback para imagem padrão
    }
  }

  getImageUrl(reservation: ReservationDetail): string {
    // Verifica se existe firstMedia e contentType
    if (reservation.firstMedia && reservation.firstMedia.contentType) {
      // Converte o base64 para data URL
      return `data:image/${reservation.firstMedia.type || 'jpeg'};base64,${reservation.firstMedia.contentType}`;
    }

    // Retorna imagem padrão quando firstMedia não está disponível
    return "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"; // ou qualquer imagem padrão que você esteja usando
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

  getStatusLabel(situation: ReservationSituation): string {
    switch (situation) {
      case ReservationSituation.CONFIRMADA: return 'CONFIRMADO';
      case ReservationSituation.PENDENTE: return 'PENDENTE';
      case ReservationSituation.CANCELADA: return 'CANCELADO';
      default: return situation;
    }
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.PIX: return 'PIX';
      case PaymentMethod.CREDITO: return 'Cartão de Crédito';
      case PaymentMethod.DEBITO: return 'Cartão de Débito';
      case PaymentMethod.BOLETO: return 'Boleto';
      default: return method;
    }
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.APROVADO: return 'Aprovado';
      case PaymentStatus.PENDENTE: return 'Pendente';
      case PaymentStatus.CANCELADO: return 'Cancelado';
      default: return status;
    }
  }

  getPackageTitle(reservation: ReservationDetail): string {
    // Você pode ajustar isso baseado na estrutura real do seu pacote
    return `${reservation.packageDate?.packageTitle || 'Destino'}`;
  }

  getPackageDuration(reservation: ReservationDetail): string {
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
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        console.log('Reserva cancelada com sucesso:', reservationId);
        this.loadReservations();
      },
      error: (error: Error) => {
        console.error('Erro ao cancelar reserva:', error);
      }
    });
  }

  payReservation(reservationId: string): void {
    // Implementar redirecionamento para pagamento
    console.log('Pagar reserva:', reservationId);
  }

  // Novos métodos para o datepicker (similares ao product-details)

  // Filtro que determina quais datas podem ser selecionadas no datepicker
  dateFilter = (date: Date | null): boolean => {
    if (!date || this.availableDateObjects.length === 0) {
      return false; // Se não há datas disponíveis, não permite seleção
    }

    // Verifica se a data está na lista de datas disponíveis
    return this.availableDateObjects.some(availableDate => {
      return (
        date.getFullYear() === availableDate.getFullYear() &&
        date.getMonth() === availableDate.getMonth() &&
        date.getDate() === availableDate.getDate()
      );
    });
  };

  // Função para aplicar classes CSS customizadas às datas no calendário
  dateClass = (date: Date): string => {
    // Aplica classe especial para datas que possuem reservas
    const hasReservation = this.availableDateObjects.some(availableDate => {
      return (
        date.getFullYear() === availableDate.getFullYear() &&
        date.getMonth() === availableDate.getMonth() &&
        date.getDate() === availableDate.getDate()
      );
    });

    return hasReservation ? 'available-date' : '';
  };

  // Método para formatar data de cancelamento
  formatCancelledDate(cancelledDate: Date | string | null | undefined): string {
    if (!cancelledDate) {
      return '';
    }

    try {
      // Se for string, converte para Date
      const date = typeof cancelledDate === 'string' ? new Date(cancelledDate) : cancelledDate;

      // Verifica se é uma data válida
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }

      return '';
    } catch (error) {
      console.error('Erro ao formatar data de cancelamento:', error);
      return '';
    }
  }

  // ===== MÉTODOS PARA RATING SYSTEM =====

  /**
   * Verifica se o usuário pode avaliar uma reserva
   * 
   * REGRAS DE NEGÓCIO:
   * 1. Só pode avaliar reservas CONFIRMADAS (não pendentes ou canceladas)
   * 2. Só pode avaliar APÓS a data de término da viagem
   * 3. A data é comparada sem considerar as horas (apenas dia, mês e ano)
   * 
   * @param reservation - Dados da reserva a ser verificada
   * @returns true se o usuário pode avaliar, false caso contrário
   */
  canRateReservation(reservation: ReservationDetail): boolean {
    // Só pode avaliar reservas confirmadas
    if (reservation.situation !== ReservationSituation.CONFIRMADA) {
      return false;
    }

    // Verifica se já passou da data de término da viagem
    if (reservation.packageDate?.endDate) {
      const endDate = new Date(reservation.packageDate.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove as horas para comparar apenas a data
      endDate.setHours(0, 0, 0, 0);

      return endDate < today; // Retorna true se a viagem já terminou
    }

    return false;
  }

  /**
   * Abre o modal para avaliar uma reserva
   */
  rateReservation(reservation: ReservationDetail): void {
    this.selectedReservationForRating = reservation;

    // Primeiro tenta o endpoint específico
    this.ratingService.getRatingByReservation(reservation.id).subscribe({
      next: (existingRating) => {
        this.existingRatingForReservation = existingRating;
        this.showRatingModal = true;
      },
      error: (error) => {
        // Se o endpoint específico falhar, tenta buscar na lista geral
        this.ratingService.findRatingByReservation(reservation.id).subscribe({
          next: (foundRating) => {
            this.existingRatingForReservation = foundRating || undefined;
            this.showRatingModal = true;
          },
          error: (searchError) => {
            console.error('Erro na busca geral:', searchError);
            this.existingRatingForReservation = undefined;
            this.showRatingModal = true;
          }
        });
      }
    });
  }

  /**
   * Fecha o modal de avaliação
   */
  onRatingModalClose(): void {
    this.showRatingModal = false;
    this.selectedReservationForRating = null;
    this.existingRatingForReservation = undefined;
  }

  /**
   * Callback chamado quando uma avaliação é salva
   */
  onRatingSaved(): void {
    this.onRatingModalClose();
    // Aguarda um pouco antes de recarregar para garantir que a avaliação foi persistida
    setTimeout(() => {
      this.loadReservations();
    }, 500);
  }

  /**
   * Callback chamado quando uma avaliação é deletada
   */
  onRatingDeleted(): void {
    this.onRatingModalClose();
    // Aguarda um pouco antes de recarregar para garantir que a avaliação foi removida
    setTimeout(() => {
      this.loadReservations();
    }, 500);
  }

  /**
   * Verifica se é possível visualizar as avaliações de um pacote
   */
  canViewPackageRatings(reservation: ReservationDetail): boolean {
    return !!(reservation.packageDate?.travelPackageId);
  }

  /**
   * Abre o modal para visualizar todas as avaliações de um pacote
   */
  viewPackageRatings(reservation: ReservationDetail): void {
    console.log('viewPackageRatings called for reservation:', reservation.id);
    console.log('packageDate:', reservation.packageDate);
    console.log('travelPackageId:', reservation.packageDate?.travelPackageId);

    if (this.canViewPackageRatings(reservation)) {
      // Sempre fecha primeiro para garantir estado limpo
      this.showPackageRatingsViewer = false;
      this.selectedPackageForViewing = null;
      
      // Força a re-renderização
      setTimeout(() => {
        this.selectedPackageForViewing = {
          id: reservation.packageDate.travelPackageId,
          title: reservation.packageDate.packageTitle || 'Pacote'
        };
        this.showPackageRatingsViewer = true;
        console.log('Modal state updated:', {
          showModal: this.showPackageRatingsViewer,
          selectedPackage: this.selectedPackageForViewing
        });
      }, 10);
    } else {
      console.warn('Cannot open ratings viewer: missing packageDate or travelPackageId');

      // Feedback simples para o usuário
      alert('Não é possível visualizar as avaliações deste pacote no momento. Dados do pacote não encontrados.');
    }
  }

  /**
   * Fecha o modal de visualização de avaliações do pacote
   */
  onPackageRatingsViewerClose(): void {
    console.log('Closing package ratings viewer');
    this.showPackageRatingsViewer = false;
    this.selectedPackageForViewing = null;
  }
}
