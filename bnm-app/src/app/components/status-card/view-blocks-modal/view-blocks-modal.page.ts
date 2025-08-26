import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { CustomersService } from 'src/app/services/customers.service';
import { Customer } from 'src/app/interfaces/customers';
import { PopupsService } from 'src/app/services/popups.service';
import { addIcons } from 'ionicons';
import { car, close, hammer, help, pizza } from 'ionicons/icons';
import { HoursWorkedCardComponent } from '../../../components/hours-worked-card/hours-worked-card.component'
import { MoneyEarnedCardComponent } from '../../money-earned-card/money-earned-card.component';
import { ShiftsService } from 'src/app/services/shifts.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-view-blocks-modal',
  templateUrl: './view-blocks-modal.page.html',
  styleUrls: ['./view-blocks-modal.page.scss'],
  standalone: true,
  imports: [FormsModule, HoursWorkedCardComponent, MoneyEarnedCardComponent,DatePipe, NgClass, TitleCasePipe, IONIC_STANDALONE_MODULES, NgIf]
})
export class ViewBlocksModalPage implements OnInit {
  @Input() shift: any
  @Input() userData: any //Or current shift
  @Input() fixedHourlyRate:any;
  loading: boolean = false;
  timeWorked = signal(0);
  hourlyRate = signal(0);

  customers: Customer[] = [];
  constructor(
    private customerService: CustomersService,
    private popupService: PopupsService,
    private modalController: ModalController,
    private shifts:ShiftsService
  ) {
    addIcons({ hammer, pizza, car, help, close })
  }

  async ngOnInit() {
    
    
    this.customers = await this.getCustomer() as Customer[]
    //If no hourly rate was provided, use the current HourlyRate from userData
    this.hourlyRate.set(this.userData.hourlyRate)  
    if(this.fixedHourlyRate){
      this.hourlyRate.set(this.fixedHourlyRate)  
    }
    this.timeWorked.set(this.shift.timeWorked.work)

  }
  async getCustomer() {
    try {
      this.loading = true;
      const customers: Customer[] = await this.customerService.getAllCustomersAlgolia()
      this.loading = false
      return customers
    } catch (e) {
      console.log(e)
      this.popupService.presentToast('bottom', 'danger', 'There was a problem reading the data. Please try again.')
      return e
    }
  }
   
  getCompanyInfoById(id: string): string {

    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      const customer = this.customers[index];
      return `${customer.companyName}, ${customer.companyAddress.city}, ${customer.companyAddress.state}`;
    } else {
      return 'Customer not found';
    }
  }
  closeModal() {
    this.modalController.dismiss()
  }
  // getCustomerInfo(customerId: string) {
  //   return this.customers.findIndex(customer => {
  //     customer.id === id
  //    return `${customer.companyName},${customer.companyAddress.city}, ${customer.companyAddress.state}`

  //   });
  // }


}
