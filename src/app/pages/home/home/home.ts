import { Component } from '@angular/core';
import { Hero } from "../components/hero/hero";
import { Header } from '../../../shared/components/header/header';
import { CardList } from '../../../shared/components/card-list/card-list';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, CardList, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
