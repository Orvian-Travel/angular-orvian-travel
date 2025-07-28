import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Package as PackageEntity } from '../../../services/entities/package';
import { Package as PackageService } from '../../../services/api/package/package';

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

  ngOnInit(): void {
    this.service.getAllPackages().subscribe((response: PackageEntity[]) => this.packages = response);
  }



  navigateToDetails(){
    this.router.navigate(['/product-details']);
  }
}
