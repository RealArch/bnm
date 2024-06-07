import { NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bed } from 'ionicons/icons';
import { StartShiftModalComponent } from '../start-shift-modal/start-shift-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, StartShiftModalComponent]
})
export class StatusCardComponent implements OnInit {
  @Input() userData: any;
  appComponent = inject(AppComponent)
  elapsedTime!: { hours: number; minutes: number; };
  interval: any;
  constructor(
    private authService: AuthService
  ) {
    addIcons({ bed })
  }

  ngOnInit() {
    this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift)
    this.interval = window.setInterval(() => {
      this.elapsedTime = this.getElapsedMinSec(this.userData.currentShift)
    }, 1000);

  }

  getElapsedMinSec(currentShift: any[]) {
    console.log('ejecute')
    //Detect if lunch present
    var firstShift;
    var hasLunch: boolean = false;
    var isLunching: boolean = false;
    var dateNow = Date.now()
    var diffMillis;
    var diffMinutes;
    var diffHours;

    //Otra opcion para hacer esto mas facil seria sumar todos los elementos que tengan fecha de inicio y de finaly que no sean lunch
    //si el elemento no tiene fecha final, usar date now ya que es el periodo actual
    //calcular tambien el tiempo de lunch, si no tiene fecha de final usar date now que significa que esta en proceso el lunch

    currentShift.forEach((element, index) => {
      //If lunch present
      if (element.type == 'lunch') {
        hasLunch = true
        //if lunch is the last element calculate time from first element to the one before lunch 
        if (index + 1 == currentShift.length) {
          isLunching = true
        }
      }
    });


    //if there is no lunch
    if (!hasLunch) {
      //count from the first element to the last element
      diffMillis = dateNow - currentShift[0].startTime;

      diffHours = Math.floor(diffMillis / (1000 * 60 * 60));
      diffMinutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));
    }

    return {
      hours: diffHours || 0,
      minutes: diffMinutes || 0
    }
    //if not, calculate lunch time and subtract it  to main time

    // var elapsedMin = 
  }


}
