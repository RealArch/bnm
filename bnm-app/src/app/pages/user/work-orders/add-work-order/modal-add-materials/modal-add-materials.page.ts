import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonIcon, IonGrid, IonRow, IonCol, IonItem, IonFooter, ModalController,
  IonInput

} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-modal-add-materials',
  templateUrl: './modal-add-materials.page.html',
  styleUrls: ['./modal-add-materials.page.scss'],
  standalone: true,
  imports: [IonFooter, IonItem, IonCol, IonRow, IonGrid, IonIcon, IonButton,
    IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    ReactiveFormsModule, IonInput

  ]
})
export class ModalAddMaterialsPage implements OnInit {
  @Input() material: any;
  @Input() index!: number;

    mode: 'Add' | 'Edit' = 'Add';


  modalCtrl = inject(ModalController)
  fb = inject(FormBuilder)
  addMaterialForm: FormGroup = this.fb.group({})

  constructor() {
    addIcons({ close });
    this.addMaterialForm = this.fb.group({
      quantity: [null, [Validators.required]],
      partNumber: [null, []],
      description: [null, []],
      ts: [null, []],
      // unitPrice: [null, []],
      // amount: [null, []],

    })
  }

  ngOnInit() {
    // 3. Si recibimos un material, estamos en modo 'Edit'
    if (this.material) {
      this.mode = 'Edit';
      // Llenamos el formulario con los datos del servicio
      this.addMaterialForm.patchValue(this.material);
    }
  }
  save() {
    this.modalCtrl.dismiss({
      material: this.addMaterialForm.value,
      mode: this.mode,
      index: this.index
    }, 'confirm');
  }
  closeModal() {
    this.modalCtrl.dismiss()
  }

}
