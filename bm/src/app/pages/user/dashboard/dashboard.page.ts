import { Component, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { StatusCardComponent } from 'src/app/components/status-card/status-card.component';
import { addIcons } from 'ionicons';
import { notifications } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { combineLatest, forkJoin, Subject, Subscription, takeUntil } from 'rxjs';
import { PopupsService } from 'src/app/services/popups.service';
import { HoursWorkedCardComponent } from 'src/app/components/hours-worked-card/hours-worked-card.component';
import { MoneyEarnedCardComponent } from 'src/app/components/money-earned-card/money-earned-card.component';
import { ShiftsService } from 'src/app/services/shifts.service';
import { NotificationsPage } from './notifications/notifications.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, StatusCardComponent, HoursWorkedCardComponent, MoneyEarnedCardComponent]
})
export class DashboardPage implements OnInit {
  subscriptions: Subscription[] = [];
  loadingData: boolean = true;
  userUid: any;
  userData: any;
  totalPaycheckHours: any;
  timeWorked = signal(0); // Inicialización directa
  hourlyRate = signal(0);
  subscribe$ = new Subject<void>();
  resPublicConfig: any;
  paycheckClosingDate: any;
  constructor(
    private authService: AuthService,
    private popupService: PopupsService,
    private shiftService: ShiftsService,
    private popoverController: PopoverController
  ) {
    addIcons({ notifications })
  }

  ngOnInit() {
    console.log(44)

    this.getUserData()
  }
  //TODO Send notification 30 minutes prior closing global payCheck if shift's open.
  //Saying he will lost his shift if not closing before 11:59
  getUserData() {
    this.userUid = localStorage.getItem('userUid')
    console.log(this.userUid)
    this.loadingData = true
    combineLatest([
      this.authService.getUserData(this.userUid),
      this.authService.getPublicConfigData()
    ]).pipe(takeUntil(this.subscribe$))
      .subscribe({
        next: ([user, resPublicConfig]) => {
          //////
          this.userData = user
          let totalPaycheckHours = this.calculateWorkedHours(this.userData.currentPaycheck)
          this.timeWorked.set(totalPaycheckHours.totalWorkHours);
          this.hourlyRate.set(this.userData.hourlyRate)
          //////
          this.resPublicConfig = resPublicConfig
          this.paycheckClosingDate = this.shiftService.calculateEndOfPaycheck(this.resPublicConfig.paymentSchedule, this.resPublicConfig.lastStartingDate)
          this.loadingData = false
        },
        error: (e) => {
          this.loadingData = false
          this.popupService.presentToast('bottom', 'danger', 'An error occurred while reading your data.')
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
  //POPOVERS
  async notificationsPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: NotificationsPage,
      event: e,
      animated:true,
      cssClass:'notificationsPopover'
    });

    await popover.present();

  }

  ngOnDestroy() {
    this.subscribe$.next();
    this.subscribe$.complete()
  }
}
