import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../../services/api/rating/rating.service';
import { RatingDetail } from '../../../services/entities/rating.model';

/**
 * Componente Carrossel de Avaliações
 * 
 * MODO DESENVOLVIMENTO:
 * Para desabilitar os dados mock e usar apenas a API real,
 * altere a propriedade 'developmentMode' para 'false' na linha 21
 */

@Component({
  selector: 'app-ratings-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ratings-carousel.component.html',
  styleUrls: ['./ratings-carousel.component.css']
})
export class RatingsCarouselComponent implements OnInit {
  ratings: RatingDetail[] = [];
  currentSlide = 0;
  isLoading = false;
  error: string | null = null;

  // Modo de desenvolvimento - remove quando a API estiver funcionando
  private developmentMode = false;

  constructor(private ratingService: RatingService) { }

  ngOnInit(): void {
    this.loadTopRatings();
  }

  /**
   * Carrega os melhores ratings
   */
  loadTopRatings(): void {
    this.isLoading = true;
    this.error = null;

    // Para debugging - verificar se o serviço está sendo chamado
    console.log('Carregando ratings...');

    this.ratingService.getTopRatings(6).subscribe({
      next: (ratings) => {
        console.log('Ratings recebidos:', ratings);
        
        if (ratings && ratings.length > 0) {
          // Debug: verificar cada rating individualmente
          ratings.forEach((rating, index) => {
            console.log(`Rating ${index + 1}:`, {
              id: rating.id,
              rate: rating.rate,
              comment: rating.comment?.substring(0, 50) + '...',
              userName: rating.userName
            });
          });
          
          // Normaliza os dados antes de filtrar
          const normalizedRatings = this.normalizeRatings(ratings);
          
          // Filtra e ordena os melhores ratings no frontend
          this.ratings = this.filterTopRatings(normalizedRatings, 6);
          
          // Debug: verificar ratings filtrados
          console.log('Ratings filtrados:', this.ratings.map(r => ({ id: r.id, rate: r.rate, userName: r.userName })));
        } else {
          this.ratings = [];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar ratings:', error);
        this.error = 'Erro ao carregar avaliações';
        this.ratings = [];
        this.isLoading = false;
      }
    });
  }

  /**
   * Navega para o slide anterior
   */
  previousSlide(): void {
    if (this.ratings.length === 0) return;
    
    this.currentSlide = this.currentSlide === 0 
      ? this.ratings.length - 1 
      : this.currentSlide - 1;
  }

  /**
   * Navega para o próximo slide
   */
  nextSlide(): void {
    if (this.ratings.length === 0) return;
    
    this.currentSlide = this.currentSlide === this.ratings.length - 1 
      ? 0 
      : this.currentSlide + 1;
  }

  /**
   * Vai para um slide específico
   */
  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  /**
   * Gera array de estrelas baseado na nota
   */
  getStarsArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }

  /**
   * Cria dados de exemplo para desenvolvimento/demonstração
   */
  private createMockRatings(): RatingDetail[] {
    return [
      {
        id: '1',
        rate: 5,
        comment: 'Experiência incrível! A viagem superou todas as expectativas. Recomendo muito!',
        reservationId: 'res1',
        createdAt: new Date('2024-07-15'),
        updatedAt: new Date('2024-07-15'),
        userName: 'Maria Silva',
        packageName: 'Pacote Paraíso Tropical - Maldivas'
      },
      {
        id: '2',
        rate: 4,
        comment: 'Muito boa organização e roteiro bem planejado. Paisagens deslumbrantes!',
        reservationId: 'res2',
        createdAt: new Date('2024-07-10'),
        updatedAt: new Date('2024-07-10'),
        userName: 'João Santos',
        packageName: 'Aventura na Patagônia - Chile'
      },
      {
        id: '3',
        rate: 5,
        comment: 'Atendimento excepcional e locais paradisíacos. Vale cada centavo investido!',
        reservationId: 'res3',
        createdAt: new Date('2024-07-05'),
        updatedAt: new Date('2024-07-05'),
        userName: 'Ana Costa',
        packageName: 'Safari Africano - Quênia e Tanzânia'
      }
    ];
  }

  /**
   * Filtra e ordena os melhores ratings
   */
  private filterTopRatings(ratings: RatingDetail[], limit: number): RatingDetail[] {
    return ratings
      .filter(rating => rating.rate >= 4) // Apenas ratings 4 e 5 estrelas
      .sort((a, b) => {
        // Ordena por nota (desc) e depois por data (desc)
        if (b.rate !== a.rate) {
          return b.rate - a.rate;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, limit); // Limita o número de resultados
  }

  /**
   * Formata a data de criação
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Limita o comentário a um número de caracteres
   */
  truncateComment(comment: string, maxLength: number = 150): string {
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + '...';
  }

  /**
   * Debug: método para verificar o valor da nota
   */
  debugRating(rating: RatingDetail): void {
    console.log('Debug rating:', {
      id: rating.id,
      rate: rating.rate,
      type: typeof rating.rate,
      userName: rating.userName
    });
  }

  /**
   * Normaliza os dados dos ratings vindos da API
   * Garante que rate seja sempre um número
   */
  private normalizeRatings(ratings: any[]): RatingDetail[] {
    return ratings.map(rating => ({
      ...rating,
      rate: Number(rating.rate) || 0, // Converte para número, default 0 se inválido
      createdAt: new Date(rating.createdAt),
      updatedAt: new Date(rating.updatedAt)
    }));
  }
}
