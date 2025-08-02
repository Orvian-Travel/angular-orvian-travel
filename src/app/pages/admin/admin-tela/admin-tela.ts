import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStateService } from '@services/auth/auth-state-service';


@Component({
  selector: 'app-admin-tela',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-tela.html',
  styleUrl: './admin-tela-new.css'
})
export class AdminTela {

  constructor(
    private authStateService: AuthStateService
  ) { }

  logout(): void {
    this.authStateService.logout();
  }
}
