import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ModalController, AlertController, } from '@ionic/angular/standalone';
import { navigate, navigateCircle } from 'ionicons/icons'
import { addIcons } from 'ionicons';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, IOSSettings, AndroidSettings } from 'capacitor-native-settings';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-request-gps',
  templateUrl: './request-gps.page.html',
  styleUrls: ['./request-gps.page.scss'],
  standalone: true,
  imports: [FormsModule, IONIC_STANDALONE_MODULES]
})
export class RequestGpsPage implements OnInit {
  modalController = inject(ModalController)
  alertController = inject(AlertController)

  constructor() {
    addIcons({ navigateCircle })

  }

  ngOnInit() {
  }
  async requestGps() {
    try {
      const permissionStatus = await Geolocation.checkPermissions()
      //Chequear si los permisos se han solicitado antes
      console.log(permissionStatus.location)
      //Si no estan concedidos




      if (permissionStatus.location === 'denied') {


        console.log('❌ El usuario rechazó los permisos de ubicación.');
        this.alertOpenConfig()
        // Mostrar mensaje con botón para abrir Configuración

        
      } else if (permissionStatus.location === 'prompt-with-rationale') {
        console.log('⚠️ El sistema bloqueó la solicitud automática porque ya fue denegada.');
        // Mostrar mensaje explicando que debe ir a Configuración
      
      
      } else if (permissionStatus.location === 'granted') {
        console.log('✅ Permisos otorgados.');
        return this.modalController.dismiss()
        // Puedes proceder con la funcionalidad de ubicación
      
      
      } else if (permissionStatus.location === 'prompt') {
        console.log('📌 El permiso nunca se ha solicitado antes.');
        // Puedes solicitar los permisos normalmente
        const requestResult = await Geolocation.requestPermissions();//Solicitar
        console.log('Resultado de la solicitud:', requestResult);

        if (requestResult.location === 'granted') {//Si se solicitaron y se aceptaron
          console.log('Permisos concedidos');
          return this.modalController.dismiss()

        } else {//Si se solicitaron y se rechazaron
          console.log('Permisos denegados');
          return;
        }

      }






      // if (permissionStatus.location !== 'granted') {
      //   const requestResult = await Geolocation.requestPermissions();//Solicitar
      //   console.log('Resultado de la solicitud:', requestResult);

      //   if (requestResult.location === 'granted') {//Si se solicitaron y se aceptaron
      //     console.log('Permisos concedidos');
      //     return this.modalController.dismiss()

      //   } else {//Si se solicitaron y se rechazaron
      //     console.log('Permisos denegados');
      //     return;
      //   }
      // } else {
      //   return this.modalController.dismiss()

      // }
    } catch (error) {
      return console.log(error)
    }
  }
  //ALERTS

  async alertOpenConfig() {
    const alert = await this.alertController.create({
      header: "Location Access Required",
      message: "You have previously denied location access. To use this feature, please enable location services in Settings.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return this.modalController.dismiss()
          },
        },
        {
          text: 'Open settings',
          role: 'confirm',
          handler: async () => {

            if (Capacitor.getPlatform() === 'ios') {
              await NativeSettings.openIOS({
                option: IOSSettings.App // Abre Settings > TuApp
              });
            } else if (Capacitor.getPlatform() === 'android') {
              await NativeSettings.openAndroid({
                option: AndroidSettings.ApplicationDetails // Abre Settings > TuApp
              });
            }

          },
        },
      ]
    })
    alert.present()
  }

}
