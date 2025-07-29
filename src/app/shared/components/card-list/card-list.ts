import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PackageService } from '../../../services/api/package/package-service';
import { PagedResponse } from '../../../services/entities/paged-response.model';
import { SERVICES_TOKEN } from '../../../services/services-token';
import { PackageDetail } from '../../../services/entities/package.model';
import { IPackageService } from '../../../services/api/package/package-service.interface';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.PACKAGE, useClass: PackageService }
  ]
})
export class CardList implements OnInit {
  constructor(private router: Router, @Inject(SERVICES_TOKEN.HTTP.PACKAGE) private readonly service: IPackageService) {

  }
  packages: PackageDetail[] = [];
  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;
  totalElements: number = 0;

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(page: number = 0): void {
    this.service.getAllPackagesWithPagination(page, this.pageSize).subscribe((response: PagedResponse<PackageDetail>) => {
      this.packages = response._embedded.DTOList;
      if (response.page) {
        this.currentPage = response.page.number;
        this.totalPages = response.page.totalPages;
        this.totalElements = response.page.totalElements;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadPackages(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadPackages(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadPackages(page);
    }
  }

  navigateToDetails(id: string) {
    this.router.navigate(['/product-details', id]);
  }
}
