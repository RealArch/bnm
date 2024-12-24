import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, people, logOut, business } from 'ionicons/icons'
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref, RouterLinkActive]
})
export class UserPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  menuController = inject(MenuController)
  private unsubscribe$ = new Subject<void>();
  constructor() {

    addIcons({ home, people, logOut, business })
    this.authService.getAuthState()
    .pipe(takeUntil(this.unsubscribe$))
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
  closeModal(){
    this.menuController.close('main')
    console.log('cerrando')
  }
  logOut() {
    this.authService.logOut()
    //Send a notification that you were logged out
  }
  ngOnDestroy(){
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}



