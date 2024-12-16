import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user-accordion',
  templateUrl: './user-accordion.page.html',
  styleUrls: ['./user-accordion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserAccordionPage implements OnInit {
  @Input() userData:any;
  constructor() { }

  ngOnInit() {
    console.log(this.userData)
  }

}
