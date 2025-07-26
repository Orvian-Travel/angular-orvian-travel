import { Component } from '@angular/core';
import { Card } from "../card/card";

@Component({
  selector: 'app-card-list',
  imports: [Card],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css'
})
export class CardList {

}
