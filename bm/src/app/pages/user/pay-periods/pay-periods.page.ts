import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendar, checkmark, eye } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ShiftsService } from 'src/app/services/shifts.service';
import { PublicConfig } from 'src/app/interfaces/public-config';
import { ViewBlocksModalPage } from 'src/app/components/status-card/view-blocks-modal/view-blocks-modal.page';

@Component({
  selector: 'app-pay-periods',
  templateUrl: './pay-periods.page.html',
  styleUrls: ['./pay-periods.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PayPeriodsPage implements OnInit {
  loading: boolean = true;
  userUid: any = localStorage.getItem('userUid');
  subscribe$ = new Subject<void>();
  userData: any;
  configData!: PublicConfig;
  currentSchedule: any;
  selectedPeriodId: string = 'current'
  selectedPeriod: any;
  fixedHourlyRate: any = null;

  constructor(
    private authService: AuthService,
    private shiftService: ShiftsService,
    private modalCtrl: ModalController,
    private shifts: ShiftsService

  ) {
    addIcons({ calendar, eye, checkmark })
  }

  ngOnInit() {
    //get userData
    this.getUserData()

  }
  getUserData() {
    this.loading = true;
    combineLatest([
      this.authService.getUserData(this.userUid),
      this.authService.getPublicConfigData()
      // this.shiftService.createFortnightArray()
    ]).pipe(takeUntil(this.subscribe$))
      .subscribe({
        next: ([resUserData, resConfigData]) => {
          //User data
          console.log(resUserData)
          this.userData = resUserData;

          //Config data
          this.configData = resConfigData as PublicConfig

          //After gettingg date, format it
          this.currentSchedule = this.shiftService.createFortnightArray(this.configData.paymentSchedule, this.configData.lastStartingDate, this.userData.currentPaycheck)
          console.log(this.currentSchedule)
          if (this.selectedPeriodId == "current") {
            this.selectedPeriod = this.currentSchedule
          }
          this.loading = false

        },
        error: (e) => {
          console.log(e)
          //todo toast notificando error
        }
      })
  }

  calculateWorkedHours(currentPaycheck: any) {
    console.log(currentPaycheck)
    let totalWorkHours = 0;
    let totalLunchHours = 0;
    currentPaycheck.forEach((paycheck: { timeWorked: { work: number; lunch: number; }; }) => {

      totalWorkHours += paycheck.timeWorked.work;
      totalLunchHours += paycheck.timeWorked.lunch;
    });
    return { totalWorkHours, totalLunchHours };
  }

  setTotalWorkingHours(currentPaycheck: any) {
    let totals = this.calculateWorkedHours(currentPaycheck)
    console.log(totals)
  }
  async getUserWorkPaycheck(objectId: string) {
    if (objectId == this.selectedPeriodId) return
    this.loading = true
    if (objectId == 'current') {
      this.selectedPeriodId = 'current'
      this.selectedPeriod = this.currentSchedule
      this.fixedHourlyRate = null
      return this.loading = false
    }
    var res: any = await this.shifts.getUserWorkPaycheck(objectId)
    let userId = localStorage.getItem('userUid')
    let userPaycheck = this.shiftService.userPaycheckById(res.usersPaychecks, userId)
    this.selectedPeriod = this.shiftService.createFortnightArray(res.paymentScheme, res.startDate, userPaycheck.days)
    this.selectedPeriodId = objectId
    console.log(this.selectedPeriod)
    this.fixedHourlyRate = userPaycheck.hourlyRate

    this.setTotalWorkingHours(userPaycheck.days)
    this.loading = false
    return
  }
  //MODALS
  async viewShift(shift: any) {
    console.log(this.fixedHourlyRate)
    const modal = await this.modalCtrl.create({
      component: ViewBlocksModalPage,
      componentProps: {
        'shift': shift,
        'userData': this.userData,
        'fixedHourlyRate': this.fixedHourlyRate
      },
    })
    await modal.present()
  }
  //
  ngOnDestroy() {
    this.subscribe$.next();
    this.subscribe$.complete()
  }
}
