import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, people, logOut, business, settings } from 'ionicons/icons'
import { AuthService } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { PopupService } from 'src/app/services/popup.service';
import { NavController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLinkWithHref, RouterLinkActive, IONIC_STANDALONE_MODULES],
})
export class UserPage implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  menuController = inject(MenuController)
  navController = inject(NavController)
  popupService = inject(PopupService)
  private unsubscribe$ = new Subject<void>();
  constructor() {

    addIcons({ home, people, logOut, business, settings })
    this.authService.getAuthState()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (user: any) => {
          if (user) {
            //Check if it is an admin
            this.authService.getIdTokenResult()?.then(data => {
              if (!data?.claims['admin'] || !data?.claims['active']) {
                console.log('No es admin');
                this.popupService.presentToast(
                  'bottom',
                  'danger',
                  'Access denied for this module.'
                )
                this.navController.navigateRoot('/auth/login')
                // this.router.navigate(['/auth/login'])
                this.logOut()
              }
            })
            //Then redirect to dashboard
          } else {
            this.navController.navigateRoot('/auth/login')
            // this.router.navigate(['/auth/login'])
          }
        }
      })

  }

  ngOnInit() {
  }
  closeModal() {
    this.menuController.close('main')
    console.log('cerrando')
  }
  logOut() {
    this.authService.logOut()
    //Send a notification that you were logged out
  }
  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}



