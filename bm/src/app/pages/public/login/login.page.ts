import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PopupsService } from 'src/app/services/popups.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircle, closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLinkWithHref]
})
export class LoginPage implements OnInit {
  authService = inject(AuthService);
  navController = inject(NavController);
  popupService = inject(PopupsService)
  signinForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(254)]],
    password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(24)]]

  });
  sending: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    addIcons({ checkmarkCircle, alertCircleOutline, closeCircle });
  }

  ngOnInit() {

  }
  sendForm(form: FormGroup) {
    this.sending = true;
    this.authService.login(form.value.email, form.value.password)
      .then(res => {
        localStorage.setItem('userUid', res.user.uid)
        this.navController.setDirection("forward")
        this.navController.navigateRoot("user")

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
