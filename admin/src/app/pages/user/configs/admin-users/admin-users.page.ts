import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { PopupService } from 'src/app/services/popup.service';
import { addIcons } from 'ionicons';
import { add, pause, pencil, play, trash } from 'ionicons/icons';
import { AddUserModalPage } from './add-user-modal/add-user-modal.page';
import {
  IonIcon, ModalController, IonFabButton, IonFab, IonSpinner, IonButton, IonCol, IonRow,
  IonItem, IonList, IonGrid, IonContent, IonBackButton, IonTitle,
  IonToolbar, IonHeader, IonButtons, IonText, IonBadge, IonProgressBar
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { AdminUsersService } from 'src/app/services/admin-users.service';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonFabButton, IonFab, IonSpinner, IonButton, IonCol, IonRow,
    IonItem, IonList, IonGrid, IonContent, IonBackButton, IonTitle, IonBadge,
    IonToolbar, IonHeader, IonButtons, IonText, IonProgressBar]
})
export class AdminUsersPage implements OnInit {
  usersService = inject(UsersService)
  adminUsersService = inject(AdminUsersService)
  popupService = inject(PopupService)
  modalController = inject(ModalController)
  authService = inject(AuthService)
  loading = signal(true);
  users = signal<any[]>([]);
  updatingList: string[] = []
  constructor() {
    addIcons({ trash, pause, play, add })
  }

  ngOnInit() {
    this.getAdminUsers()
  }
  getAdminUsers() {
    console.log('entre')
    this.loading.set(true);
    this.usersService.getAdminUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
        console.log(this.users())
      },
      error: (err) => {
        console.log(err)
        this.loading.set(false);
        this.popupService.presentToast('bottom', 'danger', 'An error occurred while getting the users.')
      }
    })

  }
  async deleteAdminUser(userId: string) {
    try {
      var confirmation = await this.popupService.boolAlert('Delete User', 'Are you sure you want to delete this user? This action is permanent and cannot be undone.')
      console.log(confirmation)
      if (confirmation) {
        this.addToUpdatingList(userId);
        this.authService.deleteAdminUser(userId).subscribe({
          next: () => {
            this.popupService.presentToast('bottom', 'success', 'User deleted successfully.');
            this.removeFromUpdatingList(userId);
          },
          error: (err) => {
            console.log(err)
            this.removeFromUpdatingList(userId);
            this.popupService.presentToast('bottom', 'danger', 'An error occurred while deleting the user.')
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  //Activate or Deactivate User
  async activateDeactivateUSer(userId: string, active: boolean) {
    try {
      var confirmation = await this.popupService.boolAlert('Activate/Deactivate User', `Are you sure you want to ${active ? 'deactivate' : 'activate'} this user?`)
      if (confirmation) {
        this.addToUpdatingList(userId);
        this.adminUsersService.activateDeactivateUser(userId, !active).subscribe({
          next: () => {
            this.popupService.presentToast('bottom', 'success', `User ${active ? 'deactivated' : 'activated'} successfully.`);
            // this.getAdminUsers();
            this.removeFromUpdatingList(userId);
          },
          error: (err) => {
            console.log(err)
            this.removeFromUpdatingList(userId);
            this.popupService.presentToast('bottom', 'danger', 'An error occurred while updating the user status.')
          }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  //Open modals
  async openAddUserModal(user: any) {
    var data = user;

    const modal = await this.modalController.create({
      component: AddUserModalPage,
      backdropDismiss: false,
      cssClass: 'radius',
      componentProps: {
        customer: data
      }
    });
    modal.present();


  }
  addToUpdatingList(userId: string) {
    if (!this.updatingList.includes(userId)) {
      this.updatingList.push(userId);
    }
  }
  removeFromUpdatingList(userId: string) {
    const index = this.updatingList.indexOf(userId);
    if (index > -1) {
      this.updatingList.splice(index, 1);
    }
  }
  checkIfUpdating(userId: string): boolean {
    return this.updatingList.includes(userId);
  }
}
