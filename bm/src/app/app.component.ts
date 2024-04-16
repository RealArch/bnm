import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  authService = inject(AuthService)
  router = inject(Router)
  constructor() {
    this.authService.getAuthState()
      .subscribe({
        next: (user: any) => {
          if (user) {
   
            this.router.navigate(['/'])
          } else {
            this.router.navigate(['/auth/login'])
          }
        }
      })
  }
}
