import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { addIcons } from 'ionicons';
import { pencil } from 'ionicons/icons';
import { TimeService } from 'src/app/services/time.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-accordion',
  templateUrl: './user-accordion.page.html',
  styleUrls: ['./user-accordion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserAccordionPage implements OnInit {
  @Input() userData: any;
  @Input() configs: any;
  schedule: any;
  loading: boolean = false;
  timeWorked: any;
  earnings: any;
  hours: number = 0;
  constructor(
    private generalService: GeneralService,
    private timeService: TimeService,
    private usersServices: UsersService,
    private alertController: AlertController
  ) {
    addIcons({ pencil })
  }

  ngOnInit() {
    console.log(this.userData)
    this.schedule = this.getArrayWithSchedule()
  }
  getArrayWithSchedule() {
    this.loading = true;
    this.timeWorked = this.calculateWorkedHours(this.userData.currentPaycheck)
    this.hours = Math.floor(this.timeWorked.totalWorkHours / (1000 * 60 * 60));
    this.earnings = this.calculateEarnings(this.timeWorked.totalWorkHours, this.userData.hourlyRate)
    //First

    return this.generalService.createFortnightArray(this.configs.paymentSchedule, this.configs.lastStartingDate, this.userData.currentPaycheck)
  }
  calculateWorkedHours(paycheck: any) {
    return this.timeService.calculateWorkedHours(paycheck)
  }
  calculateEarnings(timeWorked: any, hourlyRate: any) {
    return this.usersServices.calculateEarnings(timeWorked, hourlyRate)

  }
  async alertPaid(event: MouseEvent) {

    event.stopPropagation()
    const alert = await this.alertController.create({
      header:  "Update user's current paycheck",
      message: 'Do you want to mark this paycheck as Paid?',
      buttons: ['No','Yes'],
    });
    await alert.present()
  }

}
