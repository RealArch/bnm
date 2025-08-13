import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonDatetimeButton, IonDatetime, IonPopover, IonInput, IonText,
  IonSelect, IonSelectOption, IonButton, IonIcon, ModalController, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons'
import { ModalAddEquipmentPage } from './modal-add-equipment/modal-add-equipment.page';
@Component({
  selector: 'app-add-work-order',
  templateUrl: './add-work-order.page.html',
  styleUrls: ['./add-work-order.page.scss'],
  standalone: true,
  imports: [ IonIcon, IonButton, IonText,  IonPopover, IonDatetime, 
    IonDatetimeButton, IonLabel, IonItem, IonCol, IonRow, IonGrid, 
    IonButtons, IonBackButton,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, ReactiveFormsModule, IonSelect, IonSelectOption,
  ]
})
export class AddWorkOrderPage implements OnInit {
  modalCtrl = inject(ModalController)
  fb = inject(FormBuilder)
  addWorkOrderForm: FormGroup = this.fb.group({})

  constructor() {
    addIcons({close,add});
    this.addWorkOrderForm = this.fb.group({
      startDate: [null, [Validators.required]],
      closeDate: [null, [Validators.required]],
      billTo: [null, [Validators.required]],
      notedEquipments: this.fb.array([])

    })
  }

  ngOnInit() {
    console.log('a')
  }
  get notedEquipments() {
    return this.addWorkOrderForm.get('notedEquipments') as FormArray;
  }
  removeEquipment(index:number){
    this.notedEquipments.removeAt(index)
  }

  async openAddEquipmentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAddEquipmentPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('cerre')
    if (role === 'confirm') {
      this.notedEquipments.push(this.fb.control(data));
      console.log(this.notedEquipments)
    }
  }


}
