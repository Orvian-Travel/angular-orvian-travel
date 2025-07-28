import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Header } from '../../shared/components/header/header';
import { CardList } from '../../shared/components/card-list/card-list';
import { PackageService } from '../../services/api/package/package-service';
import { PackageDetail } from '../../services/entities/package.model';
import { SERVICES_TOKEN } from '../../services/services-token';
import { IPackageService } from '../../services/api/package/package-service.interface';

@Component({
  selector: 'app-product-details',
  imports: [Header, CardList, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.PACKAGE, useClass: PackageService }
  ]
})
export class ProductDetails implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    @Inject(SERVICES_TOKEN.HTTP.PACKAGE) private readonly service: IPackageService,
    private route: ActivatedRoute
  ) { }

  package: PackageDetail | null = null;
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
    this.service.getPackageById(id).subscribe((response: PackageDetail) => {
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
