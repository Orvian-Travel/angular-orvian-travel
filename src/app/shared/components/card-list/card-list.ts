import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PackageService } from '../../../services/api/package/package-service';
import { PagedResponse } from '../../../services/entities/paged-response.model';
import { SERVICES_TOKEN } from '../../../services/services-token';
import { PackageDetail } from '../../../services/entities/package.model';
import { IPackageService } from '../../../services/api/package/package-service.interface';
import { SearchData } from '../../../services/entities/search-data.model';

interface CacheEntry {
  data: PackageDetail[];
  totalElements: number;
  timestamp: number;
}

@Component({
  selector: 'app-card-list',
  imports: [CommonModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.PACKAGE, useClass: PackageService }
  ]
})
export class CardList implements OnInit, OnChanges {
  constructor(
    private router: Router,
    @Inject(SERVICES_TOKEN.HTTP.PACKAGE) private readonly service: IPackageService
  ) { }


  @Input() searchData: SearchData | null = null;

  cardListTitle: string = 'Pacotes recentes';
  packages: PackageDetail[] = [];
  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;
  totalElements: number = 0;

  private allCurrentData: PackageDetail[] = [];

  private allPackagesCache: CacheEntry | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000;


  ngOnInit(): void {
    this.loadPackages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes['searchData']);
    if (changes['searchData'] && changes['searchData'].currentValue) {
      console.log('Search data changed:', changes['searchData'].currentValue);
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

    // Fazer requisição com size maior para buscar todos os resultados
    this.service.getAllPackagesBySearchPagination(
      0,
      1000,
      data.destination,
      startDate,
      maxPeople
    ).subscribe({
      next: (response: PagedResponse<PackageDetail>) => {
        const allData = response._embedded.DTOList;

        // Salvar no cache
        this.setCachedData(allData, allData.length);

        // Atualizar dados locais
        this.allCurrentData = allData;
        this.cardListTitle = `Pacotes para "${data.destination}"`;
        this.currentPage = 0;
        this.updateLocalPagination();

        console.log(`Busca completa: ${allData.length} pacotes encontrados`);
      },
      error: (error) => {
        console.error('Erro na busca:', error);
        this.loadPackages();
      }
    });
  }

  loadPackages(): void {
    // Verificar cache primeiro
    const cachedData = this.getCachedData();
    if (cachedData) {
      console.log('Usando pacotes padrão do cache');
      this.allCurrentData = cachedData.data;
      this.cardListTitle = 'Pacotes recentes';
      this.currentPage = 0;
      this.updateLocalPagination();
      return;
    }


    // Fazer requisição com size maior para buscar todos os resultados
    this.service.getAllPackagesWithPagination(0, 1000).subscribe({
      next: (response: PagedResponse<PackageDetail>) => {
        const allData = response._embedded.DTOList;

        // Salvar no cache
        this.setCachedData(allData, allData.length);

        // Atualizar dados locais
        this.allCurrentData = allData;
        this.cardListTitle = 'Pacotes recentes';
        this.currentPage = 0;
        this.updateLocalPagination();

        console.log(`Pacotes carregados: ${allData.length} pacotes`);
      },
      error: (error) => {
        console.error('Erro ao carregar pacotes:', error);
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
    const cacheEntry: CacheEntry = {
      data,
      totalElements,
      timestamp: Date.now()
    };
  }

  private updateLocalPagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.packages = this.allCurrentData.slice(startIndex, endIndex);
    this.totalElements = this.allCurrentData.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);

    console.log(`Página ${this.currentPage + 1}: Mostrando ${this.packages.length} de ${this.totalElements} pacotes`);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateLocalPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateLocalPagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateLocalPagination();
    }
  }

  refreshData(): void {
    this.allPackagesCache = null;
    this.loadPackages();
  }

  // Método para limpar todo o cache
  clearCache(): void {
    this.allPackagesCache = null;
    console.log('Cache limpo');
  }

  navigateToDetails(id: string) {
    this.router.navigate(['/product-details', id]);
  }
}
