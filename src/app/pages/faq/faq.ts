import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from "@shared/components/header/header";
import { FooterComponent } from "@shared/components/footer/footer.component";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [Header, FooterComponent, CommonModule, FormsModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class Faq implements OnInit {
  selectedCategory: string = 'all';
  faqs: FAQItem[] = [];
  filteredFAQs: FAQItem[] = [];

  ngOnInit(): void {
    this.initializeFAQs();
    this.filteredFAQs = [...this.faqs];
  }

  private initializeFAQs(): void {
    this.faqs = [
      {
        id: 1,
        question: 'Como faço para reservar um pacote de viagem?',
        answer: 'Para reservar um pacote, navegue pela nossa página inicial, selecione o destino desejado, escolha as datas disponíveis e clique em "Reservar". Você será direcionado à página de pagamento, onde poderá finalizar sua reserva.',
        category: 'Reservas',
        isOpen: false
      },
      {
        id: 2,
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos cartão de crédito, cartão de débito, PIX e boleto bancário. Para facilitar sua experiência, oferecemos parcelamento em até 12x sem juros no cartão de crédito.',
        category: 'Pagamento',
        isOpen: false
      },
      {
        id: 3,
        question: 'É possível cancelar minha reserva?',
        answer: 'Sim, é possível cancelar sua reserva. As condições de cancelamento ficam disponíveis até 24 horas antes da data de check-in.',
        category: 'Cancelamento',
        isOpen: false
      },
      {
        id: 4,
        question: 'Os pacotes incluem hospedagem e alimentação?',
        answer: 'Sim, nossos pacotes são completos e incluem hospedagem em hotéis selecionados, café da manhã e algumas refeições, conforme especificado em cada pacote. Verifique os detalhes de cada pacote para informações específicas.',
        category: 'Viagem',
        isOpen: false
      },
      {
        id: 5,
        question: 'Preciso de seguro viagem?',
        answer: 'Recomendamos fortemente o seguro viagem para sua segurança e tranquilidade. Alguns destinos exigem seguro obrigatório. Oferecemos parcerias com seguradoras confiáveis.',
        category: 'Viagem',
        isOpen: false
      },
      {
        id: 6,
        question: 'Como funciona a política de reembolso?',
        answer: 'Nossa política de reembolso permite reembolso integral de até 100% do valor pago, se solicitado até 24 horas antes do check-in.',
        category: 'Cancelamento',
        isOpen: false
      },
      {
        id: 7,
        question: 'Posso alterar as datas da minha viagem?',
        answer: 'Alterações de datas não são possíveis. Sugerimos que cancele a reserva o mais rápido possível.',
        category: 'Reservas',
        isOpen: false
      },
      {
        id: 8,
        question: 'Os voos estão incluídos nos pacotes?',
        answer: 'Alguns pacotes incluem voos nacionais e internacionais, enquanto outros são apenas terrestres. Verifique sempre a descrição completa do pacote para confirmar o que está incluído.',
        category: 'Viagem',
        isOpen: false
      },
      {
        id: 9,
        question: 'Como recebo meus documentos de viagem?',
        answer: 'Após a confirmação do pagamento, enviaremos todos os documentos de viagem por e-mail em até 24 horas. Você também pode acessá-los na área do cliente em nosso site.',
        category: 'Reservas',
        isOpen: false
      },
      {
        id: 10,
        question: 'O que acontece se houver problemas climáticos?',
        answer: 'Em caso de problemas climáticos que impeçam a realização da viagem, oferecemos reagendamento sem custos adicionais ou reembolso integral, conforme sua preferência.',
        category: 'Viagem',
        isOpen: false
      }
    ];
  }

  supportRedirect(): void{
    window.open('https://wa.link/ebiz6f'), '_blank';
  }

  toggleFAQ(index: number): void {
    this.filteredFAQs[index].isOpen = !this.filteredFAQs[index].isOpen;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.faqs];

    // Filtrar apenas por categoria
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === this.selectedCategory);
    }

    // Resetar estado de abertura
    filtered.forEach(faq => faq.isOpen = false);

    this.filteredFAQs = filtered;
  }
}
