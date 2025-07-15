import { Component, inject, OnInit, signal } from '@angular/core';
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
  usersService = inject(UsersService)
  popupService = inject(PopupService)
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
        console.log(this.users)
      },
      error: (err) => {
        console.log(err)
        this.loading.set(false);
        this.popupService.presentToast('bottom', 'danger', 'An error occurred while getting the users.')
      }
    })

  }
}
