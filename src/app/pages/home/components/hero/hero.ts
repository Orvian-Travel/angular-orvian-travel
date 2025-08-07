import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchData } from '../../../../services/entities/search-data.model';
import { SERVICES_TOKEN } from '../../../../services/services-token';
import { DialogManager } from '../../../../services/dialog/dialog-manager';
import { IDialogManager } from '../../../../services/dialog/dialog-manager.interface';

@Component({
  selector: 'app-hero',
  imports: [FormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  providers: [
    { provide: SERVICES_TOKEN.DIALOG, useClass: DialogManager }
  ]
})
export class Hero {
  constructor(@Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManager: IDialogManager) { }

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
      this.dialogManager.showErrorAlert('Erro', 'Por favor, informe o destino', true)
      return;
    }

    if (this.searchData.date.trim() && new Date(this.searchData.date) < new Date(new Date().toISOString().split('T')[0])) {
      this.dialogManager.showErrorAlert('Erro', 'Selecione uma Data valida', true)
      return;
    }

    this.searchRequest.emit(this.searchData);
  }
}
