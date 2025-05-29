import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { EditProfileModalPage } from './edit-profile-modal/edit-profile-modal.page';
import { Subject, takeUntil } from 'rxjs';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { NgIf, TitleCasePipe } from '@angular/common';
import { PopupsService } from 'src/app/services/popups.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [FormsModule, IONIC_STANDALONE_MODULES, TitleCasePipe, NgIf]
})
export class ProfilePage implements OnInit {
  loading: boolean = false;
  userUid: any = localStorage.getItem('userUid');
  subscribe$ = new Subject<void>();
  userData: any;
  errorDelete: string = 'Error';
  constructor(
    private authService: AuthService,
    private modalContrller: ModalController,
    private alertController: AlertController,
    private popupService: PopupsService
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
  async deleteAccount() {
    const afAuthToken = await this.authService.getIdToken() || '';
    this.authService.deleteAccount(this.userUid, afAuthToken).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.popupService.presentToast('bottom', 'success', 'Your account has been deleted successfully.')
          this.authService.logout();
        } else {
          this.popupService.presentToast('bottom', 'danger', 'There was an error deleting your account. Please try again.')
        }
      },
      error: (e) => {
        // Si el backend responde con error 500, muestra el mensaje del backend si existe
        this.popupService.presentToast('bottom', 'danger', 'There was an error deleting your account. Please try again.')
        console.log(e);
      }
    });
    // .then(() => {
    //   console.log('eee')
    //   this.popupService.presentToast('bottom', 'success', 'Your account has been deleted successfully.')
    //   // this.authService.logout()
    // })
    // .catch((e) => {
    //   this.popupService.presentToast('bottom', 'danger', 'There was an error deleting your account. Please try again.')
    //   console.log(e)
    // })

  }
  //OPEN MODALS
  async deleteAccountAlert() {
    const alert = await this.alertController.create({
      header: 'Delete account',
      message: `Are you sure you want to delete your account? This action cannot be undone. 
      <br><br>
      <ion-text color='primary'>Type 'delete' to continue and delete your account.</ion-text>`,
      inputs: [
        {
          name: 'delete',
          type: 'text',
          placeholder: 'Delete'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: (data) => {
            console.log(data)
            if (data.delete.toLowerCase() == 'delete') {
              this.deleteAccount()
              return true;
            }
            return false

          }
        }
      ]

    })
    await alert.present();
  }

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
