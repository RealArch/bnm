import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { PopupService } from 'src/app/services/popup.service';
import { UsersService } from 'src/app/services/users.service';
import { EditAndActivateModalPage } from './edit-and-activate-modal/edit-and-activate-modal.page';
import { EditUserPage } from './edit-user/edit-user.page';

@Component({
  selector: 'app-item-user',
  templateUrl: './item-user.component.html',
  styleUrls: ['./item-user.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]

})
export class ItemUserComponent implements OnInit {
  @Input() userData: any
  authService = inject(UsersService)
  popupServices = inject(PopupService)
  modalController = inject(ModalController)
  updateActiveMsg = ''
  updateActiveHeader = 'Updating user'
  public updateActiveButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.updateActive(this.userData.active, this.userData.id)
      },
    },
  ];
  constructor() { }

  ngOnInit() {
    if (this.userData.active) {
      this.updateActiveMsg = "Are you sure you want to Deactivate this user?";

    } else {
      this.updateActiveMsg = "Are you sure you want to Activate this user?"

    }
  }

  updateActive(active: boolean, uid: string) {
    //If there are fields required to activate, show EditAndActivateUser Modal
    if (this.hasMissingFields()) {
      this.editAndActivateModal()
      //open modal to edit 
      return
    }
    console.log(active, uid)
    this.authService.activateDeactivate(active, uid)
      .then(data => {
        var msg = 'Usuario actualizado satisfactoriamente'
        this.popupServices.presentToast('bottom', 'success', msg)
      }).catch(err => {
        var msg = 'Ocurrió un problema al actualizar el usuario'
        this.popupServices.presentToast('bottom', 'danger', msg)
      })
  }

  hasMissingFields() {
    var userData = this.userData
    if (userData.hourlyRate == 0) {
      return true
    }
    return false
  }

  //MODALS
  async editUserModal() {
    const modal = await this.modalController.create({
      component: EditUserPage,
      componentProps: {
        userData: this.userData
      }
    })
    modal.present();
  }
  async editAndActivateModal() {
    const modal = await this.modalController.create({
      component: EditAndActivateModalPage,
      componentProps: {
        userData: this.userData
      }

    });
    modal.present();

  }

}
