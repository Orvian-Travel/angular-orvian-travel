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

  constructor(private router: Router, private authStateService: AuthStateService) {}

  ngOnInit(): void {
    this.authStateService.isAuthenticated$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  loginRedirect() : void{
    this.router.navigate(['/login']);
  }

  registerRedirect(): void{
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authStateService.logout();
    this.router.navigate(['/']);
  }

  getUser(): any {
    return this.authStateService.getUser();
  }

  getUserName(): string {
    const user = this.authStateService.getUser();
    return user?.name || 'Usuário';
  }
  
}
