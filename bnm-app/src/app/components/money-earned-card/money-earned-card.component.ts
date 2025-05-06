import { Component, effect, Input, OnInit, signal, Signal } from '@angular/core';
import { IONIC_STANDALONE_MODULES } from 'src/app/ionic-standalone-components';

@Component({
    selector: 'app-money-earned-card',
    templateUrl: './money-earned-card.component.html',
    styleUrls: ['./money-earned-card.component.scss'],
    imports: [IONIC_STANDALONE_MODULES]
})
export class MoneyEarnedCardComponent implements OnInit {
  @Input() hourlyRate: Signal<number> = signal(0);
  @Input() timeWorked: Signal<number> = signal(0);
  moneyEarned: any;

  constructor() { 
    effect(()=>{
      this.calculateEarnings()
    })
  }

  ngOnInit() {

  }
  
  calculateEarnings() {   
    // Convertir milisegundos a horas 
    const totalHoursWorked = this.timeWorked() / (1000 * 60 * 60);
    // Calcular el dinero adquirido 
    const earnings = this.hourlyRate() * totalHoursWorked;
    this.moneyEarned =  earnings.toFixed(2);
  }

}
