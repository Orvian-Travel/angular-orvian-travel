import { Routes } from '@angular/router';
import { Home } from './pages/home/home/home';
import { ProductDetails } from './pages/product-details/product-details';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Payment } from './pages/payment/payment';
import { LoginAdmin } from './pages/admin/login-admin/login-admin';
import { AdminTela } from './pages/admin/admin-tela/admin-tela';
import { PaymentApproved } from './pages/payment-approved/payment-approved';
import { PaymentRejected } from './pages/payment-rejected/payment-rejected';
import { Reservations } from './pages/reservations/reservations';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'product-details/:id', component: ProductDetails },
  { path: 'register', component: Register },
  { path: 'admin', component: LoginAdmin },

  { path: 'reservations', component: Reservations },

  { path: 'admin-tela', component: AdminTela, canActivate: [AuthGuard] },
  { path: 'payment', component: Payment, canActivate: [AuthGuard] },
  { path: 'payment/approved', component: PaymentApproved, canActivate: [AuthGuard] },
  { path: 'payment/rejected', component: PaymentRejected, canActivate: [AuthGuard] }

];