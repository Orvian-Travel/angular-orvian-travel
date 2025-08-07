import { Component } from '@angular/core';
import { HeaderLogged } from "../../shared/components/header-logged/header-logged";
import { ReservationsList } from './components/reservations-list/reservations-list';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-reservations',
  imports: [ReservationsList, Header],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations {

}
