import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  openDatePicker() {
    this.dateInput.nativeElement.showPicker();
  }
}
