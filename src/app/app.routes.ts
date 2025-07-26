import { Routes } from '@angular/router';
import { Home } from './home/home/home';
import { Login } from './login/login';
import { ProductDetails } from './product-details/product-details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login},
  { path: 'product-details', component: ProductDetails}
];
