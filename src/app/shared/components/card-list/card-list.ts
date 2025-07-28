import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Package as PackageEntity } from '../../../services/entities/package';
import { Package as PackageService } from '../../../services/api/package/package';
import { PagedResponse } from '../../../services/entities/paged-response';

@Component({
  selector: 'app-card-list',
  imports: [CommonModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css'
})
export class CardList implements OnInit {
    constructor(private router: Router, private service: PackageService ){

  }
    packages: PackageEntity[] = [];
    currentPage: number = 0;
    pageSize: number = 6;
    totalPages: number = 0;
    totalElements: number = 0;

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(page: number = 0): void {
    this.service.getAllPackagesWithPagination(page, this.pageSize).subscribe((response: PagedResponse) => {
      this.packages = response._embedded.packageSearchResultDTOList;
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

  navigateToDetails(id: string){
    this.router.navigate(['/product-details', id]);
  }
}
