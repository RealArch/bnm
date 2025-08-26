import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { ModalController, AlertController, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bed, eye, pencil } from 'ionicons/icons';
import { StartShiftModalComponent } from '../start-shift-modal/start-shift-modal.component';
import { AppComponent } from 'src/app/app.component';
import { ShiftsService } from 'src/app/services/shifts.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EndingShiftModalComponent } from './ending-shift-modal/ending-shift-modal.component';
import { TimeService } from 'src/app/services/time.service';
import { ViewBlocksModalPage } from './view-blocks-modal/view-blocks-modal.page';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
  imports: [NgIf,NgClass, ReactiveFormsModule, FormsModule,DatePipe, IONIC_STANDALONE_MODULES]
})
export class StatusCardComponent implements OnInit {
  @Input() userData: any;
  @ViewChild(IonModal) modal!: IonModal;
  dateNow = Date.now();
  appComponent = inject(AppComponent)
  alertController = inject(AlertController);
  interval: any;
  elapsedTime: any;
  modType!: 'start' | 'commute' | 'lunch' | 'endLunch';
  copyElapseTime!: { lunch: { hours: number; minutes: number; }; work: { hours: number; minutes: number; }; } | null;
  updating: boolean = false;
  closingShiftTime: number = 0;
  // subscriptions: Subscription[] = [];
  datetimeValue: any = Date.now();
  shiftTaken: boolean = false;
  constructor(
    //private authService: AuthService,
    private modalCtrl: ModalController,
    private shiftsService: ShiftsService,
    private timeService: TimeService
  ) {
    addIcons({ bed, pencil, eye })
  }

  ngOnInit() {
    //Verify if shift is null

    //Determine if the shift was already taken
    this.shiftTaken = this.shiftAlreadyTaken(this.userData.currentPaycheck)

    //
    this.closingShiftTime = this.dateNow;
    // this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift.blocks)
    this.elapsedTime = this.shiftsService.getElapsedMinSec2(this.userData.currentShift.blocks, this.userData.status)
    this.interval = window.setInterval(() => {
      // this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift.blocks)
      this.elapsedTime = this.shiftsService.getElapsedMinSec2(this.userData.currentShift.blocks, this.userData.status)

      //Determine if the shift was already taken
      this.shiftTaken = this.shiftAlreadyTaken(this.userData.currentPaycheck)

    }, 1000);

  }
  shiftAlreadyTaken(currentPaycheck: any[]) {
    if (currentPaycheck.length == 0) return false;
    const lastindex = currentPaycheck.length - 1
    const dateToCompare = currentPaycheck[lastindex].blocks[0].startTime
    return this.timeService.isSameDay(dateToCompare)
  }
  timeStringToMilliseconds(timeString: string) {

  }
  getElapsedMinSec(blocks: any[]) {
    var res = {
      lunch: {
        hours: 0,
        minutes: 0
      },
      work: {
        hours: 0,
        minutes: 0
      }
    }

    if (this.userData.status == "outOfShift") return null;
    var dateNow = Date.now()
    var diffLunchMinutes = 0;
    var diffLunchHours = 0;
    var diffWorkMinutes = 0;
    var diffWorkHours = 0;
    var totalTimeWorked = 0;
    var totalTimeLunch = 0;
    //Otra opcion para hacer esto mas facil seria sumar todos los elementos que tengan fecha de inicio y de final y que no sean lunch
    blocks.forEach((block, index) => {
      //Count all the laps with end time. if lunch to totalTimeLunch, if not to  totalTimeWorked
      if (block.endTime != null) {
        let timeDifference = block.endTime - block.startTime;
        //If it is the last lap, count the time till now. only if it is not lunch time
        if (block.type != "lunch") {
          totalTimeWorked += timeDifference
        } else {
          totalTimeLunch += timeDifference
        }
      } else if (block.endTime == null) {
        let timeDifference = dateNow - block.startTime;
        if (block.type != "lunch") {
          totalTimeWorked += timeDifference;
        } else {
          totalTimeLunch += timeDifference;
        }
      }
    });
    diffWorkHours = Math.floor(totalTimeWorked / (1000 * 60 * 60));
    diffWorkMinutes = Math.floor((totalTimeWorked % (1000 * 60 * 60)) / (1000 * 60));

    diffLunchHours = Math.floor(totalTimeLunch / (1000 * 60 * 60));
    diffLunchMinutes = Math.floor((totalTimeLunch % (1000 * 60 * 60)) / (1000 * 60));

    return {
      lunch: {
        hours: diffLunchHours || 0,
        minutes: diffLunchMinutes || 0
      },
      work: {
        hours: diffWorkHours || 0,
        minutes: diffWorkMinutes || 0
      }
    }
  }


  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }

  fillCopyElapseTime() {
    this.copyElapseTime = this.getElapsedMinSec(this.userData.currentShift.blocks)
    //update the variable datetimeValue with the date now so it can send the close time to the api
    this.datetimeValue = new Date(Date.now()).toISOString()


  }
  //MODALS//
  async editTimeSheetModal(currentShift: any) {
    const modal = await this.modalCtrl.create({
      component: ViewBlocksModalPage,
      componentProps: {
        'shift': currentShift,
        'userData': this.userData
      },
    })
    await modal.present()
  }
  async openEndingShiftModal() {
    const modal = await this.modalCtrl.create({
      component: EndingShiftModalComponent,
      componentProps: {
        'userData': this.userData
      },
      cssClass: 'modal-box'
    })
    await modal.present()
  }

  async openModal(modType: 'start' | 'commute' | 'lunch' | 'endLunch') {
    var previousShift = null
    var currentShiftBlockSize = this.userData.currentShift.blocks.length
    if (currentShiftBlockSize > 0) {
      previousShift = this.userData.currentShift.blocks[currentShiftBlockSize - 1];
    }

    const modal = await this.modalCtrl.create({
      component: StartShiftModalComponent,
      componentProps: {
        'modType': modType,
        'previousShift': previousShift,
      }
    });
    return await modal.present();
  }
  //Alert
  //This is for ending shift
  // async alertEndShift() {
  //   const alert = await this.alertController.create({
  //     header: 'Confirmation',
  //     message: 'You are about to end your shift for today. Do you wish to continue?',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //         },
  //       },
  //       {
  //         text: 'Close shift',
  //         role: 'confirm',
  //         handler: () => {
  //           this.closeShift()
  //         },
  //       },
  //     ]
  //   });

  //   await alert.present();
  // }
  // ngOnDestroy() {
  //   this.subscriptions.forEach(element => {
  //     element.unsubscribe()
  //   });
  // }
}


