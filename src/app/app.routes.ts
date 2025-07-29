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

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login},
  { path: 'product-details/:id', component: ProductDetails},
  { path: 'register', component: Register},
  { path: 'payment', component: Payment},
  { path: 'admin', component: LoginAdmin},
<<<<<<< HEAD
  { path: 'admin-tela', component: AdminTela},
  { path: 'payment/approved', component: PaymentApproved}
=======

  { path: 'payment/approved', component: PaymentApproved},
  { path: 'payment/rejected', component: PaymentRejected }
>>>>>>> 117cfc2691ecf846f814cce750f1aabb2daf3e01
];