import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, hourglass, person } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { DocumentSnapshot } from '@angular/fire/firestore';

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
  ) {
    addIcons({ home, person, hourglass })
  }

  ngOnInit() {

  }

}
