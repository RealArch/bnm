import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonDatetimeButton, IonDatetime, IonPopover, IonInput, IonText,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-work-order',
  templateUrl: './add-work-order.page.html',
  styleUrls: ['./add-work-order.page.scss'],
  standalone: true,
  imports: [IonText, IonInput, IonPopover, IonDatetime, IonDatetimeButton, IonLabel, IonItem, IonCol, IonRow, IonGrid, IonButtons, IonBackButton,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, ReactiveFormsModule, IonSelect, IonSelectOption
  ]
})
export class AddWorkOrderPage implements OnInit {
  fb = inject(FormBuilder)
  addWorkOrderForm: FormGroup = this.fb.group({})

  constructor() {
    this.addWorkOrderForm = this.fb.group({
      startDate: [null, [Validators.required]],
      closeDate: [null, [Validators.required]]

    })
  }

  ngOnInit() {

  }

}
