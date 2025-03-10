import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as global } from '../../environments/environment';
import { Block } from './../interfaces/user';
import moment from 'moment';
import { environment } from './../../environments/environment';
import { algoliasearch } from 'algoliasearch';
import { TimeService } from './time.service';

const client = algoliasearch(environment.algolia.appID, environment.algolia.searchKey)

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(
    private http: HttpClient,
    private timeService: TimeService
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
  closeShift(closingTime: string, afAuthToken: any) {
    console.log(closingTime)
    var data = {
      closingTime: closingTime,
      afAuthToken
    }
    return this.http.post(`${global.api}/shifts/close`, data)
  }
  async getUserWorkPaycheck(objectId: string) {
    // var currentUser = localStorage.getItem('userUid')
    try {
      const res = await client.getObject({
        indexName: environment.algolia.indexes.paycheckHistory,
        objectID: objectId
      })
      return res
    } catch (error) {
      console.error('Error searching user paycheck history:', error);
      return error;
    }
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
  getPaycheckHistory() {
    // const ref = 
  }
  //UTILITIES

  //get a block[] and return lunch and work hours
  getElapsedMinSec(blocks: Block[], status: String) {
    console.log(blocks)
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
    blocks.forEach((block: any, index) => {
      //Count all the laps with end time. if lunch to totalTimeLunch, if not to  totalTimeWorked
      if (block.endTime != null) {
        //const milliseconds = new Date(block.startTime).getTime();
        let timeDifference = new Date(block.endTime).getTime() - new Date(block.startTime).getTime()
        //If it is the last lap, count the time till now. only if it is not lunch time
        if (block.type != "lunch") {
          totalTimeWorked += timeDifference
        } else {
          totalTimeLunch += timeDifference
        }
      } else if (block.endTime == null) {
        let timeDifference = dateNow - new Date(block.startTime).getTime();
        if (block.type != "lunch") {
          totalTimeWorked += timeDifference;
        } else {
          totalTimeLunch += timeDifference;
        }
      }
    });
    console.log(totalTimeWorked)
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
    let endDate: Date;
    if (paymentSchedule === 'biweekly') {
      // Restar 14 días (2 semanas) para obtener el día de inicio 
      endDate = new Date(paycheckStartingDate + 13 * 24 * 60 * 60 * 1000);
    } else if (paymentSchedule === 'weekly') {
      // Restar 7 días (1 semana) para obtener el día de inicio 
      endDate = new Date(paycheckStartingDate + 6 * 24 * 60 * 60 * 1000);
    } else {
      throw new Error('Invalid payment schedule. Use "biweekly" or "weekly".');
    }
    return endDate;
  }

  getElapsedMinSec2(blocks: Block[], status: string) {
    if (status === "outOfShift") return null;
    let totalTimeWorked = 0;
    let totalTimeLunch = 0;
    const dateNow = moment().toISOString();
    blocks.forEach((block) => {
      if (block.endTime != null) {
        const timeDifference = moment(block.endTime).diff(moment(block.startTime));
        if (block.type !== "lunch") {
          totalTimeWorked += timeDifference;
        } else {
          totalTimeLunch += timeDifference;
        }
      } else if (block.endTime == null) {
        const timeDifference = moment(dateNow).diff(moment(block.startTime));
        if (block.type !== "lunch") {
          totalTimeWorked += timeDifference;
        } else {
          totalTimeLunch += timeDifference;
        }
      }
    });
    const formatTime = (totalMilliseconds: number) => {
      const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
      let hours: any = Math.floor(totalMinutes / 60);
      let minutes: any = totalMinutes % 60;
      // var hours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      // var minutes = this.timeService.timeStringToMilliseconds(time)
      hours = parseInt(`${hours.toString().padStart(2, '0')}`)
      minutes = parseInt(`${minutes.toString().padStart(2, '0')}`)
      return {
        hours: hours,
        minutes: minutes
      };
    };
    const res = {
      lunch: formatTime(totalTimeLunch),
      work: formatTime(totalTimeWorked)
    };
    return res;

  }
  userPaycheckById(usersPaychecks: any[], userId: any) {

    const userPaycheck = usersPaychecks.find(userPaycheck => userPaycheck.userId === userId);
    return userPaycheck;
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
        timeWorked: null,
        blocks: [],
        shiftObject: { blocks: [] }
      }); // Añade los días en orden ascendente
    }

    //////SECOND insert user currentPaycheck to schedule
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < currentPaycheck.length; j++) {
        if (currentPaycheck[j].day == days[i].day) {
          days[i].start = currentPaycheck[j].blocks[0].startTime
          days[i].end = currentPaycheck[j].blocks[currentPaycheck[j].blocks.length - 1].endTime
          days[i].timeWorked = currentPaycheck[j].timeWorked
          days[i].blocks = currentPaycheck[j].blocks
          days[i].shiftObject = currentPaycheck[j]
        }
      }

    }
    return days.reverse()
  }
}
