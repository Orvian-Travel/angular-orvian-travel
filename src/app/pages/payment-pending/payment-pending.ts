import { Component } from '@angular/core';
import { HeaderLogged } from '../../shared/components/header-logged/header-logged';
import { ContactSupport } from "../../shared/components/contact-support/contact-support";

@Component({
  selector: 'app-payment-pending',
  imports: [HeaderLogged, ContactSupport],
  templateUrl: './payment-pending.html',
  styleUrl: './payment-pending.css'
})
export class PaymentPending {

}
