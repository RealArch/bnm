import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { inject } from '@angular/core'; // Import 'inject'
import { Auth } from '@angular/fire/auth'; // Assuming you are using AngularFire Auth

// Define your functional interceptor
export const authInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  console.log('Intercepting request:', request.url);

  // Inject the Auth service
  const auth = inject(Auth);

  // Use 'of' to wrap the current user from auth.currentUser
  return of(auth.currentUser).pipe(
    switchMap(user => {
      if (user) {
        // If there's a user, get the ID token
        return from(user.getIdToken(true)).pipe(
          switchMap(idToken => {
            // Clone the request and add the Authorization header
            const clonedRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${idToken}`
              }
            });
            // Continue with the modified request
            return next(clonedRequest); // Use next(clonedRequest) directly
          })
        );
      } else {
        // If no user, continue with the original request
        return next(request); // Use next(request) directly
      }
    })
  );
};