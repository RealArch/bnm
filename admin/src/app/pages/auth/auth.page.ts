import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AuthPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  constructor() {
    this.authService.getAuthState()
      .subscribe({
        next: (user: any) => {
          if (user) {
            this.router.navigate(['/user'])
          }
        }
      })
  }
  ngOnInit() {
  }

}
