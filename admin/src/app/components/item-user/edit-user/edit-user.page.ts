import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { PopupService } from 'src/app/services/popup.service';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircle, closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditUserPage implements OnInit {
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
  updateWorker(formData: any) {
    this.loading = true
    this.usersService.updateWorker(this.userData.uid, formData)
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
