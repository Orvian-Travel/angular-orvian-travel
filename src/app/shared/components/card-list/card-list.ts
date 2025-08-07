import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PackageService } from '../../../services/api/package/package-service';
import { PagedResponse } from '../../../services/entities/paged-response.model';
import { SERVICES_TOKEN } from '../../../services/services-token';
import { PackageDetail } from '../../../services/entities/package.model';
import { IPackageService } from '../../../services/api/package/package-service.interface';
import { SearchData } from '../../../services/entities/search-data.model';
import { DialogManager } from '../../../services/dialog/dialog-manager';
import { IDialogManager } from '../../../services/dialog/dialog-manager.interface';
import { PackageRatingsViewerComponent } from '../package-ratings-viewer/package-ratings-viewer.component';
import { RatingService } from '../../../services/api/rating/rating.service';

interface CacheEntry {
  data: PackageWithRatings[];
  totalElements: number;
  timestamp: number;
}

// Extensão do PackageDetail para incluir dados de avaliação
interface PackageWithRatings extends PackageDetail {
  averageRating?: number;
  totalRatings?: number;
}

@Component({
  selector: 'app-card-list',
  imports: [CommonModule, MatIconModule, PackageRatingsViewerComponent],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.PACKAGE, useClass: PackageService },
    { provide: SERVICES_TOKEN.DIALOG, useClass: DialogManager }
  ]
})
export class CardList implements OnInit, OnChanges {
  @ViewChild('cardListContainer', { static: true }) cardListContainer!: ElementRef;

  constructor(
    private router: Router,
    @Inject(SERVICES_TOKEN.HTTP.PACKAGE) private readonly service: IPackageService,
    @Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManager: IDialogManager,
    private ratingService: RatingService
  ) { }


  @Input() searchData: SearchData | null = null;

  cardListTitle: string = 'Pacotes recentes';
  packages: PackageWithRatings[] = [];
  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;
  totalElements: number = 0;

  isSearching: boolean = false;

  // Propriedades para o modal de avaliações
  isRatingsModalVisible = false;
  selectedPackageId = '';
  selectedPackageTitle = '';

  private allCurrentData: PackageWithRatings[] = [];

  private allPackagesCache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000;


