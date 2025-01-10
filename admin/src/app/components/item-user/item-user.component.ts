import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PopupService } from 'src/app/services/popup.service';
import { UsersService } from 'src/app/services/users.service';

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


}
