import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/http-token.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideIonicAngular(),
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(
        () => initializeApp(environment.firebaseConfig)
      )),
    importProvidersFrom(provideAuth(() => {
      if (environment.useEmulators) {
        const fireauth = getAuth();
        connectAuthEmulator(fireauth, 'http://localhost:9099');
        return fireauth;
      } else { return getAuth(); }
    })),
    importProvidersFrom(provideFirestore(() => {
      if (environment.useEmulators) {

        const firestore = getFirestore();
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        return firestore;
      } else {
        return getFirestore();
      }
    })),

  ],
});
