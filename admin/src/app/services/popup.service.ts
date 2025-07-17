import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController  

  ) {
    addIcons({closeOutline})
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

    async boolAlert(header: string,message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-cancel-button',
        handler: () => {
        },
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
        },
      }],
    });

    await alert.present();
     const { role } = await alert.onDidDismiss();
     return role === 'confirm';
  }
}
