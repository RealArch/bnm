import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-money-earned-card',
  templateUrl: './money-earned-card.component.html',
  styleUrls: ['./money-earned-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MoneyEarnedCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
