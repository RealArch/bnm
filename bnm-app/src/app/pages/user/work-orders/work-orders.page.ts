import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonButton, IonSearchbar,
  IonFab, IonFabButton, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, search } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { SelectWorkTypePage } from './select-work-type/select-work-type.page';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.page.html',
  styleUrls: ['./work-orders.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonButtons, IonIcon, IonContent, IonHeader, IonTitle,
    IonButton, IonToolbar, CommonModule, FormsModule,
    ReactiveFormsModule, IonFab, IonFabButton, RouterLink
  ]
})
export class WorkOrdersPage implements OnInit {
  modalCtrl = inject(ModalController)

  constructor() {
    addIcons({ add, close, search });
  }

  ngOnInit() {

  }

  isSearching = false;
  searchText = '';

  toggleSearch() {
    this.isSearching = !this.isSearching;
    if (!this.isSearching) {
      this.searchText = ''; // limpiar búsqueda al cerrar
    }
  }

  onSearchChange(event: any) {
    const query = event.detail.value;
    console.log('Buscando:', query);
    // Aquí filtras tu lista según query
  }
  async openWorkTypeModal() {
    const modal = await this.modalCtrl.create({
      component: SelectWorkTypePage
    })

    modal.present();
  }

}
