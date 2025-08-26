import { Component, inject, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { authState, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { fileTray } from 'ionicons/icons';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone'
import { Keyboard } from '@capacitor/keyboard';
import { IONIC_STANDALONE_MODULES } from './ionic-standalone-components';
import { Geolocation } from '@capacitor/geolocation'
import { RequestGpsPage } from './pages/public/request-gps/request-gps.page';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ...IONIC_STANDALONE_MODULES]
})
export class AppComponent implements OnDestroy {
  //Injects
  authService = inject(AuthService);
  modalController = inject(ModalController)
  router = inject(Router);
  navController = inject(NavController)
  currentPath: any;
  //Variables;
  private unsubscribe$ = new Subject<void>();
  constructor(private platform: Platform) {
    //solo si es la primera vez
    if (localStorage.getItem('gpsModalPresented') != 'true') {
      // this.checkGpsPermissions()
      this.requestGpsModal()
    }

    //todo:Pause app loading if can't find userData
    authState(getAuth())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (user) => {

          this.setUserData(user)
        },
        error: (err) => {
          console.log(err)

        }
      })

    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => { this.currentPath = this.router.url; });
    //


  }
  setUserData(user: any) {
    var userData: any
    if (user) {

      this.authService.getUserData(user.uid)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (subUserData) => {

            userData = subUserData;
            //save the status of the user in localStorage
            localStorage.setItem('userUid', user.uid);
            localStorage.setItem('isUserActive', userData.active)
            if (!userData.active) {
              this.router.navigate(['/not-allowed-user'])
            } else if (userData.active && this.currentPath == "/not-allowed-user") {
              this.router.navigate(['/'])
            }

          },
          error: (e) => {

          }
        })
    } else {
      localStorage.removeItem('userUid');
      localStorage.removeItem('isUserActive');
      this.navController.navigateRoot('/auth/login')



    }
  }
  //REQUEST GPS
  async checkGpsPermissions() {

    try {
      const permissions = await Geolocation.checkPermissions()
      if (permissions.location !== 'granted') {

        this.requestGpsModal()


      }
    } catch (error) {
      return console.log(error)
    }
    return

  }
  //MODALS
  //Modal when GPS is not conceded
  async requestGpsModal() {
    localStorage.setItem('gpsModalPresented', 'true')

    const modal = await this.modalController.create({
      component: RequestGpsPage
    })
    modal.present()
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
