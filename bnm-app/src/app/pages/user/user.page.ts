import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { fileTrayFull, home, hourglass, person } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { onAuthStateChanged, getAuth } from '@angular/fire/auth';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
    imports: [FormsModule, IONIC_STANDALONE_MODULES]
})
export class UserPage implements OnInit {
  data!: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ home, person, hourglass, fileTrayFull })
  }

  ngOnInit() {
    
    //TODO Añadir pantalla de carga que impida continuar aqui
    //Read auth data to see if user is active or not
    var userData: any
    var currentStatus:boolean
  

  }
}
