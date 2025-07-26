import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  constructor(private router: Router){

  }

  navigateToDetails(){
    this.router.navigate(['/product-details']);
  }
}
