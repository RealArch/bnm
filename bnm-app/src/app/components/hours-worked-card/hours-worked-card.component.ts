import { DatePipe, NgIf } from '@angular/common';
import { Component, effect, Input, OnInit, signal, Signal } from '@angular/core';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
  selector: 'app-hours-worked-card',
  templateUrl: './hours-worked-card.component.html',
  styleUrls: ['./hours-worked-card.component.scss'],
  imports: [IONIC_STANDALONE_MODULES, DatePipe]
})
export class HoursWorkedCardComponent implements OnInit {
  @Input() timeWorked: Signal<number> = signal(0);

  hours: number = 0;
  minutes: number = 0;
  constructor() { 
    effect(() => {
      this.calculateHoursWorked()
    })
  }

  ngOnInit() { 

  }
  calculateHoursWorked(){
    if (this.timeWorked) {
      const value = this.timeWorked() as number;

      if (value !== undefined) {
        this.hours = Math.floor(value / (1000 * 60 * 60));
        this.minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
      }
    }
  }
  // ngOnInit() {
  //   console.log(this.totalWorkHours)
  //   this.hours = Math.floor(this.totalWorkHours / (1000 * 60 * 60))
  //   this.minutes = Math.floor((this.totalWorkHours % (1000 * 60 * 60)) / (1000 * 60));

  // }

}
