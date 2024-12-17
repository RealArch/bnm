import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EditProfileModalPage } from './edit-profile-modal/edit-profile-modal.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  constructor(
    private authService: AuthService,
    private modalContrller:ModalController

  ) { }

  ngOnInit() {
  }
  //OPEN MODALS
  async openEditProfileModal() {
    const modal = await this.modalContrller.create({
      component: EditProfileModalPage,
    });
    modal.present();
  }
  //
  logout() {
    this.authService.logout()
  }

}
