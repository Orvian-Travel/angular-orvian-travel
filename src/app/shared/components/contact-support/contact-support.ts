import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-support',
  imports: [],
  templateUrl: './contact-support.html',
  styleUrl: './contact-support.css'
})
export class ContactSupport {
  supportRedirect(): void{
    window.open('https://wa.link/ebiz6f'), '_blank';
  }
}
