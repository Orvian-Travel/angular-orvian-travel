import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Mostra o loading antes da requisição
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Esconde o loading após a requisição (sucesso ou erro)
      loadingService.hide();
    })
  );
};
