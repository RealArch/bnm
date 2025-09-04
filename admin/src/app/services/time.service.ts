import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  calculateWorkedHours(paycheck: any) {
    let res = {
      totalWorkHours: 0,
      totalLunchHours: 0
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
  createDate(dateValue: any): string {
    if (!dateValue) return '';
    // Firestore Timestamp serializado
    if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
      const date = new Date(dateValue._seconds * 1000);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    // Si es Firestore Timestamp con método toDate
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      const d = dateValue.toDate();
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    }
    // Si es string o número
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
