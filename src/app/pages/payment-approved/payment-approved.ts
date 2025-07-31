import { Component, OnInit } from '@angular/core';
import { HeaderLogged } from "../../shared/components/header-logged/header-logged";
import { ContactSupport } from '../../shared/components/contact-support/contact-support';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment-approved',
  imports: [HeaderLogged, ContactSupport, CurrencyPipe],
  templateUrl: './payment-approved.html',
  styleUrl: './payment-approved.css'
})
export class PaymentApproved implements OnInit {
  purshaseDate: string = '';
  totalValue: number = 0;
  packageName: string = '';
  packageDuration: number = 0;
  checkinDate: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.purshaseDate = params['purshaseDate'] || '';
      this.totalValue = parseFloat(params['totalValue']) || 0;
      this.packageName = params['packageName'] || '';
      this.packageDuration = parseInt(params['packageDuration'], 10) || 0;
      this.checkinDate = params['checkinDate'] || '';
    });
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
