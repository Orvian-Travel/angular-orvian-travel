import { Component } from '@angular/core';
import { HeaderLogged } from "../../shared/components/header-logged/header-logged";
import { ContactSupport } from '../../shared/components/contact-support/contact-support';

@Component({
  selector: 'app-payment-approved',
  imports: [HeaderLogged, ContactSupport],
  templateUrl: './payment-approved.html',
  styleUrl: './payment-approved.css'
})
export class PaymentApproved {

}
