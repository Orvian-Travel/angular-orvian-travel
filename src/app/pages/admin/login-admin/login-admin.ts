import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-admin',
  imports: [FormsModule],
  templateUrl: './login-admin.html',
  styleUrl: './login-admin.css'
})
export class LoginAdmin {

  constructor(private router: Router) {}

  navigateToAdminPanel(): void {
    this.router.navigate(['/admin-tela']);
  }

}
