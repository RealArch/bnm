import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
import { resize } from 'ionicons/icons';

const config: CapacitorConfig = {
  appId: 'com.bnm.app',
  appName: 'bnm app',
  webDir: 'www',
  // server: {
  //   androidScheme: 'http',
  //   cleartext: true,
  //   url: "http://192.168.50.46:8100",
  // },
  android: {
    allowMixedContent: true
  },
  ios:{
    appendUserAgent: 'Mobile',
    scrollEnabled: false
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Native,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: "Default", // O "Light" o "Dark" según el tema
      // overlaysWebView: false, // Evita que el status bar se superponga al contenido
      backgroundColor: '#3880ff'
    }
  }
};
//TODO ELIMINAR SERVER Y ANDORID AL COMPILAR PRODUCION

export default config;
