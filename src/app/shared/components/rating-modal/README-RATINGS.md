# Sistema de Avaliações (Ratings) - Documentação de Integração

## Visão Geral

O sistema de avaliações permite que usuários avaliem suas experiências com os pacotes de viagem após a conclusão da reserva. Inclui:

1. **Carrossel de Avaliações**: Exibe as melhores avaliações na página inicial
2. **Formulário de Avaliação**: Permite criar/editar avaliações
3. **Modal de Avaliação**: Interface modal para facilitar a integração
4. **Serviço de API**: Comunicação completa com o backend

## Componentes Criados

### 1. RatingService (`rating.service.ts`)
Serviço para comunicação com a API de ratings.

**Métodos principais:**
- `getAllRatings(page, size)` - Lista todos os ratings paginados
- `getRatingsByPackage(packageId, page, size)` - Ratings de um pacote específico
- `saveRating(rating)` - Cria nova avaliação
- `updateRating(id, rating)` - Atualiza avaliação existente
- `getRatingByReservation(reservationId)` - Busca rating por reserva
- `getTopRatings(limit)` - Melhores ratings para o carrossel

### 2. RatingsCarouselComponent (`ratings-carousel.component.*`)
Carrossel que exibe as melhores avaliações.

**Uso:**
```html
<app-ratings-carousel></app-ratings-carousel>
```

**Características:**
- Carrossel automático com navegação manual
- Indicadores de posição
- Estrelas interativas
- Design responsivo
- Estados de loading/error

### 3. RatingFormComponent (`rating-form.component.*`)
Formulário para criar/editar avaliações.

**Uso:**
```html
<app-rating-form
  [reservationId]="reservationId"
  [existingRating]="existingRating"
  (ratingSubmitted)="onRatingSubmitted($event)"
  (formCancelled)="onFormCancelled()">
</app-rating-form>
```

**Props:**
- `reservationId` (string): ID da reserva a ser avaliada
- `existingRating` (RatingDetail, opcional): Rating existente para edição

**Events:**
- `ratingSubmitted`: Emitido quando rating é salvo com sucesso
- `formCancelled`: Emitido quando usuário cancela o formulário

### 4. RatingModalComponent (`rating-modal.component.*`)
Modal wrapper para o formulário de avaliação.

**Uso:**
```html
<app-rating-modal
  [isOpen]="isModalOpen"
  [reservationId]="selectedReservationId"
  [existingRating]="selectedRating"
  (modalClosed)="closeModal()"
  (ratingSubmitted)="onRatingSubmitted($event)">
</app-rating-modal>
```

## Integração por Página

### Página Home
✅ **Já integrado** - O carrossel foi adicionado entre o vídeo de apresentação e os cards de pacotes.

```typescript
// home.ts
imports: [..., RatingsCarouselComponent, ...]
```

```html
<!-- home.html -->
<app-presentation-video></app-presentation-video>
<app-ratings-carousel></app-ratings-carousel>
<app-card-list [searchData]="searchData"></app-card-list>
```

### Página de Reservas do Usuário
Para implementar em qualquer página onde o usuário vê suas reservas:

```typescript
import { RatingModalComponent } from '../../shared/components/rating-modal/rating-modal.component';

@Component({
  imports: [CommonModule, RatingModalComponent],
  // ...
})
export class MyReservationsComponent {
  isRatingModalOpen = false;
  selectedReservationId = '';
  selectedRating?: RatingDetail;

  openRatingModal(reservationId: string): void {
    this.selectedReservationId = reservationId;
    this.isRatingModalOpen = true;
  }

  onRatingSubmitted(response: SaveRatingResponse): void {
    // Atualizar UI
    console.log('Rating saved:', response);
  }
}
```

### Página de Detalhes do Produto
Para mostrar ratings de um pacote específico:

```typescript
loadPackageRatings(): void {
  this.ratingService.getRatingsByPackage(this.packageId).subscribe({
    next: (ratings) => this.packageRatings = ratings.content,
    error: (error) => console.error('Erro ao carregar ratings:', error)
  });
}
```

## Modelos de Dados

### RatingDetail
```typescript
interface RatingDetail {
  id: string;
  rate: number;         // 1-5 estrelas
  comment: string;      // Comentário do usuário
  reservationId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### SaveRatingRequest
```typescript
interface SaveRatingRequest {
  rate: number;
  comment: string;
  reservationId: string;
}
```

## Endpoints da API (para o Backend)

O serviço espera os seguintes endpoints:

- `GET /ratings?page=0&size=10` - Lista ratings paginados
- `GET /ratings/package/{packageId}?page=0&size=10` - Ratings por pacote
- `GET /ratings/{id}` - Rating específico
- `POST /ratings` - Criar novo rating
- `PUT /ratings/{id}` - Atualizar rating
- `DELETE /ratings/{id}` - Deletar rating
- `GET /ratings/reservation/{reservationId}` - Rating por reserva
- `GET /ratings/top?limit=6` - Melhores ratings para carrossel

## Validações

### Frontend
- Rating: 1-5 estrelas (obrigatório)
- Comentário: 10-500 caracteres (obrigatório)
- Reserva: deve existir e pertencer ao usuário logado

### Backend (esperado)
- Usuário deve estar autenticado
- Reserva deve estar com status 'COMPLETED'
- Usuário deve ser o dono da reserva
- Não permitir múltiplas avaliações da mesma reserva (exceto atualizações)

## Permissões

- **Criar rating**: Usuário logado, reserva concluída, sem rating existente
- **Editar rating**: Usuário logado, dono do rating
- **Visualizar ratings**: Público (carrossel), autenticado (próprios ratings)

## Estados de UI

### Loading
- Carrossel: Spinner enquanto carrega ratings
- Formulário: Botão com spinner durante submit

### Error
- Carrossel: Mensagem de erro com botão "Tentar novamente"
- Formulário: Mensagens específicas por tipo de erro

### Empty
- Carrossel: "Ainda não há avaliações disponíveis"
- Lista de ratings: Estado vazio personalizado

## Responsividade

Todos os componentes são responsivos:
- **Desktop**: Layout padrão
- **Tablet**: Ajustes de espaçamento e tamanho
- **Mobile**: Layout empilhado, modal fullscreen

## Acessibilidade

- Labels adequados para leitores de tela
- Navegação por teclado
- Contrast ratio apropriado
- ARIA labels nos botões de estrelas

## Próximos Passos

1. **Implementar no Backend**: Criar os endpoints da API
2. **Testar Integração**: Verificar comunicação frontend-backend
3. **Integrar nas Páginas**: Adicionar aos componentes específicos
4. **Adicionar Notificações**: Toast messages para feedback
5. **Analytics**: Rastrear interações com ratings

## Exemplo de Implementação Completa

Veja o arquivo `EXEMPLO-DE-USO.html` no diretório `rating-modal` para um exemplo completo de como implementar o sistema em uma página de reservas.
