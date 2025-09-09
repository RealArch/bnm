import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons'
import { CustomersService } from 'src/app/services/customers.service';
import { AddCustomer, Customer } from 'src/app/interfaces/customers';
import { PopupService } from 'src/app/services/popup.service';
import { GeneralService } from 'src/app/services/general.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.page.html',
  styleUrls: ['./add-customer-modal.page.scss'],
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, IONIC_STANDALONE_MODULES, NgIf, NgFor]
})
export class AddCustomerModalPage implements OnInit {
  @Input() customer:Customer | undefined

  customerForm: FormGroup = new FormGroup({});
  loading = false;
  states: { name: string; code: string; }[] = [];
  constructor(
    private modalController: ModalController,
    private customersService: CustomersService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private generalService: GeneralService
  ) {
    addIcons({close});

   
  }

  ngOnInit() {
    this.states = this.generalService.getStatesArray()
    //Declare form
    this.customerForm = this.fb.group({
      companyName: [this.customer?.companyName || null, Validators.required],
      companyPhone: [this.customer?.companyPhone || null],
      companyAddress: this.fb.group({
        street: [this.customer?.companyAddress.street || null, Validators.required],
        city: [this.customer?.companyAddress.city || null, Validators.required],
        state: [this.customer?.companyAddress.state || null, Validators.required],
        zip: [this.customer?.companyAddress.zip || null, Validators.required]
      }),
  contactName: [this.customer?.contactName || null, Validators.required],
  contactPhone: [this.customer?.contactPhone || null,],
  contactEmail: [this.customer?.contactEmail || null, Validators.required],
    })
    console.log(this.customer)
  }
  //Add customer to data base
  addCustomer() {
    this.loading = true;
    let data: AddCustomer = {
      companyName: this.customerForm.value.companyName,
      companyPhone: this.customerForm.value.companyPhone,
      companyAddress: this.customerForm.value.companyAddress,
      contactName: this.customerForm.value.contactName,
      contactPhone: this.customerForm.value.contactPhone,
      contactEmail: this.customerForm.value.contactEmail,
      id:this.customer?.id || null // if null, it's a new record
    }
    this.customersService.addCustomer(data)
      .then(() => {
        this.popupService.presentToast(
          "bottom",
          "success",
          "Customer has been added successfully."
        )
        this.closeModal()
        this.loading = false;
      }).catch(e => {
        console.log(e)
        this.loading = false;
        this.popupService.presentToast(
          "bottom",
          "danger",
          "There was an error trying to add the customer"
        )
      })
  }
  closeModal() {
    this.modalController.dismiss()
  }

}
