import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RatingService } from '../../../services/api/rating/rating.service';
import { RatingDetail } from '../../../services/entities/rating.model';

@Component({
  selector: 'app-package-ratings-viewer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './package-ratings-viewer.component.html',
  styleUrl: './package-ratings-viewer.component.css'
})
export class PackageRatingsViewerComponent implements OnInit, OnChanges {
  @Input() packageId!: string;
  @Input() packageTitle!: string;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  ratings: RatingDetail[] = [];
  isLoading = false;
  error = '';
  
  // Estatísticas das avaliações
  averageRating = 0;
  totalRatings = 0;
  ratingDistribution: Record<number, number> = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };

  // Expõe Math para o template
  Math = Math;

  constructor(private ratingService: RatingService) {}

  ngOnInit() {
    if (this.packageId && this.isVisible) {
      this.loadPackageRatings();
    }
  }

  ngOnChanges() {
    if (this.packageId && this.isVisible) {
      this.loadPackageRatings();
    }
  }

  private loadPackageRatings(): void {
    this.isLoading = true;
    this.error = '';

    this.ratingService.getRatingsByPackage(this.packageId).subscribe({
      next: (ratings) => {
        this.ratings = ratings;
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar avaliações do pacote:', error);
        this.error = 'Erro ao carregar avaliações. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  // Método público para retry
  retryLoadRatings(): void {
    this.loadPackageRatings();
  }

  private calculateStatistics(): void {
    this.totalRatings = this.ratings.length;
    
    if (this.totalRatings === 0) {
      this.averageRating = 0;
      return;
    }

    // Calcula média
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rate, 0);
    this.averageRating = sum / this.totalRatings;

    // Calcula distribuição
    this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.ratings.forEach(rating => {
      const rateKey = rating.rate as keyof typeof this.ratingDistribution;
      this.ratingDistribution[rateKey]++;
    });
  }

  generateStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  getPercentage(count: number): number {
    return this.totalRatings > 0 ? (count / this.totalRatings) * 100 : 0;
  }

  getRatingCount(rating: number): number {
    return this.ratingDistribution[rating] || 0;
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
