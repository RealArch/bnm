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
  configData: PublicConfig | undefined;
  schedule: any;

  constructor(
    private authService: AuthService,
    private shiftService: ShiftsService,
    private modalCtrl: ModalController,

  ) {
    addIcons({ calendar, eye, checkmark })
  }

  ngOnInit() {
    //get userData
    this.getUserData()
    //format the currentPaycheck
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
          this.schedule = this.shiftService.createFortnightArray(this.configData.paymentSchedule, this.configData.lastStartingDate, this.userData.currentPaycheck)

          this.loading = false

        },
        error: (e) => {
          console.log(e)
          //todo toast notificando error
        }
      })
  }
  //MODALS
  async viewShift(shift: any) {
    const modal = await this.modalCtrl.create({
      component: ViewBlocksModalPage,
      componentProps: {
        'shift': shift,
        'userData':this.userData
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
