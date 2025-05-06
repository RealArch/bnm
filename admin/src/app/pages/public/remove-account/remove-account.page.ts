import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.page.html',
  styleUrls: ['./remove-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RemoveAccountPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
