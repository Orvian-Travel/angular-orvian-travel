import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  @ViewChild('birthdateInput') birthdateInput!: ElementRef<HTMLInputElement>;

  constructor(private router : Router){

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.initializeEventListeners();
    }, 100);
  }

  private initializeEventListeners(): void {
    const documentTypeSelect = document.querySelector('.document-type-select');
    if (documentTypeSelect) {
      documentTypeSelect.addEventListener('change', (e) => this.onDocumentTypeChange(e));
    }
  }

  onDocumentTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const documentInput = document.querySelector('.document-number-input') as HTMLInputElement;
    
    if (documentInput) {
      const newInput = documentInput.cloneNode(true) as HTMLInputElement;
      documentInput.parentNode?.replaceChild(newInput, documentInput);
      
      if (select.value) {
        newInput.disabled = false;
        
        if (select.value === 'cpf') {
          newInput.placeholder = '000.000.000-00';
          newInput.maxLength = 14;
          newInput.className = 'form-control form-control-custom document-number-input cpf-input';
          newInput.addEventListener('input', (e) => this.formatCPF(e));
        } else if (select.value === 'passaporte') {
          newInput.placeholder = 'AA123456';
          newInput.maxLength = 8;
          newInput.className = 'form-control form-control-custom document-number-input passport-input';
          newInput.addEventListener('input', (e) => this.formatPassport(e));
        }
        
        newInput.value = '';
      } else {
        newInput.disabled = true;
        newInput.placeholder = 'Selecione o tipo de documento';
        newInput.value = '';
      }
    }
  }

  formatPassport(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    
    let formattedValue = '';
    let letterCount = 0;
    let numberCount = 0;
    
    for (let i = 0; i < value.length && formattedValue.length < 8; i++) {
      const char = value[i];
      
      if (letterCount < 2) {
        if (/[a-zA-Z]/.test(char)) {
          formattedValue += char.toUpperCase();
          letterCount++;
        }
      } 
      else if (numberCount < 6) {
        if (/[0-9]/.test(char)) {
          formattedValue += char;
          numberCount++;
        }
      }
    }
    
    input.value = formattedValue;
  }

  formatCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    value = value.substring(0, 11);
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    input.value = value;
  }

  returnPage(): void {
    this.router.navigate(['/']);
  }

  openDatePicker(): void {
    if (this.birthdateInput) {
      const input = this.birthdateInput.nativeElement;
      if ('showPicker' in input && typeof (input as any).showPicker === 'function') {
        (input as any).showPicker();
      } else {
        input.focus();
        input.click();
      }
    }
  }
}
