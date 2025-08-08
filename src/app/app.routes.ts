import { Routes } from '@angular/router';
import { Home } from './pages/home/home/home';
import { ProductDetails } from './pages/product-details/product-details';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Payment } from './pages/payment/payment';
import { AdminTela } from './pages/admin/admin-tela/admin-tela';
import { PaymentApproved } from './pages/payment-approved/payment-approved';
import { Reservations } from './pages/reservations/reservations';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { PaymentPending } from './pages/payment-pending/payment-pending';
import { AdminDashboard } from '@pages/admin/admin-dashboard/admin-dashboard';
import { AdminUsers } from '@pages/admin/admin-users/admin-users';
import { AdminPackages } from '@pages/admin/admin-packages/admin-packages';
import { Faq } from '@pages/faq/faq';
import { AboutComponent } from './pages/about/about';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'product-details/:id', component: ProductDetails },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:token', component: ResetPassword },
  { path: 'about', component: AboutComponent },

  { path: 'reservations', component: Reservations, canActivate: [authGuard] },

  // { path: 'admin-tela', component: AdminTela, canActivate: [authGuard, adminGuard] },
  { path: 'payment', component: Payment, canActivate: [authGuard] },
  { path: 'payment/approved', component: PaymentApproved, canActivate: [authGuard] },
  { path: 'payment/pending', component: PaymentPending, canActivate: [authGuard] },

  { path: 'faq', component: Faq },

  {
    path: 'admin',
    component: AdminTela,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'packages', component: AdminPackages },
    ]
  }

];  