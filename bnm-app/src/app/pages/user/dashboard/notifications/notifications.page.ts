import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [FormsModule, IONIC_STANDALONE_MODULES]
})
export class NotificationsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
