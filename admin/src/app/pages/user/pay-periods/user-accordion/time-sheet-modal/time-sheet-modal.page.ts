import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { car, close, hammer, navigateCircle, pizza } from 'ionicons/icons';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { ModalController } from '@ionic/angular/standalone';
import { DatePipe, NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { CustomersService } from 'src/app/services/customers.service';
import { Customer } from 'src/app/interfaces/customers';
import { GoogleMapsModule } from '@angular/google-maps'
@Component({
  selector: 'app-time-sheet-modal',
  templateUrl: './time-sheet-modal.page.html',
  styleUrls: ['./time-sheet-modal.page.scss'],
  standalone: true,
  imports: [FormsModule, IONIC_STANDALONE_MODULES, DatePipe, NgClass, NgIf, TitleCasePipe,GoogleMapsModule]
})
export class TimeSheetModalPage implements OnInit {
  @Input() userData: any;
  @Input() day: any;
  @Input() customers: Customer[] = [];
  loading: boolean = false;

  
  constructor(
    private modalController: ModalController,
    private customerService: CustomersService
  ) {
    addIcons({ close, hammer, pizza, car, navigateCircle });
  }

  ngOnInit() {
    console.log(this.customers)
  }
  //Get customer data form algolia
  getCompanyInfoById(id: string): string {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      const customer = this.customers[index];
      return `${customer.companyName}, ${customer.companyAddress.city}, ${customer.companyAddress.state}`;
    } else {
      return 'Customer not found';
    }
  }
  dismissModal() {
    this.modalController.dismiss();
  }

}
