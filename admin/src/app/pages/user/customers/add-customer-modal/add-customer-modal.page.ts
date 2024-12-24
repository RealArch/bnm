import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons'
import { CustomersService } from 'src/app/services/customers.service';
import { AddCustomer } from 'src/app/interfaces/customers';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.page.html',
  styleUrls: ['./add-customer-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddCustomerModalPage implements OnInit {
  customerForm: FormGroup = new FormGroup({});
  loading = false;
  constructor(
    private modalController: ModalController,
    private customersService: CustomersService,
    private fb: FormBuilder,
    private popupService: PopupService
  ) {
    addIcons({ close })
    this.customerForm = this.fb.group({
      companyName: [null, Validators.required],
      companyPhone: [null, Validators.required],
      companyAddress: [null, Validators.required],
      contactName: [null, Validators.required],
      contactPhone: [null, Validators.required],

    })
  }

  ngOnInit() {
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

    }
    this.customersService.addCustomer(data)
      .then(() => {
        this.popupService.presentToast(
          "bottom",
          "success",
          "Customer added successfully"
        )
        this.closeModal()
        this.loading = false;
      }).catch(e=>{
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
