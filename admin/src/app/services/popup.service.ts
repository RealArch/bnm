import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private toastController: ToastController,

  ) { }
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
}
