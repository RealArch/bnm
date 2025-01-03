import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  getStatesArray() {
    return [
      { "name": "Alabama", "code": "AL" },
      { "name": "Alaska", "code": "AK" },
      { "name": "Arizona", "code": "AZ" },
      { "name": "Arkansas", "code": "AR" },
      { "name": "California", "code": "CA" },
      { "name": "Colorado", "code": "CO" },
      { "name": "Connecticut", "code": "CT" },
      { "name": "Delaware", "code": "DE" },
      { "name": "Florida", "code": "FL" },
      { "name": "Georgia", "code": "GA" },
      { "name": "Hawaii", "code": "HI" },
      { "name": "Idaho", "code": "ID" },
      { "name": "Illinois", "code": "IL" },
      { "name": "Indiana", "code": "IN" },
      { "name": "Iowa", "code": "IA" },
      { "name": "Kansas", "code": "KS" },
      { "name": "Kentucky", "code": "KY" },
      { "name": "Louisiana", "code": "LA" },
      { "name": "Maine", "code": "ME" },
      { "name": "Maryland", "code": "MD" },
      { "name": "Massachusetts", "code": "MA" },
      { "name": "Michigan", "code": "MI" },
      { "name": "Minnesota", "code": "MN" },
      { "name": "Mississippi", "code": "MS" },
      { "name": "Missouri", "code": "MO" },
      { "name": "Montana", "code": "MT" },
      { "name": "Nebraska", "code": "NE" },
      { "name": "Nevada", "code": "NV" },
      { "name": "New Hampshire", "code": "NH" },
      { "name": "New Jersey", "code": "NJ" },
      { "name": "New Mexico", "code": "NM" },
      { "name": "New York", "code": "NY" },
      { "name": "North Carolina", "code": "NC" },
      { "name": "North Dakota", "code": "ND" },
      { "name": "Ohio", "code": "OH" },
      { "name": "Oklahoma", "code": "OK" },
      { "name": "Oregon", "code": "OR" },
      { "name": "Pennsylvania", "code": "PA" },
      { "name": "Rhode Island", "code": "RI" },
      { "name": "South Carolina", "code": "SC" },
      { "name": "South Dakota", "code": "SD" },
      { "name": "Tennessee", "code": "TN" },
      { "name": "Texas", "code": "TX" },
      { "name": "Utah", "code": "UT" },
      { "name": "Vermont", "code": "VT" },
      { "name": "Virginia", "code": "VA" },
      { "name": "Washington", "code": "WA" },
      { "name": "West Virginia", "code": "WV" },
      { "name": "Wisconsin", "code": "WI" },
      { "name": "Wyoming", "code": "WY" }
    ]
  }
  createFortnightArray(paymentSchedule: string, lastStartingDate: number, currentPaycheck: any) {

    /////FIRST format the array for the schedule
    var paycheckDays = 0;
    var fortnight;
    var days = []

    if (paymentSchedule == 'biweekly') paycheckDays = 14
    if (paymentSchedule == 'weekly') paycheckDays = 7

    for (let i = 0; i < paycheckDays; i++) {
      //get the previous date on each iteration, then fill the array with all the days possible on the paycheck
      const nextDayMilliseconds = lastStartingDate + (i * 24 * 60 * 60 * 1000);
      var dayData = nextDayMilliseconds


      days.unshift({
        day: dayData,
        start: null,
        end: null,
        timeWorked:null
      }); // Añade los días en orden ascendente
    }

    //////SECOND insert user currentPaycheck to schedule
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < currentPaycheck.length; j++) {
        if (currentPaycheck[j].day == days[i].day) {
          days[i].start = currentPaycheck[j].blocks[0].startTime
          days[i].end = currentPaycheck[j].blocks[currentPaycheck[j].blocks.length-1].endTime
          days[i].timeWorked = currentPaycheck[j].timeWorked
        }
      }

    }
    return days.reverse()
  }

}
