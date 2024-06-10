import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
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
  appComponent = inject(AppComponent)
  alertController = inject(AlertController);
  interval: any;
  elapsedTime!: { lunch: { hours: number; minutes: number; }; work: { hours: number; minutes: number; }; };
  modType!: 'start' | 'commute' | 'lunch';
  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,

  ) {
    addIcons({ bed })
  }

  ngOnInit() {
    this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift)
    this.interval = window.setInterval(() => {
      this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift)
    }, 1000);

  }

  getElapsedMinSec(currentShift: any[]) {
    var dateNow = Date.now()
    var diffLunchMinutes = 0;
    var diffLunchHours = 0;
    var diffWorkMinutes = 0;
    var diffWorkHours = 0;
    var totalTimeWorked = 0;
    var totalTimeLunch = 0;
    //Otra opcion para hacer esto mas facil seria sumar todos los elementos que tengan fecha de inicio y de final y que no sean lunch
    currentShift.forEach((block, index) => {
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

  // async alertAfterLunch() {
  //   const alert = await this.alertController.create({
  //     header: 'Ending Lunch',
  //     message: 'Continue where you were working or select a new location',
  //     buttons: [
  //       {
  //         text: 'No, Commute',
  //         role: 'confirm',
  //         handler: () => {
  //           this.openModal('commute')
  //         },
  //       },
  //       {
  //         text: 'Yes',
  //         role: 'confirm',
  //         handler: () => {
  //           this.endLunch()
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }
  endLunch() {

  }
  async openModal(modType: 'start' | 'commute' | 'lunch') {
    var previousShift = null
    var currentShiftSize = this.userData.currentShift.length
    if (currentShiftSize > 0) {
      previousShift = this.userData.currentShift[currentShiftSize - 1];
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

}
