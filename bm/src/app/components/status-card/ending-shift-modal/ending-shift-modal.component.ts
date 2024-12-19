import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule, AlertController } from '@ionic/angular'
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs'
import { ShiftsService } from 'src/app/services/shifts.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-ending-shift-modal',
  templateUrl: './ending-shift-modal.component.html',
  styleUrls: ['./ending-shift-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, NgIf]
})
export class EndingShiftModalComponent implements OnInit {
  @Input() userData: any;
  updating: boolean = false;
  subscriptions: Subscription[] = [];
  datetimeValue: any = new Date().toISOString();
  closingShiftTime: any;
  copyElapseTime!: { lunch: { hours: number; minutes: number; }; work: { hours: number; minutes: number; }; } | null;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private shiftsService: ShiftsService,
  ) { }

  ngOnInit() {
    this.calculateClosingHour(this.datetimeValue)
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  //Logic for  Close the shift and send information to API
  async closeShift() {
    // this.modal.dismiss()

    this.updating = true
    var afAuthToken = await this.authService.getIdToken()
    console.log(this.datetimeValue)
    //Prepare datetimeValue to send it to api. Convert it from iso to milliseconds
    let datetimeValueMilliseconds = new Date(this.datetimeValue).getTime()
    this.subscriptions.push(
      this.shiftsService.closeShift(datetimeValueMilliseconds, afAuthToken)
        .subscribe({
          next: (res) => {
            console.log(res)
            this.updating = false;
            this.modalCtrl.dismiss()
          },
          error: (err) => {
            this.updating = false;
            console.log(err)
          }
        })
    )
  }
  //Executes every time the date picker changes
  calculateClosingHour(value: any) {
    this.datetimeValue = value
    console.log(value)
    this.closingShiftTime = new Date(value).getTime()
    console.log(this.closingShiftTime)

    var copyBlocks = JSON.parse(JSON.stringify(this.userData.currentShift.blocks));
    copyBlocks[copyBlocks.length - 1].endTime = this.closingShiftTime;
    this.copyElapseTime = this.shiftsService.getElapsedMinSec(copyBlocks, this.userData.status)
    console.log(this.copyElapseTime)
  }

  //ALERTS DOWN HERE--------------
  //This is for ending shift
  async alertEndShift() {
    const alert = await this.alertCtrl.create({
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

  //Destroying subscriptions
  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe()
    });
  }
}
