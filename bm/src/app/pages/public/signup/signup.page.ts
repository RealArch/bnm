import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PopupsService } from 'src/app/services/popups.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircle, closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLinkWithHref]
})
export class SignupPage implements OnInit {
  authService = inject(AuthService);
  popupService = inject(PopupsService)
  signinForm: FormGroup = this.fb.group({
    firstName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [null, [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(256)]],
    password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
    confirmPassword: [null, [Validators.required, this.passwordMatchValidator()]]

  });
  sending: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private navController: NavController
  ) {
    //Icons useds
    addIcons({ checkmarkCircle, alertCircleOutline });
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
          this.authService.loginWithToken(res.loginToken).then(() => {
            localStorage.setItem('userUid', res.data.uid)
            this.navController.setDirection("forward")
            this.navController.navigateRoot("user")

          })

        },
        error: err => {
          this.sending = false;
          if (err.code == 'auth/error-first-name') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "First name". ')
          } else if (err.error.code == 'auth/error-last-name') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "Last name". ')
          } else if (err.error.code == 'auth/error-password') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "Password". ')
          } else if (err.error.code == 'auth/error-email') {
            this.popupService.presentToast('bottom', 'danger', 'There is an error with the field "Email". ')
          } else if (err.error.code == 'auth/error-user-creation') {
            this.popupService.presentToast('bottom', 'danger', err.error.message)
          } else {
            this.popupService.presentToast('bottom', 'danger', 'Something went wrong. Please contact administrator. ')
            console.log(err.error)


            //Create a DB entry with this error
          }

        },
        complete: () => {
          this.sending = false;
        }
      })
  }
  // VALIDATORS


  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get('password')?.value;
      const confirmPassword = control.value;
      console.log(password)
      console.log(confirmPassword)
      // return {mismatch: true}
      return password  === confirmPassword ? null : { mismatch: true };
    };
  }
}
