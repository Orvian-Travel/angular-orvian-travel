# Sistema de Loading Automático

Este sistema de loading foi criado para ser executado automaticamente em todas as chamadas da API.

## Componentes Criados

### 1. LoadingComponent
- **Localização**: `src/app/shared/components/loading/loading.component.ts`
- **Função**: Exibe o overlay de loading com ícone animado personalizado
- **Visual**: Overlay escuro com modal branco contendo ícone SVG animado

### 2. LoadingService
- **Localização**: `src/app/services/loading/loading.service.ts`
- **Função**: Gerencia o estado global do loading
- **Métodos**:
  - `show()`: Mostra o loading
  - `hide()`: Esconde o loading (gerencia múltiplas requisições)
  - `forceHide()`: Força o loading a esconder

### 3. LoadingInterceptor
- **Localização**: `src/app/interceptors/loading.interceptor.ts`
- **Função**: Intercepta automaticamente todas as requisições HTTP
- **Comportamento**: 
  - Mostra loading antes da requisição
  - Esconde loading após a requisição (sucesso ou erro)

### 4. Ícone de Loading
- **Localização**: `public/assets/icons/loading.svg`
- **Tipo**: SVG animado personalizado
- **Características**: Círculo com gradiente azul e pontos animados

## Como Funciona

1. **Automático**: O loading aparece automaticamente em qualquer chamada HTTP
2. **Múltiplas Requisições**: Gerencia múltiplas requisições simultâneas
3. **Error Handling**: Esconde o loading mesmo se a requisição falhar

## Personalização

### Trocar o Ícone
Para usar um GIF personalizado:
1. Adicione seu GIF em `public/assets/icons/loading.gif`
2. Atualize o `loading.component.html`:
```html
<img src="/assets/icons/loading.gif" alt="Carregando..." />
```

### Customizar Estilos
Edite `loading.component.css` para alterar:
- Cores do overlay
- Tamanho do modal
- Estilo do texto
- Animações

### Controle Manual (Opcional)
Se precisar controlar manualmente em algum componente:

```typescript
import { LoadingService } from '../services/loading/loading.service';

constructor(private loadingService: LoadingService) {}

// Mostrar loading
this.loadingService.show();

// Esconder loading
this.loadingService.hide();

// Forçar a esconder
this.loadingService.forceHide();
```

## Configuração Aplicada

O sistema foi configurado no `app.config.ts` com o interceptor que captura todas as requisições HTTP automaticamente.

## Testes

Para testar o loading, faça qualquer chamada da API (login, buscar pacotes, etc.) e o loading aparecerá automaticamente.
