import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonSearchbar, IonButtons, IonButton, IonIcon, IonBackButton,
  IonRow, IonCol, IonGrid, IonItem, IonLabel, ModalController,
  LoadingController
} from '@ionic/angular/standalone';
import { WorkOrder, workOrderSignType } from 'src/app/interfaces/work-order';
import { SignPadModalPage } from './sign-pad-modal/sign-pad-modal.page';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { PopupsService } from 'src/app/services/popups.service';
import { ModalAddServicePage } from '../add-work-order/modal-add-service/modal-add-service.page';
import { addIcons } from 'ionicons';
import { createOutline, close, add } from 'ionicons/icons';
import { ModalAddMaterialsPage } from '../add-work-order/modal-add-materials/modal-add-materials.page';

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
  newServicesPerformed: any = []
  newMaterialsUsed: any = []
  constructor() {
    addIcons({ close, createOutline, add });
  }
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
        //Identificar signType
        var signType: workOrderSignType = 'closeSign'
        if (this.workOrder.type == 'pickup') {
          if (this.workOrder.openSign.img == null) {
            signType = 'openSign'
          }
        }
        //SAVE ALL NEW DATA ALONG SIGNATURE
        await this.workOrdersService.uploadSignature(data.signature, this.workOrder.id, this.workOrder.type, signType, this.newMaterialsUsed, this.newServicesPerformed);
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

  removeService(index: number) {
    this.newServicesPerformed.splice(index, 1)
  }
  removeMaterial(index: number) {
    this.newMaterialsUsed.splice(index, 1)
  }
  //SERVICES MODAL
  async openServiceModal(service: any = null, index: any = null) {


    const modal = await this.modalController.create({
      component: ModalAddServicePage,
      // 2. Pasamos los datos al modal. Si service es nulo, el modal sabrá que es para añadir.
      componentProps: {
        service: service,
        index: index
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      if (data.mode === 'Add') {
        this.newServicesPerformed.push(data.service);
      } else {
        this.newServicesPerformed[index] = data.service
      }

    }
  }

  //MATERIAL MODAL
  async openMaterialModal(material: any = null, index: any = null) {


    const modal = await this.modalController.create({
      component: ModalAddMaterialsPage,
      componentProps: {
        material: material,
        index: index
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      // 3. Verificamos e l modo para saber si añadir o actualizar
      if (data.mode === 'Add') {
        // Añadimos un nuevo servicio al FormArray
        this.newMaterialsUsed.push(data.material);
      } else { // Si el modo es 'Edit'
        // Actualizamos el servicio existente en el FormArray
        this.newMaterialsUsed[index] = data.material
      }
    }
  }



}
