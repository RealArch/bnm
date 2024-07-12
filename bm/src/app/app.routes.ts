import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const redirectToHome = () => redirectUnauthorizedTo(['/auth/login'])
const redirectToDashboard = () => redirectLoggedInTo(['/user'])

// const initialDataResolver: ResolveFn<any> = async (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot,

// ) => {
//   var authService = inject(AuthService)
//    return authService.getAuthState().subscribe(auth => {
//     return authService.getUserData(auth!.uid).subscribe(userData=>{
//       return 'hola';

//     })
//   })
//   //get uid

//   //
// };


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
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/user/profile/profile.page').then(m => m.ProfilePage)
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
    ]
  },






];
