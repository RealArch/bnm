import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { PopupService } from 'src/app/services/popup.service';
import { addIcons } from 'ionicons';
import { add, pencil, trash } from 'ionicons/icons';
import { AddUserModalPage } from './add-user-modal/add-user-modal.page';
import { IonIcon, ModalController, IonFabButton, IonFab, IonSpinner, IonButton, IonCol, IonRow,
  IonItem, IonList, IonGrid, IonContent, IonBackButton, IonTitle,
  IonToolbar, IonHeader, IonButtons, IonText
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonIcon, IonFabButton, IonFab, IonSpinner, IonButton, IonCol, IonRow,
  IonItem, IonList, IonGrid, IonContent, IonBackButton, IonTitle,
  IonToolbar, IonHeader, IonButtons, IonText ]
})
export class AdminUsersPage implements OnInit {
  usersService = inject(UsersService)
  popupService = inject(PopupService)
  modalController = inject(ModalController)
  loading = signal(true);
  users= signal<any[]>([]);
  constructor() { 
    addIcons({trash, pencil, add})
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

    //Open modals
    async openAddUserModal(user:any) {
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
}
