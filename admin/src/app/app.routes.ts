import { Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'

const redirectToLogin = () => redirectUnauthorizedTo(['/auth/login'])
const redirectToDashboard = () => redirectLoggedInTo(['/user'])

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.page').then(m => m.UserPage),
    canActivate: [redirectToLogin],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/user/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'workers',
        loadComponent: () => import('./pages/user/workers/workers.page').then(m => m.WorkersPage),
        children: [
          {
            path: 'active',
            loadComponent: () => import('./pages/user/workers/active/active.page').then(m => m.ActivePage)
          },
          {
            path: 'pending',
            loadComponent: () => import('./pages/user/workers/pending/pending.page').then(m => m.PendingPage)
          },
        ]
      },
    ]
  },

  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage),
    canActivate: [redirectToDashboard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage),
        canActivate: [redirectToDashboard],

      }
      ,
    ]
  },




];
