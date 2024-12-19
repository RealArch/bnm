import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-public',
    templateUrl: './public.page.html',
    styleUrls: ['./public.page.scss'],
    imports: [IonicModule, CommonModule, FormsModule]
})
export class PublicPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
