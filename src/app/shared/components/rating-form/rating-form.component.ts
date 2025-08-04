import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingService } from '../../../services/api/rating/rating.service';
import { CreateRatingDTO, RatingDetail } from '../../../services/entities/rating.model';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './rating-form.component.html',
  styleUrls: ['./rating-form.component.css']
})
export class RatingFormComponent implements OnInit {
  @Input() reservationId!: string;
  @Input() existingRating?: RatingDetail;
  @Output() ratingSubmitted = new EventEmitter<RatingDetail>();
  @Output() formCancelled = new EventEmitter<void>();

  ratingForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  selectedRating = 0;
  hoverRating = 0;

  constructor(
    private fb: FormBuilder,
    private ratingService: RatingService
  ) {
    this.ratingForm = this.fb.group({
      rate: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    if (this.existingRating) {
      this.selectedRating = this.existingRating.rate;
      this.ratingForm.patchValue({
        rate: this.existingRating.rate,
        comment: this.existingRating.comment
      });
    }
  }

  /**
   * Define a nota quando o usuário clica em uma estrela
   */
  setRating(rating: number): void {
    this.selectedRating = rating;
    this.ratingForm.patchValue({ rate: rating });
  }

  /**
   * Define a nota temporária quando o usuário passa o mouse
   */
  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  /**
   * Remove a nota temporária quando o mouse sai
   */
  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  /**
   * Retorna a classe CSS para cada estrela
   */
  getStarClass(starNumber: number): string {
    const rating = this.hoverRating || this.selectedRating;
    return starNumber <= rating ? 'star filled' : 'star';
  }

  /**
   * Submete o formulário de avaliação
   */
  onSubmit(): void {
    if (this.ratingForm.invalid || !this.reservationId) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const ratingData: CreateRatingDTO = {
      rate: this.ratingForm.value.rate,
      comment: this.ratingForm.value.comment.trim(),
      reservationId: this.reservationId
    };

    // Como não há endpoint de update, só criação
    this.ratingService.saveRating(ratingData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.ratingSubmitted.emit(response);
        this.resetForm();
      },
      error: (error) => {
        console.error('Erro ao salvar avaliação:', error);
        this.submitError = this.getErrorMessage(error);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Cancela o formulário
   */
  onCancel(): void {
    this.resetForm();
    this.formCancelled.emit();
  }

  /**
   * Reseta o formulário
   */
  private resetForm(): void {
    this.ratingForm.reset();
    this.selectedRating = 0;
    this.hoverRating = 0;
    this.submitError = null;
  }

  /**
   * Marca todos os campos como tocados para mostrar erros
   */
  private markFormGroupTouched(): void {
    Object.keys(this.ratingForm.controls).forEach(key => {
      this.ratingForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Retorna mensagem de erro amigável
   */
  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Dados inválidos. Verifique os campos e tente novamente.';
    } else if (error.status === 401) {
      return 'Você precisa estar logado para avaliar.';
    } else if (error.status === 403) {
      return 'Você não tem permissão para avaliar esta reserva.';
    } else if (error.status === 409) {
      return 'Esta reserva já foi avaliada.';
    } else {
      return 'Erro ao salvar avaliação. Tente novamente.';
    }
  }

  /**
   * Verifica se um campo específico tem erro
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.ratingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Retorna a mensagem de erro para um campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.ratingForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return fieldName === 'rate' ? 'Por favor, selecione uma nota' : 'Este campo é obrigatório';
    }
    if (field.errors['min']) {
      return 'A nota deve ser pelo menos 1 estrela';
    }
    if (field.errors['max']) {
      return 'A nota não pode ser maior que 5 estrelas';
    }
    if (field.errors['minlength']) {
      return 'O comentário deve ter pelo menos 10 caracteres';
    }
    if (field.errors['maxlength']) {
      return 'O comentário não pode ter mais de 500 caracteres';
    }

    return 'Campo inválido';
  }

  /**
   * Retorna o número de caracteres restantes no comentário
   */
  getRemainingChars(): number {
    const comment = this.ratingForm.get('comment')?.value || '';
    return 500 - comment.length;
  }
}
