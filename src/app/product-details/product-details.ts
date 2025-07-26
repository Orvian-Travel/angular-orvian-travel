import { Component } from '@angular/core';
import { Header } from '../shared/components/header/header';
import { CardList } from '../shared/components/card-list/card-list';

@Component({
  selector: 'app-product-details',
  imports: [Header, CardList],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {

}
