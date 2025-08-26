import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular/standalone'
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs'
import { ShiftsService } from 'src/app/services/shifts.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TimeService } from 'src/app/services/time.service';
import { Geolocation } from '@capacitor/geolocation';
import { PopupsService } from 'src/app/services/popups.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
  selector: 'app-ending-shift-modal',
  templateUrl: './ending-shift-modal.component.html',
  styleUrls: ['./ending-shift-modal.component.scss'],
  imports: [FormsModule, NgIf, IONIC_STANDALONE_MODULES]
})
export class EndingShiftModalComponent implements OnInit {
  @Input() userData: any;
  updating: boolean = false;
  subscriptions: Subscription[] = [];
  datetimeValue: any = new Date().toISOString();
  closingShiftTime: any;
  copyElapseTime!: { lunch: { hours: number; minutes: number; }; work: { hours: number; minutes: number; }; } | null;
  pickerTime: any
  minDatePicker: any
  maxDatePicker:any
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private shiftsService: ShiftsService,
    private timeServices: TimeService,
    private popupService: PopupsService,


  ) { }

  ngOnInit() {
    this.calculateClosingHour(this.datetimeValue)
    //set min time for picker
    this.pickerTime = this.timeServices.dateNowToIso8601Timezone()
    // define 5 minutes previous and 5 minutes after the current time
    this.minDatePicker = this.timeServices.setMinMaxTime().minDatePicker
    this.maxDatePicker = this.timeServices.setMinMaxTime().maxDatePicker
    
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  //Logic for  Close the shift and send information to API
  async closeShift() {

    try {
      this.updating = true
      var geolocation = await this.getGeoloc()
      if (geolocation == null) {
        this.updating = false
        return this.popupService.presentAlert('Location Access Required', 'To clock in and out, we need access to your location. Please enable GPS to continue.')
      }
      var afAuthToken = await this.authService.getIdToken()
      //Prepare datetimeValue to send it to api. Convert it from iso to milliseconds
      let datetimeValueMilliseconds = this.timeServices.formatToIso8601(this.pickerTime)
      this.subscriptions.push(
        this.shiftsService.closeShift(datetimeValueMilliseconds, geolocation, afAuthToken)
          .subscribe({
            next: (res) => {
              this.updating = false;
              this.modalCtrl.dismiss()
            },
            error: (err) => {
              this.updating = false;
              console.log(err)
            }
          })
      )
    } catch (error) {
      this.updating = false;
      console.log(error)
      this.popupService.presentAlert('Error', 'An error occurred while closing the shift. Please try again.')
    }

  }
  async getGeoloc() {

    try {
      var coords = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,  // 10 segundos
        maximumAge: 0,
      })
      var geolocation = {
        lat: coords.coords.latitude,
        lng: coords.coords.longitude,
        time: Date.now()
      }
      return geolocation

    } catch (error) {
      console.log(error)
      return null
    }
  }
  //Executes every time the date picker changes
  calculateClosingHour(value: any) {

    this.closingShiftTime = this.timeServices.dateNowToIso8601Timezone()

    var copyBlocks = JSON.parse(JSON.stringify(this.userData.currentShift.blocks));
    copyBlocks[copyBlocks.length - 1].endTime = this.pickerTime;

    this.copyElapseTime = this.shiftsService.getElapsedMinSec2(copyBlocks, this.userData.status)
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
