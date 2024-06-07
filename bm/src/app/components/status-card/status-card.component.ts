import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  imports: [IonicModule, NgIf, StartShiftModalComponent ]
})
export class StatusCardComponent implements OnInit {
  status: 'onShift' | 'outOfShift' = 'outOfShift'
  appComponent = inject(AppComponent)
  constructor(
    private authService: AuthService
  ) {
    addIcons({ bed })
  }

  ngOnInit() {
    //todo: read realtime user data info

    
  }
  

}
