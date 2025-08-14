import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonButton, IonIcon, IonGrid, IonRow,
  IonCol, IonItem, IonFooter, ModalController, IonSegment, IonSegmentButton, IonLabel,
  IonSegmentView, IonSegmentContent, IonInput, IonTextarea
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-modal-add-service',
  templateUrl: './modal-add-service.page.html',
  styleUrls: ['./modal-add-service.page.scss'],
  standalone: true,
  imports: [IonLabel, IonSegmentButton, IonSegment, IonSegmentView,
    IonSegmentContent, IonFooter, IonItem, IonCol, IonRow, IonGrid, IonIcon,
    IonButton, IonButtons, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput,
    IonTextarea
  ]
})
export class ModalAddServicePage implements OnInit {
  @Input() service: any;
  @Input() index!: number;

  mode: 'Add' | 'Edit' = 'Add';

  modalCtrl = inject(ModalController)
  fb = inject(FormBuilder)
  addServiceForm: FormGroup = this.fb.group({})
  constructor() {
    addIcons({ close });
    this.addServiceForm = this.fb.group({
      title: [null, []],
      description: [null, []],
      quantity: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    // 3. Si recibimos un servicio, estamos en modo 'Edit'
    if (this.service) {
      this.mode = 'Edit';
      // Llenamos el formulario con los datos del servicio
      this.addServiceForm.patchValue(this.service);
    }
  }
  save() {
    this.modalCtrl.dismiss({
      service: this.addServiceForm.value,
      mode: this.mode,
      index: this.index
    }, 'confirm');
  }
  closeModal() {
    this.modalCtrl.dismiss()
  }

}
