import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
    selector: 'app-edit-profile-modal',
    templateUrl: './edit-profile-modal.page.html',
    styleUrls: ['./edit-profile-modal.page.scss'],
    imports: [FormsModule, FormsModule, ReactiveFormsModule, IONIC_STANDALONE_MODULES]
})
export class EditProfileModalPage implements OnInit {
  @Input() userData: any;
  profileForm: FormGroup = new FormGroup({})
  constructor(
    private modalController: ModalController,
    private formbuilder: FormBuilder,
    private authService: AuthService
  ) {
    //settiing up profile form

  }

  ngOnInit() {
    this.profileForm = this.formbuilder.group({
      name: [{value:this.userData.firstName, disabled:true}, Validators.required,],
      lastName: [{value:this.userData.lastName, disabled:true}, Validators.required],
    })
    console.log(this.userData.firstName)
  }
  async updateProfile() {
    //todo does this toke renews? or expires?
    const afToken = await this.authService.getIdToken()
    console.log(afToken)
  }
  closeModal() {
    this.modalController.dismiss()
  }
}
