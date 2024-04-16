import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
  standalone:true,
  imports:[IonicModule]
})
export class StatusCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
