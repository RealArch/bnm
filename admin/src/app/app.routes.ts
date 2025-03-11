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
        redirectTo: 'pay-periods',
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
      {
        path: 'shifts',
        loadComponent: () => import('./pages/user/shifts/shifts.page').then(m => m.ShiftsPage)
      },
      {
        path: 'pay-periods',
        loadComponent: () => import('./pages/user/pay-periods/pay-periods.page').then(m => m.PayPeriodsPage)
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/user/customers/customers.page').then( m => m.CustomersPage)
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
  {
    path: 'user-accordion',
    loadComponent: () => import('./pages/user/pay-periods/user-accordion/user-accordion.page').then( m => m.UserAccordionPage)
  },
  {
    path: 'add-customer-modal',
    loadComponent: () => import('./pages/user/customers/add-customer-modal/add-customer-modal.page').then( m => m.AddCustomerModalPage)
  },
  {
    path: 'edit-and-activate-modal',
    loadComponent: () => import('./components/item-user/edit-and-activate-modal/edit-and-activate-modal.page').then( m => m.EditAndActivateModalPage)
  },
  {
    path: 'edit-user',
    loadComponent: () => import('./components/item-user/edit-user/edit-user.page').then( m => m.EditUserPage)
  },
 











];
