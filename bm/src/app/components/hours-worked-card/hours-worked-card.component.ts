import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-hours-worked-card',
  templateUrl: './hours-worked-card.component.html',
  styleUrls: ['./hours-worked-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HoursWorkedCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
