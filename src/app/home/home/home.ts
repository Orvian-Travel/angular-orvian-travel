import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Hero } from "../components/hero/hero";
import { CardList } from "../../shared/components/card-list/card-list";

@Component({
  selector: 'app-home',
  imports: [Header, Hero, CardList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
