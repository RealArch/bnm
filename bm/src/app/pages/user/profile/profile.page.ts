import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EditProfileModalPage } from './edit-profile-modal/edit-profile-modal.page';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  loading: boolean = false;
  userUid: any = localStorage.getItem('userUid');
  subscribe$ = new Subject<void>();
  userData: any;
  constructor(
    private authService: AuthService,
    private modalContrller: ModalController,
  ) { }

  ngOnInit() {
    this.getUserData()
  }
  //Main functions
  //Get user data info (snapshot sub)
  getUserData() {
    this.loading = true;
    this.authService.getUserData(this.userUid)
      .pipe(takeUntil(this.subscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false
          console.log(res)
          this.userData = res;
        },
        error: (e) => {
          console.log(e)
          //todo toast notificando error
        }
      })
  }
  //OPEN MODALS
  async openEditProfileModal() {
    const modal = await this.modalContrller.create({
      component: EditProfileModalPage,
      componentProps: {
        userData: this.userData
      }
    });
    modal.present();
  }
  //
  logout() {
    this.authService.logout()
  }

  ngOnDestoy() {
    this.subscribe$.next();
    this.subscribe$.complete()
  }
}
