import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, hourglass, person } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { onAuthStateChanged, getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserPage implements OnInit {
  data!: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ home, person, hourglass })
  }

  ngOnInit() {
    
    //TODO Añadir pantalla de carga que impida continuar aqui
    //Read auth data to see if user is active or not
    var userData: any
    var currentStatus:boolean
  

  }
}
