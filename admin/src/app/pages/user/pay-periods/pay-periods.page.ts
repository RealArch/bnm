import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendar, ellipsisVertical } from 'ionicons/icons';
import { UserAccordionPage } from './user-accordion/user-accordion.page';
import { UsersService } from 'src/app/services/users.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaychecksService } from 'src/app/services/paychecks.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-pay-periods',
  templateUrl: './pay-periods.page.html',
  styleUrls: ['./pay-periods.page.scss'],
  standalone: true,
  imports: [FormsModule, UserAccordionPage, DatePipe, IONIC_STANDALONE_MODULES, NgIf]
})
export class PayPeriodsPage implements OnInit {
  usersService = inject(UsersService)
  authService = inject(AuthService)
  paycheckService = inject(PaychecksService)
  private unsubscribe$ = new Subject<void>();
  currentUsersData: { id: string; }[] = [];
  loading: boolean = true;
  loadingPaychecks: any
  configs: any;
  selectedPeriodId: string = 'current'
  currentSchedule: any;
  usersData: any;
  currentClosingDate: any;

  constructor() {
    addIcons({ ellipsisVertical, calendar })
  }

  ngOnInit() {
    this.readUsers()
  }
  preventDefault(event: Event) {
    event.stopPropagation(); // Evitar que el evento afecte el acordeón }

  }
  readUsers() {
    this.loading = true;
    combineLatest([
      this.usersService.getUsers(),
      this.authService.getPublicConfigData()
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ([resUserData, configs]) => {

          this.currentUsersData = resUserData;
          if (this.selectedPeriodId == 'current') {
            this.usersData = this.currentUsersData
          }

          this.configs = configs
          //Calculate current closing date 
          this.currentClosingDate = this.paycheckService.calculateEndOfPaycheck(this.configs.paymentSchedule, this.configs.lastStartingDate)

          this.loading = false;
        },
        error: (e) => {
          console.log(e)
        }
      })
  }
  async setPreviousData(period: string) {
    this.loading = true

    if (period == "current") {
      this.selectedPeriodId = 'current'
      this.usersData = this.currentUsersData
      this.loading = false

      return
    }
    try {
      this.selectedPeriodId = period;
      const paycheckPeriod = await this.paycheckService.getPaycheckPeriodAlgolia(period)
      let format = await this.paycheckService.addDataToUsersData(this.usersData, paycheckPeriod['usersPaychecks'])
      this.usersData = format
      this.loading = false




    } catch (error) {

    }
    //Leer el paycheck solicitado

    //Inyectar el paycheck buscado en el currentPaycheck de cada uno de los users
  }
  //Get data for the paychecks
  // async getUserWorkPaycheck(objectId: string) {
  //   if (objectId == this.selectedPeriodId) return
  //   this.loading = true
  //   if (objectId == 'current') {
  //     this.selectedPeriodId = 'current'
  //     this.selectedPeriod = this.currentSchedule
  //     this.fixedHourlyRate = null
  //     return this.loading = false
  //   }
  //   var res: any = await this.shifts.getUserWorkPaycheck(objectId)
  //   let userId = localStorage.getItem('userUid')
  //   let userPaycheck = this.shiftService.userPaycheckById(res.usersPaychecks, userId)
  //   this.selectedPeriod = this.shiftService.createFortnightArray(res.paymentScheme, res.startDate, userPaycheck.days)
  //   this.selectedPeriodId = objectId
  //   console.log(this.selectedPeriod)
  //   this.fixedHourlyRate = userPaycheck.hourlyRate

  //   this.setTotalWorkingHours(userPaycheck.days)
  //   this.loading = false
  //   return
  // }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete()
  }
}