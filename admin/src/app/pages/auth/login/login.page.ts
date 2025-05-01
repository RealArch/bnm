import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PopupService } from 'src/app/services/popup.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, IONIC_STANDALONE_MODULES]
})
export class LoginPage implements OnInit {
  authService = inject(AuthService);
  popupService = inject(PopupService)
  fb = inject(FormBuilder)

  sending = false
  signInForm: FormGroup = this.fb.group({
    email: [[], [Validators.required,]],
    password: [[], [Validators.required,]]

  });
  constructor() { }

  ngOnInit() {
  }
  signIn(form: FormGroup) {
    this.sending = true;
    this.authService.login(form.value.email, form.value.password)
      .then(res => {
      }).catch(err => {
        console.log(err.code)
        if (err.code == "auth/user-not-found") {
          this.popupService.presentToast("bottom", "danger", "The email address you entered is not registered.")
        } else if (err.code == "auth/wrong-password") {
          this.popupService.presentToast("bottom", "danger", "The password you entered is wrong.")
        } else {
          this.popupService.presentToast("bottom", "danger", "Ups!? There is an unexpected error")
          console.log(err)
        }
      }).finally(() => {
        this.sending = false;
      })
  }

}
