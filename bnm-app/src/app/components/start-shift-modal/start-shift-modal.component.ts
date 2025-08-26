import { DatePipe, NgIf } from '@angular/common';
import { Component, Inject, Input, OnInit, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomersService } from 'src/app/services/customers.service';
import { PopupsService } from 'src/app/services/popups.service';
import { ShiftsService } from 'src/app/services/shifts.service';
import { TimeService } from 'src/app/services/time.service';
import { Customer } from './../../interfaces/customers'
import { Geolocation } from '@capacitor/geolocation';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { NativeSettings, IOSSettings, AndroidSettings } from 'capacitor-native-settings';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-start-shift-modal',
  templateUrl: './start-shift-modal.component.html',
  styleUrls: ['./start-shift-modal.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, DatePipe, NgIf, IONIC_STANDALONE_MODULES]
})
export class StartShiftModalComponent implements OnInit {
  @Input() modType!: 'start' | 'commute' | 'lunch' | 'endLunch';
  @Input() previousShift: any;
  //todo: if 'commute', set the min time for the clock the startTime of the previous block
  fb = inject(FormBuilder);
  sending: boolean = false;
  subscriptions: Subscription[] = [];
  minDatePicker: string = ''
  startShiftForm: FormGroup = this.fb.group({
    startTime: [[], [Validators.required,]],
    type: [null, [Validators.required,]],
    workingPlace: [null, [Validators.required,]],
    details: null,
  })
  loading: boolean = false;
  customers: Customer[] = []
  pickerTime: string = '';
  maxDatePicker: any;
  ///////////

  constructor(
    // private modal: IonModal,
    private modalController: ModalController,
    private alertController: AlertController,
    private datePipe: DatePipe,
    private timeServices: TimeService,
    private shiftsServices: ShiftsService,
    private popupService: PopupsService,
    private authService: AuthService,
    private customersService: CustomersService
  ) { }

  ngOnInit() {
    //Get custonmers (no live updates)
    this.getCustomers()
    //
    this.pickerTime = this.timeServices.dateNowToIso8601Timezone()
    this.startShiftForm.controls['startTime'].setValue(this.pickerTime);
    //If there is a previous shift block and the current is lunch, load the values from the previous one
    this.minDatePicker = this.timeServices.setMinMaxTime().minDatePicker
    this.maxDatePicker = this.timeServices.setMinMaxTime().maxDatePicker
    if (this.previousShift) {
      //if a previous shift exist, don't allow select a time before the start time. We dont want negative count hours

      // this.minDatePicker = this.timeServices.formatToIso8601(this.previousShift.startTime)
      if (this.modType == 'lunch') {
        this.startShiftForm.controls['workingPlace'].setValue(this.previousShift.workingPlace)
        this.startShiftForm.controls['details'].setValue(this.previousShift.details)
        this.startShiftForm.controls['type'].setValue('lunch')

      } else if (this.previousShift.type == 'lunch') {

        this.startShiftForm.controls['workingPlace'].setValue(this.previousShift.workingPlace)
        this.startShiftForm.controls['details'].setValue(this.previousShift.details)
        this.startShiftForm.controls['type'].setValue('working')
      }
    }
  }
  getCustomers() {
    this.loading = true
    var customers: Customer[] = []
    this.customersService.getAllCustomers()
      .then(res => {
        res.forEach(customer => {
          customers.push({
            ...customer.data(),
            id: customer.id
          } as Customer)
        })
        this.customers = customers
      }).catch(e => {
        console.log(e)
        this.popupService.presentToast('bottom', 'danger', 'There was a problem trying to retrieve customers. Please try again.')
      })
  }
  async startShiftAlert(modType: 'start' | 'commute' | 'lunch' | 'endLunch') {
    var header = 'Adding shift information'
    var msg = `
      <strong> Start hour </strong>: ${this.datePipe.transform(this.startShiftForm.value.startTime, 'shortTime')} <br>
    `;
    //           `

    if (modType == 'start' || modType == 'commute') {
      msg += `
     <strong> Place </strong>: ${this.findNameById(this.startShiftForm.value.workingPlace)}
    `}
    if (modType == 'lunch') {
      header = 'Starting lunch'
    }

    const alert = await this.alertController.create({
      header: header,
      // message: msg,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        },
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          this.modifyShift(this.startShiftForm.value)
        },
      },],
    });
    // Usar innerHTML para renderizar el contenido HTML
    const alertMessage = document.createElement('div');
    alertMessage.innerHTML = msg;
    alert.message = alertMessage.outerHTML;

    await alert.present();
  }
  async modifyShift(shiftForm: any) {
    this.sending = true
    var geolocation = await this.getGeoloc()
    if (geolocation == null) {
      this.sending = false
      // return this.popupService.presentAlert('Location Access Required', 'To clock in and out, we need access to your location. Please enable GPS to continue.')
      return this.alertOpenConfig()
    }


    var afAuthToken = await this.authService.getIdToken()
    this.subscriptions.push(this.shiftsServices.startShift(shiftForm.startTime, shiftForm.type, shiftForm.workingPlace, shiftForm.details, geolocation, afAuthToken)
      .subscribe({
        next: (res) => {
          this.popupService.presentToast('bottom', 'success', 'Shift information added successfully.')
          return this.modalController.dismiss()
        },
        error: (err) => {
          this.popupService.presentAlert('Error', 'An error occurred while adding information to the shift. Please try again.')
          this.sending = false;
          console.log(err.error)

        },
        complete: () => {

        },
      })
    )
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
  cancel() {
    return this.modalController.dismiss()
  }
  // getIso8601Date(value?: number) {
  //   var date = Date.now()
  //   if (value) { date = value }
  //   const currentDate = new Date(date);
  //   const isoString = currentDate.toISOString();
  //   return isoString
  // }
  updateStartTime(ev: CustomEvent) {
    this.pickerTime = this.timeServices.formatToIso8601(ev.detail.value)
    this.startShiftForm.controls['startTime'].setValue(this.pickerTime);
  }
  onTypeChange() {
    //reset next values
    this.startShiftForm.controls['workingPlace'].setValue(null);
    this.startShiftForm.controls['details'].setValue(null)
  }
  // getDate(date: string) {
  //   return (new Date(date).getTime());
  // }
  findNameById(id: string) {
    const item = this.customers.find((entry: any) => entry.id === id);
    return item ? item.companyName : 'Name not found';
  }
  //alerts
  async alertOpenConfig() {
    const alert = await this.alertController.create({
      header: "Location Access Required",
      message: "You have previously denied location access. To use this feature, please enable location services in Settings.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Open settings',
          role: 'confirm',
          handler: async () => {

            if (Capacitor.getPlatform() === 'ios') {
              await NativeSettings.openIOS({
                option: IOSSettings.App // Abre Settings > TuApp
              });
            } else if (Capacitor.getPlatform() === 'android') {
              await NativeSettings.openAndroid({
                option: AndroidSettings.ApplicationDetails // Abre Settings > TuApp
              });
            }

          },
        },
      ]
    })
    alert.present()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe()
    });
  }
}
