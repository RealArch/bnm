import { DatePipe, JsonPipe, NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonModal, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PopupsService } from 'src/app/services/popups.service';
import { ShiftsService } from 'src/app/services/shifts.service';

@Component({
  selector: 'app-start-shift-modal',
  templateUrl: './start-shift-modal.component.html',
  styleUrls: ['./start-shift-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, DatePipe, NgIf, JsonPipe]
})
export class StartShiftModalComponent implements OnInit {
  fb = inject(FormBuilder);
  sending: boolean = false;
  subscriptions: Subscription[] = [];

  startShiftForm: FormGroup = this.fb.group({
    startTime: [[], [Validators.required,]],
    type: [null, [Validators.required,]],
    workingPlace: [null, [Validators.required,]],
    details: "",
  })
  customers: any = [
    {
      name: 'Gatorade',
      id: '43124823',
      location: '',
      state: 'FL',
      city: 'Kisseemee'
    },
    {
      name: 'Sigma',
      id: '431248234',
      location: '',
      state: 'FL',
      city: 'Orlando'

    }
  ]
  constructor(
    private modal: IonModal,
    private alertController: AlertController,
    private datePipe: DatePipe,
    private shiftsServices: ShiftsService,
    private popupService: PopupsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    var dateNow = this.getCurrentIso8601Date()
    this.startShiftForm.controls['startTime'].setValue(this.getDate(dateNow));

  }
  async startShiftAlert() {
    const alert = await this.alertController.create({
      header: 'Adding shift information',
      message: `
      <strong>Start hour</strong>: ${this.datePipe.transform(this.startShiftForm.value.startTime, 'shortTime')} <br>
      <strong>Place</strong>: ${this.findNameById(this.startShiftForm.value.workingPlace)}     `,
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
          this.startShift(this.startShiftForm.value)
        },
      },],
    });

    await alert.present();
  }
  async startShift(shiftForm: any) {
    this.sending = true
    var afAuthToken = await this.authService.getIdToken()
    this.subscriptions.push(this.shiftsServices.startShift(shiftForm.startTime, shiftForm.type, shiftForm.workingPlace, shiftForm.details, afAuthToken)
      .subscribe({
        next: (res) => {
          this.popupService.presentToast('bottom', 'success', 'Shift started successfully.')
          return this.modal.dismiss()
        },
        error: (err) => {
          this.popupService.presentAlert('Error', 'An error occurred while starting the shift. Please try again.')
          this.sending = false;
          console.log(err.error)

        },
        complete: () => {

        },
      })
    )
  }
  cancel() {
    this.getCurrentIso8601Date()
    this.modal.dismiss(null, 'cancel');
  }
  getCurrentIso8601Date() {
    const currentDate = new Date(Date.now());
    const isoString = currentDate.toISOString();
    return isoString
  }
  updateStartTime(ev: CustomEvent) {
    var dateNow = ev.detail.value
    this.startShiftForm.controls['startTime'].setValue(this.getDate(dateNow));
  }
  onTypeChange() {
    //reset next values
    this.startShiftForm.controls['workingPlace'].setValue(null);
    this.startShiftForm.controls['details'].setValue(null)
  }
  getDate(date: string) {
    return (new Date(date).getTime());
  }
  findNameById(id: string) {
    const item = this.customers.find((entry: any) => entry.id === id);
    return item ? item.name : 'Name not found';
  }
  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe()
    });
  }
}
