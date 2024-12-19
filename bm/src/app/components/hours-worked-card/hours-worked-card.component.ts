import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-hours-worked-card',
  templateUrl: './hours-worked-card.component.html',
  styleUrls: ['./hours-worked-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HoursWorkedCardComponent implements OnInit {
  @Input() totalWorkHours: any;
  hours: number = 0;
  minutes: number = 0;
  constructor() { }

  ngOnInit() {
    console.log(this.totalWorkHours)
    this.hours = Math.floor(this.totalWorkHours / (1000 * 60 * 60))
    this.minutes = Math.floor((this.totalWorkHours % (1000 * 60 * 60)) / (1000 * 60));

  }

}
