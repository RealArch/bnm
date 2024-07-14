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
  closeShift(closingTime: number, afAuthToken:any) {
    console.log(closingTime)
    var data = {
      closingTime : closingTime,
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
}
