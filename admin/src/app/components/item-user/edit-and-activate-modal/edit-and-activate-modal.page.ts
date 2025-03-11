import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { UsersService } from 'src/app/services/users.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-edit-and-activate-modal',
  templateUrl: './edit-and-activate-modal.page.html',
  styleUrls: ['./edit-and-activate-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FormsModule, ReactiveFormsModule]
})
export class EditAndActivateModalPage implements OnInit {
  @Input() userData: any
  fb = inject(FormBuilder)
  usersService = inject(UsersService)
  modalController = inject(ModalController)
  popupService = inject(PopupService)
  editWorkerForm: FormGroup = this.fb.group({})
  loading: boolean = false;

  constructor() {
    addIcons({ checkmarkCircle, alertCircleOutline, closeCircle });

  }


  ngOnInit() {
    this.editWorkerForm = this.fb.group({
      firstName: [this.userData.firstName, [Validators.required,]],
      lastName: [this.userData.lastName, [Validators.required,]],
      hourlyRate: [this.userData.hourlyRate, [Validators.required, Validators.min(0.01)]]

    });
  }
  saveAndActivateWorker(formData: any) {
    this.loading = true
    this.usersService.updateAndActivateWorker(this.userData.uid, formData.firstName, formData.lastName, formData.hourlyRate)
      .then(() => {
        this.loading = false
        this.popupService.presentToast('bottom', 'success', 'The worker was successfully activated.')
        this.closeModal()
      }).catch(e => {
        this.loading = false
        console.log(e)
        this.popupService.presentToast('bottom', 'danger', 'There was a problem saving the data. Please try again.')
      })
  }
  closeModal() {
    this.modalController.dismiss()
  }

}
