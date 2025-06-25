import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { PopupService } from 'src/app/services/popup.service';
import { addIcons } from 'ionicons';
import { add, pencil, star, trash } from 'ionicons/icons';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminUsersPage implements OnInit {
  loading: boolean = true;
  usersService = inject(UsersService)
  popupService = inject(PopupService)
  users: any;
  constructor() { 
    addIcons({trash, pencil, add})
  }

  ngOnInit() {
    this.getAdminUsers()
  }
  getAdminUsers() {
    console.log('entre')
    this.loading = true
    this.usersService.getAdminUsers().subscribe({
      next: (users) => {
        this.users = users
        this.loading=false
        console.log(this.users)
      },
      error: (err) => {
        console.log(err)
        this.loading = false
        this.popupService.presentToast('bottom', 'danger', 'An error occurred while getting the users.')
      }
    })

  }
}
