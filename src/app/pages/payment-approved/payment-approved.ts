import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ContactSupport } from '../../shared/components/contact-support/contact-support';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment-approved',
  imports: [ContactSupport, CurrencyPipe, RouterLink],
  templateUrl: './payment-approved.html',
  styleUrl: './payment-approved.css',
  encapsulation: ViewEncapsulation.None
})
export class PaymentApproved implements OnInit, OnDestroy {
  purshaseDate: string = '';
  totalValue: number = 0;
  packageName: string = '';
  packageDuration: number = 0;
  checkinDate: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Adicionar classe ao body e app-root para forçar fundo branco
    document.body.classList.add('payment-approved-active');
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.classList.add('payment-approved-active');
    }

    this.route.queryParams.subscribe(params => {
      this.purshaseDate = params['purshaseDate'] || '';
      this.totalValue = parseFloat(params['totalValue']) || 0;
      this.packageName = params['packageName'] || '';
      this.packageDuration = parseInt(params['packageDuration'], 10) || 0;
      this.checkinDate = params['checkinDate'] || '';
    });
  }

  ngOnDestroy(): void {
    // Remover classe do body e app-root quando sair da página
    document.body.classList.remove('payment-approved-active');
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.classList.remove('payment-approved-active');
    }
  }

  getFormattedPurshaseDate(): string {
    if (!this.purshaseDate) return 'Data não disponível';

    try {
      const date = new Date(this.purshaseDate);
      if (isNaN(date.getTime())) {
        console.error('Data de check-in inválida:', this.purshaseDate);
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data de check-in:', error);
      return 'Erro na data';
    }
  }

  getFormattedCheckinDate(): string {
    if (!this.checkinDate) return 'Data não disponível';

    try {
      const date = new Date(this.checkinDate);
      if (isNaN(date.getTime())) {
        console.error('Data de check-in inválida:', this.checkinDate);
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data de check-in:', error);
      return 'Erro na data';
    }
  }

  getFormattedCheckoutDate(): string {
    if (!this.checkinDate || !this.packageDuration) return 'Data não disponível';

    try {
      const checkinDate = new Date(this.checkinDate);

      if (isNaN(checkinDate.getTime())) {
        console.error('Data de check-in inválida:', this.checkinDate);
        return 'Data inválida';
      }

      const checkoutDate = new Date(checkinDate);
      checkoutDate.setDate(checkoutDate.getDate() + this.packageDuration);

      return checkoutDate.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao calcular data de check-out:', error);
      return 'Erro na data';
    }
  }
}
