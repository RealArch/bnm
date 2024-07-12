import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, ViewChild, inject } from '@angular/core';
import { IonicModule, ModalController, AlertController, IonModal } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bed } from 'ionicons/icons';
import { StartShiftModalComponent } from '../start-shift-modal/start-shift-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, NgIf]
})
export class StatusCardComponent implements OnInit {
  @Input() userData: any;
  @ViewChild(IonModal) modal!: IonModal;

  appComponent = inject(AppComponent)
  alertController = inject(AlertController);
  interval: any;
  elapsedTime!: { lunch: { hours: number; minutes: number; }; work: { hours: number; minutes: number; }; } | null;
  modType!: 'start' | 'commute' | 'lunch';
  copyElapseTime!: { lunch: { hours: number; minutes: number; }; work: { hours: number; minutes: number; }; } | null;
  updating: boolean = false;
  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,

  ) {
    addIcons({ bed })
  }

  ngOnInit() {

    this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift.blocks)
    this.interval = window.setInterval(() => {
      this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift.blocks)
    }, 1000);

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
  calculateClosingHour(ev: CustomEvent) {
    var newEndTime = new Date(ev.detail.value).getTime()
    var copyBlocks = JSON.parse(JSON.stringify(this.userData.currentShift.blocks));
    copyBlocks[copyBlocks.length - 1].endTime = newEndTime
    this.copyElapseTime = this.getElapsedMinSec(copyBlocks)
  }
  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }
  closeShift() {
    // this.modal.dismiss()
    this.updating = true

  }
  fillCopyElapseTime() {
    this.copyElapseTime = this.getElapsedMinSec(this.userData.currentShift.blocks)

  }

  async openModal(modType: 'start' | 'commute' | 'lunch') {
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
  async alertEndShift() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'You are about to end your shift for today. Do you wish to continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Close shift',
          role: 'confirm',
          handler: () => {
            this.closeShift()
          },
        },
      ]
    });

    await alert.present();
  }
}


