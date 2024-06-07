import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  //Injects
  authService = inject(AuthService);
  router = inject(Router);
  //Variables
  userData!: DocumentSnapshot;
  constructor() {
    //todo:Pause app loading if can't find userData
    this.authService.getAuthState()
      .subscribe({
        next: (user: any) => {
          if (user) {
            this.getUserData(user.uid)
            this.router.navigate(['/'])
          } else {
            this.router.navigate(['/auth/login'])
          }
        }
      })
  }

  async getUserData(uid: string) {
    // try {
    //   this.userData = await this.authService.getUserData(uid)
    // } catch (error) {
    //   //todo: handle error when can't find the user data
    //   console.log('error getting data')
    //   console.log(error)
    // }
  }

}
