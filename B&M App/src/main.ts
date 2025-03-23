import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectAuthEmulator, getAuth, provideAuth, indexedDBLocalPersistence, initializeAuth, Auth } from '@angular/fire/auth';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Capacitor } from '@capacitor/core';

let firestoreHost ='localhost'
let authHost = 'localhost'
if (Capacitor.getPlatform() === 'android') {
  console.log('Android!')
  firestoreHost = '10.0.2.2';
  authHost = '10.0.2.2';
}




bootstrapApplication(AppComponent, {
  providers: [
    DatePipe, TitleCasePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

    provideFirestore(() => {
      if (environment.useEmulators) {
        var host = 'localhost'
        if (Capacitor.getPlatform() === 'android')  host ='10.0.2.2';
        const firestore = getFirestore();
        connectFirestoreEmulator(firestore, host, 8080)
        return firestore
      } else {
        return getFirestore()
      }

    }),

    //AUTHENTICATION INIT
    provideAuth(() => {
      //IMPORTANT TO SET  PERSISTENCE IN NATIVE ENVIROMENTS FOR AUTH> IF NOT CRASHES
      let auth: Auth;

      if (Capacitor.isNativePlatform()) {
        console.log('Running on native platform, using indexedDBLocalPersistence.');
        auth = initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence
        });
      } else {
        console.log('Running on web, using getAuth().');
        auth = getAuth();
      }

      if (environment.useEmulators) {
        const authHost = Capacitor.getPlatform() === 'android' ? 'http://10.0.2.2:9099' : 'http://localhost:9099';
        console.log(`Using Auth Emulator at ${authHost}`);
        connectAuthEmulator(auth, authHost);
      }

      return auth;
      // if (environment.useEmulators) {
      //   var host = 'http://localhost:9099'

      //   if (Capacitor.getPlatform() === 'android')  host ='http://10.0.2.2:9099';
      //   console.log('usando dev' + ' ' + host)

      //   const fireauth = getAuth();
      //   connectAuthEmulator(fireauth, host);
      //   return fireauth;
      // } else { 
      //   console.log('usando prod')

      //   return getAuth(); 
      // }


      // if (Capacitor.isNativePlatform()) {
			// 	return initializeAuth(getApp(), {
			// 		persistence: indexedDBLocalPersistence
			// 	});
			// } else {
			// 	return getAuth();
			// }
    }),
  ],
});

