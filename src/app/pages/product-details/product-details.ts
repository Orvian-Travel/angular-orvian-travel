import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { from, Subscription } from 'rxjs';
import { Header } from '../../shared/components/header/header';
import { CardList } from '../../shared/components/card-list/card-list';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SwiperGallery } from './swiper-gallery/swiper-gallery';
import { PackageService } from '../../services/api/package/package-service';
import { PackageDetail } from '../../services/entities/package.model';
import { SERVICES_TOKEN } from '../../services/services-token';
import { IPackageService } from '../../services/api/package/package-service.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthStateService } from '../../services/auth/auth-state-service';
import { Geocoding } from '@services/api/externals/geocoding';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RatingService } from '../../services/api/rating/rating.service';
import { RatingDetail } from '../../services/entities/rating.model';

@Component({
  selector: 'app-product-details',
  imports: [Header, CardList, FooterComponent, SwiperGallery, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.PACKAGE, useClass: PackageService }
  ]
})
export class ProductDetails implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private authStateService: AuthStateService,
    private geocodingService: Geocoding,
    private sanitizer: DomSanitizer,
    private ratingService: RatingService,
    @Inject(SERVICES_TOKEN.HTTP.PACKAGE) private readonly service: IPackageService,
    private route: ActivatedRoute
  ) { }

  isLoggedIn: boolean = false;
  package: PackageDetail | null = null;
  private routeSubscription: Subscription = new Subscription();
  selectedDate: Date | null = null;
  endDate: Date | null = null;
  mapEmbedUrl: SafeResourceUrl | null = null;

  // Propriedades para avaliações
  packageRatings: RatingDetail[] = [];
  loadingRatings = false;
  averageRating = 0;
  showAllReviews = false;
  ratingDistribution: Record<number, number> = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };

  // Expõe Math para o template
  Math = Math;

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPackage(id);
      }
    });
    this.authStateService.isAuthenticated$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month' && this.package?.packageDates) {
      const cellDateString = cellDate.toISOString().split('T')[0];

      const isAvailableDate = this.package.packageDates.some(
        packageDate => {
          const packageStartDate = new Date(packageDate.startDate).toISOString().split('T')[0];
          return packageStartDate === cellDateString;
        }
      );

      return isAvailableDate ? 'example-custom-date-class' : '';
    }
    return '';
  };

  dateFilter = (date: Date | null): boolean => {
    if (!date || !this.package?.packageDates) {
      return false;
    }

    const dateString = date.toISOString().split('T')[0];
    return this.package.packageDates.some(
      packageDate => {
        const packageStartDate = new Date(packageDate.startDate).toISOString().split('T')[0];
        return packageStartDate === dateString;
      }
    );
  };

  onDateSelected(selectedDate: Date | null): void {
    if (selectedDate && this.dateFilter(selectedDate)) {
      this.selectedDate = selectedDate;
      const selectedPackageDate = this.getSelectedPackageDate();

      if (selectedPackageDate?.endDate) {
        this.endDate = new Date(selectedPackageDate.endDate);
      } else {
        this.endDate = null;
      }

      console.log('Data selecionada:', selectedDate);
      console.log('Data de fim:', this.endDate);
      console.log('Informações do pacote:', selectedPackageDate);
    } else {
      this.endDate = null;
    }
  }

  getSelectedPackageDate() {
    if (!this.selectedDate || !this.package?.packageDates) {
      return null;
    }

    const selectedDateString = this.selectedDate.toISOString().split('T')[0];
    return this.package.packageDates.find(
      packageDate => {
        const packageStartDate = new Date(packageDate.startDate).toISOString().split('T')[0];
        return packageStartDate === selectedDateString;
      }
    );
  }

  private loadPackage(id: string): void {
    this.package = null;
    this.service.getPackageById(id).subscribe((response: PackageDetail) => {
      this.package = response;
      this.updateMapLocation();
      this.loadPackageRatings(id); // Carregar avaliações após carregar o pacote
    });
  }

  private setDefaultMap(): void {
    const defaultUrl = "https://maps.google.com/maps?q=-23.625599,-46.704040&hl=pt&z=14&output=embed";
    this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(defaultUrl);
  }

  private updateMapLocation(): void {
    if (this.package?.destination) {
      this.geocodingService.getCoordinates(this.package.destination).subscribe(result => {
        if (result) {
          const { lat, lon } = result;
          const offset = 0.01;
          const bbox = `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`;
          
          const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&hl=pt&z=14&output=embed`;
          
          this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
          
          console.log(`Mapa atualizado para: ${this.package?.destination} (${lat}, ${lon})`);
        } else {
          console.warn(`Não foi possível encontrar coordenadas para: ${this.package?.destination}`);
          this.setDefaultMap();
        }
      });
    } else {
      this.setDefaultMap();
    }
  }

  navigateToDetails() {
    this.router.navigate(['/payment']);
  }

  paymentRedirect(): void {
    if (this.selectedDate) {
      this.router.navigate(['/payment'], {
        queryParams: {
          packageId: this.package?.id,
          packageDestination: this.package?.destination,
          checkin: this.selectedDate.toISOString()
        }
      });
    } else {
      alert('Preencha uma data para continuar.');
    }
  }

  loginRedirectWithReturn(): void {
    this.router.navigate(['/login'], {
      queryParams: { from: '/payment' }
    });
  }

  getPackageImageUrl(packageItem: PackageDetail): string {
    if (packageItem.medias && packageItem.medias.length > 0) {
      const firstMedia = packageItem.medias[0];

      if (firstMedia.contentType) {
        return `data:${firstMedia.type};base64,${firstMedia.contentType}`;
      }
    }

    return 'assets/images/default-package-image.png';
  }

  // Métodos para avaliações
  private loadPackageRatings(packageId: string): void {
    this.loadingRatings = true;
    this.ratingService.getRatingsByPackage(packageId).subscribe({
      next: (ratings) => {
        this.packageRatings = ratings;
        this.calculateRatingStatistics();
        this.loadingRatings = false;
      },
      error: (error) => {
        console.error('Erro ao carregar avaliações do pacote:', error);
        this.loadingRatings = false;
      }
    });
  }

  private calculateRatingStatistics(): void {
    if (this.packageRatings.length === 0) {
      this.averageRating = 0;
      return;
    }

    // Calcula média
    const sum = this.packageRatings.reduce((acc, rating) => acc + rating.rate, 0);
    this.averageRating = sum / this.packageRatings.length;

    // Calcula distribuição
    this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.packageRatings.forEach(rating => {
      const rateKey = rating.rate as keyof typeof this.ratingDistribution;
      this.ratingDistribution[rateKey]++;
    });
  }

  generateStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  getRatingPercentage(rating: number): number {
    const count = this.getRatingCount(rating);
    return this.packageRatings.length > 0 ? (count / this.packageRatings.length) * 100 : 0;
  }

  getRatingCount(rating: number): number {
    return this.ratingDistribution[rating] || 0;
  }

  get displayedRatings(): RatingDetail[] {
    return this.showAllReviews ? this.packageRatings : this.packageRatings.slice(0, 3);
  }

  toggleShowAllReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }
}
