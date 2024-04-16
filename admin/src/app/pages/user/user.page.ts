import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, people } from 'ionicons/icons'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref]
})
export class UserPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  
  constructor() {
    addIcons({ home, people })
    this.authService.getAuthState()
      .subscribe({
        next: (user: any) => {
          if (user) {
            //Check if it is an admin
            this.authService.getIdTokenResult()?.then(data => {
              if (!data?.claims['admin']) {
                console.log('No es admin');
                this.router.navigate(['/auth/login'])
                this.logOut()
              } 
            })
            //Then redirect to dashboard
          } else {
            this.router.navigate(['/auth/login'])
          }
        }
      })

  }

  ngOnInit() {
  }

  logOut() {
    this.authService.logOut()
    //Send a notification that you were logged out

  }
}



