import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.page.html',
  styleUrls: ['./configs.page.scss'],
  standalone: true,
  imports: [ FormsModule, IONIC_STANDALONE_MODULES, RouterLink ]
})
export class ConfigsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
