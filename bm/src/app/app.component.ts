import { Component, inject, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { authState, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { fileTray } from 'ionicons/icons';
import { Platform } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnDestroy {
  //Injects
  authService = inject(AuthService);
  router = inject(Router);
  navController = inject(NavController)
  currentPath: any;
  //Variables;
  private unsubscribe$ = new Subject<void>();
  constructor(private platform: Platform) {
    //todo:Pause app loading if can't find userData

    console.log(' app')
    authState(getAuth())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (user) => {
          this.setUserData(user)
        }
      })
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => { this.currentPath = this.router.url; });

    //////
    // onAuthStateChanged(getAuth(), (user) => {
    //   this.setUserData(user)

    // })


  }
  setUserData(user: any) {
    var userData: any
    if (user) {
      console.log(user.uid)

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
      localStorage.clear()

      this.navController.navigateRoot('/auth/login')

      

    }
  }
  //PLUG IN KEYBOARD
  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     if (this.platform.is('ios') || this.platform.is('android')) {
  //       Keyboard.setAccessoryBarVisible({ isVisible: false }); // Opcional: oculta la barra de accesorios
  //       Keyboard.setScroll({ isDisabled: false }); // Permite que la vista se desplace con el teclado
  //       Keyboard.setResizeMode({mode:native}); // Ajusta el tamaño de la ventana automáticamente
  //     }
  //   });
  // }



    ngOnDestroy() {
      console.log('destroy')
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }


  }
