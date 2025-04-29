import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PopupsService } from 'src/app/services/popups.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, RouterLinkWithHref, ...IONIC_STANDALONE_MODULES]
})
export class ForgotPasswordPage implements OnInit {
  resetPasswordForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(254)]],

  });
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private popupService: PopupsService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  async sendEmail(formValue: any) {
    this.loading = true
    try {
      var res = await this.authService.sendPasswordResetEmail(formValue.name)
      console.log(res)
      this.popupService.presentAlert("Check your inbox!", "We just sent you an email with steps to reset your password. It might take a few minutes to arrive — and don’t forget to check your spam folder!")
      this.router.navigate(['/auth/login'])
    } catch (error) {
      this.loading = false
      console.log(error)
      this.popupService.presentToast('bottom', 'danger', 'Oops! Something went wrong sending the email. Please try again.')
    }
  }
}
