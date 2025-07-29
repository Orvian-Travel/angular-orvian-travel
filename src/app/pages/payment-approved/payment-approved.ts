import { Component } from '@angular/core';
import { HeaderLogged } from "../../shared/components/header-logged/header-logged";

@Component({
  selector: 'app-payment-approved',
  imports: [HeaderLogged],
  templateUrl: './payment-approved.html',
  styleUrl: './payment-approved.css'
})
export class PaymentApproved {
  supportRedirect(): void{
    window.open('https://wa.link/ebiz6f'), '_blank';
  }
}
