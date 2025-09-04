import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton,
   ModalController, IonButtons, IonGrid, IonCol, IonRow, IonChip, IonLabel,
   IonSelect, IonSelectOption, IonItem, IonModal, IonDatetimeButton, IonDatetime, IonPopover } from '@ionic/angular/standalone';
@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.page.html',
  styleUrls: ['./search-filters.page.scss'],
  standalone: true,
  imports: [IonPopover, IonDatetime, IonDatetimeButton, IonModal, IonItem, IonLabel, IonChip, IonRow, IonCol, IonGrid, IonButtons, IonButton, IonFooter,
     IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect,
     IonSelectOption
    ]
})
export class SearchFiltersPage implements OnInit {
  modalCtrl = inject(ModalController);
  constructor() { }

  ngOnInit() {
  }
  dismiss(){
    this.modalCtrl.dismiss();
  }

}
