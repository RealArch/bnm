import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { isActiveGuard } from './guards/is-active-user.guard';

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
    canMatch: [isActiveGuard,],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/user/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/user/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'pay-periods',
        loadComponent: () => import('./pages/user/pay-periods/pay-periods.page').then( m => m.PayPeriodsPage)
      },
    

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
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/public/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
      },

    ]

  },
  {
    path: 'not-allowed-user',
    loadComponent: () => import('./pages/public/not-allowed-user/not-allowed-user.page').then(m => m.NotAllowedUserPage),
    
  },
  {
    path: 'edit-profile-modal',
    loadComponent: () => import('./pages/user/profile/edit-profile-modal/edit-profile-modal.page').then( m => m.EditProfileModalPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/user/dashboard/notifications/notifications.page').then( m => m.NotificationsPage)
  },
  {
    path: 'view-blocks-modal',
    loadComponent: () => import('./components/status-card/view-blocks-modal/view-blocks-modal.page').then( m => m.ViewBlocksModalPage)
  },
  {
    path: 'test',
    loadComponent: () => import('./delete/test/test.page').then( m => m.TestPage)
  },
  {
    path: 'request-gps',
    loadComponent: () => import('./pages/public/request-gps/request-gps.page').then( m => m.RequestGpsPage)
  },











];
