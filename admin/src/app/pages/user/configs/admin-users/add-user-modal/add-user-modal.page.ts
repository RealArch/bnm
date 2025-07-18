import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons'
import { PopupService } from 'src/app/services/popup.service';
import { GeneralService } from 'src/app/services/general.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.page.html',
  styleUrls: ['./add-user-modal.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IONIC_STANDALONE_MODULES]
})
export class AddUserModalPage implements OnInit {

  @Input() user: any

  userForm: FormGroup = new FormGroup({});
  loading = false;
  states: { name: string; code: string; }[] = [];
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private fb: FormBuilder,
    private popupService: PopupService,
    private generalService: GeneralService
  ) {
    addIcons({ close })


  }

  ngOnInit() {
    this.states = this.generalService.getStatesArray()
    //Declare form
    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [ null, [Validators.required, Validators.minLength(6)]],
      name: [ null, Validators.required],
      lastName: [ null, Validators.required],


    })
    console.log(this.user)
  }
  //Add user to data base
  addAdminUser() {
    this.loading = true;
    let data = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      name: this.userForm.value.name,
      lastName: this.userForm.value.lastName,
    }
    this.authService.addAdminUser(data)
    .subscribe({
      next: (res) => {
        console.log(res)
         this.popupService.presentToast(
          "bottom",
          "success",
          "The user has been added successfully"
        )
        this.closeModal()
        this.loading = false;
      },
      error: (err) => {
        console.log(err)
        this.loading = false;
        this.popupService.presentToast(
          "bottom",
          "danger",
          "There was an error trying to add the user"
        )
      }
    })


  }



  closeModal() {
    this.modalController.dismiss()
  }


}
