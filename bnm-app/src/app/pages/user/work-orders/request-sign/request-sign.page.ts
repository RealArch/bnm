import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonSearchbar, IonButtons, IonButton, IonIcon, IonBackButton,
  IonRow, IonCol, IonGrid, IonItem, IonLabel, ModalController,
  LoadingController, IonDatetime, IonText, IonModal, IonDatetimeButton, IonPopover, IonList
} from '@ionic/angular/standalone';
import { WorkOrder, workOrderSignType } from 'src/app/interfaces/work-order';
import { SignPadModalPage } from './sign-pad-modal/sign-pad-modal.page';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { PopupsService } from 'src/app/services/popups.service';
import { ModalAddServicePage } from '../add-work-order/modal-add-service/modal-add-service.page';
import { addIcons } from 'ionicons';
import { createOutline, close, add, calendarOutline } from 'ionicons/icons';
import { ModalAddMaterialsPage } from '../add-work-order/modal-add-materials/modal-add-materials.page';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-request-sign',
  templateUrl: './request-sign.page.html',
  styleUrls: ['./request-sign.page.scss'],
  standalone: true,
  imports: [IonList, IonPopover, IonDatetimeButton, IonModal, IonText, IonDatetime, IonLabel, IonItem, IonGrid, IonCol, IonRow, IonBackButton, IonIcon, IonButton, IonButtons, IonSearchbar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RequestSignPage implements OnInit {
  @Input() workOrder!: WorkOrder;
  modalController = inject(ModalController)
  loadingCtrl = inject(LoadingController)
  workOrdersService = inject(WorkOrdersService)
  popupService = inject(PopupsService)
  newServicesPerformed: any = []
  newMaterialsUsed: any = []
  closeDate: null | string = null;
  constructor() {
    addIcons({ close, createOutline, add, calendarOutline });
  }
  ngOnInit() {
    console.log(this.workOrder)
    //si el tipo es work, llenar closeDate con la fecha actual
    if (this.workOrder.status == 'in-progress' && this.workOrder.startDate) {
      this.closeDate = this.getTodaysDateFormatted();
    }
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
        await this.workOrdersService.uploadSignature(data.signature, this.workOrder.id, this.workOrder.type, signType, this.newMaterialsUsed, this.newServicesPerformed, this.closeDate);
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
  getTodaysDateFormatted() {
    // 1. Crea un objeto Date con la fecha y hora actuales.
    //    `new Date()` es el equivalente a usar Date.now().
    const dateObject = new Date();

    // 2. Extrae los componentes de la fecha (año, mes, día).
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // getMonth() es 0-11, por eso +1
    const day = dateObject.getDate();

    // 3. Construye la cadena 'YYYY-MM-DD' asegurando los dos dígitos para mes y día.
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return formattedDate;
  }
  formatDateForIonTime(timestamp: Timestamp) {
    if (!timestamp) {
      return ''; // Devuelve una cadena vacía si no hay timestamp
    }

    // Convierte el timestamp de Firebase a un objeto Date de JavaScript
    const dateObject = timestamp.toDate();

    // --- INICIO DE LA CORRECCIÓN ---
    // En lugar de usar .toISOString(), construimos la fecha manualmente.

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // getMonth() es 0-11, por eso +1
    const day = dateObject.getDate();

    // Usamos .padStart(2, '0') para asegurar el formato MM y DD (ej: 08, 09)
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return formattedDate;
  }
  formatDate(event: any) {
   // Obtenemos el valor UTC directamente del evento
    const dateValueFromPicker = event.detail.value;

    if (dateValueFromPicker) {
      const dateObject = new Date(dateValueFromPicker);

      // --- INICIO DE LA CORRECCIÓN CLAVE ---
      // Usamos los métodos UTC para evitar que la zona horaria local reste un día.
      const year = dateObject.getUTCFullYear();
      const month = dateObject.getUTCMonth() + 1; // getUTCMonth() también es 0-11
      const day = dateObject.getUTCDate();
      // --- FIN DE LA CORRECCIÓN CLAVE ---

      // Formateamos y asignamos el valor a nuestra variable una sola vez
      this.closeDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      console.log('Fecha formateada y asignada:', this.closeDate);
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
