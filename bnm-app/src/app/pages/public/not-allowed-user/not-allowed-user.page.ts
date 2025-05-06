import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons'
import { keyOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
    selector: 'app-not-allowed-user',
    templateUrl: './not-allowed-user.page.html',
    styleUrls: ['./not-allowed-user.page.scss'],
    imports: [FormsModule, IONIC_STANDALONE_MODULES]
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
