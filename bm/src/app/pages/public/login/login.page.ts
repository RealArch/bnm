import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  authServices = inject(AuthService);
  signinForm: FormGroup = this.fb.group({
    username: [[], [Validators.required,]],
    password: [[], [Validators.required,]]

  });
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

  }
  sendForm(form: FormGroup) {
    console.log(form)
    this.authServices.login(form.value.username, form.value.password)
    .then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err.code)
    })
  }

}
