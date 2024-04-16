import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PopupsService } from 'src/app/services/popups.service';
import { RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLinkWithHref]
})
export class SignupPage implements OnInit {
  authService = inject(AuthService);
  popupService = inject(PopupsService)
  signinForm: FormGroup = this.fb.group({
    firstName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    lastName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    password: [null, [Validators.required,]],
    passwordConfirm: [null, [Validators.required,]]

  });
  sending: boolean = false;
  constructor(
    private fb: FormBuilder,
  ) {
    //Icons used
    addIcons({ checkmarkCircle });
    addIcons({ closeCircle });
  }

  ngOnInit() {

  }

  sendForm(form: FormGroup) {
    this.sending = true;
    this.authService.signup(form.value)
      .subscribe({
        next: (res: any) => {
          console.log(res)
          this.authService.loginWithToken(res.loginToken)
        },
        error: err => {
          this.sending = false;
          if (err.code == 'auth/error-first-name') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "First name". ')
          } else if (err.code == 'auth/error-last-name') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "Last name". ')
          } else if (err.code == 'auth/error-password') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "Password". ')
          } else if (err.code == 'auth/error-email') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "Email". ')
          } else {
            this.popupService.presentToast('bottom', 'danger', 'Something went wrong. Please contact administrator. ')
            console.log(err)
            //Create a DB entry with this error
          }

        },
        complete: () => {
          this.sending = false;
        }
      })

    // .then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   if (err.code == "auth/user-not-found") {
    //     this.popupService.presentToast("bottom", "danger", "The email address you entered is not registered.")
    //   } else if (err.code == "auth/user-not-found") {

    //     console.log('error de pass')

    //   } else {
    //     console.log('error inesperado')

    //   }
    // }).finally(() => {
    //   this.sending = false;
    // })
  }

}