  ngOnInit(): void {
    this.loadPackages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes['searchData']);
    if (changes['searchData'] && changes['searchData'].currentValue) {
      this.currentPage = 0;
      this.loadSearch(changes['searchData'].currentValue);
    }
  }

  loadSearch(data: SearchData): void {
    // Validar se os dados necessários existem
    if (!data || !data.destination) {
      console.log('Dados de busca inválidos, carregando pacotes padrão');
      this.loadPackages();
      return;
    }

    const maxPeople = data.people ? parseInt(data.people.replace('+', ''), 10) : 1;
    const startDate = data.date || new Date().toISOString().split('T')[0];



    console.log('Fazendo busca na API:', {
      destination: data.destination,
      date: startDate,
      people: maxPeople
    });


    this.isSearching = true;
    this.service.getAllPackagesBySearchPagination(
      0,
      1000,
      data.destination,
      startDate,
      maxPeople
    ).subscribe({
      next: (response: PagedResponse<PackageDetail>) => {
        if (response._embedded.DTOList.length === 0) {
          this.dialogManager.showNotificationAlert(
            'Nenhum resultado',
            'Nenhum pacote encontrado para a busca informada.',
            true)
          this.loadPackages();
          return;
        }

        // Converter para PackageWithRatings
        const allData: PackageWithRatings[] = response._embedded.DTOList.map(pkg => ({
          ...pkg,
          averageRating: 0,
          totalRatings: 0
        }));

        // Atualizar dados locais
        this.allCurrentData = allData;
        this.cardListTitle = `Pacotes para "${data.destination}"`;
        this.currentPage = 0;
        this.updateLocalPagination();
        
        // Carregar avaliações para os pacotes encontrados
        this.loadRatingsForPackages();

        this.dialogManager.showNotificationAlert(
          'Busca completa',
          'Pacotes encontrados, Aproveite!',
          true
        )
      },
      error: () => {
        this.dialogManager.showErrorAlert(
          'Erro inesperado',
          'Ocorreu um erro ao buscar os pacotes. Tente novamente mais tarde.',
          true
        )
        this.loadPackages();
      }
    });
  }

  loadPackages(): void {

    const cachedData = this.getCachedData();
    if (this.isSearching) {
      this.allCurrentData = [];
      this.isSearching = false;
    }

    if (cachedData) {
      this.allCurrentData = cachedData.data;
      this.cardListTitle = 'Pacotes recentes';
      this.currentPage = 0;
      this.updateLocalPagination();
      // Carregar avaliações para dados em cache
      this.loadRatingsForPackages();
      return;
    }


    // Fazer requisição com size maior para buscar todos os resultados
    this.service.getAllPackagesWithPagination(0, 1000).subscribe({
      next: (response: PagedResponse<PackageDetail>) => {
        // Converter para PackageWithRatings
        const allData: PackageWithRatings[] = response._embedded.DTOList.map(pkg => ({
          ...pkg,
          averageRating: 0,
          totalRatings: 0
        }));

        // Salvar no cache (usando os dados originais)
        this.setCachedData(response._embedded.DTOList, response._embedded.DTOList.length);

        // Atualizar dados locais
        this.allCurrentData = allData;
        this.cardListTitle = 'Pacotes recentes';
        this.currentPage = 0;
        this.updateLocalPagination();
        
        // Carregar avaliações para os pacotes
        this.loadRatingsForPackages();
      },
      error: () => {
        this.dialogManager.showErrorAlert(
          'Erro ao carregar pacotes:',
          'Ocorreu um erro ao carregar os pacotes. Tente novamente mais tarde.',
          true
        );
      }
    });
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION;
  }

  private getCachedData(): CacheEntry | null {
    return this.allPackagesCache && this.isCacheValid(this.allPackagesCache) ? this.allPackagesCache : null;
  }

  private setCachedData(data: PackageDetail[], totalElements: number): void {
    // Converter PackageDetail para PackageWithRatings
    const dataWithRatings: PackageWithRatings[] = data.map(pkg => ({
      ...pkg,
      averageRating: 0,
      totalRatings: 0
    }));

    const cacheEntry: CacheEntry = {
      data: dataWithRatings,
      totalElements,
      timestamp: Date.now()
    };

    this.allPackagesCache = cacheEntry;
  }

  private updateLocalPagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.packages = this.allCurrentData.slice(startIndex, endIndex);
    this.totalElements = this.allCurrentData.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateLocalPagination();
      setTimeout(() => this.scrollToCardList(), 100);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateLocalPagination();
      setTimeout(() => this.scrollToCardList(), 100);
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateLocalPagination();
      setTimeout(() => this.scrollToCardList(), 100);
    }
  }

  private scrollToCardList() {
    const cardListElement = document.querySelector('.section-title');
    if (cardListElement) {
      cardListElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  refreshData(): void {
    this.allPackagesCache = null;
    this.loadPackages();
  }

  // Método para limpar todo o cache
  clearCache(): void {
    this.allPackagesCache = null;
  }

  limparBusca() {
    this.loadPackages();
  }

  navigateToDetails(id: string) {
    this.router.navigate(['/product-details', id]);
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
  generateStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? 1 : 0);
  }

  openRatingsModal(packageId: string, packageTitle: string): void {
    this.selectedPackageId = packageId;
    this.selectedPackageTitle = packageTitle;
    this.isRatingsModalVisible = true;
  }

  closeRatingsModal(): void {
    this.isRatingsModalVisible = false;
    this.selectedPackageId = '';
    this.selectedPackageTitle = '';
  }

  private loadRatingsForPackages(): void {
    this.allCurrentData.forEach((package_, index) => {
      this.ratingService.getRatingsByPackage(package_.id).subscribe({
        next: (ratings) => {
          const totalRatings = ratings.length;
          let averageRating = 0;
          
          if (totalRatings > 0) {
            const sum = ratings.reduce((acc, rating) => acc + rating.rate, 0);
            averageRating = sum / totalRatings;
          }
          
          // Atualizar o pacote com dados de avaliação
          this.allCurrentData[index] = {
            ...package_,
            averageRating,
            totalRatings
          };
          
          // Atualizar a paginação local para refletir as mudanças
          this.updateLocalPagination();
        },
        error: (error) => {
          console.error(`Erro ao carregar avaliações para pacote ${package_.id}:`, error);
          // Em caso de erro, manter os dados originais sem avaliação
          this.allCurrentData[index] = {
            ...package_,
            averageRating: 0,
            totalRatings: 0
          };
        }
      });
    });
  }
}
