import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/movie/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { AddEditComponent } from './pages/movie/add-edit/add-edit.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'movies',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create',
    component: AddEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit/:id',
    component: AddEditComponent,
    canActivate: [authGuard],
  },
];
