import { Component, EventEmitter, Output } from '@angular/core';
import { Hero } from "../components/hero/hero";
import { Header } from '../../../shared/components/header/header';
import { CardList } from '../../../shared/components/card-list/card-list';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { PresentationVideoComponent } from '../../../shared/components/presentation-video/presentation-video';
import { RatingsCarouselComponent } from '../../../shared/components/ratings-carousel/ratings-carousel.component';
import { SearchData } from '../../../services/entities/search-data.model';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, CardList, PresentationVideoComponent, RatingsCarouselComponent, FooterComponent],
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
