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
import { provideHttpClient } from '@angular/common/http'
import { DatePipe } from '@angular/common';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    provideIonicAngular({
      innerHTMLTemplatesEnabled: true
    }),
    provideRouter(routes),
    //FIREBASE INIT
    importProvidersFrom(
      provideFirebaseApp(
        () => initializeApp(environment.firebaseConfig)
      )),

    //  if(environment.useEmulators) {

    //   const firestore = getFirestore();
    //   connectFirestoreEmulator(firestore, 'localhost', 8080);
    //   enableIndexedDbPersistence(firestore);
    //   return firestore;
    // } else {
    //   getFirestore();
    // }

    importProvidersFrom(provideFirestore(() => {
      if (environment.useEmulators) {
        const firestore = getFirestore();
        connectFirestoreEmulator(firestore, 'localhost', 8080)
        return firestore
      } else {
        return getFirestore()
      }
    })),

    //AUTHENTICATION INIT
    importProvidersFrom(provideAuth(() => {
      if (environment.useEmulators) {
        const fireauth = getAuth();
        connectAuthEmulator(fireauth, 'http://localhost:9099');
        return fireauth;
      } else { return getAuth(); }
    })),
    // importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
});
