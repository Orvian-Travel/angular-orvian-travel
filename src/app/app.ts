import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-orvian-travel');

  constructor(public loadingService: LoadingService) {}
}
