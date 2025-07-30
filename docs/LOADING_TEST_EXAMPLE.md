# Exemplo de Teste do Loading

Para testar o sistema de loading, você pode criar um botão de teste em qualquer componente:

```typescript
// No componente (exemplo: login.ts)
import { LoadingService } from '../../services/loading/loading.service';
import { HttpClient } from '@angular/common/http';

constructor(
  private loadingService: LoadingService,
  private http: HttpClient
) {}

// Método para testar loading
testLoading() {
  // Teste com requisição real (será automatico via interceptor)
  this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe({
    next: (data) => console.log('Dados recebidos:', data),
    error: (err) => console.error('Erro:', err)
  });
}

// Teste manual do loading
testManualLoading() {
  this.loadingService.show();
  setTimeout(() => {
    this.loadingService.hide();
  }, 3000);
}
```

```html
<!-- No template -->
<button (click)="testLoading()">Testar Loading Automático</button>
<button (click)="testManualLoading()">Testar Loading Manual</button>
```

O loading aparecerá automaticamente em qualquer chamada HTTP real do seu projeto!
