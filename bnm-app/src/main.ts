import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { environment } from './environments/environment';

// Firebase Imports
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth, indexedDBLocalPersistence, initializeAuth, Auth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';

import { Capacitor } from '@capacitor/core';

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe, TitleCasePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({innerHTMLTemplatesEnabled: true}),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

    // FIRESTORE INIT
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        // Use the specific IP for Android emulator, otherwise localhost
        const host = Capacitor.getPlatform() === 'android' ? '192.168.50.131' : 'localhost';
        console.log(`Using Firestore Emulator at ${host}:8080`);
        connectFirestoreEmulator(firestore, host, 8080);
      }
      return firestore;
    }),

    // AUTHENTICATION INIT
    provideAuth(() => {
      let auth: Auth;

      // Set persistence for native environments to prevent crashes
      if (Capacitor.isNativePlatform()) {
        console.log('Running on native platform, using indexedDBLocalPersistence.');
        auth = initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence
        });
      } else {
        console.log('Running on web, using default persistence.');
        auth = getAuth();
      }

      if (environment.useEmulators) {
        // For Auth emulator, the URL needs the protocol
        const authHost = Capacitor.getPlatform() === 'android' ? 'http://192.168.50.131:9099' : 'http://localhost:9099';
        console.log(`Using Auth Emulator at ${authHost}`);
        connectAuthEmulator(auth, authHost);
      }

      return auth;
    }),

    // STORAGE INIT
    provideStorage(() => {
      const storage = getStorage();
      if (environment.useEmulators) {
        // Use the specific IP for Android emulator, otherwise localhost
        const host = Capacitor.getPlatform() === 'android' ? '192.168.50.131' : 'localhost';
        const port = 9199; // Default port for Storage emulator
        console.log(`Using Storage Emulator at ${host}:${port}`);
        connectStorageEmulator(storage, host, port);
      }
      return storage;
    }),
  ],
});
