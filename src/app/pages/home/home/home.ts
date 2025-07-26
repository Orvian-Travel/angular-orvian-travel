import { Component } from '@angular/core';
import { Hero } from "../components/hero/hero";
import { Header } from '../../../shared/components/header/header';
import { CardList } from '../../../shared/components/card-list/card-list';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, CardList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
