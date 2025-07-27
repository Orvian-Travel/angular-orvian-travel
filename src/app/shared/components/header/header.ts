import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(private router: Router) {}

  loginRedirect() : void{
    this.router.navigate(['/login']);
  }

  registerRedirect(): void{
    this.router.navigate(['/register']);
  }
}
