import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-money-earned-card',
    templateUrl: './money-earned-card.component.html',
    styleUrls: ['./money-earned-card.component.scss'],
    imports: [IonicModule, CommonModule]
})
export class MoneyEarnedCardComponent implements OnInit {
  @Input() hourlyRate: number = 0;
  @Input() timeWorked: number = 0;
  moneyEarned: any;

  constructor() { }

  ngOnInit() {

    this.moneyEarned= this.calculateEarnings(this.hourlyRate, this.timeWorked).toFixed(2);
  }

  calculateEarnings(hourlyRate: any, timeWorked: any) {
    // Convertir milisegundos a horas 
    const totalHoursWorked = timeWorked / (1000 * 60 * 60);
    // Calcular el dinero adquirido 
    const earnings = hourlyRate * totalHoursWorked;
    return earnings;
  }

}
