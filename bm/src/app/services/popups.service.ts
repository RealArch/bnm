import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular'
import { closeOutline } from 'ionicons/icons'
import { addIcons } from 'ionicons';
@Injectable({
  providedIn: 'root'
})
export class PopupsService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ closeOutline });
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', color: string, msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 6000,
      position: position,
      color: color,
      swipeGesture: "vertical",
      buttons: [{
        icon: "close-outline"
      }]
    });

    await toast.present();
  }

  async presentAlert(header:string, message:string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok'],
      backdropDismiss:false,
      
    });

    await alert.present();
  }
  
}
