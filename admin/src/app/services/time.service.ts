import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  calculateWorkedHours(paycheck: any) {
    let res = {
      totalWorkHours :0,
      totalLunchHours : 0
    }
    paycheck.forEach((paycheck: { timeWorked: { work: number; lunch: number; }; }) => {
      console.log("ddd")
      res.totalWorkHours += paycheck.timeWorked.work;
      res.totalLunchHours += paycheck.timeWorked.lunch;
    });
    console.log(res)
    // res.totalWorkHours = Math.floor(res.totalWorkHours / (1000 * 60 * 60));
    return res;
  }
}
