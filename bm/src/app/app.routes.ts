import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'public',
    loadComponent: () => import('./pages/public/public.page').then( m => m.PublicPage),
    children:[
      {
        path: 'login',
        loadComponent: () => import('./pages/public/login/login.page').then( m => m.LoginPage)
      }
    ]
  },
  
];
