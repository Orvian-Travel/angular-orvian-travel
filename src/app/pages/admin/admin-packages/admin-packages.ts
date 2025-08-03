import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PackageDetail } from '@services/entities/package.model';
import { SERVICES_TOKEN } from '@services/services-token';
import { IPackageService } from '@services/api/package/package-service.interface';
import { PagedResponse } from '@services/entities/paged-response.model';
import { PackageService } from '@services/api/package/package-service';

interface Package {
  id: number;
  destination: string;
  price: number;
  duration: string;
  status: string;
  description: string;
  image: string;
}

interface DateEntry {
  startDate: string;
  endDate: string;
  availableReservations: number;
}

@Component({
  selector: 'app-admin-packages',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-packages.html',
  styleUrl: './admin-packages.css',
  providers: [
    {
      provide: SERVICES_TOKEN.HTTP.PACKAGE,
      useClass: PackageService
    }
  ]
})
export class AdminPackages implements OnInit {
  packages: PackageDetail[] = [];
  selectedPackage: PackageDetail | null = null;
  selectedImageFile: File | null = null;

  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  currentStep = 1;
  tempPackageData: any = {};
  currentEditStep = 1; 
  tempEditPackageData: any = {};
  
  packageDates: DateEntry[] = [];
  editPackageDates: DateEntry[] = [];

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.PACKAGE)
    private readonly packageService: IPackageService
  ){
  }

  ngOnInit() {
    this.loadPackages();
  }

  private loadPackages() {
    this.packageService.getAllPackagesWithPagination(this.currentPage, this.pageSize)
    .subscribe({
      next: (response: PagedResponse<PackageDetail>) => {
        this.packages = response._embedded.DTOList;
        this.totalPages = response.page?.totalElements!;
        this.totalPages = response.page?.totalPages!;
      },
      error: (error) => {
        console.error('Erro ao carregar pacotes:', error);
        alert('Erro ao carregar pacotes. Por favor, tente novamente mais tarde.');
      }
    });
  }

    nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPackages();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPackages();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadPackages();
    }
  }

  getPageNumbers(): number[] {
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(0, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goBackToForm() {
    this.currentStep = 1;
  }

  resetModal() {
    this.currentStep = 1;
    this.tempPackageData = {};
    this.selectedImageFile = null;
    this.packageDates = [];
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('pt-BR');
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatDateBrazilian(dateString: string): string {
    if (!dateString) return '';
    
    // Se for no formato ISO (yyyy-mm-dd), adiciona horário para evitar problemas de timezone
    const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T12:00:00');
    
    // Formata especificamente no padrão brasileiro dd/mm/yyyy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  formatCurrencyBrazilian(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatNumberBrazilian(value: number): string {
    if (!value) return '0';
    return value.toLocaleString('pt-BR');
  }
}
