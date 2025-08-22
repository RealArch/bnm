import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
   IonSearchbar, IonButtons, IonButton, IonIcon, IonBackButton,
    IonRow, IonCol, IonGrid, IonItem, IonLabel, ModalController
  } from '@ionic/angular/standalone';
import { WorkOrder } from 'src/app/interfaces/work-order';

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
  type = "work"

  constructor() { }

  ngOnInit() {
    console.log(this.workOrder)
  }
  dismiss(){
    this.modalController.dismiss()
  }
}
