import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policies',
  templateUrl: './privacy-policies.page.html',
  styleUrls: ['./privacy-policies.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrivacyPoliciesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
