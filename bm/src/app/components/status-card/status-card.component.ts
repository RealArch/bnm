import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bed } from 'ionicons/icons';
import { StartShiftModalComponent } from '../start-shift-modal/start-shift-modal.component';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, StartShiftModalComponent ]
})
export class StatusCardComponent implements OnInit {
  status: 'on-shift' | 'off-shift' = 'off-shift'

  constructor() { 
    addIcons({bed})
  }

  ngOnInit() { }

}
