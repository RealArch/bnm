import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton,
  ModalController, IonButtons, IonGrid, IonCol, IonRow, IonChip, IonLabel,
  IonSelect, IonSelectOption, IonItem, IonModal, IonDatetimeButton, IonDatetime, IonPopover
} from '@ionic/angular/standalone';
import { CustomersService } from 'src/app/services/customers.service';
import { i } from '@angular/cdk/data-source.d-Bblv7Zvh';
import { PopupsService } from 'src/app/services/popups.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.page.html',
  styleUrls: ['./search-filters.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonChip, IonRow, IonCol, IonGrid, IonButtons, IonButton, IonFooter,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect,
    IonSelectOption
  ]
})
export class SearchFiltersPage implements OnInit {
  modalCtrl = inject(ModalController);
  customersService = inject(CustomersService);
  popoverService = inject(PopupsService);
  authService = inject(AuthService);
  filters = {
    status: '',
    type: '',
    customerId: '',
    createdBy: '' 
  };
  loading: boolean = true;
  customers: any[] = [];
  userUid: any;
  constructor() { }

  async ngOnInit() {
    //leer customers de algolia
    this.userUid = await this.authService.getCurrentUserUid();
    this.filters.createdBy = this.userUid;
    this.getCustomers();
  }
  getCustomers() {
    this.loading = true;
    this.customersService.getAllCustomersAlgolia()
      .then((data) => {
        this.customers = data.sort((a, b) => {
          const stateA = a.companyAddress?.state?.toLowerCase() || '';
          const stateB = b.companyAddress?.state?.toLowerCase() || '';
          if (stateA === stateB) {
            const nameA = a.companyName?.toLowerCase() || '';
            const nameB = b.companyName?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
          }
          return stateA.localeCompare(stateB);
        });
        this.loading = false;
      }).catch((error) => {
        console.error('Error fetching customers:', error);
        this.popoverService.presentToast('bottom', 'danger', 'Error fetching customers');
        this.loading = false;
      });
  }
  
  dismiss() {
    this.modalCtrl.dismiss();
  }

  applyFilters() {
    this.modalCtrl.dismiss(this.filters, 'confirm');
  }
}