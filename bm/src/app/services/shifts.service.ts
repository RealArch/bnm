import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as global } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(
    private http: HttpClient
  ) { }

  startShift(startTime: number, type: 'working' | 'traveling' | 'other' | 'lunch', workingPlace: string, details: string, afAuthToken: string | null) {
    var data = {
      startTime: startTime,
      type: type,
      workingPlace: workingPlace,
      details: details,
      afAuthToken
    }
    return this.http.post(`${global.api}/shifts/start`, data)
  }
  closeShift(closingTime: number, afAuthToken: any) {
    console.log(closingTime)
    var data = {
      closingTime: closingTime,
      afAuthToken
    }
    return this.http.post(`${global.api}/shifts/close`, data)
  }
  alreadyHasLunch(currentShiftBlocks: any[]) {
    var alreadyHasLunch = false;
    currentShiftBlocks.forEach((element) => {
      if (element.type == 'lunch') {
        alreadyHasLunch = true;
      }
    });
    return alreadyHasLunch
  }
  //UTILITIES

  //get a block[] and return lunch and work hours
  getElapsedMinSec(blocks: any[], status: String) {
    var res = {
      lunch: {
        hours: 0,
        minutes: 0
      },
      work: {
        hours: 0,
        minutes: 0
      }
    }

    if (status == "outOfShift") return null;
    var dateNow = Date.now()
    var diffLunchMinutes = 0;
    var diffLunchHours = 0;
    var diffWorkMinutes = 0;
    var diffWorkHours = 0;
    var totalTimeWorked = 0;
    var totalTimeLunch = 0;
    //Otra opcion para hacer esto mas facil seria sumar todos los elementos que tengan fecha de inicio y de final y que no sean lunch
    blocks.forEach((block, index) => {
      //Count all the laps with end time. if lunch to totalTimeLunch, if not to  totalTimeWorked
      if (block.endTime != null) {
        let timeDifference = block.endTime - block.startTime;
        //If it is the last lap, count the time till now. only if it is not lunch time
        if (block.type != "lunch") {
          totalTimeWorked += timeDifference
        } else {
          totalTimeLunch += timeDifference
        }
      } else if (block.endTime == null) {
        let timeDifference = dateNow - block.startTime;
        if (block.type != "lunch") {
          totalTimeWorked += timeDifference;
        } else {
          totalTimeLunch += timeDifference;
        }
      }
    });

    diffWorkHours = Math.floor(totalTimeWorked / (1000 * 60 * 60));
    diffWorkMinutes = Math.floor((totalTimeWorked % (1000 * 60 * 60)) / (1000 * 60));

    diffLunchHours = Math.floor(totalTimeLunch / (1000 * 60 * 60));
    diffLunchMinutes = Math.floor((totalTimeLunch % (1000 * 60 * 60)) / (1000 * 60));
    var res = {
      lunch: {
        hours: diffLunchHours || 0,
        minutes: diffLunchMinutes || 0
      },
      work: {
        hours: diffWorkHours || 0,
        minutes: diffWorkMinutes || 0
      }
    }
    console.log(res)
    return res
  }

  calculateEndOfPaycheck(paymentSchedule: string, paycheckStartingDate: number) {
    const nextPaymentDate = paycheckStartingDate;
    let startDate: Date;
    if (paymentSchedule === 'biweekly') {
      // Restar 14 días (2 semanas) para obtener el día de inicio 
      startDate = new Date(nextPaymentDate + 14 * 24 * 60 * 60 * 1000);
    } else if (paymentSchedule === 'weekly') {
      // Restar 7 días (1 semana) para obtener el día de inicio 
      startDate = new Date(nextPaymentDate + 7 * 24 * 60 * 60 * 1000);
    } else {
      throw new Error('Invalid payment schedule. Use "biweekly" or "weekly".');
    }
    return startDate;
  }

}
