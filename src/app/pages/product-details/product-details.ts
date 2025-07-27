import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { CardList } from '../../shared/components/card-list/card-list';

@Component({
  selector: 'app-product-details',
  imports: [Header, CardList],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  constructor(private router: Router) {}

  navigateToDetails() {
    this.router.navigate(['/payment']);
  }

  paymentRedirect(): void {
    this.router.navigate(['/payment']);
  }

  registerRedirect(): void {
    this.router.navigate(['/payment']);
  }
}
