import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, AlertController, SearchbarCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, ellipsisVertical, pencil, search, trash } from 'ionicons/icons';
import { AddCustomerModalPage } from './add-customer-modal/add-customer-modal.page';
import { CustomersService } from 'src/app/services/customers.service';
import { Customer } from 'src/app/interfaces/customers';
import { NavigationStart, Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CustomersPage implements OnInit {
  loading: boolean = false;
  customers: Customer[] = [];
  removeAlertButtons: any = []
  navigationSubscription: any;
  constructor(
    private modalController: ModalController,
    private customersServices: CustomersService,
    private router: Router,
    private alertController: AlertController,
    private popupServices: PopupService
  ) {
    addIcons({ add, pencil, trash })

  }

  ngOnInit() {
    this.getData()
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // this.setOpen(false)
      }
    });
  }

  searchData(event: SearchbarCustomEvent) {
    if (event.detail.value == '') return this.getData()
    this.loading = true
    let q = event.detail.value || '';
    this.customersServices.searchCustomer(q)
      .then((customers: Customer[]) => {
        this.customers = customers
        console.log(this.customers)
        this.loading = false
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
  }
  getData() {
    this.loading = true
    this.customersServices.getAllCustomers()
      .subscribe({
        next: (res: Customer[]) => {
          this.customers = res
          console.log(res)
          this.loading = false

        },
        error: (e) => {
          console.log(e)
          this.loading = false
        }
      })

  }
  removeCustomer(customerId: string) {
    this.customersServices.removeCustomer(customerId)
      .then(() => {
        this.popupServices.presentToast(
          'bottom',
          'success',
          'The customer has been successfully deleted.'
        )
      }).catch(e => {
        console.log(e)
        this.popupServices.presentToast(
          'bottom',
          'danger',
          'An error occurred while trying to delete the customer. Please try again later.'
        )
      })
  }
  // Alerts
  async openRemoveAlert(customerId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this customer? This action is permanent and cannot be undone.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-cancel-button',
        handler: () => {
        },
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          this.removeCustomer(customerId)
        },
      }],
    });

    await alert.present();
  }


  //Open modals
  async openAddCustomerModal(customer:any) {
    var data = customer;

    const modal = await this.modalController.create({
      component: AddCustomerModalPage,
      backdropDismiss: false,
      cssClass: 'radius',
      componentProps: {
        customer: data
      }
    });
    modal.present();


  }

}
