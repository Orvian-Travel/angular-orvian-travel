import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth/auth-state-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;

  constructor(private router: Router, private authStateService: AuthStateService) {}

  ngOnInit(): void {
    this.authStateService.isAuthenticated$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
    this.isMenuOpen = false; // Fecha o menu após navegar
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loginRedirect() : void{
    this.router.navigate(['/login']);
    this.isMenuOpen = false; // Fecha o menu após navegar
  }

  registerRedirect(): void{
    this.router.navigate(['/register']);
    this.isMenuOpen = false; // Fecha o menu após navegar
  }

  logout(): void {
    this.authStateService.logout();
    this.router.navigate(['/']);
    this.isMenuOpen = false; // Fecha o menu após navegar
  }

  getUser(): any {
    return this.authStateService.getUser();
  }

  getUserName(): string {
    const user = this.authStateService.getUser();
    return user?.name || 'Usuário';
  }
  
}
