import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import the guard

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },

  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'items/:id/view',
    loadComponent: () => import('./view/view-item.component').then(m => m.ViewItemComponent),
    canActivate: [AuthGuard]
  },

  {
  path: 'items/:id/edit',
  loadComponent: () => import('./edit-item/edit-item.component').then(m => m.EditItemComponent),
  canActivate: [AuthGuard]
  },

  {
    path: 'add-category',
    loadComponent: () => import('./category-add/category-add.component').then(m => m.CategoryAddComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-item',
    loadComponent: () => import('./add-item/add-item.component').then(m => m.AddItemComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-reduce',
    loadComponent: () => import('./add-reduce/add-reduce.component').then(m => m.AddReduceComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    loadComponent: () => import('./transaction-list/transaction-list.component').then(m => m.TransactionListComponent),
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: 'login' }
];
