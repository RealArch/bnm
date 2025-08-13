import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonButton, IonIcon,
  ModalController, IonFooter, IonGrid, IonRow, IonCol, IonItem, IonInput, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-modal-add-equipment',
  templateUrl: './modal-add-equipment.page.html',
  styleUrls: ['./modal-add-equipment.page.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonCol,
     IonRow, IonGrid, IonFooter, IonIcon,
     IonButton, IonButtons, IonContent,
      IonHeader, IonTitle, IonToolbar, 
      CommonModule, FormsModule, ReactiveFormsModule]
})
export class ModalAddEquipmentPage implements OnInit {
  modalCtrl = inject(ModalController)
  fb = inject(FormBuilder)
  addEquipmentForm: FormGroup = this.fb.group({})
  constructor() {
    addIcons({ close });
    this.addEquipmentForm = this.fb.group({
      make: [null, []],
      model: [null, []],
      serialNumber: [null, []],
      equipmentNumber: [null, []],
    })
  }

  ngOnInit() {
  }
  save(){
    this.modalCtrl.dismiss(this.addEquipmentForm.value, 'confirm');
  }
  closeModal() {
    this.modalCtrl.dismiss()
  }
}
