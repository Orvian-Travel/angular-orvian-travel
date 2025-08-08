import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewEncapsulation, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RatingService } from '../../../services/api/rating/rating.service';
import { RatingDetail } from '../../../services/entities/rating.model';

@Component({
  selector: 'app-package-ratings-viewer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './package-ratings-viewer.component.html',
  styleUrl: './package-ratings-viewer.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PackageRatingsViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() packageId!: string;
  @Input() packageTitle!: string;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  @ViewChild('ratingsModal') ratingsModalTemplate!: TemplateRef<any>;

  private modalRef?: NgbModalRef;

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

  constructor(
    private ratingService: RatingService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    console.log('PackageRatingsViewer ngOnInit called', {
      packageId: this.packageId,
      isVisible: this.isVisible
    });
  }

  ngOnChanges() {
    console.log('PackageRatingsViewer ngOnChanges called', {
      packageId: this.packageId,
      isVisible: this.isVisible,
      hasModalRef: !!this.modalRef
    });

    if (this.packageId && this.isVisible && !this.modalRef) {
      this.loadPackageRatings();
      // Aguarda o próximo ciclo para garantir que o template esteja disponível
      setTimeout(() => {
        this.openModal();
      }, 0);
    } else if (!this.isVisible && this.modalRef) {
      this.closeModal();
    }
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = undefined;
    }
  }

  private openModal() {
    console.log('Attempting to open modal', {
      isVisible: this.isVisible,
      hasTemplate: !!this.ratingsModalTemplate,
      hasModalRef: !!this.modalRef
    });

    if (this.isVisible && this.ratingsModalTemplate && !this.modalRef) {
      console.log('Opening modal...');
      
      this.modalRef = this.modalService.open(this.ratingsModalTemplate, {
        size: 'xl',
        backdrop: 'static',
        keyboard: true,
        windowClass: 'ratings-modal-wrapper',
        centered: true
      });

      this.modalRef.result.then(
        () => {
          // Modal fechado normalmente
          console.log('Modal closed normally');
          this.handleModalClose();
        },
        () => {
          // Modal fechado via backdrop ou ESC
          console.log('Modal dismissed');
          this.handleModalClose();
        }
      );
      
      console.log('Modal opened successfully');
    } else {
      console.warn('Cannot open modal:', {
        isVisible: this.isVisible,
        hasTemplate: !!this.ratingsModalTemplate,
        hasModalRef: !!this.modalRef
      });
    }
  }

  private handleModalClose() {
    console.log('Handling modal close');
    this.modalRef = undefined;
    this.close.emit();
  }

  private loadPackageRatings(): void {
    console.log('Loading package ratings for packageId:', this.packageId);
    
    this.isLoading = true;
    this.error = '';

    this.ratingService.getRatingsByPackage(this.packageId).subscribe({
      next: (ratings) => {
        console.log('Package ratings loaded successfully:', ratings);
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

  closeModal(): void {
    console.log('Closing modal manually');
    
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = undefined;
    }
    this.close.emit();
  }
}
