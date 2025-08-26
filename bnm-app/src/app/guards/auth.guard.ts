import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth'; // Importa Auth y authState
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth: Auth = inject(Auth); // Inyecta la instancia de Auth correcta
  const router = inject(Router);

  return authState(auth).pipe( // Usa el authState de la instancia inyectada
    take(1),
    map(user => !!user), // Comprueba si el usuario existe
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        // Si no está logueado, redirige a la página de login
        router.navigate(['/auth/login']);
      }
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const auth: Auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map(user => !user), // Comprueba si el usuario NO existe
    tap(isLoggedOut => {
      if (!isLoggedOut) {
        // Si ya está logueado, redirige al dashboard
        router.navigate(['/user/dashboard']);
      }
    })
  );
};