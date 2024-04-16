import { Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'

const redirectToHome = () => redirectUnauthorizedTo(['/auth/login'])
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
    ...canActivate(redirectToHome),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/user/dashboard/dashboard.page').then(m => m.DashboardPage),
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/public/public.page').then(m => m.PublicPage),
    ...canActivate(redirectToDashboard),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/public/login/login.page').then(m => m.LoginPage)
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/public/signup/signup.page').then(m => m.SignupPage)
      },
    ]
  },





];
