import { Component, EventEmitter, Output } from '@angular/core';
import { Hero } from "../components/hero/hero";
import { Header } from '../../../shared/components/header/header';
import { CardList } from '../../../shared/components/card-list/card-list';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { PresentationVideoComponent } from '../../../shared/components/presentation-video/presentation-video';
import { SearchData } from '../../../services/entities/search-data.model';
import { ChatWidgetComponent } from "app/chatbot/components/chat-widget/chat-widget.component";

@Component({
  selector: 'app-home',
  imports: [Header, Hero, CardList, PresentationVideoComponent, FooterComponent, ChatWidgetComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  @Output()
  updateData = new EventEmitter<SearchData>();

  searchData: SearchData | null = null;

  onSearchRequest($event: SearchData) {
    this.searchData = { ...$event };
  }

}
