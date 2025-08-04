import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingFormComponent } from '../rating-form/rating-form.component';
import { RatingDetail } from '../../../services/entities/rating.model';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule, RatingFormComponent],
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.css']
})
export class RatingModalComponent {
  @Input() isOpen = false;
  @Input() reservationId = '';
  @Input() existingRating?: RatingDetail;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() ratingSubmitted = new EventEmitter<RatingDetail>();

  /**
   * Fecha o modal
   */
  closeModal(): void {
    this.isOpen = false;
    this.modalClosed.emit();
  }

  /**
   * Manipula o clique no overlay para fechar o modal
   */
  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  /**
   * Manipula a submissão da avaliação
   */
  onRatingSubmitted(response: RatingDetail): void {
    this.ratingSubmitted.emit(response);
    this.closeModal();
  }

  /**
   * Manipula o cancelamento do formulário
   */
  onFormCancelled(): void {
    this.closeModal();
  }
}
