import { Routes } from '@angular/router';
// Se elimina la importación de @angular/fire/auth-guard
import { isActiveGuard } from './guards/is-active-user.guard';
import { authGuard, publicGuard } from './guards/auth.guard';

// Se eliminan las constantes que usaban los guardias anteriores

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',

  },

  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.page').then(m => m.UserPage),
    // Se reemplaza el guardia de AngularFire por tu authGuard personalizado
    canActivate: [authGuard],
    canMatch: [isActiveGuard],
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
        loadComponent: () => import('./pages/user/pay-periods/pay-periods.page').then(m => m.PayPeriodsPage)
      },
      {
        path: 'work-orders',
        loadComponent: () => import('./pages/user/work-orders/work-orders.page').then(m => m.WorkOrdersPage)
      },
      {
        path: 'work-orders/add/:type',
        loadComponent: () => import('./pages/user/work-orders/add-work-order/add-work-order.page').then(m => m.AddWorkOrderPage)
      },
      {
        path: 'work-orders/request-sign',
        loadComponent: () => import('./pages/user/work-orders/request-sign/request-sign.page').then(m => m.RequestSignPage)
      },
      {
        path: 'work-orders/search',
        loadComponent: () => import('./pages/user/work-orders/search/search.page').then(m => m.SearchPage)
      },

    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/public/public.page').then(m => m.PublicPage),
    // Se reemplaza el guardia de AngularFire por tu publicGuard personalizado
    canActivate: [publicGuard],
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
        loadComponent: () => import('./pages/public/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
      },

    ]

  },
  {
    path: 'not-allowed-user',
    loadComponent: () => import('./pages/public/not-allowed-user/not-allowed-user.page').then(m => m.NotAllowedUserPage),

  },
  {
    path: 'edit-profile-modal',
    loadComponent: () => import('./pages/user/profile/edit-profile-modal/edit-profile-modal.page').then(m => m.EditProfileModalPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/user/dashboard/notifications/notifications.page').then(m => m.NotificationsPage)
  },
  {
    path: 'view-blocks-modal',
    loadComponent: () => import('./components/status-card/view-blocks-modal/view-blocks-modal.page').then(m => m.ViewBlocksModalPage)
  },
  {
    path: 'test',
    loadComponent: () => import('./delete/test/test.page').then(m => m.TestPage)
  },
  {
    path: 'request-gps',
    loadComponent: () => import('./pages/public/request-gps/request-gps.page').then(m => m.RequestGpsPage)
  },
  {
    path: 'modal-add-equipment',
    loadComponent: () => import('./pages/user/work-orders/add-work-order/modal-add-equipment/modal-add-equipment.page').then(m => m.ModalAddEquipmentPage)
  },
  {
    path: 'modal-add-service',
    loadComponent: () => import('./pages/user/work-orders/add-work-order/modal-add-service/modal-add-service.page').then(m => m.ModalAddServicePage)
  },
  {
    path: 'modal-add-materials',
    loadComponent: () => import('./pages/user/work-orders/add-work-order/modal-add-materials/modal-add-materials.page').then(m => m.ModalAddMaterialsPage)
  },
  {
    path: 'select-work-type',
    loadComponent: () => import('./pages/user/work-orders/select-work-type/select-work-type.page').then(m => m.SelectWorkTypePage)
  },
  {
    path: 'sign-pad-modal',
    loadComponent: () => import('./pages/user/work-orders/request-sign/sign-pad-modal/sign-pad-modal.page').then(m => m.SignPadModalPage)
  },
  {
    path: 'search-filters',
    loadComponent: () => import('./pages/user/work-orders/search/search-filters/search-filters.page').then( m => m.SearchFiltersPage)
  },
];