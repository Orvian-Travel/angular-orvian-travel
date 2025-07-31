import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchData } from '../../../../services/entities/search-data.model';

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  searchData: SearchData = {
    destination: '',
    date: '',
    people: ''
  };

  @Output()
  searchRequest = new EventEmitter<SearchData>();

  openDatePicker() {
    this.dateInput.nativeElement.showPicker();
  }

  onSearch() {
    if (!this.searchData.destination.trim()) {
      alert('Por favor, informe o destino');
      return;
    }

    // if (!this.searchData.date) {
    //   alert('Por favor, selecione uma data');
    //   return;
    // }

    // if (!this.searchData.people || this.searchData.people === '') {
    //   alert('Por favor, selecione o número de pessoas');
    //   return;
    // }

    this.searchRequest.emit(this.searchData);
  }
}
