import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/auth/dashboard/dashboard.component';
import { BinanceListComponent } from './pages/binance/binance-list.component';
import { LoginSuccessComponent } from './pages/auth/login/google.success.component';
import { AuthGuard } from './guards/auth-guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'binance-list',
    component: BinanceListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login-success',
    component: LoginSuccessComponent
  },


];
