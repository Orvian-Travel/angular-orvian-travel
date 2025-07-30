import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private activeRequests = 0;
  private minLoadingTime = 1000;
  private loadingStartTime: number | null = null;

  loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.loadingStartTime = Date.now();
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      
      if (this.loadingStartTime) {
        const elapsedTime = Date.now() - this.loadingStartTime;
        const remainingTime = this.minLoadingTime - elapsedTime;
        
        if (remainingTime > 0) {
          setTimeout(() => {
            this.loadingSubject.next(false);
            this.loadingStartTime = null;
          }, remainingTime);
        } else {
          this.loadingSubject.next(false);
          this.loadingStartTime = null;
        }
      } else {
        this.loadingSubject.next(false);
      }
    }
  }

  forceHide(): void {
    this.activeRequests = 0;
    this.loadingSubject.next(false);
    this.loadingStartTime = null;
  }
}
