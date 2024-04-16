import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StatusCardComponent } from 'src/app/components/status-card/status-card.component';
import { addIcons } from 'ionicons';
import { notifications } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, StatusCardComponent]
})
export class DashboardPage implements OnInit {
  constructor() {
    addIcons({ notifications })

  }

  ngOnInit() {

  }

}
