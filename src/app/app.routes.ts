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
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'product-details/:id', component: ProductDetails },
  { path: 'register', component: Register },
  { path: 'admin', component: LoginAdmin },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:token', component: ResetPassword },

  { path: 'reservations', component: Reservations },

  { path: 'admin-tela', component: AdminTela, canActivate: [authGuard, adminGuard] },
  { path: 'payment', component: Payment, canActivate: [authGuard] },
  { path: 'payment/approved', component: PaymentApproved, canActivate: [authGuard] },
  { path: 'payment/rejected', component: PaymentRejected, canActivate: [authGuard] }

];