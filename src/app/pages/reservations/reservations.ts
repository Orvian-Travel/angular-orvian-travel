import { Component } from '@angular/core';
import { HeaderLogged } from "../../shared/components/header-logged/header-logged";
import { ReservationsList } from './components/reservations-list/reservations-list';

@Component({
  selector: 'app-reservations',
  imports: [HeaderLogged,ReservationsList],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations {

}
