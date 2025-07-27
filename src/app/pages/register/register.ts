import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  @ViewChild('birthdateInput') birthdateInput!: ElementRef<HTMLInputElement>;

  constructor(private router : Router){

  }

  returnPage(): void {
    this.router.navigate(['/']);
  }

  openDatePicker(): void {
    if (this.birthdateInput) {
      const input = this.birthdateInput.nativeElement;
      // Tentar usar showPicker se disponível (Chrome/Edge moderno)
      if ('showPicker' in input && typeof (input as any).showPicker === 'function') {
        (input as any).showPicker();
      } else {
        // Fallback: focar no input e simular clique
        input.focus();
        input.click();
      }
    }
  }
}
