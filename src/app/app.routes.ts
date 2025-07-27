import { Routes } from '@angular/router';
import { Home } from './pages/home/home/home';
import { ProductDetails } from './pages/product-details/product-details';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Payment } from './pages/payment/payment';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login},
  { path: 'product-details', component: ProductDetails},
  { path: 'register', component: Register},
  { path: 'payment', component: Payment}
];
