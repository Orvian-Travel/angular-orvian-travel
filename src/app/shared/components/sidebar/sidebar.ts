import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  selectedItem: string = '';

  selectItem(item: string) {
    this.selectedItem = item;
  }

  isSelected(item: string): boolean {
    return this.selectedItem === item;
  }
}
