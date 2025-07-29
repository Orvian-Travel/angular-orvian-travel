import { Component } from '@angular/core';
import { HeaderLogged } from '../../shared/components/header-logged/header-logged';
import { ContactSupport } from "../../shared/components/contact-support/contact-support";

@Component({
  selector: 'app-payment-rejected',
  imports: [HeaderLogged, ContactSupport],
  templateUrl: './payment-rejected.html',
  styleUrl: './payment-rejected.css'
})
export class PaymentRejected {

}
