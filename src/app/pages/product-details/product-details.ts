import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Header } from '../../shared/components/header/header';
import { CardList } from '../../shared/components/card-list/card-list';
import { Package as PackageService } from '../../services/api/package/package';
import { Package as PackageEntity } from '../../services/entities/package';

@Component({
  selector: 'app-product-details',
  imports: [Header, CardList, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit, OnDestroy {
  constructor(private router: Router, private service: PackageService, private route: ActivatedRoute) {}

  package: PackageEntity | null = null;
  private routeSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPackage(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private loadPackage(id: string): void {
    this.package = null;
    this.service.getPackageById(id).subscribe((response: PackageEntity) => {
      this.package = response;
    });
  }

  navigateToDetails() {
    this.router.navigate(['/payment']);
  }

  paymentRedirect(): void {
    this.router.navigate(['/payment']);
  }

  registerRedirect(): void {
    this.router.navigate(['/payment']);
  }
}
