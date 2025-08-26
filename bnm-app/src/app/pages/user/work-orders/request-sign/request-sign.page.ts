import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonSearchbar, IonButtons, IonButton, IonIcon, IonBackButton,
  IonRow, IonCol, IonGrid, IonItem, IonLabel, ModalController,
  LoadingController
} from '@ionic/angular/standalone';
import { WorkOrder } from 'src/app/interfaces/work-order';
import { SignPadModalPage } from './sign-pad-modal/sign-pad-modal.page';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { PopupsService } from 'src/app/services/popups.service';

@Component({
  selector: 'app-request-sign',
  templateUrl: './request-sign.page.html',
  styleUrls: ['./request-sign.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonGrid, IonCol, IonRow, IonBackButton, IonIcon, IonButton, IonButtons, IonSearchbar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RequestSignPage implements OnInit {
  @Input() workOrder!: WorkOrder;
  modalController = inject(ModalController)
  loadingCtrl = inject(LoadingController)
  workOrdersService = inject(WorkOrdersService)
  popupService = inject(PopupsService)
  type = "work"

  constructor() { }

  ngOnInit() {
    console.log(this.workOrder)
  }
  dismiss() {
    this.modalController.dismiss()
  }
  async openSignatureModal() {
    const modal = await this.modalController.create({
      component: SignPadModalPage,
      cssClass: 'full-landscape-modal',
      backdropDismiss: false,
      animated: false
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.signature) {
      const loading = await this.loadingCtrl.create({
        message: 'Uploading Signature...',
      });
      await loading.present();

      try {
        await this.workOrdersService.uploadSignature(data.signature, this.workOrder.id, this.workOrder.type);
        this.popupService.presentToast("bottom", "success", "Work order signed successfully");
        this.dismiss()
      } catch (error) {
        this.popupService.presentToast("bottom", "danger", "Something went wrong while trying to sign the work order. Please try again.");
        console.error('Error al guardar firma:', error);
      } finally {
        loading.dismiss();
      }
    }
  }



}
