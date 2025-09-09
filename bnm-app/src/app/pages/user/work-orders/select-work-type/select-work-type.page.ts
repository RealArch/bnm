import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonGrid, IonCol, IonRow, IonCard, IonCardContent, IonText,
  IonIcon, IonButton, ModalController, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-work-type',
  templateUrl: './select-work-type.page.html',
  styleUrls: ['./select-work-type.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonText, IonCardContent, IonCard,
     IonRow, IonCol, IonGrid, IonButtons, IonContent, IonHeader, 
     IonToolbar, CommonModule, FormsModule
    ]
})
export class SelectWorkTypePage implements OnInit {
  modalCtrl = inject(ModalController)
  router = inject(Router)
  constructor() {
    addIcons({ close });
  }

  ngOnInit() {
  }
  navigateTo(dir:string){
    console.log(dir)
    this.router.navigate([dir])
    this.close()
  }
  close() {
    this.modalCtrl.dismiss()
  }
}
