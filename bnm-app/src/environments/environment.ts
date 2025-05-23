// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Capacitor } from "@capacitor/core";

export const environment = {
  production: false,
  useEmulators: true,

  api: getApiUrl(),
  firebaseConfig: {
    apiKey: "AIzaSyA0LMo7LR0QcHf_ZOy5ozuG_KT4hnGx51k",
    authDomain: "bnm-01-abd4b.firebaseapp.com",
    projectId: "bnm-01-abd4b",
    storageBucket: "bnm-01-abd4b.appspot.com",
    messagingSenderId: "1040575377552",
    appId: "1:1040575377552:web:98ae956ea87d7840766815",
    measurementId: "G-DQB4L8VBDE"
  },
  //ALGOLIA CONFIG
  algolia: {
    appID: 'CKJQ46D11T',
    searchKey: '020bc175a201a0515a5a52f951e1fb54',
    indexes: {
      customers: 'customers_dev',
      paycheckHistory: 'paycheckHistory_dev'
    }
  }
};
export function getApiUrl(): string {
  const platform = Capacitor.getPlatform();
  switch (platform) {
    case 'android':
      console.log('andorid')
      // return 'http://localhost:5001/bnm-01-abd4b/us-central1/api'
      // return 'http://10.0.2.2:5001/bnm-01-abd4b/us-central1/api'; // Para emulador Android

    return 'http://192.168.50.46:5001/bnm-01-abd4b/us-central1/api'; // para android. poner direccion ip de la pc
    case 'ios':
      return 'http://localhost:5001/bnm-01-abd4b/us-central1/api'; // Para emulador iOS
    case 'web':
      console.log('web')

      return 'http://localhost:5001/bnm-01-abd4b/us-central1/api'; // Web con ngrok
    default:
      return 'http://localhost:5001/bnm-01-abd4b/us-central1/api'; // Fallback
  }
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
