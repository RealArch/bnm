import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons'
import { keyOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-not-allowed-user',
  templateUrl: './not-allowed-user.page.html',
  styleUrls: ['./not-allowed-user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotAllowedUserPage implements OnInit {
  constructor(
    private authService: AuthService
  ) {
    addIcons({ keyOutline })

  }

  ngOnInit() {
    
  }

  logOut(){
    this.authService.logout()
  }

}
